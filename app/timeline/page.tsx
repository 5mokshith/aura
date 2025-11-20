'use client';

import { useState } from 'react';
import { TimelineHeader, TimelineFilters } from '@/components/timeline/TimelineHeader';
import { TimelineContent } from '@/components/timeline/TimelineContent';

export default function TimelinePage() {
  const [filters, setFilters] = useState<TimelineFilters>({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <TimelineHeader 
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <TimelineContent filters={filters} />
      </div>
    </div>
  );
}