import { NextRequest } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { ApiResponse } from '@/app/types/api';
import type { TaskHistoryItem } from '@/app/components/timeline/TaskCard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 items
    const status = searchParams.get('status');
    const service = searchParams.get('service');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Create Supabase client
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED', 
            message: 'Authentication required' 
          } 
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Build query (V2)
    let query = supabase
      .from('tasks_v2')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (service) {
      query = query.contains('google_services', [service]);
    }

    if (startDate) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(0, 0, 0, 0);
      query = query.gte('created_at', startDateTime.toISOString());
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDateTime.toISOString());
    }

    // Execute query
    const { data: tasks, error: queryError } = await query;

    if (queryError) {
      console.error('Database query error:', queryError);
      return Response.json(
        { 
          success: false, 
          error: { 
            code: 'DATABASE_ERROR', 
            message: 'Failed to fetch task history' 
          } 
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Transform data to match TaskHistoryItem interface
    const transformedTasks: TaskHistoryItem[] = ((tasks as any[]) || []).map((task: any) => ({
      id: task.id,
      task_id: task.task_id,
      title: task.title,
      status: task.status, // 'success' | 'failed' | 'pending' | 'running' | 'cancelled' | 'rerun'
      input_prompt: task.input_prompt,
      output_summary: task.output_summary,
      outputs: task.outputs || [],
      google_services: task.google_services || [],
      duration_ms: task.duration_ms,
      created_at: task.created_at,
      completed_at: task.completed_at,
    }));

    // Get total count for pagination info (optional)
    let totalCount = null;
    if (page === 0) {
      let countQuery = supabase
        .from('tasks_v2')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Apply same filters for count
      if (status) {
        countQuery = countQuery.eq('status', status);
      }
      if (service) {
        countQuery = countQuery.contains('google_services', [service]);
      }
      if (startDate) {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        countQuery = countQuery.gte('created_at', startDateTime.toISOString());
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        countQuery = countQuery.lte('created_at', endDateTime.toISOString());
      }

      const { count } = await countQuery;
      totalCount = count;
    }

    return Response.json({
      success: true,
      data: {
        tasks: transformedTasks,
        pagination: {
          page,
          limit,
          hasMore: transformedTasks.length === limit,
          totalCount,
        },
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Timeline API error:', error);
    return Response.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Internal server error' 
        } 
      } as ApiResponse,
      { status: 500 }
    );
  }
}