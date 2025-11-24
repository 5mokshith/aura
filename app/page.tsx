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

export default function HomePage() {
  const [messages] = useState<Message[]>([]);

  // Derive user session from cookies (set by Google OAuth callback)
  const session = useMemo(() => getUserSessionClient(), []);
  const userId = session?.userId;

  return (
    <>
      <Header />
      <MainContent className="flex h-screen flex-col relative pt-16 overflow-hidden bg-galaxy-bg">
        {/* Main Content Area */}
        <div className="flex-1 flex relative px-4 max-w-[1600px] mx-auto w-full gap-6 h-full pb-4">
          {/* Chat Interface */}
          <div className="flex-1 min-w-0 h-full">
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center glass-panel rounded-2xl">
                  <LoadingSpinner />
                </div>
              }
            >
              <ChatInterfaceWithRealtime
                userId={userId}
                initialMessages={messages}
                className="h-full"
              />
            </Suspense>
          </div>
        </div>
      </MainContent>
    </>
  );
}
