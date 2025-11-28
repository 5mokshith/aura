'use client';

import { Download, Search, Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface LogFilters {
  taskId: string;
  agentType: string;
  startDate: string;
  endDate: string;
}

interface LogsHeaderProps {
  filters: LogFilters;
  onFilterChange: (filters: Partial<LogFilters>) => void;
  onExport: () => void;
  totalCount: number;
}

export function LogsHeader({
  filters,
  onFilterChange,
  onExport,
  totalCount,
}: LogsHeaderProps) {
  // Local state for filters to support "Apply Filters" button
  const [localFilters, setLocalFilters] = useState<LogFilters>(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      taskId: '',
      agentType: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-6">
      {/* Title and Export Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center transform rotate-45">
            <div className="w-4 h-4 bg-white transform -rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Execution Logs
          </h1>
        </div>

        <button
          onClick={onExport}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filter Controls Panel */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Task ID Filter */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Task ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={localFilters.taskId}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, taskId: e.target.value }))}
                placeholder="Enter Task ID"
                className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Agent Type Filter */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Agent Type
            </label>
            <div className="relative">
              <select
                value={localFilters.agentType}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, agentType: e.target.value }))}
                className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
              >
                <option value="" className="bg-gray-900">All Agents</option>
                <option value="planner" className="bg-gray-900">Planner</option>
                <option value="worker" className="bg-gray-900">Worker</option>
                <option value="evaluator" className="bg-gray-900">Evaluator</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Date Filter */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
              />
            </div>
          </div>

          {/* End Date Filter */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={localFilters.endDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-white/5">
          <button
            onClick={handleClearFilters}
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

