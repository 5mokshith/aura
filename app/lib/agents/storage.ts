import { createServiceClient } from '@/app/lib/supabase/server';
import { TaskPlan, PlanStep } from '@/app/types/agent';

/**
 * Storage utilities for task plans
 * Note: This uses metadata field in task_history for simplicity
 * In production, consider a separate task_steps table
 */

export async function saveTaskPlan(plan: TaskPlan): Promise<void> {
  const supabase = createServiceClient();

  // Store plan steps in metadata
  const { error } = await supabase
    .from('task_history')
    .update({
      metadata: {
        steps: plan.steps,
        title: plan.title,
      },
    })
    .eq('task_id', plan.taskId);

  if (error) {
    throw new Error(`Failed to save task plan: ${error.message}`);
  }
}

export async function getTaskPlan(taskId: string, userId: string): Promise<TaskPlan | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('task_history')
    .select('*')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  // Reconstruct plan from metadata
  const metadata = data.metadata as any;
  if (!metadata || !metadata.steps) {
    return null;
  }

  return {
    taskId: data.task_id,
    userId: data.user_id,
    title: metadata.title || data.title,
    steps: metadata.steps as PlanStep[],
    createdAt: new Date(data.created_at),
  };
}

export async function updateTaskStatus(
  taskId: string,
  status: 'pending' | 'running' | 'completed' | 'failed',
  summary?: string,
  outputs?: any[],
  durationMs?: number
): Promise<void> {
  const supabase = createServiceClient();

  const updates: any = {
    status,
  };

  if (summary) {
    updates.output_summary = summary;
  }

  if (outputs) {
    updates.outputs = outputs;
  }

  if (durationMs !== undefined) {
    updates.duration_ms = durationMs;
  }

  if (status === 'completed' || status === 'failed') {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('task_history')
    .update(updates)
    .eq('task_id', taskId);

  if (error) {
    throw new Error(`Failed to update task status: ${error.message}`);
  }
}
