-- Create user_tokens table for storing encrypted OAuth tokens
-- This table stores Google OAuth tokens with encryption for enhanced security
-- Requirements: 6.4, 14.1, 14.2

CREATE TABLE IF NOT EXISTS public.user_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL DEFAULT 'google',
    access_token TEXT NOT NULL, -- Encrypted with AES-256-GCM
    refresh_token TEXT NOT NULL, -- Encrypted with AES-256-GCM
    expires_at TIMESTAMPTZ NOT NULL,
    scopes TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON public.user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_expires_at ON public.user_tokens(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_tokens
CREATE POLICY "Users can view their own tokens"
    ON public.user_tokens FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
    ON public.user_tokens FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
    ON public.user_tokens FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
    ON public.user_tokens FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_tokens_updated_at
    BEFORE UPDATE ON public.user_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to upsert user tokens
CREATE OR REPLACE FUNCTION public.upsert_user_tokens(
    p_user_id UUID,
    p_provider TEXT,
    p_access_token TEXT,
    p_refresh_token TEXT,
    p_expires_at TIMESTAMPTZ,
    p_scopes TEXT[]
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.user_tokens (
        user_id,
        provider,
        access_token,
        refresh_token,
        expires_at,
        scopes
    )
    VALUES (
        p_user_id,
        p_provider,
        p_access_token,
        p_refresh_token,
        p_expires_at,
        p_scopes
    )
    ON CONFLICT (user_id, provider)
    DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        scopes = EXCLUDED.scopes,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user tokens
CREATE OR REPLACE FUNCTION public.get_user_tokens(p_user_id UUID, p_provider TEXT DEFAULT 'google')
RETURNS TABLE (
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    scopes TEXT[],
    is_expired BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ut.access_token,
        ut.refresh_token,
        ut.expires_at,
        ut.scopes,
        (ut.expires_at < NOW()) as is_expired
    FROM public.user_tokens ut
    WHERE ut.user_id = p_user_id
    AND ut.provider = p_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user tokens (for disconnect)
CREATE OR REPLACE FUNCTION public.delete_user_tokens(p_user_id UUID, p_provider TEXT DEFAULT 'google')
RETURNS void AS $$
BEGIN
    DELETE FROM public.user_tokens
    WHERE user_id = p_user_id
    AND provider = p_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
