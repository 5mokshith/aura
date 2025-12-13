import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getWorker } from '@/app/lib/agents/workers';
import { evaluatorAgent } from '@/app/lib/agents/evaluator';
import { getTaskPlan, updateTaskStatus, updateStepStatus } from '@/app/lib/agents/storage';
import { createServiceClient } from '@/app/lib/supabase/server';
import { getEnv } from '@/app/lib/env';
import { ApiResponse, AgentExecuteRequest, AgentExecuteResponse } from '@/app/types/api';
import { WorkerResult, PlanStep, TaskPlan } from '@/app/types/agent';

/**
 * POST /api/agent/execute
 * Execute planned task steps sequentially
 */
const envConfig = getEnv();
const genAI = new GoogleGenerativeAI(envConfig.llm.geminiApiKey!);
const summarizerModel = genAI.getGenerativeModel({
  model: envConfig.llm.geminiModel || 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const supabase = createServiceClient();
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const body: AgentExecuteRequest = await request.json();
    const { taskId, userId, conversationId, mode, resumeFromStepId } = body;

    const cookieUserId = request.cookies.get('aura_user_id')?.value;
    const usedUserId = userId || cookieUserId || '';

    console.log(`🚀 [EXECUTE] Starting task execution:`, {
      executionId,
      taskId,
      mode,
      resumeFromStepId,
      userId: usedUserId,
      timestamp: new Date().toISOString()
    });

    // Validate input
    if (!taskId || !usedUserId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Missing required fields: taskId and userId',
          },
        },
        { status: 400 }
      );
    }

    // Retrieve task plan from database
    const plan = await getTaskPlan(taskId, usedUserId);

    if (!plan) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found or plan not available',
          },
        },
        { status: 404 }
      );
    }

    // Resolve conversation id from request or DB
    const { data: taskRow } = await supabase
      .from('tasks_v2')
      .select('conversation_id')
      .eq('task_id', taskId)
      .single();
    const resolvedConversationId = conversationId || taskRow?.conversation_id || null;

    await logExecution(supabase, usedUserId, taskId, null, 'planner', 'info', `Starting task execution (${executionId})`, undefined, resolvedConversationId || undefined);

    // Update task status to running
    await updateTaskStatus(taskId, 'running');

    // Load current step statuses from database to skip already-completed steps
    const { data: stepStatuses } = await supabase
      .from('task_steps_v2')
      .select('step_id, status')
      .eq('task_uuid', (await supabase
        .from('tasks_v2')
        .select('id')
        .eq('task_id', taskId)
        .single()).data?.id || '');

    const completedSteps = new Set(
      (stepStatuses || [])
        .filter((s: any) => s.status === 'completed')
        .map((s: any) => s.step_id)
    );

    console.log(`📋 [EXECUTE] Found ${completedSteps.size} already-completed steps:`, Array.from(completedSteps));

    // Execute steps sequentially
    const results: WorkerResult[] = [];
    const outputs: any[] = [];

    // If resuming, we need to skip all steps up to and including the resumeFromStepId
    let shouldSkipUntilResume = !!resumeFromStepId;
    let hasPassedResumePoint = false;

    for (const step of plan.steps) {
      // Skip steps that are already completed in the database
      if (completedSteps.has(step.id)) {
        console.log(`⏭️ [EXECUTE] Skipping already-completed step ${step.id} (found in DB)`);
        results.push({
          stepId: step.id,
          success: true,
          output: {
            type: 'data',
            title: `Step ${step.id} already completed`,
            data: {
              skipped: true,
              service: step.service,
              action: step.action,
            },
          },
        });
        continue;
      }

      // In resume mode, skip all steps up to and including the resume step
      if (shouldSkipUntilResume && !hasPassedResumePoint) {
        if (step.id === resumeFromStepId) {
          // Mark this step as completed (user already approved it)
          results.push({
            stepId: step.id,
            success: true,
            output: {
              type: 'data',
              title: `Step ${step.id} completed via preview flow`,
              data: {
                resumedFromPreview: true,
                service: step.service,
                action: step.action,
              },
            },
          });
          hasPassedResumePoint = true;
          console.log(`⏭️ [EXECUTE] Resuming from step ${step.id}, skipping all previous steps`);
          continue;
        } else {
          // Skip this step entirely (it was completed in a previous execution)
          console.log(`⏭️ [EXECUTE] Skipping already-completed step ${step.id}`);
          results.push({
            stepId: step.id,
            success: true,
            output: {
              type: 'data',
              title: `Step ${step.id} already completed`,
              data: {
                skipped: true,
                service: step.service,
                action: step.action,
              },
            },
          });
          continue;
        }
      }

      // Check dependencies
      if (step.dependencies && step.dependencies.length > 0) {
        const dependenciesMet = step.dependencies.every(depId => {
          const depResult = results.find(r => r.stepId === depId);
          return depResult && depResult.success;
        });

        if (!dependenciesMet) {
          await updateStepStatus(taskId, step.id, 'failed', 'Dependencies not met');
          await logExecution(
            supabase,
            usedUserId,
            taskId,
            step.id,
            'worker',
            'error',
            'Step skipped: dependencies not met',
            { status: 'failed', reason: 'dependencies_not_met' },
            resolvedConversationId || undefined
          );

          results.push({
            stepId: step.id,
            success: false,
            error: 'Dependencies not met',
          });
          continue;
        }
      }

      // Execute step (with access to previous results for simple placeholder resolution)
      const result = await executeStep(
        step,
        usedUserId,
        supabase,
        taskId,
        0,
        resolvedConversationId || undefined,
        results,
        mode
      );
      results.push(result);

      if (result.success && result.output) {
        outputs.push(result.output);

        // Save document references
        if (result.output.type === 'document' || result.output.type === 'file') {
          await supabase.from('documents_generated').insert({
            user_id: usedUserId,
            task_id: taskId,
            document_type: result.output.type,
            google_id: result.output.googleId,
            title: result.output.title,
            url: result.output.url,
            created_at: new Date().toISOString(),
          });
        }
      }

      // Stop execution if a critical step fails
      if (!result.success && !step.dependencies) {
        await logExecution(
          supabase,
          usedUserId,
          taskId,
          null,
          'worker',
          'error',
          'Execution stopped due to critical step failure',
          undefined,
          resolvedConversationId || undefined
        );
        break;
      }

      // In preview mode, stop executing further steps after preparing a Gmail send draft
      if (
        mode === 'preview' &&
        ((step.service === 'gmail' && step.action === 'send') ||
          (step.service === 'docs' && step.action === 'create'))
      ) {
        break;
      }
    }

    const summaryOutput = await generateContentSummaryOutput(plan, results);
    if (summaryOutput) {
      outputs.unshift(summaryOutput);
    }

    // Evaluate results
    await logExecution(supabase, usedUserId, taskId, null, 'evaluator', 'info', 'Evaluating results', undefined, resolvedConversationId || undefined);

    const evaluation = await evaluatorAgent.evaluateResults(plan, results);
    const summary = evaluatorAgent.generateSummary(plan, results);

    await logExecution(
      supabase,
      usedUserId,
      taskId,
      null,
      'evaluator',
      evaluation.valid ? 'success' : 'error',
      summary,
      undefined,
      resolvedConversationId || undefined
    );

    // Update task status
    const hasHardFailure = results.some(r => !r.success || !r.output);
    const finalStatus = hasHardFailure ? 'failed' : 'completed';
    await updateTaskStatus(
      taskId,
      finalStatus,
      summary,
      outputs,
      Date.now() - startTime
    );

    const response: AgentExecuteResponse = {
      taskId,
      status: finalStatus,
      outputs,
      error: hasHardFailure ? evaluation.issues?.join('; ') : undefined,
    };

    return NextResponse.json<ApiResponse<AgentExecuteResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in /api/agent/execute:', error);

    // Try to update task status to failed
    try {
      const body: AgentExecuteRequest = await request.json();
      await updateTaskStatus(
        body.taskId,
        'failed',
        error instanceof Error ? error.message : 'Execution error',
        [],
        Date.now() - startTime
      );
    } catch { }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to execute task',
          details: error,
        },
      },
      { status: 500 }
    );
  }
}

