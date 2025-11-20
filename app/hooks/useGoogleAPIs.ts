/**
 * Custom hooks for Google APIs with caching
 * 
 * Uses React Query for automatic caching and request deduplication
 * Requirements: 19.5
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, cacheInvalidation } from '@/app/lib/queryClient';
import { ApiResponse, DriveFile, GmailMessage } from '@/app/types/api';

/**
 * Hook for searching Google Drive files with caching
 */
export function useDriveSearch(query: string, fileType?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.drive.search(query, fileType),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        query,
        limit: '20',
      });
      
      if (fileType) {
        params.append('fileType', fileType);
      }

      const response = await fetch(`/api/drive/search?${params.toString()}`);
      const result: ApiResponse<{ files: DriveFile[] }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to search files');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for searching Gmail messages with caching
 */
export function useGmailSearch(query: string, maxResults: number = 10, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.gmail.search(query),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        query,
        maxResults: maxResults.toString(),
      });

      const response = await fetch(`/api/gmail/search?${params.toString()}`);
      const result: ApiResponse<{ messages: GmailMessage[] }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to search emails');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (emails change more frequently)
  });
}

/**
 * Hook for reading a Gmail message with caching
 */
export function useGmailMessage(messageId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.gmail.message(messageId),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        messageId,
      });

      const response = await fetch(`/api/gmail/read?${params.toString()}`);
      const result: ApiResponse<GmailMessage> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to read email');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for reading Google Docs with caching
 */
export function useGoogleDoc(documentId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.docs.document(documentId),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        documentId,
      });

      const response = await fetch(`/api/docs/read?${params.toString()}`);
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to read document');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for reading Google Sheets with caching
 */
export function useGoogleSheet(
  spreadsheetId: string,
  range?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.sheets.spreadsheet(spreadsheetId, range),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        spreadsheetId,
      });
      
      if (range) {
        params.append('range', range);
      }

      const response = await fetch(`/api/sheets/read?${params.toString()}`);
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to read spreadsheet');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for listing calendar events with caching
 */
export function useCalendarEvents(
  timeMin: string,
  timeMax: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.calendar.events(timeMin, timeMax),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        timeMin,
        timeMax,
        maxResults: '10',
      });

      const response = await fetch(`/api/calendar/list?${params.toString()}`);
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to list events');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (calendar changes frequently)
  });
}

/**
 * Hook for agent logs with caching
 */
export function useAgentLogs(
  taskId?: string,
  agentType?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.agent.logs(taskId, agentType),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
      });
      
      if (taskId) params.append('taskId', taskId);
      if (agentType) params.append('agentType', agentType);

      const response = await fetch(`/api/agent/logs?${params.toString()}`);
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch logs');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute (logs update frequently)
  });
}

/**
 * Hook for task history with caching
 */
export function useTaskHistory(filters?: Record<string, any>, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.taskHistory.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: 'current-user-id', // TODO: Get from auth context
        ...filters,
      });

      const response = await fetch(`/api/timeline?${params.toString()}`);
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch task history');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Mutation hook for sending Gmail with cache invalidation
 */
export function useSendGmail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      to: string[];
      subject: string;
      body: string;
      attachments?: any[];
    }) => {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth context
          ...data,
        }),
      });
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to send email');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate Gmail queries after sending
      cacheInvalidation.invalidateGmail();
    },
  });
}

/**
 * Mutation hook for creating Google Docs with cache invalidation
 */
export function useCreateDoc() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: any[];
    }) => {
      const response = await fetch('/api/docs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth context
          ...data,
        }),
      });
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create document');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate Drive and Docs queries after creating
      cacheInvalidation.invalidateDrive();
      cacheInvalidation.invalidateDocs();
    },
  });
}

/**
 * Mutation hook for uploading to Drive with cache invalidation
 */
export function useUploadToDrive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      filename: string;
      mimeType: string;
      content: string;
      folderId?: string;
    }) => {
      const response = await fetch('/api/drive/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth context
          ...data,
        }),
      });
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to upload file');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate Drive queries after uploading
      cacheInvalidation.invalidateDrive();
    },
  });
}
