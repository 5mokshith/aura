"use client";

import { useState } from 'react';
import { Rocket } from 'lucide-react';

interface SuggestedTaskButtonProps {
  description: string;
  onStart: () => Promise<void> | void;
}

export function SuggestedTaskButton({ description, onStart }: SuggestedTaskButtonProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handleClick = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      await onStart();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="glass-panel-md rounded-xl border border-white/10 p-3 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Suggested Task</p>
        <p className="text-sm text-white/90">
          {description || 'AURA detected an actionable task.'}
        </p>
      </div>
      <button
        onClick={handleClick}
        disabled={isRunning}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
          isRunning
            ? 'bg-white/10 text-white/60 border-white/10 cursor-not-allowed'
            : 'bg-neon-cyan/20 text-white border-neon-cyan/40 hover:bg-neon-cyan/30'
        }`}
        aria-disabled={isRunning}
      >
        <Rocket className="w-4 h-4" />
        {isRunning ? 'Starting…' : 'Start Task'}
      </button>
    </div>
  );
}