async function generateContentSummaryOutput(plan: TaskPlan, results: WorkerResult[]): Promise<any | null> {
  const candidate = findTextCandidate(results);
  if (!candidate) {
    return null;
  }

  const trimmed = candidate.text.trim();
  if (trimmed.length < 100) {
    return null;
  }

  const maxChars = 16000;
  const inputText = trimmed.length > maxChars ? trimmed.slice(0, maxChars) : trimmed;

  const prompt = `Summarize the following document for the user in clear, concise natural language. Focus on the main ideas, key points, and any important details.\n\nDocument title: ${candidate.title || plan.title
    }\n\nDocument content:\n${inputText}`;

  try {
    const result = await summarizerModel.generateContent([prompt]);
    const summaryText = result.response.text().trim();
    if (!summaryText) {
      return null;
    }

    return {
      type: 'data',
      title: candidate.title ? `Summary of ${candidate.title}` : 'Summary of document',
      data: {
        summary: summaryText,
      },
    };
  } catch (error) {
    console.error('Failed to generate content summary:', error);
    return null;
  }
}

function findTextCandidate(results: WorkerResult[]): { text: string; title?: string } | null {
  for (const r of results) {
    const output = r.output as any;
    if (!output) {
      continue;
    }

    if (output.type === 'data' && output.data) {
      const data = output.data as any;
      if (typeof data.content === 'string' && data.content.trim().length > 0) {
        return {
          text: data.content,
          title: data.title || output.title,
        };
      }
    }

    if (output.type === 'file' && output.data) {
      const data = output.data as any;
      const mimeType = String(data.mimeType || '');
      const content = data.content;
      const isTextLike =
        mimeType.startsWith('text/') ||
        mimeType.startsWith('application/vnd.google-apps.');

      if (typeof content === 'string' && isTextLike) {
        try {
          const decoded = Buffer.from(content, 'base64').toString('utf8');
          if (decoded.trim().length > 0) {
            return {
              text: decoded,
              title: output.title,
            };
          }
        } catch { }
      }
    }
  }

  return null;
}

