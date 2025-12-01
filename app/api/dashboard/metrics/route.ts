import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';

const SERVICE_KEYS = ['gmail', 'docs', 'drive', 'sheets', 'calendar'] as const;
type ServiceKey = (typeof SERVICE_KEYS)[number];

interface TasksRow {
  created_at: string;
  google_services: string[] | null;
}

interface TokenRow {
  expires_at: string | null;
}

function createEmptyCounts(): Record<ServiceKey, number> {
  return {
    gmail: 0,
    docs: 0,
    drive: 0,
    sheets: 0,
    calendar: 0,
  };
}

function computeTrend(current: number, previous: number): number {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    const supabase = createServiceClient();

    const now = new Date();
    const startCurrent = new Date(now);
    startCurrent.setDate(now.getDate() - 6);
    startCurrent.setHours(0, 0, 0, 0);

    const startPrevious = new Date(startCurrent);
    startPrevious.setDate(startCurrent.getDate() - 7);

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks_v2')
      .select('created_at, google_services')
      .eq('user_id', userId)
      .gte('created_at', startPrevious.toISOString())
      .order('created_at', { ascending: true }) as unknown as { data: TasksRow[] | null; error: any };

    if (tasksError) {
      console.error('Error fetching tasks for dashboard metrics:', tasksError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch tasks for dashboard metrics',
            details: tasksError.message,
          },
        },
        { status: 500 }
      );
    }

    const currentCounts = createEmptyCounts();
    const previousCounts = createEmptyCounts();

    const dailyMap: Record<string, { date: Date; counts: Record<ServiceKey, number> }> = {};

    for (const row of tasks || []) {
      const createdAt = new Date(row.created_at);
      const services = Array.isArray(row.google_services) ? row.google_services : [];

      const bucket = createdAt >= startCurrent ? currentCounts : previousCounts;
      const dateKey = createdAt.toISOString().split('T')[0];

      if (createdAt >= startCurrent) {
        if (!dailyMap[dateKey]) {
          const dayDate = new Date(dateKey + 'T00:00:00Z');
          dailyMap[dateKey] = {
            date: dayDate,
            counts: createEmptyCounts(),
          };
        }
      }

      for (const service of services) {
        const key = service as ServiceKey;
        if (!SERVICE_KEYS.includes(key)) continue;

        bucket[key] = (bucket[key] || 0) + 1;

        if (createdAt >= startCurrent) {
          const entry = dailyMap[dateKey];
          if (entry) {
            entry.counts[key] = (entry.counts[key] || 0) + 1;
          }
        }
      }
    }

    let isConnected = false;

    const { data: tokenRow, error: tokenError } = await supabase
      .from('user_tokens')
      .select('expires_at')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single() as unknown as { data: TokenRow | null; error: any };

    if (tokenError) {
      if (tokenError.code !== 'PGRST116') {
        console.error('Error fetching tokens for dashboard metrics:', tokenError);
      }
    } else if (tokenRow && tokenRow.expires_at) {
      const expiresAt = new Date(tokenRow.expires_at);
      isConnected = expiresAt > now;
    }

    const services = SERVICE_KEYS.map((id) => {
      const current = currentCounts[id] || 0;
      const previous = previousCounts[id] || 0;
      return {
        id,
        count: current,
        trend: computeTrend(current, previous),
        isActive: isConnected,
      };
    });

    const points: Array<{
      day: string;
      Gmail: number;
      'Google Drive': number;
      Calendar: number;
      Docs: number;
      Sheets: number;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startCurrent);
      d.setDate(startCurrent.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const entry = dailyMap[key];
      const counts = entry ? entry.counts : createEmptyCounts();

      points.push({
        day: d.toLocaleDateString(undefined, { weekday: 'short' }),
        Gmail: counts.gmail,
        'Google Drive': counts.drive,
        Calendar: counts.calendar,
        Docs: counts.docs,
        Sheets: counts.sheets,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        services,
        analytics: {
          points,
        },
      },
    });
  } catch (error: any) {
    console.error('Error in /api/dashboard/metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error?.message || 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
