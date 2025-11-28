'use client';

import { RefreshCw, Loader2, Info } from 'lucide-react';

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

function LogLevelBadge({ level }: { level: string }) {
  const getLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'info':
        return 'bg-[#1E293B] text-[#60A5FA] border-[#3B82F6]/20';
      case 'warn':
      case 'warning':
        return 'bg-[#2D2200] text-[#FACC15] border-[#EAB308]/20';
      case 'error':
        return 'bg-[#2A1215] text-[#F87171] border-[#EF4444]/20';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-medium border ${getLevelStyles(level)} uppercase tracking-wide`}>
      {level}
    </span>
  );
}

export function LogViewer({ logs, loading, onRefresh }: LogViewerProps) {
  if (loading && logs.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading execution logs...</p>
      </div>
    );
  }

  if (!loading && logs.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Info className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No logs found
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Try adjusting your filters or execute a task to generate logs
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-black/20 border-b border-white/10 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-2">Timestamp</div>
        <div className="col-span-2">Log Level</div>
        <div className="col-span-2">Task ID</div>
        <div className="col-span-6">Message</div>
      </div>

      {/* Table Body */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {logs.map((log) => (
          <div
            key={log.id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-start text-sm"
          >
            <div className="col-span-2 text-gray-400 font-mono text-xs pt-1">
              {log.timestamp}
            </div>
            <div className="col-span-2">
              <LogLevelBadge level={log.level} />
            </div>
            <div className="col-span-2 text-gray-400 font-mono text-xs pt-1">
              {log.stepId || log.agent || '-'}
            </div>
            <div className="col-span-6 text-gray-300 pt-1">
              {log.message}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-black/20 border-t border-white/10 p-3 flex justify-between items-center">
        <p className="text-gray-500 text-xs">
          Showing {logs.length} entries
        </p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-gray-400 hover:text-white text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stream
        </button>
      </div>
    </div>
  );
}

