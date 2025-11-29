'use client';

import { useState, useCallback } from 'react';
import { Message as MessageType, ExecutionUpdate } from '@/app/types/chat';
import { ChatInterface } from './ChatInterface';
import { useRealtimeLogs, ExecutionLog } from '@/app/hooks/useRealtimeLogs';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { TaskVisualizer } from '../task/TaskVisualizer';

interface ChatInterfaceWithRealtimeProps {
  userId?: string;
  initialMessages?: MessageType[];
  onSendMessage?: (message: string) => Promise<void>;
  className?: string;
}

function buildExecutionSummary(outputs: any[]): string | null {
  if (!outputs || outputs.length === 0) {
    return null;
  }

  const primary = outputs[0];

  // Handle Gmail search/read responses where data.messages contains email list
  if (
    primary?.type === 'data' &&
    primary.data &&
    Array.isArray(primary.data.messages)
  ) {
    const messages = primary.data.messages as any[];

    if (messages.length === 0) {
      return 'I checked your inbox but did not find any emails for this request.';
    }

    const header = `Here are your latest ${messages.length} emails:`;
    const lines = messages.map((m, index) => {
      const from = m.from || 'Unknown sender';
      const subject = m.subject && m.subject.trim() !== '' ? m.subject : '(no subject)';
      const date = m.date || '';

      // First line: numbered subject + sender (and date if available)
      const titleLine = `${index + 1}. ${subject} — ${from}${date ? ` (${date})` : ''}`;

      // Optional second line: a short snippet, trimmed and collapsed
      const rawSnippet = typeof m.snippet === 'string' ? m.snippet.trim().replace(/\s+/g, ' ') : '';
      const maxSnippetLength = 160;
      const snippet = rawSnippet
        ? rawSnippet.length > maxSnippetLength
          ? `${rawSnippet.slice(0, maxSnippetLength).trim()}...`
          : rawSnippet
        : '';

      const snippetLine = snippet ? `   ${snippet}` : '';
      return snippetLine ? `${titleLine}\n${snippetLine}` : titleLine;
    });

    return [header, '', ...lines].join('\n\n');
  }

  // Handle single Gmail read response where data.body contains the email content
  if (primary?.type === 'data' && primary.data && primary.data.body) {
    const { subject, from, date, body } = primary.data as any;
    const safeSubject = subject && subject.trim() !== '' ? subject : '(no subject)';
    const sender = from || 'Unknown sender';
    const when = date || '';

    const header = `Here is the email "${safeSubject}" from ${sender}${when ? ` (${when})` : ''}:`;

    // Avoid dumping an extremely long body into chat
    const maxChars = 1500;
    const textBody = typeof body === 'string' ? body.trim() : '';
    const truncatedBody = textBody.length > maxChars
      ? `${textBody.slice(0, maxChars)}...`
      : textBody;

    return truncatedBody
      ? `${header}\n\n${truncatedBody}`
      : header;
  }

  // Fallback: list output titles if available
  const titles = outputs
    .map((o: any) => o?.title)
    .filter((t: any) => typeof t === 'string' && t.length > 0);

  if (titles.length > 0) {
    return `Task completed. Generated outputs:\n\n${titles
      .map((t: string) => `- ${t}`)
      .join('\n')}`;
  }

  return 'Task completed successfully.';
}

