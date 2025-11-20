'use client';

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

// Lazy load dashboard components
const ConnectedApps = lazy(() => import('@/app/components/dashboard/ConnectedApps').then(mod => ({ default: mod.ConnectedApps })));
const TokenStatus = lazy(() => import('@/app/components/dashboard/TokenStatus').then(mod => ({ default: mod.TokenStatus })));
const RecentActivity = lazy(() => import('@/app/components/dashboard/RecentActivity').then(mod => ({ default: mod.RecentActivity })));
const StorageUsage = lazy(() => import('@/app/components/dashboard/StorageUsage').then(mod => ({ default: mod.StorageUsage })));

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
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-48 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <ConnectedApps />
          </Suspense>

          {/* Token Status */}
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-32 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <TokenStatus />
          </Suspense>

          {/* Recent Activity */}
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <RecentActivity />
          </Suspense>

          {/* Storage Usage */}
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-32 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <StorageUsage />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
