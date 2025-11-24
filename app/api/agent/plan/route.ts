import { NextRequest, NextResponse } from 'next/server';
import { plannerAgent } from '@/app/lib/agents/planner';
import { saveTaskPlan } from '@/app/lib/agents/storage';
import { createServiceClient } from '@/app/lib/supabase/server';
import { ApiResponse, AgentPlanRequest, AgentPlanResponse } from '@/app/types/api';

/**
 * POST /api/agent/plan
 * Decompose user prompt into executable steps
 */
export async function POST(request: NextRequest) {
  try {
    const body: AgentPlanRequest = await request.json();
    const { prompt, userId } = body;

    // Validate input
    if (!prompt || !userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Missing required fields: prompt and userId',
          },
        },
        { status: 400 }
      );
    }

    // Plan the task using Planner Agent
    const plan = await plannerAgent.planTask(prompt, userId);

    // Save task plan to database
    const supabase = createServiceClient();
    const { error: insertError } = await supabase.from('task_history').insert({
      task_id: plan.taskId,
      user_id: userId,
      title: plan.title,
      status: 'pending',
      input_prompt: prompt,
      google_services: plannerAgent.identifyRequiredServices(plan.steps),
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Failed to save task plan:', insertError);
      console.error('Supabase task_history insert error details:', {
        code: (insertError as any).code,
        message: (insertError as any).message,
        details: (insertError as any).details,
        hint: (insertError as any).hint,
      });
      throw new Error('Failed to save task plan to database');
    }

    // Save plan steps
    await saveTaskPlan(plan);

    // Log the planning step
    await supabase.from('execution_logs').insert({
      user_id: userId,
      task_id: plan.taskId,
      agent_type: 'planner',
      message: `Task planned: ${plan.title} with ${plan.steps.length} steps`,
      log_level: 'info',
      metadata: {
        stepCount: plan.steps.length,
        services: plannerAgent.identifyRequiredServices(plan.steps),
      },
      created_at: new Date().toISOString(),
    });

    // Convert plan steps to TaskStep format for response
    const responseSteps = plan.steps.map(step => ({
      id: step.id,
      description: step.description,
      status: 'pending' as const,
      agent: 'worker' as const,
      googleService: step.service,
    }));

    const response: AgentPlanResponse = {
      taskId: plan.taskId,
      steps: responseSteps,
    };

    return NextResponse.json<ApiResponse<AgentPlanResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/agent/plan:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'PLANNING_FAILED',
          message: error instanceof Error ? error.message : 'Failed to plan task',
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
