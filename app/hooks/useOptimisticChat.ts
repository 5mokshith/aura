/**
 * Optimistic Chat Hook
 * 
 * Custom hook for chat interface with optimistic UI updates
 * Requirements: 19.4
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Message, TaskStep } from '@/app/types/chat';
import {
  addOptimisticMessage,
  replaceOptimisticMessage,
  removeOptimisticMessage,
  optimisticChatManager,
  optimisticTaskManager,
} from '@/app/lib/optimisticUpdates';
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

  const queryClient = useQueryClient();

  /**
   * Send message mutation with optimistic update
   */
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // Call agent API to plan and execute task
      const planResponse = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          userId: 'current-user-id', // TODO: Get from auth
        }),
      });

      const planResult = await planResponse.json();

      if (!planResult.success) {
        throw new Error(planResult.error?.message || 'Failed to plan task');
      }

      return planResult.data;
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

    onSuccess: (data, content, context) => {
      // Confirm user message
      if (context?.optimisticId) {
        optimisticChatManager.confirmMessage(context.optimisticId, data.taskId);
      }

      // Update assistant message with actual response
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `I'm working on your request: "${content}". I've broken it down into ${data.steps.length} steps.`,
        timestamp: new Date(),
        taskDecomposition: {
          taskId: data.taskId,
          steps: data.steps,
        },
        executionFeed: [],
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === context?.assistantMessageId ? assistantMessage : msg
        )
      );

      // Set active task
      setActiveTask({
        id: data.taskId,
        title: content,
        subtasks: data.steps,
        overallStatus: 'running',
      });

      // Start task execution
      executeTask(data.taskId);

      options.onSuccess?.(data);
    },

    onError: (error: Error, content, context) => {
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

    onMutate: async (newItem: Omit<T, 'id'>) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      // Optimistically update
      if (previousData) {
        const optimisticItem = {
          ...newItem,
          id: `optimistic_${Date.now()}`,
        } as T;

        queryClient.setQueryData<T[]>(queryKey, [...previousData, optimisticItem]);
      }

      return { previousData };
    },

    onError: (err, newItem, context) => {
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

    onError: (err, itemId, context) => {
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
