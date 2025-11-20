-- Create documents_generated table for tracking generated Google Workspace documents
-- This table stores references to all documents created by AURA agents
-- Requirements: 5.3, 10.1, 10.2

CREATE TABLE IF NOT EXISTS public.documents_generated (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'doc' | 'sheet' | 'email' | 'calendar_event' | 'file'
    google_id TEXT, -- Google resource ID (document ID, file ID, event ID, message ID)
    title TEXT,
    url TEXT, -- Direct link to the resource
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_generated_user_id ON public.documents_generated(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_generated_task_id ON public.documents_generated(task_id);
CREATE INDEX IF NOT EXISTS idx_documents_generated_document_type ON public.documents_generated(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_generated_created_at ON public.documents_generated(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_generated_google_id ON public.documents_generated(google_id);

-- Create composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_documents_generated_user_task ON public.documents_generated(user_id, task_id);
CREATE INDEX IF NOT EXISTS idx_documents_generated_user_type ON public.documents_generated(user_id, document_type, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.documents_generated ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents_generated
CREATE POLICY "Users can view their own generated documents"
    ON public.documents_generated FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated documents"
    ON public.documents_generated FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated documents"
    ON public.documents_generated FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated documents"
    ON public.documents_generated FOR DELETE
    USING (auth.uid() = user_id);

-- Function to insert generated document
CREATE OR REPLACE FUNCTION public.insert_generated_document(
    p_user_id UUID,
    p_task_id TEXT,
    p_document_type TEXT,
    p_google_id TEXT,
    p_title TEXT,
    p_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_document_id UUID;
BEGIN
    INSERT INTO public.documents_generated (
        user_id,
        task_id,
        document_type,
        google_id,
        title,
        url
    )
    VALUES (
        p_user_id,
        p_task_id,
        p_document_type,
        p_google_id,
        p_title,
        p_url
    )
    RETURNING id INTO v_document_id;
    
    RETURN v_document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get documents by task ID
CREATE OR REPLACE FUNCTION public.get_documents_by_task(
    p_user_id UUID,
    p_task_id TEXT
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    document_type TEXT,
    google_id TEXT,
    title TEXT,
    url TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dg.id,
        dg.task_id,
        dg.document_type,
        dg.google_id,
        dg.title,
        dg.url,
        dg.created_at
    FROM public.documents_generated dg
    WHERE dg.user_id = p_user_id
    AND dg.task_id = p_task_id
    ORDER BY dg.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get documents by type
CREATE OR REPLACE FUNCTION public.get_documents_by_type(
    p_user_id UUID,
    p_document_type TEXT,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    document_type TEXT,
    google_id TEXT,
    title TEXT,
    url TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dg.id,
        dg.task_id,
        dg.document_type,
        dg.google_id,
        dg.title,
        dg.url,
        dg.created_at
    FROM public.documents_generated dg
    WHERE dg.user_id = p_user_id
    AND dg.document_type = p_document_type
    ORDER BY dg.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent documents
CREATE OR REPLACE FUNCTION public.get_recent_documents(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    document_type TEXT,
    google_id TEXT,
    title TEXT,
    url TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dg.id,
        dg.task_id,
        dg.document_type,
        dg.google_id,
        dg.title,
        dg.url,
        dg.created_at
    FROM public.documents_generated dg
    WHERE dg.user_id = p_user_id
    ORDER BY dg.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get documents with filters
CREATE OR REPLACE FUNCTION public.get_documents_filtered(
    p_user_id UUID,
    p_document_type TEXT DEFAULT NULL,
    p_task_id TEXT DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    task_id TEXT,
    document_type TEXT,
    google_id TEXT,
    title TEXT,
    url TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dg.id,
        dg.task_id,
        dg.document_type,
        dg.google_id,
        dg.title,
        dg.url,
        dg.created_at
    FROM public.documents_generated dg
    WHERE dg.user_id = p_user_id
    AND (p_document_type IS NULL OR dg.document_type = p_document_type)
    AND (p_task_id IS NULL OR dg.task_id = p_task_id)
    AND (p_start_date IS NULL OR dg.created_at >= p_start_date)
    AND (p_end_date IS NULL OR dg.created_at <= p_end_date)
    ORDER BY dg.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete document record
CREATE OR REPLACE FUNCTION public.delete_generated_document(
    p_user_id UUID,
    p_document_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_deleted BOOLEAN;
BEGIN
    DELETE FROM public.documents_generated
    WHERE user_id = p_user_id
    AND id = p_document_id;
    
    GET DIAGNOSTICS v_deleted = FOUND;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete documents by task ID
CREATE OR REPLACE FUNCTION public.delete_documents_by_task(
    p_user_id UUID,
    p_task_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.documents_generated
    WHERE user_id = p_user_id
    AND task_id = p_task_id;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get document statistics
CREATE OR REPLACE FUNCTION public.get_document_statistics(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_documents INTEGER,
    docs_count INTEGER,
    sheets_count INTEGER,
    emails_count INTEGER,
    calendar_events_count INTEGER,
    files_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_documents,
        COUNT(*) FILTER (WHERE document_type = 'doc')::INTEGER as docs_count,
        COUNT(*) FILTER (WHERE document_type = 'sheet')::INTEGER as sheets_count,
        COUNT(*) FILTER (WHERE document_type = 'email')::INTEGER as emails_count,
        COUNT(*) FILTER (WHERE document_type = 'calendar_event')::INTEGER as calendar_events_count,
        COUNT(*) FILTER (WHERE document_type = 'file')::INTEGER as files_count
    FROM public.documents_generated
    WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to batch insert generated documents
CREATE OR REPLACE FUNCTION public.batch_insert_generated_documents(
    p_user_id UUID,
    p_task_id TEXT,
    p_documents JSONB -- Array of {document_type, google_id, title, url}
)
RETURNS INTEGER AS $$
DECLARE
    v_document JSONB;
    v_inserted_count INTEGER := 0;
BEGIN
    FOR v_document IN SELECT * FROM jsonb_array_elements(p_documents)
    LOOP
        INSERT INTO public.documents_generated (
            user_id,
            task_id,
            document_type,
            google_id,
            title,
            url
        )
        VALUES (
            p_user_id,
            p_task_id,
            v_document->>'document_type',
            v_document->>'google_id',
            v_document->>'title',
            v_document->>'url'
        );
        
        v_inserted_count := v_inserted_count + 1;
    END LOOP;
    
    RETURN v_inserted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
