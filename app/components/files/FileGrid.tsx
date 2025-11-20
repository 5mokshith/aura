'use client';

import { useEffect, useRef } from 'react';
import { FileCard } from './FileCard';
import { DriveFile } from '@/app/types/api';
import { Loader2 } from 'lucide-react';

interface FileGridProps {
  files: (DriveFile & { size?: string; iconLink?: string })[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onFileAction?: (action: 'summarize' | 'share' | 'download', file: DriveFile) => void;
}

/**
 * FileGrid Component
 * 
 * Displays files in responsive grid with infinite scroll
 * Requirements: 10.1, 10.5
 */
export function FileGrid({
  files,
  loading,
  hasMore,
  onLoadMore,
  onFileAction,
}: FileGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  if (files.length === 0 && !loading) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center">
        <p className="text-white/60 text-lg">No files found</p>
        <p className="text-white/40 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* File Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onAction={onFileAction}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="h-4" />

      {/* End of Results */}
      {!hasMore && files.length > 0 && (
        <div className="text-center py-4">
          <p className="text-white/40 text-sm">No more files to load</p>
        </div>
      )}
    </div>
  );
}
