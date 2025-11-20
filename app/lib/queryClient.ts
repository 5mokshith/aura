/**
 * React Query Client Configuration
 * 
 * Centralized configuration for API response caching
 * Requirements: 19.5
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Default cache time: 5 minutes (as per requirements)
 */
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Stale time: 2 minutes
 * Data is considered fresh for 2 minutes, then stale but still served from cache
 */
const STALE_TIME = 2 * 60 * 1000; // 2 minutes

/**
 * Create and configure the React Query client
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: how long inactive data stays in cache
      gcTime: CACHE_TIME,
      
      // Stale time: how long data is considered fresh
      staleTime: STALE_TIME,
      
      // Retry failed requests
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (disabled for better UX)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
      retryDelay: 1000,
    },
  },
});

/**
 * Query keys for different API endpoints
 * Centralized to ensure consistency
 */
export const queryKeys = {
  // Gmail
  gmail: {
    all: ['gmail'] as const,
    search: (query: string) => ['gmail', 'search', query] as const,
    message: (messageId: string) => ['gmail', 'message', messageId] as const,
  },
  
  // Google Drive
  drive: {
    all: ['drive'] as const,
    search: (query: string, fileType?: string) =>
      ['drive', 'search', query, fileType] as const,
    file: (fileId: string) => ['drive', 'file', fileId] as const,
  },
  
  // Google Docs
  docs: {
    all: ['docs'] as const,
    document: (documentId: string) => ['docs', 'document', documentId] as const,
  },
  
  // Google Sheets
  sheets: {
    all: ['sheets'] as const,
    spreadsheet: (spreadsheetId: string, range?: string) =>
      ['sheets', 'spreadsheet', spreadsheetId, range] as const,
  },
  
  // Google Calendar
  calendar: {
    all: ['calendar'] as const,
    events: (timeMin: string, timeMax: string) =>
      ['calendar', 'events', timeMin, timeMax] as const,
    event: (eventId: string) => ['calendar', 'event', eventId] as const,
  },
  
  // Agent
  agent: {
    all: ['agent'] as const,
    logs: (taskId?: string, agentType?: string) =>
      ['agent', 'logs', taskId, agentType] as const,
    task: (taskId: string) => ['agent', 'task', taskId] as const,
  },
  
  // Task History
  taskHistory: {
    all: ['taskHistory'] as const,
    list: (filters?: Record<string, any>) =>
      ['taskHistory', 'list', filters] as const,
    task: (taskId: string) => ['taskHistory', 'task', taskId] as const,
  },
  
  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    connectedApps: ['dashboard', 'connectedApps'] as const,
    tokenStatus: ['dashboard', 'tokenStatus'] as const,
    recentActivity: ['dashboard', 'recentActivity'] as const,
    storageUsage: ['dashboard', 'storageUsage'] as const,
  },
  
  // User
  user: {
    all: ['user'] as const,
    profile: ['user', 'profile'] as const,
    tokens: ['user', 'tokens'] as const,
  },
};

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
  /**
   * Invalidate all Gmail queries
   */
  invalidateGmail: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.gmail.all });
  },
  
  /**
   * Invalidate all Drive queries
   */
  invalidateDrive: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.drive.all });
  },
  
  /**
   * Invalidate all Docs queries
   */
  invalidateDocs: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.docs.all });
  },
  
  /**
   * Invalidate all Sheets queries
   */
  invalidateSheets: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.sheets.all });
  },
  
  /**
   * Invalidate all Calendar queries
   */
  invalidateCalendar: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
  },
  
  /**
   * Invalidate all Agent queries
   */
  invalidateAgent: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.agent.all });
  },
  
  /**
   * Invalidate all Task History queries
   */
  invalidateTaskHistory: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.taskHistory.all });
  },
  
  /**
   * Invalidate all Dashboard queries
   */
  invalidateDashboard: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
  },
  
  /**
   * Invalidate all User queries
   */
  invalidateUser: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
  },
  
  /**
   * Invalidate all queries (nuclear option)
   */
  invalidateAll: () => {
    queryClient.invalidateQueries();
  },
};

/**
 * Prefetch helpers for better UX
 */
export const prefetchHelpers = {
  /**
   * Prefetch Drive files
   */
  prefetchDriveFiles: async (query: string, fileType?: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.drive.search(query, fileType),
      queryFn: async () => {
        const params = new URLSearchParams({
          userId: 'current-user-id', // TODO: Get from auth
          query,
          limit: '20',
        });
        if (fileType) params.append('fileType', fileType);
        
        const response = await fetch(`/api/drive/search?${params.toString()}`);
        return response.json();
      },
    });
  },
  
  /**
   * Prefetch task history
   */
  prefetchTaskHistory: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.taskHistory.all,
      queryFn: async () => {
        const response = await fetch('/api/timeline?userId=current-user-id');
        return response.json();
      },
    });
  },
};
