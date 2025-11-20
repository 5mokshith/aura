'use client';

import { useEffect, useState } from 'react';
import { Mail, FolderOpen, FileText, Sheet, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * RecentActivity Component
 * 
 * Fetch last 10 tasks from task_history and display task summaries with timestamps
 * Requirements: 7.3
 */

interface TaskHistoryItem {
  id: string;
  task_id: string;
  title: string;
  status: 'success' | 'failed' | 'rerun';
  google_services: string[];
  created_at: string;
  completed_at: string | null;
  duration_ms: number | null;
}

export function RecentActivity() {
  const [tasks, setTasks] = useState<TaskHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Get user ID from session (placeholder - implement based on your auth)
      const userId = 'current-user-id'; // TODO: Get from auth context

      const response = await fetch(`/api/timeline/history?userId=${userId}&limit=10`);
      const result = await response.json();

      if (result.success && result.data) {
        setTasks(result.data);
        setError(null);
      } else {
        setError(result.error?.message || 'Failed to fetch recent activity');
      }
    } catch (err: any) {
      console.error('Error fetching recent activity:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'gmail':
        return <Mail className="w-4 h-4 text-neon-cyan" />;
      case 'drive':
        return <FolderOpen className="w-4 h-4 text-blue-400" />;
      case 'docs':
        return <FileText className="w-4 h-4 text-neon-purple" />;
      case 'sheets':
        return <Sheet className="w-4 h-4 text-neon-pink" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-neon-cyan" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">Success</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
            <XCircle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400">Failed</span>
          </div>
        );
      case 'rerun':
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400">Rerun</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (ms: number | null): string => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Recent Activity
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <p className="text-white/70">No recent activity</p>
          <p className="text-white/50 text-sm mt-2">
            Start a conversation to see your task history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-white">
          Recent Activity
        </h2>
        <Link
          href="/timeline"
          className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className="glass-panel rounded-lg p-4 hover:bg-glass-medium transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-medium truncate">
                    {task.title}
                  </h3>
                  {getStatusBadge(task.status)}
                </div>

                {/* Services Used */}
                {task.google_services && task.google_services.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    {task.google_services.map((service, index) => (
                      <div key={index} className="flex items-center gap-1">
                        {getServiceIcon(service)}
                        <span className="text-xs text-white/60 capitalize">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(task.created_at)}</span>
                  </div>
                  {task.duration_ms && (
                    <span>Duration: {formatDuration(task.duration_ms)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