async function maybeGenerateEmailSummaryBodyFromResults(
  step: PlanStep,
  previousResults: WorkerResult[],
  toParam?: any,
  subjectParam?: any
): Promise<string | null> {
  const description = (step.description || '').toLowerCase();
  const looksLikeSummaryEmail =
    description.includes('summary') ||
    description.includes('summarize') ||
    description.includes('summarise');

  if (!looksLikeSummaryEmail) {
    return null;
  }

  let contentText = '';

  // Prefer explicit structured/text content from prior data outputs (e.g., Sheets read)
  for (const r of previousResults) {
    const output = r.output as any;
    if (output?.type === 'data' && output.data) {
      const data = output.data as any;
      if (typeof data.content === 'string' && data.content.trim().length > 0) {
        contentText = data.content.trim();
        break;
      }
    }
  }

  if (!contentText) {
    const candidate = findTextCandidate(previousResults);
    if (!candidate || !candidate.text) {
      return null;
    }
    contentText = candidate.text.trim();
  }

  if (contentText.length < 50) {
    return null;
  }

  const maxChars = 16000;
  const inputText =
    contentText.length > maxChars ? contentText.slice(0, maxChars) : contentText;

  const toForPrompt = Array.isArray(toParam)
    ? toParam.join(', ')
    : typeof toParam === 'string'
      ? toParam
      : '';
  const subjectForPrompt = typeof subjectParam === 'string' ? subjectParam : '';

  const prompt = `You are AURA's email writer.

The user asked you to perform this step:
"${step.description}"

Recipient(s): ${toForPrompt || '(not specified)'}
Subject: ${subjectForPrompt || '(not specified)'}

Below is structured data (for example, a spreadsheet) that you must base the email summary on. The first row is usually headers.

${inputText}

Write the full email body, including:
- a short greeting,
- a concise but accurate summary of the data, mentioning key figures you can actually compute from the data,
- a brief closing line and sign-off as "AURA".

CRITICAL RULES:
- Use only information that can be derived from the data above.
- Do NOT invent column names, values, or student names.
- Do NOT use phrases like "assuming the sheet contains columns" or any similar wording.
- If a requested statistic cannot be computed from the data, say so explicitly instead of guessing.

Return only the email body, without any additional commentary.`;

  try {
    const result = await summarizerModel.generateContent([prompt]);
    const body = result.response.text().trim();
    return body || null;
  } catch (error) {
    console.error('Failed to generate email summary body:', error);
    return null;
  }
}

/**
 * Execute a single step with error handling and retries
 */
