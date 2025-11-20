/**
 * Optimistic UI Update Utilities
 * 
 * Utilities for implementing optimistic updates with rollback on errors
 * Requirements: 19.4
 */

import { QueryClient } from '@tanstack/react-query';
import { Message, TaskStep } from '@/app/types/chat';

/**
 * Optimistic message update
 * Adds a message to the UI immediately before server confirmation
 */
export function addOptimisticMessage(
  messages: Message[],
  newMessage: Omit<Message, 'id' | 'timestamp'>
): Message[] {
  const optimisticMessage: Message = {
    ...newMessage,
    id: `optimistic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };

  return [...messages, optimisticMessage];
}

/**
 * Replace optimistic message with server response
 */
export function replaceOptimisticMessage(
  messages: Message[],
  optimisticId: string,
  serverMessage: Message
): Message[] {
  return messages.map((msg) =>
    msg.id === optimisticId ? serverMessage : msg
  );
}

/**
 * Remove optimistic message on error
 */
export function removeOptimisticMessage(
  messages: Message[],
  optimisticId: string
): Message[] {
  return messages.filter((msg) => msg.id !== optimisticId);
}

/**
 * Optimistic task status update
 */
export function updateTaskStatusOptimistically(
  task: {
    id: string;
    title: string;
    subtasks: TaskStep[];
    overallStatus: 'pending' | 'running' | 'completed' | 'failed';
  },
  stepId: string,
  newStatus: 'pending' | 'running' | 'completed' | 'failed'
): typeof task {
  return {
    ...task,
    subtasks: task.subtasks.map((step) =>
      step.id === stepId ? { ...step, status: newStatus } : step
    ),
  };
}

/**
 * Optimistic list item addition
 */
export function addOptimisticListItem<T extends { id: string }>(
  list: T[],
  newItem: Omit<T, 'id'>,
  position: 'start' | 'end' = 'end'
): T[] {
  const optimisticItem = {
    ...newItem,
    id: `optimistic_${Date.now()}`,
  } as T;

  return position === 'start'
    ? [optimisticItem, ...list]
    : [...list, optimisticItem];
}

/**
 * Optimistic list item update
 */
export function updateOptimisticListItem<T extends { id: string }>(
  list: T[],
  itemId: string,
  updates: Partial<T>
): T[] {
  return list.map((item) =>
    item.id === itemId ? { ...item, ...updates } : item
  );
}

/**
 * Optimistic list item deletion
 */
export function deleteOptimisticListItem<T extends { id: string }>(
  list: T[],
  itemId: string
): T[] {
  return list.filter((item) => item.id !== itemId);
}

/**
 * Rollback helper for optimistic updates
 */
export function createOptimisticUpdateWithRollback<T>(
  queryClient: QueryClient,
  queryKey: any[],
  updater: (oldData: T) => T
) {
  return {
    // Optimistically update the cache
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T>(queryKey);

      // Optimistically update to the new value
      if (previousData) {
        queryClient.setQueryData<T>(queryKey, updater(previousData));
      }

      // Return context with the previous value
      return { previousData };
    },

    // On error, rollback to the previous value
    onError: (err: any, variables: any, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

/**
 * Optimistic chat message sender
 */
export class OptimisticChatManager {
  private pendingMessages: Map<string, Message> = new Map();

  /**
   * Add a message optimistically
   */
  addMessage(
    content: string,
    role: 'user' | 'assistant' = 'user'
  ): { optimisticId: string; message: Message } {
    const optimisticId = `optimistic_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const message: Message = {
      id: optimisticId,
      role,
      content,
      timestamp: new Date(),
    };

    this.pendingMessages.set(optimisticId, message);

    return { optimisticId, message };
  }

  /**
   * Confirm message with server ID
   */
  confirmMessage(optimisticId: string, serverId: string): void {
    const message = this.pendingMessages.get(optimisticId);
    if (message) {
      this.pendingMessages.delete(optimisticId);
    }
  }

  /**
   * Rollback message on error
   */
  rollbackMessage(optimisticId: string): void {
    this.pendingMessages.delete(optimisticId);
  }

  /**
   * Get all pending messages
   */
  getPendingMessages(): Message[] {
    return Array.from(this.pendingMessages.values());
  }

  /**
   * Check if message is pending
   */
  isPending(messageId: string): boolean {
    return this.pendingMessages.has(messageId);
  }
}

/**
 * Optimistic task execution manager
 */
export class OptimisticTaskManager {
  private pendingTasks: Map<
    string,
    {
      id: string;
      title: string;
      subtasks: TaskStep[];
      overallStatus: 'pending' | 'running' | 'completed' | 'failed';
    }
  > = new Map();

  /**
   * Start task optimistically
   */
  startTask(
    title: string,
    steps: TaskStep[]
  ): {
    optimisticId: string;
    task: {
      id: string;
      title: string;
      subtasks: TaskStep[];
      overallStatus: 'pending' | 'running' | 'completed' | 'failed';
    };
  } {
    const optimisticId = `task_optimistic_${Date.now()}`;

    const task = {
      id: optimisticId,
      title,
      subtasks: steps,
      overallStatus: 'running' as const,
    };

    this.pendingTasks.set(optimisticId, task);

    return { optimisticId, task };
  }

  /**
   * Update task step status optimistically
   */
  updateStepStatus(
    taskId: string,
    stepId: string,
    status: 'pending' | 'running' | 'completed' | 'failed'
  ): void {
    const task = this.pendingTasks.get(taskId);
    if (task) {
      task.subtasks = task.subtasks.map((step) =>
        step.id === stepId ? { ...step, status } : step
      );
      this.pendingTasks.set(taskId, task);
    }
  }

  /**
   * Confirm task with server ID
   */
  confirmTask(optimisticId: string, serverId: string): void {
    const task = this.pendingTasks.get(optimisticId);
    if (task) {
      this.pendingTasks.delete(optimisticId);
    }
  }

  /**
   * Rollback task on error
   */
  rollbackTask(optimisticId: string): void {
    this.pendingTasks.delete(optimisticId);
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string) {
    return this.pendingTasks.get(taskId);
  }

  /**
   * Get all pending tasks
   */
  getPendingTasks() {
    return Array.from(this.pendingTasks.values());
  }
}

/**
 * Create singleton instances
 */
export const optimisticChatManager = new OptimisticChatManager();
export const optimisticTaskManager = new OptimisticTaskManager();
