import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';

/**
 * GET /api/db/storage-metrics
 * 
 * Query Supabase for storage metrics including logs count, task history count, and documents count
 * 
 * Requirements: 7.4
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate required parameter
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required parameter: userId',
          },
        },
        { status: 400 }
      );
    }

    // Validate userId is a UUID; if not, return empty counts to avoid UUID casting errors
    const isUuid = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    if (!isUuid(userId || undefined)) {
      return NextResponse.json({
        success: true,
        data: {
          logsCount: 0,
          logsSize: 0,
          taskHistoryCount: 0,
          documentsCount: 0,
          totalSize: 0,
        },
      });
    }

    // Create service client for admin operations
    const supabase = createServiceClient();

    // Query execution logs count
    const { count: logsCount, error: logsError } = await supabase
      .from('execution_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (logsError) {
      console.error('Error counting execution logs:', logsError);
    }

    // Query tasks count (V2)
    const { count: taskHistoryCount, error: taskHistoryError } = await supabase
      .from('tasks_v2')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (taskHistoryError) {
      console.error('Error counting task history:', taskHistoryError);
    }

    // Query documents generated count
    const { count: documentsCount, error: documentsError } = await supabase
      .from('documents_generated')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (documentsError) {
      console.error('Error counting documents:', documentsError);
    }

    // Estimate storage size (rough calculation)
    // Average log entry: ~500 bytes
    // Average task entry: ~1KB
    // Average document entry: ~200 bytes
    const logsSize = (logsCount || 0) * 500;
    const taskHistorySize = (taskHistoryCount || 0) * 1024;
    const documentsSize = (documentsCount || 0) * 200;
    const totalSize = logsSize + taskHistorySize + documentsSize;

    return NextResponse.json({
      success: true,
      data: {
        logsCount: logsCount || 0,
        logsSize,
        taskHistoryCount: taskHistoryCount || 0,
        documentsCount: documentsCount || 0,
        totalSize,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/db/storage-metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
