'use client';

import { DebouncedSearchInput } from '@/app/components/ui/DebouncedSearchInput';

interface FilesHeaderProps {
  onSearchChange: (query: string) => void;
  onFileTypeChange: (fileType: string) => void;
  searchQuery: string;
  selectedFileType: string;
}

const FILE_TYPES = [
  { value: '', label: 'All Files' },
  { value: 'application/vnd.google-apps.document', label: 'Google Docs' },
  { value: 'application/vnd.google-apps.spreadsheet', label: 'Google Sheets' },
  { value: 'application/vnd.google-apps.presentation', label: 'Google Slides' },
  { value: 'application/pdf', label: 'PDFs' },
  { value: 'image/', label: 'Images' },
  { value: 'video/', label: 'Videos' },
];

/**
 * FilesHeader Component
 * 
 * Displays search bar and file type filters for the files browser
 * With 300ms debounce to reduce API calls (Requirements: 10.3, 19.7)
 */
export function FilesHeader({
  onSearchChange,
  onFileTypeChange,
  searchQuery,
  selectedFileType,
}: FilesHeaderProps) {
  return (
    <div className="glass-panel-strong rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Debounced Search Bar */}
        <div className="flex-1">
          <DebouncedSearchInput
            placeholder="Search files..."
            onSearch={onSearchChange}
            delay={300}
            showClearButton={true}
          />
        </div>

        {/* File Type Filter */}
        <div className="md:w-64">
          <select
            value={selectedFileType}
            onChange={(e) => onFileTypeChange(e.target.value)}
            className="glass-input w-full px-4 py-3 rounded-lg text-white focus:outline-none cursor-pointer"
          >
            {FILE_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="bg-gray-900">
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
