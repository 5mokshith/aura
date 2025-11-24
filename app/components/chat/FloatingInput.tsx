'use client';

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSubmit(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-8 absolute bottom-0 ">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          relative group
          rounded-[24px]
          backdrop-blur-xl
          transition-all duration-500
          ${isFocused
            ? 'bg-white/10 shadow-[0_0_40px_-10px_rgba(255,109,36,0.3)] border-white/20'
            : 'bg-white/5 hover:bg-white/10 border-white/10'}
          border
        `}
      >
        {/* Glowing border gradient on focus (Galaxy Theme) */}
        <div className={`
          absolute -inset-[1px] rounded-[25px] bg-gradient-to-r from-neon-orange/50 via-neon-purple/50 to-neon-cyan/50
          opacity-0 transition-opacity duration-500 -z-10 blur-sm
          ${isFocused ? 'opacity-100' : 'group-hover:opacity-30'}
        `} />

        <form onSubmit={handleSubmit} className="flex items-end gap-2 p-2">
          <div className="pl-4 pb-3 pt-3">
            <Sparkles className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-neon-orange' : 'text-white/30'}`} />
          </div>

          <div className="flex-1 min-h-[48px] flex items-center">
            <textarea
              ref={textareaRef}
              name="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
              className="
                w-full bg-transparent text-white placeholder:text-white/30
                resize-none outline-none
                py-3 px-2
                text-base font-light tracking-wide
                disabled:opacity-50
              "
              style={{
                minHeight: '24px',
                maxHeight: '200px',
              }}
            />
          </div>

          <div className="flex items-center gap-1 pb-1 pr-1">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-full text-white/40 hover:text-white transition-colors"
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full
                transition-all duration-300
                ${input.trim() && !isLoading && !disabled
                  ? 'bg-gradient-to-tr from-neon-orange to-neon-purple text-white shadow-[0_0_20px_rgba(255,109,36,0.4)]'
                  : 'bg-white/10 text-white/20 cursor-not-allowed'}
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-0.5" />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {!disabled && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 -bottom-6 text-center"
          >
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
              Press Enter to send
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
