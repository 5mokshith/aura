'use client';

import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

interface StatusBadgeProps {
  status: TaskStatus;
  showIcon?: boolean;
  showProgress?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({
  status,
  showIcon = true,
  showProgress = false,
  progress,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-2xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const statusConfig: Record<TaskStatus, {
    label: string;
    icon: React.ReactNode;
    baseClasses: string;
    animationClasses?: string;
  }> = {
    pending: {
      label: 'Pending',
      icon: <Clock className={iconSizes[size]} />,
      baseClasses: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    },
    running: {
      label: showProgress && progress !== undefined ? `${Math.round(progress)}%` : 'Running',
      icon: <Loader2 className={`${iconSizes[size]} animate-spin`} />,
      baseClasses: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
      animationClasses: 'animate-glow-pulse-cyan',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle2 className={iconSizes[size]} />,
      baseClasses: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    failed: {
      label: 'Failed',
      icon: <XCircle className={iconSizes[size]} />,
      baseClasses: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative inline-flex">
      <span
        className={`
          inline-flex items-center rounded-full
          font-medium border uppercase tracking-wide
          ${sizeClasses[size]}
          ${config.baseClasses}
          ${config.animationClasses || ''}
          transition-all duration-200
          ${className}
        `}
        role="status"
        aria-label={`Status: ${config.label}`}
      >
        {showIcon && config.icon}
        <span>{config.label}</span>
      </span>

      {/* Progress ring for running tasks */}
      {status === 'running' && showProgress && progress !== undefined && (
        <svg
          className="absolute -inset-1 w-[calc(100%+0.5rem)] h-[calc(100%+0.5rem)] -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-700/30"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
            className="text-neon-cyan transition-all duration-500 ease-out"
          />
        </svg>
      )}
    </div>
  );
}

// Variant: Minimal status indicator (just a dot)
export function StatusDot({ status, size = 'md', className = '' }: {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusClasses: Record<TaskStatus, string> = {
    pending: 'bg-gray-500/50',
    running: 'bg-neon-cyan animate-glow-pulse-cyan',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  return (
    <span
      className={`
        inline-block rounded-full
        ${sizeClasses[size]}
        ${statusClasses[status]}
        ${className}
      `}
      role="status"
      aria-label={`Status: ${status}`}
    />
  );
}

// Variant: Status with text label (no icon)
export function StatusLabel({ status, className = '' }: {
  status: TaskStatus;
  className?: string;
}) {
  const statusConfig: Record<TaskStatus, { label: string; classes: string }> = {
    pending: { label: 'Pending', classes: 'text-gray-400' },
    running: { label: 'Running', classes: 'text-neon-cyan' },
    completed: { label: 'Completed', classes: 'text-green-400' },
    failed: { label: 'Failed', classes: 'text-red-400' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`text-sm font-medium ${config.classes} ${className}`}
      role="status"
    >
      {config.label}
    </span>
  );
}

// Variant: Large status card
export function StatusCard({ status, title, description, className = '' }: {
  status: TaskStatus;
  title?: string;
  description?: string;
  className?: string;
}) {
  const statusConfig: Record<TaskStatus, {
    bgClasses: string;
    borderClasses: string;
    icon: React.ReactNode;
  }> = {
    pending: {
      bgClasses: 'bg-gray-500/10',
      borderClasses: 'border-gray-500/30',
      icon: <Clock className="w-8 h-8 text-gray-400" />,
    },
    running: {
      bgClasses: 'bg-neon-cyan/10',
      borderClasses: 'border-neon-cyan/30',
      icon: <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />,
    },
    completed: {
      bgClasses: 'bg-green-500/10',
      borderClasses: 'border-green-500/30',
      icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
    },
    failed: {
      bgClasses: 'bg-red-500/10',
      borderClasses: 'border-red-500/30',
      icon: <XCircle className="w-8 h-8 text-red-400" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`
        glass-panel rounded-xl p-6
        border-l-4 ${config.borderClasses}
        ${config.bgClasses}
        ${className}
      `}
      role="status"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-medium text-white/90 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-white/60">
              {description}
            </p>
          )}
          <div className="mt-2">
            <StatusBadge status={status} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
