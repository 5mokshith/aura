'use client';

import { useEffect, useState } from 'react';
import { Database, FileText, Activity, HardDrive } from 'lucide-react';

/**
 * StorageUsage Component
 * 
 * Query Supabase for storage metrics and display logs size and entry count
 * Requirements: 7.4
 */

interface StorageMetrics {
  logsCount: number;
  logsSize: number;
  taskHistoryCount: number;
  documentsCount: number;
  totalSize: number;
}

export function StorageUsage() {
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStorageMetrics();
  }, []);

  const fetchStorageMetrics = async () => {
    try {
      // Get user ID from session (placeholder - implement based on your auth)
      const userId = 'current-user-id'; // TODO: Get from auth context

      const response = await fetch(`/api/db/storage-metrics?userId=${userId}`);
      const result = await response.json();

      if (result.success && result.data) {
        setMetrics(result.data);
        setError(null);
      } else {
        setError(result.error?.message || 'Failed to fetch storage metrics');
      }
    } catch (err: any) {
      console.error('Error fetching storage metrics:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const calculatePercentage = (used: number, total: number): number => {
    if (total === 0) return 0;
    return Math.min((used / total) * 100, 100);
  };

  if (loading) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Storage Usage
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Storage Usage
        </h2>
        <div className="text-center py-8">
          <p className="text-white/70">{error || 'No storage data available'}</p>
        </div>
      </div>
    );
  }

  const maxStorage = 100 * 1024 * 1024; // 100 MB limit (example)
  const usagePercentage = calculatePercentage(metrics.totalSize, maxStorage);

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        Storage Usage
      </h2>

      {/* Overall Storage */}
      <div className="glass-panel rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-lg font-semibold text-white">Total Storage</h3>
          </div>
          <span className="text-white font-medium">
            {formatBytes(metrics.totalSize)} / {formatBytes(maxStorage)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-glass-dark rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercentage > 80
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : usagePercentage > 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-neon-cyan to-blue-500'
            }`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>

        <p className="text-xs text-white/60 mt-2">
          {usagePercentage.toFixed(1)}% used
        </p>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Execution Logs */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-neon-purple" />
            <h3 className="text-sm font-semibold text-white">Execution Logs</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              {formatNumber(metrics.logsCount)}
            </p>
            <p className="text-xs text-white/60">
              {formatBytes(metrics.logsSize)}
            </p>
          </div>
        </div>

        {/* Task History */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-neon-pink" />
            <h3 className="text-sm font-semibold text-white">Task History</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              {formatNumber(metrics.taskHistoryCount)}
            </p>
            <p className="text-xs text-white/60">entries</p>
          </div>
        </div>

        {/* Documents Generated */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Documents</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              {formatNumber(metrics.documentsCount)}
            </p>
            <p className="text-xs text-white/60">generated</p>
          </div>
        </div>
      </div>

      {/* Warning if storage is high */}
      {usagePercentage > 80 && (
        <div className="mt-4 glass-panel rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-yellow-400">
            ⚠️ Storage usage is high. Consider cleaning up old logs from the{' '}
            <a href="/settings" className="underline hover:text-yellow-300">
              settings page
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
