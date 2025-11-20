'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ExternalLink, 
  Mail, 
  FileText, 
  Calendar, 
  FolderOpen,
  Sheet,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface TaskHistoryItem {
  id: string;
  task_id: string;
  title: string;
  status: 'success' | 'failed' | 'rerun' | 'cancelled';
  input_prompt: string;
  output_summary?: string;
  outputs?: TaskOutput[];
  google_services?: string[];
  duration_ms?: number;
  created_at: string;
  completed_at?: string;
}

export interface TaskOutput {
  type: 'document' | 'email' | 'calendar_event' | 'file' | 'data';
  title: string;
  url?: string;
  googleId?: string;
  data?: any;
}

interface TaskCardProps {
  task: TaskHistoryItem;
  onRetry?: (taskId: string) => void;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    label: 'Success'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    label: 'Failed'
  },
  rerun: {
    icon: RotateCcw,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    label: 'Rerun'
  },
  cancelled: {
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    label: 'Cancelled'
  }
};

const serviceConfig = {
  gmail: { icon: Mail, color: 'text-red-400', label: 'Gmail' },
  drive: { icon: FolderOpen, color: 'text-blue-400', label: 'Drive' },
  docs: { icon: FileText, color: 'text-blue-500', label: 'Docs' },
  sheets: { icon: Sheet, color: 'text-green-400', label: 'Sheets' },
  calendar: { icon: Calendar, color: 'text-purple-400', label: 'Calendar' }
};

const outputTypeConfig = {
  document: { icon: FileText, color: 'text-blue-400' },
  email: { icon: Mail, color: 'text-red-400' },
  calendar_event: { icon: Calendar, color: 'text-purple-400' },
  file: { icon: FolderOpen, color: 'text-blue-400' },
  data: { icon: FileText, color: 'text-gray-400' }
};

export function TaskCard({ task, onRetry }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  
  const formatDuration = (ms?: number) => {
    if (!ms) return 'Unknown';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className={`task-card ${task.status === 'failed' ? 'task-card-failed' : task.status === 'success' ? 'task-card-completed' : 'task-card'} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor} ${status.borderColor} border`}>
              <StatusIcon className={`w-3 h-3 ${status.color}`} />
              <span className={`text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            
            {task.google_services && task.google_services.length > 0 && (
              <div className="flex items-center gap-1">
                {task.google_services.map((service) => {
                  const serviceInfo = serviceConfig[service as keyof typeof serviceConfig];
                  if (!serviceInfo) return null;
                  const ServiceIcon = serviceInfo.icon;
                  return (
                    <div
                      key={service}
                      className="p-1 rounded bg-glass-light border border-white/10"
                      title={serviceInfo.label}
                    >
                      <ServiceIcon className={`w-3 h-3 ${serviceInfo.color}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Title and Summary */}
          <h3 className="text-white font-medium mb-1 line-clamp-2">
            {task.title}
          </h3>
          
          {task.output_summary && (
            <p className="text-white/60 text-sm mb-3 line-clamp-2">
              {task.output_summary}
            </p>
          )}

          {/* Outputs */}
          {task.outputs && task.outputs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.outputs.slice(0, 3).map((output, index) => {
                const outputConfig = outputTypeConfig[output.type];
                const OutputIcon = outputConfig.icon;
                
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <OutputIcon className={`w-3 h-3 ${outputConfig.color}`} />
                    <span className="text-xs text-white/80 truncate max-w-32">
                      {output.title}
                    </span>
                    {output.url && (
                      <a
                        href={output.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3 text-white/60 hover:text-white/80" />
                      </a>
                    )}
                  </div>
                );
              })}
              
              {task.outputs.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all"
                >
                  <span className="text-xs text-white/60">
                    +{task.outputs.length - 3} more
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-white/60" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Expanded Outputs */}
          {isExpanded && task.outputs && task.outputs.length > 3 && (
            <div className="flex flex-wrap gap-2 mb-3 animate-slide-up">
              {task.outputs.slice(3).map((output, index) => {
                const outputConfig = outputTypeConfig[output.type];
                const OutputIcon = outputConfig.icon;
                
                return (
                  <div
                    key={index + 3}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <OutputIcon className={`w-3 h-3 ${outputConfig.color}`} />
                    <span className="text-xs text-white/80 truncate max-w-32">
                      {output.title}
                    </span>
                    {output.url && (
                      <a
                        href={output.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3 text-white/60 hover:text-white/80" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span>{formatDate(task.created_at)}</span>
            {task.duration_ms && (
              <span>Duration: {formatDuration(task.duration_ms)}</span>
            )}
            <span>ID: {task.task_id.slice(-8)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {task.status === 'failed' && onRetry && (
            <button
              onClick={() => onRetry(task.task_id)}
              className="glass-button-purple flex items-center gap-2 px-3 py-2 text-sm"
              title="Retry task"
            >
              <Play className="w-3 h-3" />
              Retry
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/60" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-slide-up">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs text-white/60 uppercase tracking-wide mb-1">
                Original Prompt
              </h4>
              <p className="text-sm text-white/80 bg-glass-light rounded-lg p-3 border border-white/10">
                {task.input_prompt}
              </p>
            </div>
            
            {task.completed_at && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/60">Started:</span>
                  <span className="text-white/80 ml-2">
                    {new Date(task.created_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Completed:</span>
                  <span className="text-white/80 ml-2">
                    {new Date(task.completed_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}