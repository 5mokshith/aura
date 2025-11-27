'use client';

import { Mail, FolderOpen, FileText, Sheet, Calendar } from 'lucide-react';
import { ServiceMetricsCard } from '@/app/components/dashboard/ServiceMetricsCard';
import { LiveAnalytics } from '@/app/components/dashboard/LiveAnalytics';
import { HistoryPanel } from '@/app/components/dashboard/HistoryPanel';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-transparent to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/60">
            Pages / Dashboard
          </p>
        </div>

        {/* Service Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {servicesData.map((service) => (
            <ServiceMetricsCard
              key={service.name}
              {...service}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Analytics - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <LiveAnalytics />
          </div>

          {/* History Panel - Takes 1/3 width */}
          <div className="lg:col-span-1">
            <HistoryPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
