/**
 * Optimistic Chat Hook
 * 
 * Custom hook for chat interface with optimistic UI updates
 * Requirements: 19.4
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Message, TaskStep } from '@/app/types/chat';
import { optimisticChatManager } from '@/app/lib/optimisticUpdates';
import { queryKeys } from '@/app/lib/queryClient';

interface UseOptimisticChatOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useOptimisticChat(options: UseOptimisticChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTask, setActiveTask] = useState<{
    id: string;
    title: string;
    subtasks: TaskStep[];
    overallStatus: 'pending' | 'running' | 'completed' | 'failed';
  } | undefined>(undefined);
  const [suggestedTask, setSuggestedTask] = useState<{ description: string; prompt: string } | null>(null);

  const queryClient = useQueryClient();

  /**
   * Send message mutation with optimistic update
   */
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          userId: 'current-user-id', // TODO: Get from auth
          conversationHistory: history,
        }),
      });

      const chatResult = await chatResponse.json();
      if (!chatResult.success) {
        throw new Error(chatResult.error?.message || 'Chat service failed');
      }
      return chatResult.data;
    },

    onMutate: async (content: string) => {
      // Add user message optimistically
      const { optimisticId, message: userMessage } =
        optimisticChatManager.addMessage(content, 'user');

      setMessages((prev) => [...prev, userMessage]);

      // Create optimistic assistant response
      const assistantMessage: Message = {
        id: `optimistic_assistant_${Date.now()}`,
        role: 'assistant',
        content: 'Processing your request...',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      return { optimisticId, assistantMessageId: assistantMessage.id };
    },

    onSuccess: (data, _content, context) => {
      // Confirm user message (no task id in chat response, keep confirmation simple)
      if (context?.optimisticId) {
        optimisticChatManager.confirmMessage(context.optimisticId, context.optimisticId);
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: String(data.message || ''),
        timestamp: new Date(),
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === context?.assistantMessageId ? assistantMessage : msg
        )
      );

      if (data.suggestedTask?.prompt) {
        setSuggestedTask({
          description: String(data.suggestedTask.description || 'Suggested task'),
          prompt: String(data.suggestedTask.prompt),
        });
      } else {
        setSuggestedTask(null);
      }

      options.onSuccess?.(data);
    },

    onError: (error: Error, _content, context) => {
      // Rollback optimistic updates
      if (context?.optimisticId) {
        optimisticChatManager.rollbackMessage(context.optimisticId);
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== context.optimisticId)
        );
      }

      // Update assistant message with error
      if (context?.assistantMessageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === context.assistantMessageId
              ? {
                  ...msg,
                  content: `Error: ${error.message}. Please try again.`,
                }
              : msg
          )
        );
      }

      options.onError?.(error);
    },
  });

  /**
   * Execute task (called after planning)
   */
  const executeTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userId: 'current-user-id', // TODO: Get from auth
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Task execution failed');
      }

      // Update task status to completed
      setActiveTask((prev) =>
        prev
          ? {
              ...prev,
              subtasks: prev.subtasks.map((step) => ({
                ...step,
                status: 'completed',
              })),
              overallStatus: 'completed',
            }
          : undefined
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.taskHistory.all });
    } catch (error) {
      // Update task status to failed
      setActiveTask((prev) =>
        prev
          ? {
              ...prev,
              overallStatus: 'failed',
            }
          : undefined
      );

      console.error('Task execution error:', error);
    }
  };

  /**
   * Send message with optimistic update
   */
  const sendMessage = useCallback(
    (content: string) => {
      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation]
  );

  /**
   * Retry failed task
   */
  const retryTask = useCallback(
    (taskId: string) => {
      if (activeTask) {
        // Reset task status
        setActiveTask({
          ...activeTask,
          subtasks: activeTask.subtasks.map((step) => ({
            ...step,
            status: 'pending',
          })),
          overallStatus: 'running',
        });

        // Re-execute task
        executeTask(taskId);
      }
    },
    [activeTask]
  );

  return {
    messages,
    activeTask,
    sendMessage,
    suggestedTask,
    executeSuggestedTask,
    retryTask,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
}

/**
 * Hook for optimistic list updates (e.g., file uploads, task creation)
 */
export function useOptimisticList<T extends { id: string }>(
  queryKey: any[],
  mutationFn: (item: Omit<T, 'id'>) => Promise<T>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onMutate: async (_newItem: Omit<T, 'id'>) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      // Optimistically update
      if (previousData) {
        const optimisticItem = {
          ..._newItem,
          id: `optimistic_${Date.now()}`,
        } as T;

        queryClient.setQueryData<T[]>(queryKey, [...previousData, optimisticItem]);
      }

      return { previousData };
    },

    onError: (_err, _newItem, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * Hook for optimistic item deletion
 */
export function useOptimisticDelete<T extends { id: string }>(
  queryKey: any[],
  deleteFn: (id: string) => Promise<void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFn,

    onMutate: async (itemId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      // Optimistically remove item
      if (previousData) {
        queryClient.setQueryData<T[]>(
          queryKey,
          previousData.filter((item) => item.id !== itemId)
        );
      }

      return { previousData };
    },

    onError: (_err, _itemId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
