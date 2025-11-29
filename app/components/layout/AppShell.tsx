'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { MainContent } from '../ui/SkipLink';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapsed state from localStorage (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('aura-sidebar-collapsed');
    if (stored === 'true') {
      setCollapsed(true);
    }
  }, []);

  // Persist collapsed state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('aura-sidebar-collapsed', collapsed ? 'true' : 'false');
  }, [collapsed]);

  return (
    <MainContent className="min-h-screen px-4 py-4 md:px-6 md:py-6 bg-[#050816] bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.16)_0,_transparent_55%)]">
      <div className="h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)] flex gap-4 md:gap-6">
        <div
          className={`shrink-0 transition-[width] duration-300 ease-out ${
            collapsed ? 'w-16 md:w-20' : 'w-20 md:w-64'
          }`}
        >
          <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        </div>

        <div className="flex-1 flex min-w-0">
          {children}
        </div>
      </div>
    </MainContent>
  );
}
