'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ExecutionLog {
  id: string;
  user_id: string;
  task_id: string;
  step_id?: string;
  agent_type: string;
  message: string;
  log_level: 'info' | 'success' | 'error';
  metadata?: any;
  created_at: string;
}

interface UseRealtimeLogsOptions {
  taskId?: string;
  userId?: string;
  onLogReceived?: (log: ExecutionLog) => void;
  enabled?: boolean;
}

export function useRealtimeLogs({
  taskId,
  userId,
  onLogReceived,
  enabled = true,
}: UseRealtimeLogsOptions = {}) {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      try {
        // Build filter based on provided options
        let filter = 'execution_logs';
        if (taskId) {
          filter = `execution_logs:task_id=eq.${taskId}`;
        } else if (userId) {
          filter = `execution_logs:user_id=eq.${userId}`;
        }

        channel = supabase
          .channel('execution_logs_channel')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'execution_logs',
              filter: taskId ? `task_id=eq.${taskId}` : undefined,
            },
            (payload) => {
              const newLog = payload.new as ExecutionLog;
              
              // Filter by userId if specified
              if (userId && newLog.user_id !== userId) {
                return;
              }

              setLogs((prev) => [...prev, newLog]);
              
              if (onLogReceived) {
                onLogReceived(newLog);
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              setError(null);
            } else if (status === 'CHANNEL_ERROR') {
              setIsConnected(false);
              setError(new Error('Failed to connect to Realtime'));
            } else if (status === 'TIMED_OUT') {
              setIsConnected(false);
              setError(new Error('Connection timed out'));
            }
          });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsConnected(false);
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [taskId, userId, enabled, onLogReceived]);

  return {
    logs,
    isConnected,
    error,
  };
}
