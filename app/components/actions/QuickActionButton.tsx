'use client';

import { LucideIcon } from 'lucide-react';

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
  
  // Map color to CSS class
  const colorClass = `glass-button-${action.color}`;
  
  const handleClick = () => {
    onClick(action.prompt);
  };

  return (
    <button
      className={`${colorClass} flex flex-col items-center justify-center gap-2 min-w-[120px] min-h-[80px] w-full md:w-auto`}
      onClick={handleClick}
      aria-label={action.label}
    >
      <Icon className="w-6 h-6" aria-hidden="true" />
      <span className="text-sm font-medium text-white/90">{action.label}</span>
    </button>
  );
}
