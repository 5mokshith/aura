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
      <MainContent className="min-h-screen flex flex-col pt-16 bg-galaxy-bg">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 pb-6 max-w-[1440px] w-full mx-auto">
          {/* Left Sidebar */}
          <aside className="hidden">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-yellow-300/80">
                Workspace
              </p>
              <h2 className="text-lg font-semibold text-white">Session overview</h2>
              <p className="text-xs text-white/60">
                Organize your conversations, switch contexts, and keep track of what you're
                working on.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-white/70">Quick actions</p>
              <div className="grid gap-2 text-xs">
                <button className="glass-panel border border-white/5 rounded-xl px-3 py-2 text-left hover:border-yellow-400/60 transition-colors">
                  <p className="font-medium text-white">New idea sprint</p>
                  <p className="text-[11px] text-white/60">
                    Start a fresh chat focused on brainstorming or exploration.
                  </p>
                </button>
                <button className="glass-panel border border-white/5 rounded-xl px-3 py-2 text-left hover:border-yellow-400/60 transition-colors">
                  <p className="font-medium text-white">Debug session</p>
                  <p className="text-[11px] text-white/60">
                    Dive into logs, stack traces, and incremental fixes.
                  </p>
                </button>
                <button className="glass-panel border border-white/5 rounded-xl px-3 py-2 text-left hover:border-yellow-400/60 transition-colors">
                  <p className="font-medium text-white">Product spec mode</p>
                  <p className="text-[11px] text-white/60">
                    Iterate on docs, specs, and product thinking with structure.
                  </p>
                </button>
              </div>
            </div>

            <div className="hidden lg:block pt-2 border-t border-white/5 mt-2">
              <p className="text-xs font-semibold text-white/70 mb-1">Shortcuts</p>
              <ul className="space-y-1 text-[11px] text-white/60">
                <li>Press <span className="font-semibold text-white">/</span> to focus the chat input</li>
                <li>Use <span className="font-semibold text-white">Shift + Enter</span> for new lines</li>
                <li>Summarize long threads to stay oriented</li>
              </ul>
            </div>
          </aside>

          {/* Chat Interface */}
          <section className="flex-1 min-w-0 flex flex-col space-y-4">
            <div className="glass-panel rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col h-full">
              <header className="mb-4 md:mb-5 lg:mb-6 hidden">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-yellow-300/80">
                  Aura
                </p>
                <h1 className="mt-1 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                  Your focused AI workspace
                </h1>
                <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
                  Chat, explore, and ship faster with a space designed for deep work. Each
                  conversation stays grounded in your context and code.
                </p>
              </header>

              <div className="flex-1 min-h-0">
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
          </section>

          {/* Right Sidebar */}
          <aside className="hidden">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-yellow-300/80">
                Context
              </p>
              <h2 className="text-lg font-semibold text-white">Session hints</h2>
              <p className="text-xs text-white/60">
                Use this space to keep track of goals, constraints, or notes for the current
                conversation.
              </p>
            </div>

            <div className="space-y-2 text-xs text-white/70">
              <div className="glass-panel rounded-xl p-3 border border-white/5">
                <p className="font-semibold text-white mb-1">Designing with Aura</p>
                <p className="text-[11px] text-white/60">
                  Let the model reason about trade-offs while you focus on product taste and
                  direction.
                </p>
              </div>
              <div className="glass-panel rounded-xl p-3 border border-white/5">
                <p className="font-semibold text-white mb-1">Code-aware conversations</p>
                <p className="text-[11px] text-white/60">
                  Ask about files, refactors, and bugs with the confidence that context is in
                  sync.
                </p>
              </div>
              <div className="glass-panel rounded-xl p-3 border border-white/5">
                <p className="font-semibold text-white mb-1">Stay in flow</p>
                <p className="text-[11px] text-white/60">
                  Use short prompts and iterative updates instead of giant single-shot requests.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </MainContent>
    </>
  );
}
