'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface FloatingInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function FloatingInput({
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'Ask AURA anything...',
}: FloatingInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="floating-input-bar">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            name="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full bg-transparent text-white placeholder:text-white/40 resize-none outline-none min-h-[40px] max-h-[200px] py-2 px-1"
            style={{
              height: 'auto',
              minHeight: '40px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="glass-button-cyan flex items-center justify-center w-10 h-10 rounded-lg p-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-neon-cyan" />
          ) : (
            <Send className="w-5 h-5 text-white" />
          )}
        </button>
      </form>
      {!disabled && (
        <p className="text-xs text-white/30 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      )}
    </div>
  );
}
