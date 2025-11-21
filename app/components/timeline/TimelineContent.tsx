'use client';

import { useState, useEffect, useCallback } from 'react';
import { TaskCard, TaskHistoryItem } from './TaskCard';
import { TimelineFilters } from './TimelineHeader';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface TimelineContentProps {
  filters?: TimelineFilters;
}

export function TimelineContent({ filters = {} }: TimelineContentProps) {
  const [tasks, setTasks] = useState<TaskHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [retrying, setRetrying] = useState<string | null>(null);

  const fetchTasks = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
        ...(filters.status && { status: filters.status }),
        ...(filters.service && { service: filters.service }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/timeline/tasks?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch tasks');
      }

      const newTasks = data.data.tasks || [];

      if (reset || pageNum === 0) {
        setTasks(newTasks);
      } else {
        setTasks(prev => [...prev, ...newTasks]);
      }

      setHasMore(newTasks.length === 20); // If we got a full page, there might be more
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks(0, true);
  }, [fetchTasks]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchTasks(page + 1, false);
    }
  };

  const handleRetry = async (taskId: string) => {
    try {
      setRetrying(taskId);

      const response = await fetch('/api/agent/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to retry task');
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the task list to show the new retry
        fetchTasks(0, true);
      } else {
        throw new Error(data.error?.message || 'Failed to retry task');
      }
    } catch (err) {
      console.error('Error retrying task:', err);
      setError(err instanceof Error ? err.message : 'Failed to retry task');
    } finally {
      setRetrying(null);
    }
  };

  const handleRefresh = () => {
    fetchTasks(0, true);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          Failed to Load Timeline
        </h3>
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="glass-button-cyan flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-glass-light border border-white/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No Tasks Found
        </h3>
        <p className="text-white/60 mb-4">
          {Object.keys(filters).length > 0
            ? 'No tasks match your current filters. Try adjusting your search criteria.'
            : 'You haven\'t executed any tasks yet. Start a conversation to see your task history here.'
          }
        </p>
        {Object.keys(filters).length > 0 && (
          <button
            onClick={() => window.location.reload()}
            className="glass-button-cyan"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all text-sm text-white/60 hover:text-white/80"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TaskCard
              task={task}
              onRetry={retrying === task.task_id ? undefined : handleRetry}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="glass-button-cyan flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Tasks'
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && tasks.length > 0 && (
        <div className="glass-panel rounded-lg p-4 border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}