'use client';

import { useState, useEffect } from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { getUserSessionClient } from '@/lib/auth';
import Link from 'next/link';

export function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const session = getUserSessionClient();
    if (session) {
      setUserEmail(session.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/auth/setup';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!userEmail) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] glass-panel-sm border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full glass-panel-md bg-white/10 flex items-center justify-center shadow-neon-cyan">
              <span className="text-lg font-bold text-neon-cyan font-display">A</span>
            </div>
            <span className="text-white font-display font-semibold text-lg hidden sm:inline">AURA</span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass-panel-sm hover:glass-panel-md transition-all"
            >
              <User className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-gray-300 hidden sm:inline max-w-[150px] truncate">
                {userEmail}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 glass-panel-md bg-gray-900/95 rounded-lg shadow-xl border border-white/10 z-50 animate-slide-up">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm text-white truncate">{userEmail}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setShowMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setShowMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </Link>

                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
