'use client';

import { Download, Filter, RefreshCw } from 'lucide-react';
import { useDebouncedInput } from '@/app/hooks/useDebounce';
import { useEffect } from 'react';

/**
 * Debounced Task ID Input Component
 */
function DebouncedTaskIdInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { value: localValue, debouncedValue, setValue } = useDebouncedInput(value, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter task ID..."
      className="glass-input w-full px-4 py-2 rounded-lg text-white text-sm placeholder:text-white/40"
    />
  );
}

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
  return (
    <div className="glass-panel-strong rounded-xl p-6 space-y-6">
      {/* Title and Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Execution Logs
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {totalCount} {totalCount === 1 ? 'entry' : 'entries'} found
          </p>
        </div>

        <button
          onClick={onExport}
          className="glass-button-cyan flex items-center gap-2 text-sm"
          disabled={totalCount === 0}
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Task ID Filter - Debounced */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Task ID
          </label>
          <DebouncedTaskIdInput
            value={filters.taskId}
            onChange={(value) => onFilterChange({ taskId: value })}
          />
        </div>

        {/* Agent Type Filter */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">
            Agent Type
          </label>
          <select
            value={filters.agentType}
            onChange={(e) => onFilterChange({ agentType: e.target.value })}
            className="glass-input w-full px-4 py-2 rounded-lg text-white text-sm"
          >
            <option value="">All Agents</option>
            <option value="planner">Planner</option>
            <option value="worker">Worker</option>
            <option value="evaluator">Evaluator</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">
            Start Date
          </label>
          <input
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="glass-input w-full px-4 py-2 rounded-lg text-white text-sm"
          />
        </div>

        {/* End Date Filter */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">
            End Date
          </label>
          <input
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="glass-input w-full px-4 py-2 rounded-lg text-white text-sm"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filters.taskId || filters.agentType || filters.startDate || filters.endDate) && (
        <div className="flex justify-end">
          <button
            onClick={() =>
              onFilterChange({
                taskId: '',
                agentType: '',
                startDate: '',
                endDate: '',
              })
            }
            className="glass-button flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
