import { NextRequest, NextResponse } from 'next/server';
import { evaluatorAgent } from '@/app/lib/agents/evaluator';
import { getTaskPlan } from '@/app/lib/agents/storage';
import { createServiceClient } from '@/app/lib/supabase/server';
import { ApiResponse } from '@/app/types/api';
import { WorkerResult } from '@/app/types/agent';

interface EvaluateRequest {
  taskId: string;
  userId: string;
  outputs?: any[];
}

interface EvaluateResponse {
  valid: boolean;
  issues?: string[];
  suggestions?: string[];
  retrySteps?: string[];
  summary: string;
}

/**
 * POST /api/agent/evaluate
 * Validate task execution results
 */
export async function POST(request: NextRequest) {
  try {
    const body: EvaluateRequest = await request.json();
    const { taskId, userId, outputs } = body;

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

    // Retrieve task plan
    const plan = await getTaskPlan(taskId, userId);

    if (!plan) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found',
          },
        },
        { status: 404 }
      );
    }

    // Retrieve execution results from database (V2)
    const supabase = createServiceClient();
    const { data: taskData } = await supabase
      .from('tasks_v2')
      .select('*')
      .eq('task_id', taskId)
      .single();

    if (!taskData) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task execution data not found',
          },
        },
        { status: 404 }
      );
    }

    // Construct results from stored data
    // In a real implementation, you'd store individual step results
    const results: WorkerResult[] = plan.steps.map((step, index) => ({
      stepId: step.id,
      success: taskData.status === 'success',
      output: outputs?.[index],
    }));

    // Evaluate results
    const evaluation = await evaluatorAgent.evaluateResults(plan, results);
    const summary = evaluatorAgent.generateSummary(plan, results);

    // Log evaluation
    await supabase.from('execution_logs').insert({
      user_id: userId,
      task_id: taskId,
      agent_type: 'evaluator',
      message: `Evaluation: ${evaluation.valid ? 'Valid' : 'Invalid'}`,
      log_level: evaluation.valid ? 'success' : 'error',
      metadata: {
        issues: evaluation.issues,
        suggestions: evaluation.suggestions,
        retrySteps: evaluation.retrySteps,
      },
      created_at: new Date().toISOString(),
    });

    const response: EvaluateResponse = {
      valid: evaluation.valid,
      issues: evaluation.issues,
      suggestions: evaluation.suggestions,
      retrySteps: evaluation.retrySteps,
      summary,
    };

    return NextResponse.json<ApiResponse<EvaluateResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/agent/evaluate:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'EVALUATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to evaluate task',
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
