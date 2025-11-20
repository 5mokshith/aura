'use client';

import { useState } from 'react';
import { QuickActionsPanel } from './QuickActionsPanel';

/**
 * Example component demonstrating how to use QuickActionsPanel
 * 
 * This shows integration with a chat interface where clicking
 * a quick action pre-fills the chat input with a prompt.
 */
export function QuickActionsPanelExample() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleActionClick = (prompt: string) => {
    // In a real implementation, this would:
    // 1. Set the chat input value to the prompt
    // 2. Optionally auto-submit the prompt
    // 3. Scroll to the chat input
    
    setSelectedPrompt(prompt);
    setMessages([...messages, `User: ${prompt}`]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, `Assistant: I'll help you with that!`]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      {/* Quick Actions Panel */}
      <QuickActionsPanel 
        onActionClick={handleActionClick}
        className="mb-6"
      />

      {/* Demo Chat Area */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="glass-panel rounded-2xl p-6 min-h-[400px]">
          <h2 className="text-xl font-display text-white mb-4">
            Chat Interface Demo
          </h2>
          
          {/* Messages */}
          <div className="space-y-3 mb-4">
            {messages.length === 0 ? (
              <p className="text-white/60 text-center py-8">
                Click a quick action above to get started
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.startsWith('User:')
                      ? 'bg-neon-cyan/10 border border-neon-cyan/30 ml-auto max-w-[70%]'
                      : 'bg-white/5 border border-white/20 mr-auto max-w-[70%]'
                  }`}
                >
                  <p className="text-white/90 text-sm">{msg}</p>
                </div>
              ))
            )}
          </div>

          {/* Current Prompt Display */}
          {selectedPrompt && (
            <div className="glass-panel-strong rounded-lg p-4 border-l-4 border-neon-cyan">
              <p className="text-xs text-white/60 mb-1">Last selected action:</p>
              <p className="text-white/90">{selectedPrompt}</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto mt-6 glass-panel rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">
          How to use:
        </h3>
        <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
          <li>Click any quick action button to trigger a pre-filled prompt</li>
          <li>On mobile, tap the menu icon in the top-right to open the drawer</li>
          <li>Each button has a unique neon glow color on hover</li>
          <li>The drawer auto-closes after selecting an action on mobile</li>
        </ul>
      </div>
    </div>
  );
}
