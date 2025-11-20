'use client';

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { DriveFile, ApiResponse } from '@/app/types/api';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

// Lazy load file components
const FilesHeader = lazy(() => import('@/app/components/files').then(mod => ({ default: mod.FilesHeader })));
const FileGrid = lazy(() => import('@/app/components/files').then(mod => ({ default: mod.FileGrid })));

interface ExtendedDriveFile extends DriveFile {
  size?: string;
  iconLink?: string;
}

/**
 * Files Browser Page
 * 
 * Display Google Drive files with search, filters, and infinite scroll
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */
export default function FilesPage() {
  const router = useRouter();
  const [files, setFiles] = useState<ExtendedDriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Cache for search results (5 minutes as per requirements 19.5)
  const [cache, setCache] = useState<Map<string, { data: ExtendedDriveFile[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCacheKey = (query: string, type: string, pageNum: number) => {
    return `${query}|${type}|${pageNum}`;
  };

  const getCachedData = (key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const setCachedData = (key: string, data: ExtendedDriveFile[]) => {
    setCache(prev => new Map(prev).set(key, { data, timestamp: Date.now() }));
  };

  // Fetch files from API
  const fetchFiles = useCallback(async (query: string, type: string, pageNum: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = getCacheKey(query, type, pageNum);
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        if (append) {
          setFiles(prev => [...prev, ...cachedData]);
        } else {
          setFiles(cachedData);
        }
        setHasMore(cachedData.length === 20); // Assuming 20 is the page size
        setLoading(false);
        return;
      }

      // Get userId from session/auth (for now, using a placeholder)
      // In production, this should come from your auth system
      const userId = 'current-user-id'; // TODO: Replace with actual user ID from auth

      const params = new URLSearchParams({
        userId,
        query,
        limit: '20',
      });

      if (type) {
        params.append('fileType', type);
      }

      const response = await fetch(`/api/drive/search?${params.toString()}`);
      const result: ApiResponse<{ files: ExtendedDriveFile[]; count: number }> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch files');
      }

      const newFiles = result.data.files;
      
      // Cache the results
      setCachedData(cacheKey, newFiles);

      if (append) {
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles);
      }

      setHasMore(newFiles.length === 20);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to load files');
      
      // If OAuth token expired, redirect to setup
      if (err.message?.includes('token') || err.message?.includes('auth')) {
        router.push('/auth/setup');
      }
    } finally {
      setLoading(false);
    }
  }, [router, cache]);

  // Initial load
  useEffect(() => {
    fetchFiles(searchQuery, fileType, 1, false);
  }, []);

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    fetchFiles(query, fileType, 1, false);
  };

  // Handle file type change
  const handleFileTypeChange = (type: string) => {
    setFileType(type);
    setPage(1);
    setHasMore(true);
    fetchFiles(searchQuery, type, 1, false);
  };

  // Handle load more (infinite scroll)
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFiles(searchQuery, fileType, nextPage, true);
    }
  };

  // Handle file actions
  const handleFileAction = (action: 'summarize' | 'share' | 'download', file: DriveFile) => {
    console.log(`Action: ${action}`, file);
    
    switch (action) {
      case 'summarize':
        // TODO: Implement summarize functionality
        // Could redirect to chat with pre-filled prompt
        router.push(`/?prompt=Summarize this file: ${file.webViewLink}`);
        break;
      case 'share':
        // Open Google Drive share dialog
        window.open(file.webViewLink, '_blank');
        break;
      case 'download':
        // TODO: Implement download via /api/drive/download
        window.open(`/api/drive/download?fileId=${file.id}&userId=current-user-id`, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Google Drive Files
          </h1>
          <p className="text-white/60">
            Browse and manage your Google Drive files
          </p>
        </div>

        {/* Search and Filters */}
        <Suspense fallback={
          <div className="glass-panel rounded-xl p-6 mb-6 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <FilesHeader
            searchQuery={searchQuery}
            selectedFileType={fileType}
            onSearchChange={handleSearchChange}
            onFileTypeChange={handleFileTypeChange}
          />
        </Suspense>

        {/* Error Message */}
        {error && (
          <div className="glass-panel rounded-xl p-4 mb-6 border-l-4 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* File Grid */}
        <Suspense fallback={
          <div className="glass-panel rounded-xl p-6 h-96 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <FileGrid
            files={files}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onFileAction={handleFileAction}
          />
        </Suspense>
      </div>
    </div>
  );
}
