import { createServiceClient } from '@/app/lib/supabase/server';
import { TaskPlan, PlanStep } from '@/app/types/agent';

/**
 * Storage utilities for task plans (V2)
 * Uses tasks_v2 and task_steps_v2 tables.
 */

export async function saveTaskPlan(plan: TaskPlan): Promise<void> {
  const supabase = createServiceClient();

  // Find tasks_v2 UUID by task_id
  const { data: taskRow, error: taskErr } = await supabase
    .from('tasks_v2')
    .select('id')
    .eq('task_id', plan.taskId)
    .single();

  if (taskErr || !taskRow) {
    throw new Error(`Failed to locate task_v2 for steps insert: ${taskErr?.message || 'not found'}`);
  }

  const taskUuid = taskRow.id;

  const stepRows = plan.steps.map((s) => ({
    task_uuid: taskUuid,
    step_id: s.id,
    description: s.description,
    service: s.service,
    action: s.action,
    parameters: s.parameters || {},
    dependencies: s.dependencies || [],
    status: 'pending',
  }));

  const { error: stepsErr } = await supabase.from('task_steps_v2').insert(stepRows);
  if (stepsErr) {
    throw new Error(`Failed to save task steps: ${stepsErr.message}`);
  }
}

export async function getTaskPlan(taskId: string, userId: string): Promise<TaskPlan | null> {
  const supabase = createServiceClient();

  const { data: task, error: taskErr } = await supabase
    .from('tasks_v2')
    .select('id, user_id, task_id, title, created_at')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .single();

  if (taskErr || !task) return null;

  const { data: steps, error: stepsErr } = await supabase
    .from('task_steps_v2')
    .select('step_id, description, service, action, parameters, dependencies')
    .eq('task_uuid', task.id)
    .order('created_at', { ascending: true });

  if (stepsErr) return null;

  const planSteps: PlanStep[] = (steps || []).map((s: any) => ({
    id: s.step_id,
    description: s.description,
    service: s.service,
    action: s.action,
    parameters: s.parameters || {},
    dependencies: s.dependencies || [],
  }));

  return {
    taskId: task.task_id,
    userId: task.user_id,
    title: task.title,
    steps: planSteps,
    createdAt: new Date(task.created_at),
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

  // Map internal statuses to DB reporting semantics (success vs completed)
  const dbStatus = status === 'completed' ? 'success' : status;

  const updates: any = {
    status: dbStatus,
  };

  if (summary) updates.output_summary = summary;
  if (outputs) updates.outputs = outputs;
  if (durationMs !== undefined) updates.duration_ms = durationMs;

  const nowIso = new Date().toISOString();
  if (status === 'running') updates.started_at = updates.started_at || nowIso;
  if (status === 'completed' || status === 'failed') updates.completed_at = nowIso;

  const { error } = await supabase
    .from('tasks_v2')
    .update(updates)
    .eq('task_id', taskId);

  if (error) {
    throw new Error(`Failed to update task status: ${error.message}`);
  }
}

export async function updateStepStatus(
  taskId: string,
  stepId: string,
  status: 'pending' | 'running' | 'completed' | 'failed',
  errorMessage?: string
): Promise<void> {
  const supabase = createServiceClient();

  // Lookup task UUID
  const { data: task, error: taskErr } = await supabase
    .from('tasks_v2')
    .select('id')
    .eq('task_id', taskId)
    .single();

  if (taskErr || !task) return;

  const updates: any = { status };
  const nowIso = new Date().toISOString();
  if (status === 'running') updates.started_at = nowIso;
  if (status === 'completed' || status === 'failed') updates.finished_at = nowIso;
  if (errorMessage) updates.error = errorMessage;

  await supabase
    .from('task_steps_v2')
    .update(updates)
    .eq('task_uuid', task.id)
    .eq('step_id', stepId);
}
