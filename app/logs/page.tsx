'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, X } from 'lucide-react';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { AppShell } from '@/app/components/layout/AppShell';
import { getUserSessionClient } from '@/lib/auth';

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
  const [showConnectionAlert, setShowConnectionAlert] = useState(true); // Simulating connection lost for design
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
      // Using a valid dummy UUID to pass backend validation
      const session = getUserSessionClient();
      const userId = session?.userId;

      if (!userId) {
        setLogs([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      params.append('userId', userId);

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
      const session = getUserSessionClient();
      const userId = session?.userId;

      if (!userId) {
        setError('No user session found for export');
        return;
      }

      params.append('userId', userId);

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
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900 p-6 relative rounded-2xl border border-white/5 shadow-glass-lg">
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
        <Suspense fallback={
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 flex items-center justify-center">
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
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Suspense fallback={
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 h-96 flex items-center justify-center">
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
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="text-white/60 text-sm">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!hasPrevPage || loading}
                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={!hasNextPage || loading}
                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        </div>

        {/* {showConnectionAlert && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-full md:max-w-2xl bg-[#3B1215] border border-[#5C181C] rounded-lg p-4 shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#F87171]" />
              <span className="text-[#FECACA] text-sm font-medium">
                Connection to log stream lost. Retrying automatically...
              </span>
            </div>
            <button
              onClick={() => setShowConnectionAlert(false)}
              className="text-[#F87171] hover:text-[#FECACA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )} */}
      </div>
    </AppShell>
  );
}

