'use client';

import { useState, useEffect, useRef } from 'react';
import { Message as MessageType } from '@/app/types/chat';
import { Message } from './Message';
import { FloatingInput } from './FloatingInput';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Public method to add messages (for external updates like Realtime)
  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  };

  // Public method to update a message (for live updates)
  const updateMessage = (messageId: string, updates: Partial<MessageType>) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="glass-panel-md rounded-2xl p-8 max-w-md">
                <h2 className="text-2xl font-display font-bold text-white mb-3">
                  Welcome to AURA
                </h2>
                <p className="text-white/60 text-sm">
                  I'm your AI assistant for Google Workspace. Ask me to send emails,
                  create documents, manage your calendar, and more.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-white/40">Try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleSendMessage('Show my latest emails')}
                      className="glass-button text-xs px-3 py-1.5"
                    >
                      Show my latest emails
                    </button>
                    <button
                      onClick={() => handleSendMessage('Create a new document')}
                      className="glass-button text-xs px-3 py-1.5"
                    >
                      Create a new document
                    </button>
                    <button
                      onClick={() => handleSendMessage('Schedule a meeting')}
                      className="glass-button text-xs px-3 py-1.5"
                    >
                      Schedule a meeting
                    </button>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
