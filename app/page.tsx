'use client';

import { useState, lazy, Suspense, useMemo } from 'react';
import { Message } from './types/chat';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { MainContent } from './components/ui/SkipLink';
import { Header } from './components/layout/Header';
import { getUserSessionClient } from '@/lib/auth';

// Lazy load heavy components for better performance
const ChatInterfaceWithRealtime = lazy(() =>
  import('./components/chat/ChatInterfaceWithRealtime').then((mod) => ({
    default: mod.ChatInterfaceWithRealtime,
  }))
);
const TaskVisualizer = lazy(() =>
  import('./components/task/TaskVisualizer').then((mod) => ({
    default: mod.TaskVisualizer,
  }))
);
const QuickActionsPanel = lazy(() =>
  import('./components/actions/QuickActionsPanel').then((mod) => ({
    default: mod.QuickActionsPanel,
  }))
);

export default function HomePage() {
  const [messages] = useState<Message[]>([]);

  // Derive user session from cookies (set by Google OAuth callback)
  const session = useMemo(() => getUserSessionClient(), []);
  const userId = session?.userId;

  // Handle quick action clicks by delegating to the chat interface
  const handleQuickAction = (prompt: string) => {
    // The ChatInterfaceWithRealtime will handle planning and execution via agent APIs
    // by sending the prompt through its own onSendMessage handler.
    const input = document.querySelector<HTMLTextAreaElement>('textarea[name="chat-input"]');
    if (input) {
      input.value = prompt;
      const form = input.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <>
      <Header />
      <MainContent className="flex min-h-screen flex-col relative pt-16">
        {/* Quick Actions Panel - Top on desktop, drawer on mobile */}
        <Suspense
          fallback={
            <div className="h-24 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <div className="hidden md:flex justify-center pt-6 px-6">
            <QuickActionsPanel onActionClick={handleQuickAction} />
          </div>

          {/* Mobile Quick Actions - Drawer */}
          <div className="md:hidden">
            <QuickActionsPanel onActionClick={handleQuickAction} />
          </div>
        </Suspense>

        {/* Main Content Area */}
        <div className="flex-1 flex relative">
          {/* Chat Interface - Takes full width on mobile, leaves space for sidebar on desktop */}
          <div className="flex-1 md:mr-80 lg:mr-96">
            <Suspense
              fallback={
                <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <ChatInterfaceWithRealtime
                userId={userId}
                initialMessages={messages}
                className="h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)]"
              />
            </Suspense>
          </div>

          {/* Task Visualizer - Right sidebar on desktop, bottom drawer on mobile */}
          <Suspense
            fallback={
              <div className="hidden md:block fixed right-0 top-0 w-80 lg:w-96 h-screen p-6">
                <div className="glass-panel rounded-xl h-full flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              </div>
            }
          >
            {/* TODO: Wire TaskVisualizer to real task history / Realtime updates */}
            <TaskVisualizer activeTask={undefined} />
          </Suspense>
        </div>

        {/* TODO: Implement Gemini-like voice mode (live mode)
            - Add voice input button to FloatingInput
            - Integrate Web Speech API or Gemini Live API
            - Add audio visualization during voice input
            - Support real-time voice-to-text streaming
        */}
      </MainContent>
    </>
  );
}
