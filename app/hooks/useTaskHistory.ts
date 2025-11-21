'use client';

import { useQuery } from '@tanstack/react-query';

export interface TaskHistoryItem {
    id: string;
    task_id: string;
    title: string;
    status: 'success' | 'failed' | 'rerun' | 'cancelled' | 'in-progress';
    input_prompt: string;
    output_summary: string | null;
    outputs: Array<{
        type: string;
        link?: string;
        metadata?: Record<string, unknown>;
    }>;
    google_services: string[];
    duration_ms: number | null;
    created_at: string;
    completed_at: string | null;
}

interface TaskHistoryResponse {
    success: boolean;
    data?: {
        tasks: TaskHistoryItem[];
        pagination: {
            page: number;
            limit: number;
            hasMore: boolean;
            totalCount: number | null;
        };
    };
    error?: {
        code: string;
        message: string;
    };
}

interface UseTaskHistoryOptions {
    page?: number;
    limit?: number;
    status?: string;
    service?: string;
    startDate?: string;
    endDate?: string;
    enabled?: boolean;
    refetchInterval?: number;
}

/**
 * Custom hook to fetch task history from the API
 * Uses React Query for caching and automatic refetching
 */
export function useTaskHistory(options: UseTaskHistoryOptions = {}) {
    const {
        page = 0,
        limit = 20,
        status,
        service,
        startDate,
        endDate,
        enabled = true,
        refetchInterval,
    } = options;

    return useQuery<TaskHistoryItem[], Error>({
        queryKey: ['taskHistory', { page, limit, status, service, startDate, endDate }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (status) params.append('status', status);
            if (service) params.append('service', service);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`/api/timeline/tasks?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch task history');
            }

            const result: TaskHistoryResponse = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error?.message || 'Failed to fetch task history');
            }

            return result.data.tasks;
        },
        enabled,
        refetchInterval,
        staleTime: 30000, // Consider data fresh for 30 seconds
        retry: 2,
    });
}
