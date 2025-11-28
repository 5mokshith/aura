'use client';

import { useState, lazy, Suspense, useMemo } from 'react';
import { Message } from './types/chat';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { MainContent } from './components/ui/SkipLink';
import { AppSidebar } from './components/layout/AppSidebar';
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
    <MainContent className="min-h-screen px-4 py-4 md:px-6 md:py-6 bg-[#050816] bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.16)_0,_transparent_55%)]">
      <div className="max-w-7xl mx-auto h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)] flex gap-4 md:gap-6">
        <div className="w-20 md:w-64 shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 flex">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center rounded-3xl border border-white/10 bg-black/40">
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
  );
}
