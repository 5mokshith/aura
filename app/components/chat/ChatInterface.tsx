'use client';

import { useState, useEffect, useRef } from 'react';
import { Message as MessageType } from '@/app/types/chat';
import { Message } from './Message';
import { FloatingInput } from './FloatingInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { QuickActionsPanel } from '../actions/QuickActionsPanel';

interface ChatInterfaceProps {
  initialMessages?: MessageType[];
  onSendMessage?: (message: string) => Promise<void>;
  className?: string;
}

export function ChatInterface({
  initialMessages = [],
  onSendMessage,
  className = '',
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
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto glass-scrollbar px-4 py-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              <div className="max-w-3xl w-full space-y-10">
                {/* Logo/Icon */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 rounded-3xl glass-panel-strong flex items-center justify-center shadow-neon-cyan relative group">
                    <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                    <Sparkles className="w-10 h-10 text-neon-cyan relative z-10" />
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-[11px] md:text-xs font-semibold tracking-[0.28em] text-yellow-300/80 uppercase">
                    Intelligent workspace assistant
                  </p>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">
                    Welcome to AURA
                  </h2>
                  <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
                    Ready to orchestrate Gmail, Drive, Docs, Sheets, and Calendar so you can stay focused on the work that matters.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/70">
                      Automate email follow-ups
                    </span>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/70">
                      Search and summarize documents
                    </span>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-xs text-white/70">
                      Plan and schedule with Calendar
                    </span>
                  </div>
                </motion.div>

                {/* Suggestions Grid */}
                <div className="w-full max-w-4xl mx-auto mt-4 md:mt-6">
                  <div className="relative glass-panel-strong rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-neon-purple/10 p-4 sm:p-5 lg:p-6 overflow-hidden">
                    <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-neon-cyan/20 blur-3xl opacity-40" />
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-neon-purple/25 blur-3xl opacity-50" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                      <div className="text-left">
                        <p className="text-xs font-medium tracking-wide text-white/70 uppercase">
                          Quick start actions
                        </p>
                        <p className="text-[11px] text-white/50">
                          Pick a card to jump straight into a workspace task.
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] text-white/60">
                        No setup required
                      </span>
                    </div>

                    <QuickActionsPanel onActionClick={handleSendMessage} />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}
        </AnimatePresence>

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
