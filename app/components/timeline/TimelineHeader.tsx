'use client';

import { useState } from 'react';
import { FilterBar } from './FilterBar';
import { Clock, Filter } from 'lucide-react';

export interface TimelineFilters {
  status?: string;
  service?: string;
  startDate?: string;
  endDate?: string;
}

interface TimelineHeaderProps {
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
}

export function TimelineHeader({ filters, onFiltersChange }: TimelineHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="glass-panel rounded-xl p-6 mb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30">
            <Clock className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">
              Execution Timeline
            </h1>
            <p className="text-white/60 text-sm">
              View your task history and execution results
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`glass-button-cyan flex items-center gap-2 ${
            showFilters ? 'glow-cyan' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="animate-slide-up">
          <FilterBar 
            filters={filters} 
            onFiltersChange={onFiltersChange}
          />
        </div>
      )}
    </div>
  );
}