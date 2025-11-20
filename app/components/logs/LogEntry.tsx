'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface LogEntryData {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  level: string;
  stepId?: string;
  metadata?: any;
}

interface LogEntryProps {
  log: LogEntryData;
}

export function LogEntry({ log }: LogEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // Get log level styling
  const getLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          icon: Info,
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: CheckCircle,
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: XCircle,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: Info,
        };
    }
  };

  // Get agent badge color
  const getAgentColor = (agent: string) => {
    switch (agent.toLowerCase()) {
      case 'planner':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'worker':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'evaluator':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const levelStyles = getLevelStyles(log.level);
  const LevelIcon = levelStyles.icon;

  return (
    <div
      className={`${levelStyles.bg} ${levelStyles.border} border rounded-lg p-3 transition-all duration-200 hover:bg-opacity-20`}
    >
      {/* Main Log Line */}
      <div className="flex items-start gap-3">
        {/* Expand Button (if metadata exists) */}
        {hasMetadata && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-white/40 hover:text-white/80 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Level Icon */}
        <div className={`mt-1 ${levelStyles.text}`}>
          <LevelIcon className="w-4 h-4" />
        </div>

        {/* Log Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Timestamp */}
            <span className="text-white/50 text-xs">
              {formatTimestamp(log.timestamp)}
            </span>

            {/* Agent Badge */}
            <span
              className={`${getAgentColor(log.agent)} px-2 py-0.5 rounded text-xs font-medium border`}
            >
              {log.agent}
            </span>

            {/* Level Badge */}
            <span
              className={`${levelStyles.text} ${levelStyles.bg} px-2 py-0.5 rounded text-xs font-medium border ${levelStyles.border}`}
            >
              {log.level.toUpperCase()}
            </span>

            {/* Step ID (if exists) */}
            {log.stepId && (
              <span className="text-white/40 text-xs">
                Step: {log.stepId}
              </span>
            )}
          </div>

          {/* Message */}
          <div className="text-white/90 text-sm break-words">
            {log.message}
          </div>
        </div>
      </div>

      {/* Expanded Metadata */}
      {expanded && hasMetadata && (
        <div className="mt-3 ml-10 pl-4 border-l-2 border-white/10">
          <div className="text-white/60 text-xs font-semibold mb-2">
            Metadata:
          </div>
          <pre className="text-white/70 text-xs overflow-x-auto bg-black/20 rounded p-2">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