async function executeStep(
  step: PlanStep,
  userId: string,
  supabase: any,
  taskId: string,
  retryCount = 0,
  conversationId?: string,
  previousResults: WorkerResult[] = [],
  mode?: AgentExecuteRequest['mode']
): Promise<WorkerResult> {
  const maxRetries = 2;

  try {
    await updateStepStatus(taskId, step.id, 'running');
    await logExecution(
      supabase,
      userId,
      taskId,
      step.id,
      'worker',
      'info',
      `Executing step: ${step.description}`,
      { status: 'running' },
      conversationId
    );
    const resolvedStep = resolveStepPlaceholders(step, previousResults);

    const effectiveMode =
      mode === 'preview' || mode === 'preview_auto'
        ? 'preview'
        : 'auto';
    if (effectiveMode === 'preview' && resolvedStep.service === 'gmail' && resolvedStep.action === 'send') {
      const { to, subject, body, cc, bcc } = resolvedStep.parameters || {};

      let rawBody = typeof body === 'string' ? body : String(body ?? '');

      // For summary-style emails (e.g., summarizing a sheet or document),
      // try to regenerate the body using actual content from previous steps
      // instead of relying on planner-time guesses.
      const maybeDataDrivenBody = await maybeGenerateEmailSummaryBodyFromResults(
        resolvedStep,
        previousResults,
        to,
        subject
      );

      if (maybeDataDrivenBody && maybeDataDrivenBody.trim().length > 0) {
        rawBody = maybeDataDrivenBody;
      }

      const trimmedBody = rawBody.trim();
      const maxBodyChars = 4000;
      const bodyForOutput =
        trimmedBody.length > maxBodyChars ? trimmedBody.slice(0, maxBodyChars) : trimmedBody;

      const draftOutput = {
        type: 'email' as const,
        title: `Draft email: ${subject}`,
        data: {
          taskId,
          stepId: resolvedStep.id,
          to,
          cc,
          bcc,
          subject,
          body: bodyForOutput,
          mode: 'draft',
          requiresApproval: true,
        },
      };

      await updateStepStatus(taskId, step.id, 'completed');
      await logExecution(
        supabase,
        userId,
        taskId,
        step.id,
        'worker',
        'info',
        `Prepared Gmail send draft in preview mode: ${step.description}`,
        { status: 'completed', mode: 'preview', previewType: 'gmail_send_draft' },
        conversationId
      );

      return {
        stepId: step.id,
        success: true,
        output: draftOutput,
      };
    }

    if (effectiveMode === 'preview' && resolvedStep.service === 'docs' && resolvedStep.action === 'create') {
      const { title, content } = resolvedStep.parameters || {};

      const safeTitle = typeof title === 'string' && title.trim() !== '' ? title.trim() : 'Untitled document';
      const blocks = Array.isArray(content) ? content : [];
      const bodyText = blocks
        .map((block: any) => (typeof block?.text === 'string' ? block.text.trim() : ''))
        .filter((text: string) => text.length > 0)
        .join('\n\n');

      const draftOutput = {
        type: 'document' as const,
        title: `Draft doc: ${safeTitle}`,
        data: {
          taskId,
          stepId: resolvedStep.id,
          title: safeTitle,
          body: bodyText,
          content: blocks,
          mode: 'draft',
          requiresApproval: true,
        },
      };

      await updateStepStatus(taskId, step.id, 'completed');
      await logExecution(
        supabase,
        userId,
        taskId,
        step.id,
        'worker',
        'info',
        `Prepared Docs create draft in preview mode: ${step.description}`,
        { status: 'completed', mode: 'preview', previewType: 'docs_create_draft' },
        conversationId
      );

      return {
        stepId: step.id,
        success: true,
        output: draftOutput,
      };
    }

    const worker = getWorker(step.service);
    const result = await worker.executeStep(resolvedStep, userId);

    if (result.success) {
      await updateStepStatus(taskId, step.id, 'completed');
      await logExecution(
        supabase,
        userId,
        taskId,
        step.id,
        'worker',
        'success',
        `Step completed: ${step.description}`,
        { status: 'completed' },
        conversationId
      );
    } else {
      await updateStepStatus(taskId, step.id, 'failed', result.error || undefined);
      await logExecution(
        supabase,
        userId,
        taskId,
        step.id,
        'worker',
        'error',
        `Step failed: ${result.error}`,
        { status: 'failed' },
        conversationId
      );

      // Retry if applicable
      if (retryCount < maxRetries && isRetryable(result.error || '')) {
        await logExecution(
          supabase,
          userId,
          taskId,
          step.id,
          'worker',
          'info',
          `Retrying step (attempt ${retryCount + 1}/${maxRetries})`,
          undefined,
          conversationId
        );

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));

        return executeStep(step, userId, supabase, taskId, retryCount + 1, conversationId, previousResults, mode);
      }
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await updateStepStatus(taskId, step.id, 'failed', errorMessage);
    await logExecution(
      supabase,
      userId,
      taskId,
      step.id,
      'worker',
      'error',
      `Step error: ${errorMessage}`,
      { status: 'failed' },
      conversationId
    );

    return {
      stepId: step.id,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Resolve simple {{step_X.*}} placeholders in step parameters using previous WorkerResult outputs.
 * Currently supports patterns like {{step_1.fileId}} where fileId is taken from the first file
 * returned by a Drive search step, or from output.googleId / output.data.fileId when available.
 */
function resolveStepPlaceholders(step: PlanStep, previousResults: WorkerResult[]): PlanStep {
  if (!step.parameters) return step;

  const resolvedParameters = resolveValue(step.parameters, previousResults);

  return {
    ...step,
    parameters: resolvedParameters,
  };
}

function resolveValue(value: any, previousResults: WorkerResult[]): any {
  if (typeof value === 'string') {
    // First try strict {{step_X.*}} templates
    const templated = resolveTemplateString(value, previousResults);
    if (templated !== value) return templated;

    // Backward-compat: handle simple patterns like "fileId_from_step_1"
    const legacyMatch = value.match(/^\s*fileId_from_(step_\d+)\s*$/);
    if (legacyMatch) {
      const stepRef = legacyMatch[1];
      return resolveTemplateString(`{{${stepRef}.fileId}}`, previousResults);
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => resolveValue(v, previousResults));
  }

  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [key, v] of Object.entries(value)) {
      out[key] = resolveValue(v, previousResults);
    }
    return out;
  }

  return value;
}

