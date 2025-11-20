'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

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
 * Requirements: 10.3
 */
export function FilesHeader({
  onSearchChange,
  onFileTypeChange,
  searchQuery,
  selectedFileType,
}: FilesHeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localQuery);
  };

  return (
    <div className="glass-panel-strong rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search files..."
              className="glass-input w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none"
            />
          </div>
        </form>

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