export function ChatInterfaceWithRealtime({
  userId,
  initialMessages = [],
  onSendMessage,
  className = '',
}: ChatInterfaceWithRealtimeProps) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<Array<{ description: string; prompt: string }>>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

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

  // Handle sending messages (let Gemini handle clarifications via /api/chat)
  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: MessageType = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Optimistically append user message
      setMessages((prev) => [...prev, userMessage]);

      try {
        if (onSendMessage) {
          await onSendMessage(content);
          return;
        }

        if (!userId) {
          throw new Error('User not authenticated. Please connect Google Workspace and refresh the page.');
        }

        // Include the just-sent user message in history
        const history = [...messages, userMessage].map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, userId, conversationHistory: history, conversationId }),
        });

        if (!response.ok) {
          throw new Error('Chat service failed');
        }

        const chatResult = await response.json();
        if (!chatResult.success || !chatResult.data) {
          throw new Error(chatResult.error?.message || 'Chat service error');
        }

        const { message: assistantText, suggestedTask: suggestion, suggestedTasks: multi, conversationId: newConversationId } = chatResult.data;

        const assistantMessage: MessageType = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: assistantText || ' ',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (newConversationId) {
          setConversationId(newConversationId);
        }

        if (Array.isArray(multi) && multi.length > 0) {
          setSuggestedTasks(multi);
        } else if (suggestion && suggestion.prompt) {
          setSuggestedTasks([{ description: suggestion.description || 'Suggested task', prompt: suggestion.prompt }]);
        } else {
          setSuggestedTasks([]);
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
    [userId, onSendMessage, messages]
  );

  const executeTaskFromPrompt = useCallback(
    async (prompt: string, description?: string) => {
      if (!userId) return;
      try {
        const planRes = await fetch('/api/agent/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, userId, conversationId }),
        });

        if (!planRes.ok) throw new Error('Failed to plan task');
        const planJson = await planRes.json();
        if (!planJson.success || !planJson.data) {
          throw new Error(planJson.error?.message || 'Failed to plan task');
        }

        const { taskId, steps, title } = planJson.data;
        setCurrentTaskId(taskId);

        const assistantMessage: MessageType = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: description ? `Starting: ${description}` : "I've prepared a plan. Executing it now...",
          timestamp: new Date(),
          taskDecomposition: {
            taskId,
            ...(title ? { title } : {}),
            steps: steps.map((step: any) => ({
              id: step.id,
              description: step.description,
              status: step.status ?? 'pending',
              agent: step.agent || 'worker',
              googleService: step.googleService,
            })),
          },
          executionFeed: [],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const execRes = await fetch('/api/agent/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, userId, conversationId }),
        });
        if (!execRes.ok) throw new Error('Failed to execute task');
        const execJson = await execRes.json();
        if (execJson?.success && execJson.data) {
          const { status, outputs, error: executionError } = execJson.data;

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.role === 'assistant' && msg.taskDecomposition?.taskId === taskId) {
                const td = msg.taskDecomposition!;
                return {
                  ...msg,
                  taskDecomposition: {
                    taskId: td.taskId,
                    steps: td.steps.map((step) => ({
                      ...step,
                      status:
                        status === 'completed'
                          ? 'completed'
                          : status === 'failed'
                          ? 'failed'
                          : step.status,
                      error: status === 'failed' ? executionError || step.error : step.error,
                    })),
                  },
                };
              }
              return msg;
            })
          );

          const summaryContent = buildExecutionSummary(outputs);
          if (summaryContent) {
            const resultMessage: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: summaryContent,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, resultMessage]);
          }
        }
      } catch (err) {
        console.error('executeTaskFromPrompt error:', err);
      }
    },
    [userId, conversationId]
  );

  // Derive active task from messages
  const activeTask = messages
    .filter((m) => m.role === 'assistant' && m.taskDecomposition)
    .map((m) => ({
      id: m.taskDecomposition!.taskId,
      // Prefer a title provided by the backend/model (e.g. Gemini),
      // then fall back to the first step description.
      title:
        (m.taskDecomposition as any).title ||
        m.taskDecomposition!.steps[0]?.description ||
        'Untitled Task',
      subtasks: m.taskDecomposition!.steps,
      overallStatus: m.taskDecomposition!.steps.every((s) => s.status === 'completed')
        ? 'completed'
        : m.taskDecomposition!.steps.some((s) => s.status === 'failed')
        ? 'failed'
        : 'running',
    }))
    .pop() as any; // Cast to any to match TaskVisualizer props for now, or refine type

  return (

    <div className="flex flex-1 w-full h-full gap-4 xl:gap-6 bg-[#050712]/90 rounded-2xl border border-white/5 shadow-glass-lg p-3 sm:p-4 lg:p-5">
      <div className="flex-1 min-w-0 relative h-full">
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
          suggestedTasks={suggestedTasks}
          onExecuteTaskFromPrompt={executeTaskFromPrompt}
        />
      </div>

      {/* Task Visualizer - Desktop Sidebar (right aligned) */}
      {activeTask && (
        <div className="hidden xl:flex w-80 xl:w-96 shrink-0 h-full">
          <TaskVisualizer activeTask={activeTask} className="w-full" />
        </div>
      )}
    </div>
  );
}
