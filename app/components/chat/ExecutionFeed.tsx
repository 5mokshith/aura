'use client';

import { ExecutionUpdate } from '@/app/types/chat';
import { CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExecutionFeedProps {
  updates: ExecutionUpdate[];
  className?: string;
}

export function ExecutionFeed({ updates, className = '' }: ExecutionFeedProps) {
  if (updates.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence mode="popLayout">
        {updates.map((update, index) => (
          <motion.div
            key={`${update.stepId}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2"
          >
            <ExecutionIcon type={update.type} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${getTextColor(update.type)}`}>
                {update.message}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {formatTimestamp(update.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ExecutionIcon({ type }: { type: ExecutionUpdate['type'] }) {
  const iconClass = 'w-4 h-4 flex-shrink-0 mt-0.5';

  switch (type) {
    case 'success':
      return <CheckCircle2 className={`${iconClass} text-green-400`} />;
    case 'error':
      return <AlertCircle className={`${iconClass} text-red-400`} />;
    case 'info':
    default:
      return <Info className={`${iconClass} text-blue-400`} />;
  }
}

function getTextColor(type: ExecutionUpdate['type']): string {
  switch (type) {
    case 'success':
      return 'text-green-300';
    case 'error':
      return 'text-red-300';
    case 'info':
    default:
      return 'text-white/70';
  }
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

interface ExecutionStatusProps {
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
}

export function ExecutionStatus({ status, message }: ExecutionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`status-${status} text-xs font-medium`}
    >
      {status === 'running' && (
        <Loader2 className="w-3 h-3 animate-spin" />
      )}
      {status === 'completed' && (
        <CheckCircle2 className="w-3 h-3" />
      )}
      {status === 'failed' && (
        <AlertCircle className="w-3 h-3" />
      )}
      <span className="capitalize">{message || status}</span>
    </motion.div>
  );
}
