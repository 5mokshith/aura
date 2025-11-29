'use client';

import { Mail, FolderOpen, FileText, Sheet, Calendar } from 'lucide-react';
import { ServiceMetricsCard } from '@/app/components/dashboard/ServiceMetricsCard';
import { LiveAnalytics } from '@/app/components/dashboard/LiveAnalytics';
import { HistoryPanel } from '@/app/components/dashboard/HistoryPanel';
import { AppShell } from '@/app/components/layout/AppShell';

/**
 * Dashboard Page
 * 
 * Display Google Workspace metrics, live analytics, and activity history
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default function DashboardPage() {
  // Sample metrics data - replace with real API data when available
  const servicesData = [
    {
      name: 'Gmail',
      icon: Mail,
      count: 1600,
      trend: 55,
      isActive: true,
      color: 'orange' as const,
      iconColor: 'text-white',
    },
    {
      name: 'Docs',
      icon: FileText,
      count: 357,
      trend: 12,
      isActive: false,
      color: 'dark' as const,
      iconColor: 'text-white',
    },
    {
      name: 'Drive',
      icon: FolderOpen,
      count: 2300,
      trend: 15,
      isActive: true,
      color: 'dark-blue' as const,
      iconColor: 'text-white',
    },
    {
      name: 'Sheets',
      icon: Sheet,
      count: 940,
      trend: 90,
      isActive: false,
      color: 'dark-green' as const,
      iconColor: 'text-white',
    },
    {
      name: 'Calendar',
      icon: Calendar,
      count: 450,
      trend: 40,
      isActive: true,
      color: 'dark-purple' as const,
      iconColor: 'text-white',
    },
  ];

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-transparent to-slate-900 rounded-2xl border border-white/5 shadow-glass-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-white/60">
              Pages / Dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {servicesData.map((service) => (
              <ServiceMetricsCard
                key={service.name}
                {...service}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
            <div className="lg:col-span-2">
              <LiveAnalytics />
            </div>

            <div className="lg:col-span-1">
              <HistoryPanel />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
