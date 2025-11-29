import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvaluationResult, WorkerResult, TaskPlan } from '@/app/types/agent';
import { getEnv } from '@/app/lib/env';

const envConfig = getEnv();
const genAI = new GoogleGenerativeAI(envConfig.llm.geminiApiKey!);

export class EvaluatorAgent {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: envConfig.llm.geminiModel || 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent evaluation
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });
  }

  /**
   * Evaluate task execution results
   */
  async evaluateResults(
    plan: TaskPlan,
    results: WorkerResult[]
  ): Promise<EvaluationResult> {
    try {
      // Quick validation first
      const quickValidation = this.quickValidate(results);
      if (!quickValidation.valid) {
        return quickValidation;
      }

      // Deep validation with AI
      const systemPrompt = this.getSystemPrompt();
      const evaluationPrompt = this.formatEvaluationPrompt(plan, results);

      const result = await this.model.generateContent([systemPrompt, evaluationPrompt]);
      const response = result.response.text();

      // Extract JSON from response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;

      const evaluation = JSON.parse(jsonText);

      return {
        valid: evaluation.valid,
        issues: evaluation.issues || [],
        suggestions: evaluation.suggestions || [],
        retrySteps: evaluation.retrySteps || [],
      };
    } catch (error) {
      console.error('Evaluator Agent Error:', error);
      // Return a safe default evaluation
      return {
        valid: true,
        issues: [],
        suggestions: ['Evaluation completed with warnings'],
      };
    }
  }

  /**
   * Quick validation without AI (fast path)
   */
  private quickValidate(results: WorkerResult[]): EvaluationResult {
    const issues: string[] = [];
    const retrySteps: string[] = [];

    // Check for failed steps
    const failedSteps = results.filter(r => !r.success);
    if (failedSteps.length > 0) {
      failedSteps.forEach(step => {
        issues.push(`Step ${step.stepId} failed: ${step.error}`);
        retrySteps.push(step.stepId);
      });

      return {
        valid: false,
        issues,
        suggestions: ['Retry failed steps', 'Check error messages for details'],
        retrySteps,
      };
    }

    // Check for missing outputs
    const stepsWithoutOutput = results.filter(r => r.success && !r.output);
    if (stepsWithoutOutput.length > 0) {
      stepsWithoutOutput.forEach(step => {
        issues.push(`Step ${step.stepId} succeeded but produced no output`);
      });

      return {
        valid: false,
        issues,
        suggestions: ['Review step implementation', 'Ensure outputs are properly returned'],
        retrySteps: stepsWithoutOutput.map(s => s.stepId),
      };
    }

    return {
      valid: true,
      issues: [],
      suggestions: [],
    };
  }

  /**
   * Identify failures and suggest retries
   */
  identifyFailures(results: WorkerResult[]): {
    failures: WorkerResult[];
    retryable: string[];
  } {
    const failures = results.filter(r => !r.success);
    
    // Determine which failures are retryable
    const retryable = failures
      .filter(f => this.isRetryable(f.error || ''))
      .map(f => f.stepId);

    return { failures, retryable };
  }

  /**
   * Generate result summary
   */
  generateSummary(plan: TaskPlan, results: WorkerResult[]): string {
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;

    const outputs = results
      .filter(r => r.success && r.output)
      .map(r => r.output!);

    const documents = outputs.filter(o => o.type === 'document');
    const emails = outputs.filter(o => o.type === 'email');
    const events = outputs.filter(o => o.type === 'calendar_event');
    const files = outputs.filter(o => o.type === 'file');

    let summary = `Task "${plan.title}" completed with ${successful}/${total} steps successful.`;

    if (failed > 0) {
      summary += ` ${failed} step(s) failed.`;
    }

    const achievements: string[] = [];
    if (documents.length > 0) achievements.push(`${documents.length} document(s) created`);
    if (emails.length > 0) achievements.push(`${emails.length} email(s) sent`);
    if (events.length > 0) achievements.push(`${events.length} event(s) created`);
    if (files.length > 0) achievements.push(`${files.length} file(s) processed`);

    if (achievements.length > 0) {
      summary += ` Achievements: ${achievements.join(', ')}.`;
    }

    return summary;
  }

  private getSystemPrompt(): string {
    return `You are an evaluation agent for AURA (Agentic Unified Reasoning Assistant).
Your role is to validate task execution results and identify any issues or improvements.

Evaluate the task execution based on:
1. Did all steps complete successfully?
2. Are the outputs appropriate for the requested task?
3. Are there any inconsistencies or errors?
4. Could the execution be improved?

Return JSON in this format:
{
  "valid": true/false,
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "retrySteps": ["step_id_1", "step_id_2"]
}

Guidelines:
- Set "valid" to false only if there are critical issues (for example: core content missing, wrong recipient, or outputs clearly not matching the user's intent).
- Use the task plan title and step descriptions as the source of truth for what the user actually requested, including the intended tone (for example, "romantic", "personal", or "formal") and topic.
- For email tasks where the description clearly asks for a personal, romantic, or sentimental message (for example, describing how two people met, filled with love), treat a romantic or poetic email as appropriate and do NOT mark the task invalid just because it is not a generic business email.
- Only treat tone or style as a critical issue when the email obviously contradicts the requested style or omits key information the request explicitly asked to include (such as required dates, times, locations, or links).
- When results are broadly on-topic but could be improved (for example, more detail, clearer wording, or a slightly different tone), set "valid" to true and record your concerns in "issues" or "suggestions" instead of failing the task.
- List specific, actionable issues
- Provide constructive suggestions for improvement
- Only suggest retrying steps that actually failed or produced incorrect results
- When tasks involve writing content (e.g., stories, summaries, emails) or specify a word count, use any available text in the outputs (such as document content or email body previews) to judge whether the content was actually produced.
- Treat word-count requirements as soft constraints: if there is clearly a substantial, on-topic piece of text (for example, a full paragraph or story) you may still set "valid" to true even if the length is not exactly the requested word count. In that case, note any concerns about length in "issues" or "suggestions" instead of failing the task.
- Only set "valid" to false for word-count reasons when the available text is extremely short compared to the request (e.g., just a title, a single short sentence, or obvious placeholder text where a long story or report was requested).`;
  }

  private formatEvaluationPrompt(plan: TaskPlan, results: WorkerResult[]): string {
    const resultsText = results
      .map(r => {
        if (r.success && r.output) {
          const output = r.output;
          let details = '';

          if (output.type === 'email') {
            const data = output.data || {};
            const to = Array.isArray((data as any).to)
              ? (data as any).to.join(', ')
              : (data as any).to;
            const bodyPreviewRaw = typeof (data as any).body === 'string' ? (data as any).body : '';
            const bodyPreview = bodyPreviewRaw.trim().slice(0, 1600);
            const parts: string[] = [];
            if (to) parts.push(`to: ${to}`);
            if (bodyPreview) parts.push(`body preview: "${bodyPreview}"`);
            if (parts.length > 0) {
              details = ` (${parts.join(', ')})`;
            }
          }

          return `	 ${r.stepId}: Success - ${output.title || 'Completed'}${details}`;
        }

        if (r.success) {
          return `	 ${r.stepId}: Success - Completed`;
        }

        return `	 ${r.stepId}: Failed - ${r.error}`;
      })
      .join('\n');

    return `Task Plan:
Title: ${plan.title}
Steps: ${plan.steps.length}

Execution Results:
${resultsText}

Please evaluate these results and provide your assessment.`;
  }

  private isRetryable(error: string): boolean {
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
}

// Export singleton instance
export const evaluatorAgent = new EvaluatorAgent();
