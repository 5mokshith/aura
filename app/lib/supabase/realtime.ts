import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from './client';

export interface RealtimeSubscriptionOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  callback: (payload: any) => void;
}

export function subscribeToTable({
  table,
  event = '*',
  filter,
  callback,
}: RealtimeSubscriptionOptions): RealtimeChannel {
  const supabase = createClient();

  let channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table,
        filter,
      } as any,
      callback
    );

  channel.subscribe();

  return channel;
}

export function unsubscribe(channel: RealtimeChannel) {
  channel.unsubscribe();
}

// Subscribe to execution logs for a specific task
export function subscribeToExecutionLogs(
  taskId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  return subscribeToTable({
    table: 'execution_logs',
    event: 'INSERT',
    filter: `task_id=eq.${taskId}`,
    callback,
  });
}

// Subscribe to task history updates
export function subscribeToTaskHistory(
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  return subscribeToTable({
    table: 'task_history',
    event: '*',
    filter: `user_id=eq.${userId}`,
    callback,
  });
}
