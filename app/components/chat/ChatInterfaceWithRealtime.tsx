'use client';

import { useState, useCallback } from 'react';
import { Message as MessageType, ExecutionUpdate } from '@/app/types/chat';
import { ChatInterface } from './ChatInterface';
import { useRealtimeLogs, ExecutionLog } from '@/app/hooks/useRealtimeLogs';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ChatInterfaceWithRealtimeProps {
  userId?: string;
  initialMessages?: MessageType[];
  onSendMessage?: (message: string) => Promise<void>;
  className?: string;
}

export function ChatInterfaceWithRealtime({
  userId,
  initialMessages = [],
  onSendMessage,
  className = '',
}: ChatInterfaceWithRealtimeProps) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // Subscribe to Realtime logs
  const { isConnected, error } = useRealtimeLogs({
    taskId: currentTaskId || undefined,
    userId,
    enabled: !!currentTaskId,
    onLogReceived: handleLogReceived,
  });

  // Handle incoming Realtime logs
  function handleLogReceived(log: ExecutionLog) {
    // Convert log to ExecutionUpdate
    const update: ExecutionUpdate = {
      stepId: log.step_id || log.id,
      message: log.message,
      timestamp: new Date(log.created_at),
      type: log.log_level === 'error' ? 'error' : log.log_level === 'success' ? 'success' : 'info',
    };

    // Find the assistant message for this task and update its execution feed
    setMessages((prev) =>
      prev.map((msg) => {
        if (
          msg.role === 'assistant' &&
          msg.taskDecomposition?.taskId === log.task_id
        ) {
          return {
            ...msg,
            executionFeed: [...(msg.executionFeed || []), update],
          };
        }
        return msg;
      })
    );

    // Update task step status if metadata contains status
    if (log.metadata?.status && log.step_id) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.role === 'assistant' &&
            msg.taskDecomposition?.taskId === log.task_id
          ) {
            return {
              ...msg,
              taskDecomposition: {
                ...msg.taskDecomposition,
                steps: msg.taskDecomposition.steps.map((step) =>
                  step.id === log.step_id
                    ? { ...step, status: log.metadata.status }
                    : step
                ),
              },
            };
          }
          return msg;
        })
      );
    }
  }

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (content: string) => {
      // Create user message
      const userMessage: MessageType = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        if (onSendMessage) {
          await onSendMessage(content);
        } else {
          // Default: Call the agent API
          const response = await fetch('/api/agent/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: content, userId }),
          });

          if (!response.ok) {
            throw new Error('Failed to plan task');
          }

          const data = await response.json();
          
          // Set current task ID for Realtime subscription
          setCurrentTaskId(data.taskId);

          // Create assistant message with task decomposition
          const assistantMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'I\'ve analyzed your request and created a plan. Executing now...',
            timestamp: new Date(),
            taskDecomposition: {
              taskId: data.taskId,
              steps: data.steps.map((step: any) => ({
                id: step.id,
                description: step.description,
                status: 'pending',
                agent: step.agent || 'worker',
                googleService: step.service,
              })),
            },
            executionFeed: [],
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Start execution
          fetch('/api/agent/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: data.taskId, userId }),
          }).catch((err) => {
            console.error('Execution error:', err);
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);

        const errorMessage: MessageType = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    },
    [userId, onSendMessage]
  );

  return (
    <div className="relative h-full">
      {/* Connection Status Indicator */}
      {currentTaskId && (
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`glass-panel-sm px-3 py-2 rounded-full flex items-center gap-2 text-xs ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Disconnected</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-16 right-4 z-10 max-w-xs">
          <div className="glass-panel-md p-3 rounded-lg border-l-4 border-red-500">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-300 font-medium">Connection Error</p>
                <p className="text-xs text-white/60 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <ChatInterface
        initialMessages={messages}
        onSendMessage={handleSendMessage}
        className={className}
      />
    </div>
  );
}
