'use client';

import { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { TaskStep } from '@/app/types/chat';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatedList } from '../ui/AnimatedList';

interface ActiveTask {
  id: string;
  title: string;
  subtasks: TaskStep[];
  overallStatus: 'pending' | 'running' | 'completed' | 'failed';
}

interface TaskVisualizerProps {
  activeTask?: ActiveTask;
  className?: string;
}

export function TaskVisualizer({ activeTask, className = '' }: TaskVisualizerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!activeTask) {
    return null;
  }

  return (
    <>
      {/* Desktop: Right sidebar */}
      <div
        className={`
          hidden md:flex flex-col
          fixed right-0 top-0 h-screen
          transition-all duration-300 ease-glass
          ${isCollapsed ? 'w-12' : 'w-80 lg:w-96'}
          ${className}
        `}
      >
        {/* Collapse/Expand button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            absolute -left-4 top-20 z-50
            w-8 h-8 rounded-full
            bg-glass-medium backdrop-blur-glass
            border border-white/20
            shadow-glass
            flex items-center justify-center
            hover:bg-glass-strong hover:shadow-neon-cyan
            transition-all duration-200
          "
          aria-label={isCollapsed ? 'Expand task panel' : 'Collapse task panel'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-white/80" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/80" />
          )}
        </button>

        {/* Content */}
        <div
          className={`
            h-full overflow-hidden
            bg-glass-light backdrop-blur-glass-strong
            border-l border-white/10
            shadow-glass-lg
            ${isCollapsed ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
        >
          {!isCollapsed && (
            <div className="h-full flex flex-col p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-lg font-display font-semibold text-white/90 mb-1">
                  Active Task
                </h2>
                <p className="text-sm text-white/60">
                  Real-time execution status
                </p>
              </div>

              {/* Task Card */}
              <div className="mb-4">
                <TaskCard
                  task={{
                    id: activeTask.id,
                    title: activeTask.title,
                    status: activeTask.overallStatus,
                  }}
                  showProgress
                />
              </div>

              {/* Subtasks Timeline */}
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wide px-1">
                  Subtasks ({activeTask.subtasks.length})
                </h3>

                <AnimatedList
                  items={activeTask.subtasks}
                  renderItem={(subtask, index, isSelected) => (
                    <div className="relative pl-10">
                      {/* Timeline dot */}
                      <div
                        className={`
                          absolute left-2.5 top-3 w-3 h-3 rounded-full
                          border-2 border-background z-10
                          ${subtask.status === 'completed' ? 'bg-green-500' : ''}
                          ${subtask.status === 'running' ? 'bg-neon-cyan animate-glow-pulse-cyan' : ''}
                          ${subtask.status === 'failed' ? 'bg-red-500' : ''}
                          ${subtask.status === 'pending' ? 'bg-gray-500/50' : ''}
                        `}
                      />

                      {/* Subtask content */}
                      <div
                        className={`
                          glass-panel rounded-lg p-3
                          border-l-2
                          ${subtask.status === 'completed' ? 'border-green-500/50' : ''}
                          ${subtask.status === 'running' ? 'border-neon-cyan' : ''}
                          ${subtask.status === 'failed' ? 'border-red-500/50' : ''}
                          ${subtask.status === 'pending' ? 'border-gray-500/30' : ''}
                          transition-all duration-300
                          ${isSelected ? 'bg-white/10 border-white/30' : ''}
                        `}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm text-white/80 flex-1">
                            {subtask.description}
                          </p>
                          {subtask.googleService && (
                            <GoogleServiceIcon service={subtask.googleService} />
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <AgentBadge agent={subtask.agent} />
                          {subtask.error && (
                            <span className="text-red-400 truncate">
                              {subtask.error}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                >
                  {/* Timeline line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-neon-cyan/50 via-neon-purple/30 to-transparent" />
                </AnimatedList>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Bottom drawer */}
      <div
        className={`
          md:hidden fixed inset-x-0 bottom-0 z-40
          transition-transform duration-300 ease-glass
          ${isCollapsed ? 'translate-y-[calc(100%-3rem)]' : 'translate-y-0'}
        `}
      >
        {/* Handle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            w-full py-3 px-4
            bg-glass-medium backdrop-blur-glass
            border-t border-white/10
            flex items-center justify-between
          "
          aria-label={isCollapsed ? 'Expand task panel' : 'Collapse task panel'}
        >
          <span className="text-sm font-medium text-white/80">
            Active Task: {activeTask.title}
          </span>
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5 text-white/60 rotate-90" />
          ) : (
            <X className="w-5 h-5 text-white/60" />
          )}
        </button>

        {/* Content */}
        <div
          className="
            max-h-[70vh] overflow-y-auto
            bg-glass-light backdrop-blur-glass-strong
            border-t border-white/10
            shadow-glass-xl
          "
        >
          <div className="p-4 space-y-4">
            {/* Task Card */}
            <TaskCard
              task={{
                id: activeTask.id,
                title: activeTask.title,
                status: activeTask.overallStatus,
              }}
              showProgress
            />

            {/* Subtasks */}
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wide">
                Subtasks ({activeTask.subtasks.length})
              </h3>

              <div className="space-y-2">
                {activeTask.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={`
                      glass-panel rounded-lg p-3
                      border-l-2
                      ${subtask.status === 'completed' ? 'border-green-500/50' : ''}
                      ${subtask.status === 'running' ? 'border-neon-cyan' : ''}
                      ${subtask.status === 'failed' ? 'border-red-500/50' : ''}
                      ${subtask.status === 'pending' ? 'border-gray-500/30' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-white/80 flex-1">
                        {subtask.description}
                      </p>
                      {subtask.googleService && (
                        <GoogleServiceIcon service={subtask.googleService} />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <AgentBadge agent={subtask.agent} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper component for Google service icons
function GoogleServiceIcon({ service }: { service: string }) {
  const icons: Record<string, string> = {
    gmail: '📧',
    drive: '📁',
    docs: '📄',
    sheets: '📊',
    calendar: '📅',
  };

  return (
    <span
      className="text-lg"
      title={service}
      aria-label={`${service} service`}
    >
      {icons[service] || '🔧'}
    </span>
  );
}

// Helper component for agent badges
function AgentBadge({ agent }: { agent: string }) {
  const colors: Record<string, string> = {
    planner: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    worker: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    evaluator: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full
        text-xs font-medium border
        ${colors[agent] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}
      `}
    >
      {agent}
    </span>
  );
}
