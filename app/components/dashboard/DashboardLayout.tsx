'use client';

import { useState, useEffect } from 'react';
import { getUserSessionClient } from '@/lib/auth';
import { Sidebar } from '../layout/Sidebar';
import { ActivityPanel } from './ActivityPanel';
import { CommandInterface } from './CommandInterface';
import { MainContent } from '../ui/SkipLink';
import { TopNavigation } from '../layout/TopNavigation';

export function DashboardLayout() {
    // Start with default to avoid hydration mismatch
    const [userName, setUserName] = useState('User');

    // Update userName on client side only
    useEffect(() => {
        const session = getUserSessionClient();
        if (session?.email) {
            const emailPrefix = session.email.split('@')[0];
            // Capitalize first letter
            setUserName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
        }
    }, []);

    const handleExecute = (command: string) => {
        // TODO: Integrate with existing chat/agent system
        console.log('Executing command:', command);

        // For now, use the existing chat interface approach
        const input = document.querySelector<HTMLTextAreaElement>('textarea[name="chat-input"]');
        if (input) {
            input.value = command;
            const form = input.form;
            if (form) {
                form.requestSubmit();
            }
        }
    };

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
                className="ml-48 mr-80 lg:mr-96 min-h-screen flex flex-col"
            >
                <TopNavigation userName={userName} />

                <div className="flex-1 flex items-center justify-center p-8">
                    <CommandInterface userName={userName} onExecute={handleExecute} />
                </div>
            </MainContent>

            {/* Right Activity Panel */}
            <ActivityPanel />
        </>
    );
}
