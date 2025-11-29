'use client';

import type { ComponentType, SVGProps } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  ScrollText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getUserSessionClient } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Logs',
    href: '/logs',
    icon: ScrollText,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ collapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const session = getUserSessionClient();
    if (session) {
      setUserEmail(session.email);
    }
  }, []);

  const initials = userEmail ? userEmail.charAt(0).toUpperCase() : 'A';

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

  return (
    <aside
      className="
        relative
        h-full w-full
        flex md:flex-col
        items-stretch
        bg-glass-light/90 backdrop-blur-glass
        border border-white/10
        rounded-2xl
        shadow-glass-lg
        px-4 py-3 md:px-4 md:py-5
        gap-4 md:gap-6
        overflow-hidden
      "
    >
      <div className="flex items-center justify-between md:justify-start md:flex-col md:items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-white font-display font-semibold text-lg shadow-neon-cyan">
            <span>{initials}</span>
          </div>
          <div
            className={`
              hidden md:block
              transition-all duration-200 origin-left
              ${collapsed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}
            `}
          >
            <div className="text-sm font-display font-semibold text-white">
              AURA
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-300/90">
              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:self-end">
          {userEmail && (
            <div className="md:hidden text-[11px] text-white/60 truncate max-w-[140px]">
              {userEmail}
            </div>
          )}

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 flex md:flex-col items-center md:items-stretch gap-2 md:gap-1 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group
                flex-1 md:flex-none
                flex items-center md:items-center
                justify-center md:justify-start
                gap-2 md:gap-3
                px-3 py-2 md:px-3 md:py-2.5
                rounded-xl
                transition-all duration-200
                border
                ${isActive
                  ? 'bg-white/10 border-white/20 text-white shadow-neon-cyan'
                  : 'bg-white/0 border-white/5 text-white/70 hover:bg-white/5 hover:border-white/15 hover:text-white'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`
                  hidden md:inline-block truncate
                  transition-all duration-200
                  ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex flex-col gap-2 pt-1 border-t border-white/10 mt-auto">
        <button
          type="button"
          onClick={() =>
            window.open('https://github.com/5mokshith/aura', '_blank', 'noopener,noreferrer')
          }
          className="
            flex items-center gap-3
            px-3 py-2
            rounded-xl
            text-sm
            text-white/70
            hover:text-white
            hover:bg-white/5
            transition-colors
          "
        >
          <HelpCircle className="w-5 h-5" />
          <span
            className={`
              hidden md:inline-block truncate
              transition-all duration-200
              ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
            `}
          >
            Help &amp; docs
          </span>
        </button>

        {userEmail && (
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex items-center gap-3
              px-3 py-2
              rounded-xl
              text-sm
              text-white/70
              hover:text-red-300
              hover:bg-red-500/10
              transition-colors
            "
          >
            <LogOut className="w-5 h-5" />
            <span
              className={`
                hidden md:inline-block truncate
                transition-all duration-200
                ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
              `}
            >
              Sign out
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