function resolveTemplateString(template: string, previousResults: WorkerResult[]): any {
  const match = template.match(/^\s*\{\{\s*([^}]+)\s*\}\}\s*$/);
  if (!match) return template;

  const expression = match[1]; // e.g. "step_1.fileId"
  const [stepRef, ...pathParts] = expression.split('.');
  if (!stepRef.startsWith('step_')) return template;

  const targetStepId = stepRef;
  const result = previousResults.find((r) => r.stepId === targetStepId);
  if (!result) return template;

  const path = pathParts.join('.');

  // Special handling for common shortcuts like {{step_1.fileId}}
  if (path === 'fileId') {
    const output = result.output as any;
    if (!output) return template;

    if (output.googleId) return String(output.googleId);
    if (output.data?.fileId) return String(output.data.fileId);
    if (Array.isArray(output.data?.files) && output.data.files[0]?.id) {
      return String(output.data.files[0].id);
    }

    return template;
  }

  // Special handling for {{step_X.content}} to pull text content from prior outputs
  if (path === 'content') {
    const output = result.output as any;
    if (!output) return template;

    const data = output.data as any;
    if (data) {
      if (typeof data.content === 'string' && data.content.trim().length > 0) {
        return data.content;
      }
      if (typeof data.body === 'string' && data.body.trim().length > 0) {
        return data.body;
      }
    }

    const candidate = findTextCandidate([result]);
    if (candidate && candidate.text && candidate.text.trim().length > 0) {
      return candidate.text;
    }

    return template;
  }

  // Generic dotted path resolution starting from result
  let current: any = result;
  if (path) {
    const segments = path.split('.');
    for (const segment of segments) {
      if (!current) break;

      const arrayMatch = segment.match(/^(\w+)(\[(\d+)\])?$/);
      if (!arrayMatch) {
        current = current[segment as keyof typeof current];
        continue;
      }

      const key = arrayMatch[1];
      const indexStr = arrayMatch[3];

      current = current[key];
      if (indexStr !== undefined) {
        const idx = parseInt(indexStr, 10);
        if (Array.isArray(current)) {
          current = current[idx];
        } else {
          current = undefined;
          break;
        }
      }
    }
  }

  if (current === undefined || current === null) {
    return template;
  }

  return String(current);
}

/**
 * Log execution progress to Supabase
 */
async function logExecution(
  supabase: any,
  userId: string,
  taskId: string,
  stepId: string | null,
  agentType: string,
  logLevel: string,
  message: string,
  metadata?: any,
  conversationId?: string
): Promise<void> {
  try {
    await supabase.from('execution_logs').insert({
      user_id: userId,
      task_id: taskId,
      step_id: stepId,
      conversation_id: conversationId || null,
      agent_type: agentType,
      message,
      log_level: logLevel,
      metadata,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log execution:', error);
  }
}

/**
 * Check if an error is retryable
 */
function isRetryable(error: string): boolean {
  const retryableErrors = [
    'timeout',
    'network',
    'rate limit',
    'temporarily unavailable',
    'connection',
    'ECONNRESET',
    'ETIMEDOUT',
  ];

  const errorLower = error.toLowerCase();
  return retryableErrors.some(pattern => errorLower.includes(pattern));
}
