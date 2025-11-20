'use client';

import { ConnectedApps } from '@/app/components/dashboard/ConnectedApps';
import { TokenStatus } from '@/app/components/dashboard/TokenStatus';
import { RecentActivity } from '@/app/components/dashboard/RecentActivity';
import { StorageUsage } from '@/app/components/dashboard/StorageUsage';

/**
 * Dashboard Page
 * 
 * Display connected apps status, token validity, recent activity, and storage usage
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/60">
            Monitor your Google Workspace connections and activity
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Connected Apps */}
          <ConnectedApps />

          {/* Token Status */}
          <TokenStatus />

          {/* Recent Activity */}
          <RecentActivity />

          {/* Storage Usage */}
          <StorageUsage />
        </div>
      </div>
    </div>
  );
}
