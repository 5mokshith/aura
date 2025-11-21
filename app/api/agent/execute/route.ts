import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command } = body;

    if (!command) {
      return Response.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Command is required'
          }
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Create standard Supabase client for auth check
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Fallback to demo user if not authenticated
    const userId = user?.id || 'demo-user-id';

    // Determine which client to use for DB operations
    let dbClient = supabase;

    // If using demo user, we MUST use the service role key to bypass RLS
    console.log('User:', user?.id);
    console.log('Has Service Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Creating admin client...');
      dbClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      ) as any; // Cast to any to avoid type mismatch with ssr client
    }

    // If you want to enforce auth strictly, uncomment this:
    /*
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
    */

    // 1. Create initial task record
    const taskId = `task_${Date.now()}`;
    const { data: task, error: insertError } = await dbClient
      .from('task_history')
      .insert({
        user_id: userId,
        task_id: taskId,
        title: command.length > 50 ? `${command.substring(0, 50)}...` : command,
        status: 'in-progress',
        input_prompt: command,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Task creation error:', insertError);
      return Response.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create task',
            details: insertError
          }
        } as ApiResponse,
        { status: 500 }
      );
    }

    // 2. Simulate Agent Processing (Delay)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Update task to success with dummy output
    const { data: updatedTask, error: updateError } = await dbClient
      .from('task_history')
      .update({
        status: 'success',
        output_summary: `Successfully executed command: "${command}"`,
        completed_at: new Date().toISOString(),
        duration_ms: 2000,
        google_services: ['gmail', 'calendar'] // Dummy services
      })
      .eq('id', task.id)
      .select()
      .single();

    if (updateError) {
      console.error('Task update error:', updateError);
      // Return the initial task if update fails, but with error note
      return Response.json({
        success: true,
        data: task
      } as ApiResponse);
    }

    return Response.json({
      success: true,
      data: updatedTask
    } as ApiResponse);

  } catch (error) {
    console.error('Execute API error:', error);
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
