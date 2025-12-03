'use client';

import { useState, useEffect, useRef } from 'react';
import { Message as MessageType } from '@/app/types/chat';
import { Message } from './Message';
import { FloatingInput } from './FloatingInput';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickActionsPanel } from '../actions/QuickActionsPanel';
import { SuggestedTaskButton } from './SuggestedTaskButton';
import { EmailDraftEditor } from './EmailDraftEditor';
import { DocDraftEditor } from './DocDraftEditor';
import { SquarePen } from 'lucide-react';

interface ChatInterfaceProps {
  initialMessages?: MessageType[];
  onSendMessage?: (message: string) => Promise<void>;
  className?: string;
  suggestedTasks?: Array<{ description: string; prompt: string }>;
  onExecuteTaskFromPrompt?: (prompt: string, description?: string) => Promise<void> | void;
  userId?: string;
  emailDraft?: {
    to: string | string[];
    subject: string;
    body: string;
  } | null;
  onDraftSent?: (info: { to: string | string[]; subject: string }) => void;
  onDraftCancel?: () => void;
  docDraft?: {
    title: string;
    body: string;
  } | null;
  onDocDraftCreated?: (info: { title: string; url?: string }) => void;
  onDocDraftCancel?: () => void;
  onNewChat?: () => void;
}

export function ChatInterface({
  initialMessages = [],
  onSendMessage,
  className = '',
  suggestedTasks,
  onExecuteTaskFromPrompt,
  userId,
  emailDraft,
  onDraftSent,
  onDraftCancel,
  docDraft,
  onDocDraftCreated,
  onDocDraftCancel,
  onNewChat,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Update messages when initialMessages prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isEmpty = messages.length === 0;

  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: MessageType = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the onSendMessage callback if provided
      if (onSendMessage) {
        await onSendMessage(content);
      } else {
        // Default behavior: simulate assistant response
        await simulateAssistantResponse(content);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: MessageType = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate assistant response (for demo purposes)
  const simulateAssistantResponse = async (userMessage: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const assistantMessage: MessageType = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: `I received your message: "${userMessage}". I'm analyzing your request and will break it down into actionable steps.`,
      timestamp: new Date(),
      taskDecomposition: {
        taskId: `task_${Date.now()}`,
        steps: [
          {
            id: 'step_1',
            description: 'Analyze user request and identify required services',
            status: 'completed',
            agent: 'planner',
          },
          {
            id: 'step_2',
            description: 'Execute task using appropriate Google Workspace service',
            status: 'running',
            agent: 'worker',
            googleService: 'gmail',
          },
          {
            id: 'step_3',
            description: 'Validate results and generate summary',
            status: 'pending',
            agent: 'evaluator',
          },
        ],
      },
      executionFeed: [
        {
          stepId: 'step_1',
          message: 'Task planning completed successfully',
          timestamp: new Date(Date.now() - 2000),
          type: 'success',
        },
        {
          stepId: 'step_2',
          message: 'Connecting to Gmail API...',
          timestamp: new Date(Date.now() - 1000),
          type: 'info',
        },
      ],
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* New Chat Button - Top Left */}
      {!isEmpty && onNewChat && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 z-50"
        >
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-white/10 transition-all duration-300 shadow-lg backdrop-blur-sm"
            title="Start a new chat"
          >
            <SquarePen className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </motion.button>
        </motion.div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className={`flex-1 glass-scrollbar px-4 pt-4 pb-32 space-y-4 scroll-bar-minimal ${isEmpty ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
      >
        <AnimatePresence mode="popLayout">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex h-full"
            >
              <div className="m-auto w-full max-w-5xl px-2 sm:px-4 lg:px-8">
                <div className="text-center space-y-4 md:space-y-5">
                  <p className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-sky-300/80 uppercase">
                    Aura seamlessly works with your Google Workspace
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-transparent bg-gradient-to-b from-white to-transparent bg-clip-text text-slate-50 tracking-tight">
                    Automate Your Workflow.
                    <br className="hidden sm:block" />
                    Elevate Your Productivity.
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-slate-300/80 max-w-2xl mx-auto">
                    AURA seamlessly integrates with your Google Workspace to draft emails, summarize documents,
                    manage your calendar, and more. Let&apos;s start.
                  </p>
                </div>

                <div className="mt-10 md:mt-12 pb-2">
                  <QuickActionsPanel onActionClick={handleSendMessage} />
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
        </AnimatePresence>

        {userId && docDraft && (
          <DocDraftEditor
            userId={userId}
            draft={docDraft}
            onCreated={onDocDraftCreated}
            onCancel={onDocDraftCancel}
          />
        )}

        {userId && emailDraft && (
          <EmailDraftEditor
            userId={userId}
            draft={emailDraft}
            onSent={onDraftSent}
            onCancel={onDraftCancel}
          />
        )}

        {suggestedTasks && suggestedTasks.length > 0 && onExecuteTaskFromPrompt && (
          <div className="mt-2 space-y-2">
            <SuggestedTaskButton
              description={
                suggestedTasks.length === 1
                  ? suggestedTasks[0].description
                  : suggestedTasks
                    .map((task, index) => `${index + 1}. ${task.description}`)
                    .join('  ')
              }
              onStart={() => {
                const combinedDescription =
                  suggestedTasks.length === 1
                    ? suggestedTasks[0].description
                    : suggestedTasks
                      .map((task, index) => `${index + 1}. ${task.description}`)
                      .join('  ');

                const combinedPrompt =
                  suggestedTasks.length === 1
                    ? suggestedTasks[0].prompt
                    : suggestedTasks
                      .map((task, index) =>
                        index === 0 ? `First, ${task.prompt}` : `Then, ${task.prompt}`
                      )
                      .join(' ');

                return onExecuteTaskFromPrompt(combinedPrompt, combinedDescription);
              }}
            />
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full glass-panel-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
            </div>
            <div className="glass-panel-md rounded-2xl rounded-tl-sm p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input */}
      <FloatingInput
        onSubmit={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask AURA anything..."
      />
    </div>
  );
}
