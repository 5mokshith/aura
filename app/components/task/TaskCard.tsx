'use client';

import { StatusBadge } from './StatusBadge';
import { GoogleService, AgentType } from '@/app/types/chat';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    googleServices?: GoogleService[];
    agents?: AgentType[];
    progress?: number;
    startTime?: Date;
    endTime?: Date;
    error?: string;
  };
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TaskCard({ task, showProgress = false, onClick, className = '' }: TaskCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={`
        glass-panel rounded-xl p-4
        border-l-4
        ${task.status === 'pending' ? 'border-gray-500/50' : ''}
        ${task.status === 'running' ? 'border-neon-cyan animate-glow-pulse-cyan' : ''}
        ${task.status === 'completed' ? 'border-green-500' : ''}
        ${task.status === 'failed' ? 'border-red-500' : ''}
        ${isClickable ? 'cursor-pointer hover:bg-glass-medium hover:scale-[1.02]' : ''}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-white/90 truncate mb-1">
            {task.title}
          </h3>
          <p className="text-xs text-white/50">
            Task ID: {task.id.slice(0, 12)}...
          </p>
        </div>
        
        <StatusBadge status={task.status} />
      </div>

      {/* Progress bar (if running and showProgress) */}
      {showProgress && task.status === 'running' && task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Progress</span>
            <span>{Math.round(task.progress)}%</span>
          </div>
          <div className="h-1.5 bg-glass-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500 ease-out"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {task.error && (
        <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-red-400">
            {task.error}
          </p>
        </div>
      )}

      {/* Footer: Google Services and Agents */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Google Services */}
        {task.googleServices && task.googleServices.length > 0 && (
          <div className="flex items-center gap-1.5">
            {task.googleServices.map((service) => (
              <GoogleServiceIcon key={service} service={service} />
            ))}
          </div>
        )}

        {/* Agent Badges */}
        {task.agents && task.agents.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.agents.map((agent) => (
              <AgentBadge key={agent} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Timing info */}
      {(task.startTime || task.endTime) && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            {task.startTime && (
              <span>
                Started: {formatTime(task.startTime)}
              </span>
            )}
            {task.endTime && (
              <span>
                Completed: {formatTime(task.endTime)}
              </span>
            )}
            {task.startTime && task.endTime && (
              <span className="text-white/60 font-medium">
                {formatDuration(task.startTime, task.endTime)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for Google service icons
function GoogleServiceIcon({ service }: { service: GoogleService }) {
  const serviceConfig: Record<GoogleService, { icon: string; color: string; label: string }> = {
    gmail: { icon: '📧', color: 'bg-red-500/20 border-red-500/30', label: 'Gmail' },
    drive: { icon: '📁', color: 'bg-blue-500/20 border-blue-500/30', label: 'Drive' },
    docs: { icon: '📄', color: 'bg-blue-400/20 border-blue-400/30', label: 'Docs' },
    sheets: { icon: '📊', color: 'bg-green-500/20 border-green-500/30', label: 'Sheets' },
    calendar: { icon: '📅', color: 'bg-purple-500/20 border-purple-500/30', label: 'Calendar' },
  };

  const config = serviceConfig[service];

  return (
    <div
      className={`
        w-8 h-8 rounded-lg
        flex items-center justify-center
        border ${config.color}
        transition-all duration-200
        hover:scale-110
      `}
      title={config.label}
      aria-label={`${config.label} service`}
    >
      <span className="text-base">{config.icon}</span>
    </div>
  );
}

// Helper component for agent badges
function AgentBadge({ agent }: { agent: AgentType }) {
  const agentConfig: Record<AgentType, { color: string; label: string }> = {
    planner: { color: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30', label: 'Planner' },
    worker: { color: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30', label: 'Worker' },
    evaluator: { color: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30', label: 'Evaluator' },
  };

  const config = agentConfig[agent];

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full
        text-2xs font-medium border uppercase tracking-wide
        ${config.color}
        transition-all duration-200
      `}
      title={config.label}
    >
      {agent}
    </span>
  );
}

// Helper functions
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

function formatDuration(start: Date, end: Date): string {
  const durationMs = end.getTime() - start.getTime();
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
