import { NextRequest } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';
import { ApiResponse } from '@/app/types/api';

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json();

    if (!taskId) {
      return Response.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_REQUEST', 
            message: 'Task ID is required' 
          } 
        } as ApiResponse,
        { status: 400 }
      );
    }

    const cookieUserId = request.cookies.get('aura_user_id')?.value;

    if (!cookieUserId) {
      return Response.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED', 
            message: 'Authentication required' 
          } 
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Create Supabase service client
    const supabase = createServiceClient();

    // Get the original task from V2
    const { data: originalTask, error: fetchError } = await supabase
      .from('tasks_v2')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', cookieUserId)
      .single();

    if (fetchError || !originalTask) {
      return Response.json(
        { 
          success: false, 
          error: { 
            code: 'TASK_NOT_FOUND', 
            message: 'Task not found or access denied' 
          } 
        } as ApiResponse,
        { status: 404 }
      );
    }

    const planResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agent/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        prompt: originalTask.input_prompt,
        userId: cookieUserId,
        conversationId: originalTask.conversation_id || undefined,
      }),
    });

    if (!planResponse.ok) {
      throw new Error('Failed to create retry plan');
    }

    const planData = await planResponse.json();

    if (!planData.success) {
      throw new Error(planData.error?.message || 'Failed to create retry plan');
    }

    // Execute the new task
    const executeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agent/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        taskId: planData.data.taskId,
        userId: cookieUserId,
        conversationId: originalTask.conversation_id || undefined,
      }),
    });

    if (!executeResponse.ok) {
      throw new Error('Failed to execute retry task');
    }

    const executeData = await executeResponse.json();

    // Update the original task status to 'rerun'
    await supabase
      .from('tasks_v2')
      .update({ 
        status: 'rerun',
        output_summary: `Task retried as ${planData.data.taskId}`,
      })
      .eq('task_id', taskId)
      .eq('user_id', cookieUserId);

    return Response.json({
      success: true,
      data: {
        originalTaskId: taskId,
        newTaskId: planData.data.taskId,
        status: executeData.success ? 'started' : 'failed',
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Retry task error:', error);
    return Response.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Internal server error' 
        } 
      } as ApiResponse,
      { status: 500 }
    );
  }
}