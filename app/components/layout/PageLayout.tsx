'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MainContent } from '../ui/SkipLink';
import { getUserSessionClient } from '@/lib/auth';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const session = getUserSessionClient();
        if (!session?.isAuthenticated) {
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return null; // Or a loading spinner
    }

    return (
        <>
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white 
                   focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
                Skip to main content
            </a>

            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <MainContent
                id="main-content"
                className={`ml-48 min-h-screen flex flex-col ${className}`}
            >
                {children}
            </MainContent>
        </>
    );
}
