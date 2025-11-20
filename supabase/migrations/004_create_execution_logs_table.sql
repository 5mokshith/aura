-- Create execution_logs table for real-time task execution tracking
-- This table stores detailed logs of agent execution with Realtime support
-- Requirements: 2.5, 9.2, 14.3, 17.1, 17.2, 17.3

CREATE TABLE IF NOT EXISTS public.execution_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id TEXT NOT NULL,
    step_id TEXT,
    agent_type TEXT NOT NULL, -- 'planner' | 'worker' | 'evaluator'
    message TEXT NOT NULL,
    log_level TEXT DEFAULT 'info', -- 'info' | 'success' | 'error' | 'warning'
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_execution_logs_task_id ON public.execution_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_user_id ON public.execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON public.execution_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_logs_agent_type ON public.execution_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_execution_logs_log_level ON public.execution_logs(log_level);

-- Create composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_execution_logs_user_task ON public.execution_logs(user_id, task_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for execution_logs
CREATE POLICY "Users can view their own execution logs"
    ON public.execution_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own execution logs"
    ON public.execution_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own execution logs"
    ON public.execution_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Enable Realtime for real-time log updates
-- This allows clients to subscribe to changes in execution_logs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.execution_logs;

-- Function to insert execution log
CREATE OR REPLACE FUNCTION public.insert_execution_log(
    p_user_id UUID,
    p_task_id TEXT,
    p_step_id TEXT,
    p_agent_type TEXT,
    p_message TEXT,
    p_log_level TEXT DEFAULT 'info',
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.execution_logs (
        user_id,
        task_id,
        step_id,
        agent_type,
        message,
        log_level,
        metadata
    )
    VALUES (
        p_user_id,
        p_task_id,
        p_step_id,
        p_agent_type,
        p_message,
        p_log_level,
        p_metadata
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get execution logs by task ID
CREATE OR REPLACE FUNCTION public.get_execution_logs_by_task(
    p_user_id UUID,
    p_task_id TEXT,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    step_id TEXT,
    agent_type TEXT,
    message TEXT,
    log_level TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        el.id,
        el.task_id,
        el.step_id,
        el.agent_type,
        el.message,
        el.log_level,
        el.metadata,
        el.created_at
    FROM public.execution_logs el
    WHERE el.user_id = p_user_id
    AND el.task_id = p_task_id
    ORDER BY el.created_at ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get execution logs with filters
CREATE OR REPLACE FUNCTION public.get_execution_logs_filtered(
    p_user_id UUID,
    p_task_id TEXT DEFAULT NULL,
    p_agent_type TEXT DEFAULT NULL,
    p_log_level TEXT DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL,
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    step_id TEXT,
    agent_type TEXT,
    message TEXT,
    log_level TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        el.id,
        el.task_id,
        el.step_id,
        el.agent_type,
        el.message,
        el.log_level,
        el.metadata,
        el.created_at
    FROM public.execution_logs el
    WHERE el.user_id = p_user_id
    AND (p_task_id IS NULL OR el.task_id = p_task_id)
    AND (p_agent_type IS NULL OR el.agent_type = p_agent_type)
    AND (p_log_level IS NULL OR el.log_level = p_log_level)
    AND (p_start_date IS NULL OR el.created_at >= p_start_date)
    AND (p_end_date IS NULL OR el.created_at <= p_end_date)
    ORDER BY el.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete execution logs by task ID
CREATE OR REPLACE FUNCTION public.delete_execution_logs_by_task(
    p_user_id UUID,
    p_task_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.execution_logs
    WHERE user_id = p_user_id
    AND task_id = p_task_id;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete old execution logs (for cleanup)
CREATE OR REPLACE FUNCTION public.delete_old_execution_logs(
    p_user_id UUID,
    p_days_old INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.execution_logs
    WHERE user_id = p_user_id
    AND created_at < NOW() - (p_days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
