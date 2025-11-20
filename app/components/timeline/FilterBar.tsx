'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, RotateCcw, X } from 'lucide-react';
import { TimelineFilters } from './TimelineHeader';

interface FilterBarProps {
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
}

const statusOptions = [
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-400' },
  { value: 'failed', label: 'Failed', icon: XCircle, color: 'text-red-400' },
  { value: 'rerun', label: 'Rerun', icon: RotateCcw, color: 'text-yellow-400' },
];

const serviceOptions = [
  { value: 'gmail', label: 'Gmail', color: 'text-red-400' },
  { value: 'drive', label: 'Drive', color: 'text-blue-400' },
  { value: 'docs', label: 'Docs', color: 'text-blue-500' },
  { value: 'sheets', label: 'Sheets', color: 'text-green-400' },
  { value: 'calendar', label: 'Calendar', color: 'text-purple-400' },
];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [localFilters, setLocalFilters] = useState<TimelineFilters>(filters);

  const updateFilter = (key: keyof TimelineFilters, value: string | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value);

  return (
    <div className="glass-panel-strong rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/70 uppercase tracking-wide">
          Filter Tasks
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wide">
            Date Range
          </label>
          <div className="space-y-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) => updateFilter('startDate', e.target.value || undefined)}
                className="glass-input w-full pl-10 pr-3 py-2 text-sm rounded-lg"
                placeholder="Start date"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) => updateFilter('endDate', e.target.value || undefined)}
                className="glass-input w-full pl-10 pr-3 py-2 text-sm rounded-lg"
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wide">
            Status
          </label>
          <div className="space-y-1">
            {statusOptions.map((status) => (
              <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={localFilters.status === status.value}
                  onChange={(e) => updateFilter('status', e.target.checked ? e.target.value : undefined)}
                  className="sr-only"
                />
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                  localFilters.status === status.value
                    ? 'bg-glass-medium border border-white/30'
                    : 'bg-glass-light border border-white/10 hover:border-white/20'
                }`}>
                  <status.icon className={`w-3 h-3 ${status.color}`} />
                  <span className="text-xs text-white/80">{status.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Service Filter */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wide">
            Google Service
          </label>
          <div className="space-y-1">
            {serviceOptions.map((service) => (
              <label key={service.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="service"
                  value={service.value}
                  checked={localFilters.service === service.value}
                  onChange={(e) => updateFilter('service', e.target.checked ? e.target.value : undefined)}
                  className="sr-only"
                />
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                  localFilters.service === service.value
                    ? 'bg-glass-medium border border-white/30'
                    : 'bg-glass-light border border-white/10 hover:border-white/20'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${service.color.replace('text-', 'bg-')}`} />
                  <span className="text-xs text-white/80">{service.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <label className="text-xs text-white/60 uppercase tracking-wide">
            Quick Filters
          </label>
          <div className="space-y-1">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                updateFilter('startDate', today);
                updateFilter('endDate', today);
              }}
              className="w-full text-left px-3 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all"
            >
              <span className="text-xs text-white/80">Today</span>
            </button>
            <button
              onClick={() => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                updateFilter('startDate', weekAgo.toISOString().split('T')[0]);
                updateFilter('endDate', undefined);
              }}
              className="w-full text-left px-3 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all"
            >
              <span className="text-xs text-white/80">Last 7 days</span>
            </button>
            <button
              onClick={() => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                updateFilter('startDate', monthAgo.toISOString().split('T')[0]);
                updateFilter('endDate', undefined);
              }}
              className="w-full text-left px-3 py-1 rounded-lg bg-glass-light border border-white/10 hover:border-white/20 transition-all"
            >
              <span className="text-xs text-white/80">Last 30 days</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}