-- Create task_history table for storing completed task information
-- This table stores historical records of all executed tasks with their results
-- Requirements: 5.2, 5.3, 5.4, 5.5

CREATE TABLE IF NOT EXISTS public.task_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success' | 'failed' | 'rerun' | 'cancelled'
    input_prompt TEXT NOT NULL,
    output_summary TEXT,
    outputs JSONB, -- Array of output objects with links to created resources
    google_services TEXT[], -- Array of services used: ['gmail', 'drive', 'docs', 'sheets', 'calendar']
    duration_ms INTEGER, -- Task execution duration in milliseconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_task_history_user_id ON public.task_history(user_id);
CREATE INDEX IF NOT EXISTS idx_task_history_status ON public.task_history(status);
CREATE INDEX IF NOT EXISTS idx_task_history_created_at ON public.task_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_history_completed_at ON public.task_history(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_history_task_id ON public.task_history(task_id);

-- Create composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_task_history_user_status_created ON public.task_history(user_id, status, created_at DESC);

-- Create GIN index for JSONB outputs column for efficient querying
CREATE INDEX IF NOT EXISTS idx_task_history_outputs ON public.task_history USING GIN (outputs);

-- Create GIN index for google_services array
CREATE INDEX IF NOT EXISTS idx_task_history_google_services ON public.task_history USING GIN (google_services);

-- Enable Row Level Security (RLS)
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_history
CREATE POLICY "Users can view their own task history"
    ON public.task_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own task history"
    ON public.task_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task history"
    ON public.task_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task history"
    ON public.task_history FOR DELETE
    USING (auth.uid() = user_id);

-- Function to insert task history
CREATE OR REPLACE FUNCTION public.insert_task_history(
    p_user_id UUID,
    p_task_id TEXT,
    p_title TEXT,
    p_status TEXT,
    p_input_prompt TEXT,
    p_output_summary TEXT DEFAULT NULL,
    p_outputs JSONB DEFAULT NULL,
    p_google_services TEXT[] DEFAULT NULL,
    p_duration_ms INTEGER DEFAULT NULL,
    p_completed_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
    v_history_id UUID;
BEGIN
    INSERT INTO public.task_history (
        user_id,
        task_id,
        title,
        status,
        input_prompt,
        output_summary,
        outputs,
        google_services,
        duration_ms,
        completed_at
    )
    VALUES (
        p_user_id,
        p_task_id,
        p_title,
        p_status,
        p_input_prompt,
        p_output_summary,
        p_outputs,
        p_google_services,
        p_duration_ms,
        p_completed_at
    )
    RETURNING id INTO v_history_id;
    
    RETURN v_history_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update task history status
CREATE OR REPLACE FUNCTION public.update_task_history_status(
    p_user_id UUID,
    p_task_id TEXT,
    p_status TEXT,
    p_output_summary TEXT DEFAULT NULL,
    p_outputs JSONB DEFAULT NULL,
    p_duration_ms INTEGER DEFAULT NULL,
    p_completed_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS BOOLEAN AS $$
DECLARE
    v_updated BOOLEAN;
BEGIN
    UPDATE public.task_history
    SET 
        status = p_status,
        output_summary = COALESCE(p_output_summary, output_summary),
        outputs = COALESCE(p_outputs, outputs),
        duration_ms = COALESCE(p_duration_ms, duration_ms),
        completed_at = p_completed_at
    WHERE user_id = p_user_id
    AND task_id = p_task_id;
    
    GET DIAGNOSTICS v_updated = FOUND;
    RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get task history with filters
CREATE OR REPLACE FUNCTION public.get_task_history_filtered(
    p_user_id UUID,
    p_status TEXT DEFAULT NULL,
    p_google_service TEXT DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    title TEXT,
    status TEXT,
    input_prompt TEXT,
    output_summary TEXT,
    outputs JSONB,
    google_services TEXT[],
    duration_ms INTEGER,
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        th.id,
        th.task_id,
        th.title,
        th.status,
        th.input_prompt,
        th.output_summary,
        th.outputs,
        th.google_services,
        th.duration_ms,
        th.created_at,
        th.completed_at
    FROM public.task_history th
    WHERE th.user_id = p_user_id
    AND (p_status IS NULL OR th.status = p_status)
    AND (p_google_service IS NULL OR p_google_service = ANY(th.google_services))
    AND (p_start_date IS NULL OR th.created_at >= p_start_date)
    AND (p_end_date IS NULL OR th.created_at <= p_end_date)
    ORDER BY th.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent task history
CREATE OR REPLACE FUNCTION public.get_recent_task_history(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    title TEXT,
    status TEXT,
    output_summary TEXT,
    google_services TEXT[],
    duration_ms INTEGER,
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        th.id,
        th.task_id,
        th.title,
        th.status,
        th.output_summary,
        th.google_services,
        th.duration_ms,
        th.created_at,
        th.completed_at
    FROM public.task_history th
    WHERE th.user_id = p_user_id
    ORDER BY th.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get task history by task ID
CREATE OR REPLACE FUNCTION public.get_task_history_by_id(
    p_user_id UUID,
    p_task_id TEXT
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    title TEXT,
    status TEXT,
    input_prompt TEXT,
    output_summary TEXT,
    outputs JSONB,
    google_services TEXT[],
    duration_ms INTEGER,
    created_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        th.id,
        th.task_id,
        th.title,
        th.status,
        th.input_prompt,
        th.output_summary,
        th.outputs,
        th.google_services,
        th.duration_ms,
        th.created_at,
        th.completed_at
    FROM public.task_history th
    WHERE th.user_id = p_user_id
    AND th.task_id = p_task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete task history
CREATE OR REPLACE FUNCTION public.delete_task_history(
    p_user_id UUID,
    p_task_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_deleted BOOLEAN;
BEGIN
    DELETE FROM public.task_history
    WHERE user_id = p_user_id
    AND task_id = p_task_id;
    
    GET DIAGNOSTICS v_deleted = FOUND;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get task statistics
CREATE OR REPLACE FUNCTION public.get_task_statistics(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_tasks INTEGER,
    successful_tasks INTEGER,
    failed_tasks INTEGER,
    avg_duration_ms INTEGER,
    most_used_service TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*)::INTEGER as total,
            COUNT(*) FILTER (WHERE status = 'success')::INTEGER as success,
            COUNT(*) FILTER (WHERE status = 'failed')::INTEGER as failed,
            AVG(duration_ms)::INTEGER as avg_duration
        FROM public.task_history
        WHERE user_id = p_user_id
        AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    ),
    service_usage AS (
        SELECT 
            UNNEST(google_services) as service,
            COUNT(*) as usage_count
        FROM public.task_history
        WHERE user_id = p_user_id
        AND created_at >= NOW() - (p_days || ' days')::INTERVAL
        GROUP BY service
        ORDER BY usage_count DESC
        LIMIT 1
    )
    SELECT 
        s.total,
        s.success,
        s.failed,
        s.avg_duration,
        su.service
    FROM stats s
    LEFT JOIN service_usage su ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
