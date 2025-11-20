'use client';

import { RefreshCw, Loader2 } from 'lucide-react';
import { LogEntry } from './LogEntry';

interface LogEntryData {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  level: string;
  stepId?: string;
  metadata?: any;
}

interface LogViewerProps {
  logs: LogEntryData[];
  loading: boolean;
  onRefresh: () => void;
}

export function LogViewer({ logs, loading, onRefresh }: LogViewerProps) {
  if (loading && logs.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mb-4" />
        <p className="text-white/60 text-sm">Loading execution logs...</p>
      </div>
    );
  }

  if (!loading && logs.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">📋</div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No logs found
            </h3>
            <p className="text-white/60 text-sm">
              Try adjusting your filters or execute a task to generate logs
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="glass-button-cyan flex items-center gap-2 text-sm mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {/* Header with Refresh Button */}
      <div className="border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Log Entries</h2>
          <span className="text-white/60 text-sm">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="glass-button flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Scrollable Log Container */}
      <div className="max-h-[600px] overflow-y-auto glass-scrollbar">
        <div className="p-4 space-y-2 font-mono text-sm">
          {logs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))}
        </div>
      </div>

      {/* Footer with Scroll Hint */}
      {logs.length > 10 && (
        <div className="border-t border-white/10 p-3 text-center">
          <p className="text-white/40 text-xs">
            Scroll to view more entries
          </p>
        </div>
      )}
    </div>
  );
}
