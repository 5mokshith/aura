import { NextRequest, NextResponse } from 'next/server';
import { plannerAgent } from '@/app/lib/agents/planner';
import { saveTaskPlan } from '@/app/lib/agents/storage';
import { createServiceClient, createClient } from '@/app/lib/supabase/server';
import { ApiResponse, AgentPlanRequest, AgentPlanResponse } from '@/app/types/api';

/**
 * POST /api/agent/plan
 * Decompose user prompt into executable steps
 */
export async function POST(request: NextRequest) {
  try {
    const body: AgentPlanRequest = await request.json();
    const { prompt, userId, conversationId } = body;

    const isUuid = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    const cookieClient = await createClient();
    const { data: { user: authUser } } = await cookieClient.auth.getUser();
    const usedUserId = isUuid(userId) ? userId : (authUser?.id || '');
    const usedConversationId = isUuid(conversationId) ? conversationId : null;

    // Validate input
    if (!prompt || !usedUserId) {
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
    const plan = await plannerAgent.planTask(prompt, usedUserId);

    // Save task (V2)
    const supabase = createServiceClient();
    const { error: insertError } = await supabase.from('tasks_v2').insert({
      task_id: plan.taskId,
      user_id: usedUserId,
      conversation_id: usedConversationId,
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

    // Save plan steps (V2)
    await saveTaskPlan(plan);

    // Log the planning step
    await supabase.from('execution_logs').insert({
      user_id: usedUserId,
      task_id: plan.taskId,
      conversation_id: usedConversationId,
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
      title: plan.title,
      conversationId: usedConversationId || undefined,
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
