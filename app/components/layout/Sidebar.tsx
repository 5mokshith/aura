'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Settings, HelpCircle, FolderOpen, Clock, FileText, LogOut } from 'lucide-react';
import { logoutUser } from '@/lib/auth';

interface SidebarProps {
    className?: string;
}

const navigationItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: Home,
    },
    {
        id: 'files',
        label: 'Files',
        href: '/files',
        icon: FolderOpen,
    },
    {
        id: 'timeline',
        label: 'Timeline',
        href: '/timeline',
        icon: Clock,
    },
    {
        id: 'logs',
        label: 'Logs',
        href: '/logs',
        icon: FileText,
    },

    {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        id: 'help',
        label: 'Help',
        href: '/help',
        icon: HelpCircle,
    },
];

export function Sidebar({ className = '' }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        router.push('/');
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen w-48 bg-[#0B0D12] border-r border-white/5 z-40 ${className}`}
            aria-label="Main navigation"
        >
            {/* Logo/Brand */}
            <div className="p-6 mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-wide">AURA AI</h1>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Workspace Agent</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="px-3" aria-label="Sidebar navigation">
                <ul className="space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${active
                                            ? 'bg-[#2D2B3B] text-white border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                  `}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <Icon
                                        className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-purple-400' : 'text-gray-500 group-hover:text-white'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 w-full p-3 border-t border-white/5 bg-[#0B0D12]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
            </div>
        </aside >
    );
}
