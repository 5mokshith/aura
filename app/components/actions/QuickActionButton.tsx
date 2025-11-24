'use client';

import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  prompt: string;
  color: 'cyan' | 'purple' | 'pink' | 'blue';
}

interface QuickActionButtonProps {
  action: QuickAction;
  onClick: (prompt: string) => void;
}

export function QuickActionButton({ action, onClick }: QuickActionButtonProps) {
  const Icon = action.icon;

  const colors = {
    cyan: {
      bg: 'hover:bg-cyan-500/10',
      border: 'hover:border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]'
    },
    purple: {
      bg: 'hover:bg-purple-500/10',
      border: 'hover:border-purple-500/30',
      text: 'text-purple-400',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]'
    },
    pink: {
      bg: 'hover:bg-pink-500/10',
      border: 'hover:border-pink-500/30',
      text: 'text-pink-400',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]'
    },
    blue: {
      bg: 'hover:bg-blue-500/10',
      border: 'hover:border-blue-500/30',
      text: 'text-blue-400',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]'
    }
  }[action.color];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative w-full text-left
        p-4 rounded-xl
        glass-panel
        border border-white/5
        transition-all duration-300
        flex items-center gap-4
        overflow-hidden
        ${colors.bg}
        ${colors.border}
        ${colors.glow}
      `}
      onClick={() => onClick(action.prompt)}
    >
      {/* Galaxy Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-orange/10 via-neon-purple/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className={`
        p-3 rounded-lg bg-white/5 relative z-10
        ${colors.text}
        group-hover:scale-110 transition-transform duration-300
      `}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <h3 className="text-sm font-medium text-white/90 group-hover:text-white truncate">
          {action.label}
        </h3>
        <p className="text-xs text-white/50 group-hover:text-white/70 truncate">
          {action.prompt}
        </p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0 relative z-10">
        <ArrowRight className="w-4 h-4 text-white/40" />
      </div>
    </motion.button>
  );
}
