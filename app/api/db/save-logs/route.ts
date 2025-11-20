import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';

/**
 * POST /api/db/save-logs
 * 
 * Insert execution logs to Supabase execution_logs table
 * Supports metadata JSON and triggers Realtime updates
 * 
 * Requirements: 14.3, 17.1
 */

interface SaveLogsRequest {
  userId: string;
  taskId: string;
  stepId?: string;
  agentType: 'planner' | 'worker' | 'evaluator';
  message: string;
  logLevel?: 'info' | 'success' | 'error';
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveLogsRequest = await request.json();
    const { userId, taskId, stepId, agentType, message, logLevel = 'info', metadata } = body;

    // Validate required fields
    if (!userId || !taskId || !agentType || !message) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: userId, taskId, agentType, message',
          },
        },
        { status: 400 }
      );
    }

    // Validate agentType
    const validAgentTypes = ['planner', 'worker', 'evaluator'];
    if (!validAgentTypes.includes(agentType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_AGENT_TYPE',
            message: `Invalid agentType. Must be one of: ${validAgentTypes.join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    // Validate logLevel
    const validLogLevels = ['info', 'success', 'error'];
    if (!validLogLevels.includes(logLevel)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_LOG_LEVEL',
            message: `Invalid logLevel. Must be one of: ${validLogLevels.join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    // Create service client for admin operations
    const supabase = createServiceClient();

    // Insert execution log
    // Supabase Realtime will automatically trigger updates for subscribed clients
    const { data, error } = await supabase
      .from('execution_logs')
      .insert({
        user_id: userId,
        task_id: taskId,
        step_id: stepId || null,
        agent_type: agentType,
        message,
        log_level: logLevel,
        metadata: metadata || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving log to Supabase:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to save log',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        logId: data.id,
        taskId: data.task_id,
        stepId: data.step_id,
        agentType: data.agent_type,
        message: data.message,
        logLevel: data.log_level,
        createdAt: data.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/db/save-logs:', error);
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
