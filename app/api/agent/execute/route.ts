import { NextRequest, NextResponse } from 'next/server';
import { getWorker } from '@/app/lib/agents/workers';
import { evaluatorAgent } from '@/app/lib/agents/evaluator';
import { getTaskPlan, updateTaskStatus, updateStepStatus } from '@/app/lib/agents/storage';
import { createServiceClient } from '@/app/lib/supabase/server';
import { ApiResponse, AgentExecuteRequest, AgentExecuteResponse } from '@/app/types/api';
import { WorkerResult, PlanStep } from '@/app/types/agent';

/**
 * POST /api/agent/execute
 * Execute planned task steps sequentially
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const supabase = createServiceClient();

  try {
    const body: AgentExecuteRequest = await request.json();
    const { taskId, userId, conversationId } = body;

    // Validate input
    if (!taskId || !userId) {
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
    const plan = await getTaskPlan(taskId, userId);

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

    await logExecution(supabase, userId, taskId, null, 'planner', 'info', 'Starting task execution', undefined, resolvedConversationId || undefined);

    // Update task status to running
    await updateTaskStatus(taskId, 'running');

    // Execute steps sequentially
    const results: WorkerResult[] = [];
    const outputs: any[] = [];

    for (const step of plan.steps) {
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
            userId,
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

      // Execute step
      const result = await executeStep(step, userId, supabase, taskId, 0, resolvedConversationId || undefined);
      results.push(result);

      if (result.success && result.output) {
        outputs.push(result.output);

        // Save document references
        if (result.output.type === 'document' || result.output.type === 'file') {
          await supabase.from('documents_generated').insert({
            user_id: userId,
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
          userId,
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
    }

    // Evaluate results
    await logExecution(supabase, userId, taskId, null, 'evaluator', 'info', 'Evaluating results', undefined, resolvedConversationId || undefined);

    const evaluation = await evaluatorAgent.evaluateResults(plan, results);
    const summary = evaluatorAgent.generateSummary(plan, results);

    await logExecution(
      supabase,
      userId,
      taskId,
      null,
      'evaluator',
      evaluation.valid ? 'success' : 'error',
      summary,
      undefined,
      resolvedConversationId || undefined
    );

    // Update task status
    const finalStatus = evaluation.valid ? 'completed' : 'failed';
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
      error: evaluation.valid ? undefined : evaluation.issues?.join('; '),
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
    } catch {}

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

/**
 * Execute a single step with error handling and retries
 */
async function executeStep(
  step: PlanStep,
  userId: string,
  supabase: any,
  taskId: string,
  retryCount = 0,
  conversationId?: string
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

    const worker = getWorker(step.service);
    const result = await worker.executeStep(step, userId);

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

        return executeStep(step, userId, supabase, taskId, retryCount + 1, conversationId);
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
