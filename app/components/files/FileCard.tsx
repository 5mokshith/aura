'use client';

import { FileText, Download, Share2, FileSpreadsheet, FileImage, File, Video, Music, Archive, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { DriveFile } from '@/app/types/api';

interface FileCardProps {
  file: DriveFile & { size?: string; iconLink?: string };
  onAction?: (action: 'summarize' | 'share' | 'download', file: DriveFile) => void;
}

/**
 * FileCard Component
 * 
 * Displays individual file with thumbnail, metadata, and action menu
 * Requirements: 10.2, 10.4
 */
export function FileCard({ file, onAction }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('document')) return <FileText className="w-8 h-8" />;
    if (mimeType.includes('spreadsheet')) return <FileSpreadsheet className="w-8 h-8" />;
    if (mimeType.includes('image')) return <FileImage className="w-8 h-8" />;
    if (mimeType.includes('video')) return <Video className="w-8 h-8" />;
    if (mimeType.includes('audio')) return <Music className="w-8 h-8" />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '';
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const handleAction = (action: 'summarize' | 'share' | 'download') => {
    setShowMenu(false);
    onAction?.(action, file);
  };

  return (
    <div className="glass-panel rounded-xl p-4 hover:bg-glass-medium transition-all duration-300 group relative">
      {/* Thumbnail or Icon */}
      <div className="aspect-square rounded-lg bg-glass-dark mb-3 flex items-center justify-center overflow-hidden relative">
        {file.thumbnailLink ? (
          <img
            src={file.thumbnailLink}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-neon-cyan">
            {getFileIcon(file.mimeType)}
          </div>
        )}
        
        {/* Action Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-2 right-2 glass-button p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>

        {/* Action Menu Dropdown */}
        {showMenu && (
          <div className="absolute top-10 right-2 glass-panel-strong rounded-lg overflow-hidden z-10 min-w-[150px]">
            <button
              onClick={() => handleAction('summarize')}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-glass-medium transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Summarize
            </button>
            <button
              onClick={() => handleAction('share')}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-glass-medium transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => handleAction('download')}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-glass-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="space-y-1">
        <h3 className="text-white font-medium text-sm truncate" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>{formatDate(file.modifiedTime)}</span>
          {file.size && <span>{formatFileSize(file.size)}</span>}
        </div>
      </div>

      {/* Click to open */}
      <a
        href={file.webViewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 rounded-xl"
        aria-label={`Open ${file.name}`}
      />
    </div>
  );
}
