'use client';

import { useState, lazy, Suspense, useMemo } from 'react';
import { Message } from './types/chat';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AppShell } from './components/layout/AppShell';
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
    <AppShell>
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
    </AppShell>
  );
}
