'use client';

import { useState, FormEvent, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface CommandInterfaceProps {
    userName?: string;
    onExecute?: (command: string) => void;
}

export function CommandInterface({ userName = 'User', onExecute }: CommandInterfaceProps) {
    const [command, setCommand] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const queryClient = useQueryClient();

    const handleSubmit = async (e?: FormEvent) => {
        e?.preventDefault();
        if (!command.trim() || isExecuting) return;

        setIsExecuting(true);
        try {
            const response = await fetch('/api/agent/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Failed to execute command');

            setCommand('');
            // Invalidate task history query to refresh ActivityPanel
            queryClient.invalidateQueries({ queryKey: ['taskHistory'] });

            // Call onExecute callback if provided
            if (onExecute) {
                onExecute(command);
            }
        } catch (error) {
            console.error('Execution failed:', error);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const suggestions = [
        "Summarize unread emails",
        "Draft a meeting follow-up",
        "Schedule a new event"
    ];

    const handleSuggestionClick = (suggestion: string) => {
        setCommand(suggestion);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Hello, {userName}. How can I help you today?
            </h1>
            <p className="text-gray-400 text-lg mb-10">Your AI-powered workspace assistant is ready.</p>

            <div className="mb-6">
                <label htmlFor="command-input" className="block text-sm font-medium text-gray-300 mb-3">
                    Command
                </label>
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        id="command-input"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tell AURA what to do... e.g., 'Summarize unread emails from the last 24 hours and draft a response to any urgent messages.'"
                        className="w-full h-40 bg-[#1A1D24] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                    />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2.5 rounded-lg bg-[#252830] hover:bg-[#2D3139] text-gray-300 text-sm transition-colors border border-white/5 hover:border-white/10"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => handleSubmit()}
                disabled={!command.trim() || isExecuting}
                className="px-8 py-3 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isExecuting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Executing...
                    </>
                ) : (
                    'Execute'
                )}
            </button>
        </div>
    );
}
