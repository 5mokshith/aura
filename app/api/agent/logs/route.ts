import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';
import { ApiResponse } from '@/app/types/api';

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  level: string;
  stepId?: string;
  metadata?: any;
}

interface LogsResponse {
  logs: LogEntry[];
  totalCount: number;
}

/**
 * GET /api/agent/logs
 * Query execution logs by task ID, agent type, and date range
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const taskId = searchParams.get('taskId');
    const userId = searchParams.get('userId');
    const agentType = searchParams.get('agentType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate required parameters
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Missing required parameter: userId',
          },
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Build query
    let query = supabase
      .from('execution_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    if (agentType) {
      query = query.eq('agent_type', agentType);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch logs: ${error.message}`);
    }

    // Format logs
    const logs: LogEntry[] = (data || []).map(log => ({
      id: log.id,
      timestamp: log.created_at,
      agent: log.agent_type,
      message: log.message,
      level: log.log_level,
      stepId: log.step_id,
      metadata: log.metadata,
    }));

    const response: LogsResponse = {
      logs,
      totalCount: count || 0,
    };

    return NextResponse.json<ApiResponse<LogsResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/agent/logs:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'LOGS_FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch logs',
          details: error,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent/logs
 * Delete logs for a specific task or user
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const taskId = searchParams.get('taskId');
    const userId = searchParams.get('userId');

    // Validate required parameters
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Missing required parameter: userId',
          },
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Build delete query
    let query = supabase
      .from('execution_logs')
      .delete()
      .eq('user_id', userId);

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    const { error } = await query;

    if (error) {
      throw new Error(`Failed to delete logs: ${error.message}`);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message: taskId 
            ? `Logs deleted for task ${taskId}` 
            : 'All logs deleted for user',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/agent/logs:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'LOGS_DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete logs',
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
