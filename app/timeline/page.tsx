'use client';

import { useState, lazy, Suspense } from 'react';
import { TimelineFilters } from '@/components/timeline/TimelineHeader';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

// Lazy load timeline components
const TimelineHeader = lazy(() => import('@/components/timeline/TimelineHeader').then(mod => ({ default: mod.TimelineHeader })));
const TimelineContent = lazy(() => import('@/components/timeline/TimelineContent').then(mod => ({ default: mod.TimelineContent })));

export default function TimelinePage() {
  const [filters, setFilters] = useState<TimelineFilters>({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="glass-panel rounded-xl p-6 mb-6 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <TimelineHeader 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </Suspense>
        
        <Suspense fallback={
          <div className="glass-panel rounded-xl p-6 h-96 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <TimelineContent filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}