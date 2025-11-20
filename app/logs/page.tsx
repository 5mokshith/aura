'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

// Lazy load logs components
const LogsHeader = lazy(() => import('@/app/components/logs/LogsHeader').then(mod => ({ default: mod.LogsHeader })));
const LogViewer = lazy(() => import('@/app/components/logs/LogViewer').then(mod => ({ default: mod.LogViewer })));

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  level: string;
  stepId?: string;
  metadata?: any;
}

interface LogFilters {
  taskId: string;
  agentType: string;
  startDate: string;
  endDate: string;
}

const LOGS_PER_PAGE = 100;

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<LogFilters>({
    taskId: '',
    agentType: '',
    startDate: '',
    endDate: '',
  });

  const fetchLogs = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // TODO: Get actual userId from auth context
      params.append('userId', 'temp-user-id');
      
      if (filters.taskId) params.append('taskId', filters.taskId);
      if (filters.agentType) params.append('agentType', filters.agentType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Add pagination
      params.append('limit', LOGS_PER_PAGE.toString());
      params.append('offset', ((page - 1) * LOGS_PER_PAGE).toString());

      const response = await fetch(`/api/agent/logs?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch logs');
      }

      setLogs(result.data.logs);
      setTotalCount(result.data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchLogs(1);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = async () => {
    try {
      // Fetch all logs for export (without pagination)
      const params = new URLSearchParams();
      params.append('userId', 'temp-user-id');
      
      if (filters.taskId) params.append('taskId', filters.taskId);
      if (filters.agentType) params.append('agentType', filters.agentType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', '10000'); // Large limit for export

      const response = await fetch(`/api/agent/logs?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch logs for export');
      }

      const dataStr = JSON.stringify(result.data.logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `execution-logs-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export logs');
    }
  };

  const totalPages = Math.ceil(totalCount / LOGS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handleNextPage = () => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchLogs(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchLogs(prevPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Suspense fallback={
          <div className="glass-panel rounded-xl p-6 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <LogsHeader
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            totalCount={totalCount}
          />
        </Suspense>

        {error && (
          <div className="glass-panel border-red-500/50 p-4 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Suspense fallback={
          <div className="glass-panel rounded-xl p-6 h-96 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <LogViewer
            logs={logs}
            loading={loading}
            onRefresh={() => fetchLogs(currentPage)}
          />
        </Suspense>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div className="text-white/60 text-sm">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!hasPrevPage || loading}
                className="glass-button flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={!hasNextPage || loading}
                className="glass-button flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
