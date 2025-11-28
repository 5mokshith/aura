-- 010_migrate_user_ids_to_text.sql
-- Migrate user_id columns from Supabase Auth UUIDs to TEXT Google user IDs
-- and secure RLS using a custom JWT claim `aura_user_id` (no auth.uid() usage).

-- Helper: current_aura_user_id() reads the JWT claim 'aura_user_id'.
-- Returns NULL if no JWT or claim is present.
CREATE OR REPLACE FUNCTION public.current_aura_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb->>'aura_user_id',
    NULL
  );
$$;

-------------------------------
-- conversations
-------------------------------

-- Drop all existing RLS policies on conversations
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname 
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'conversations'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.conversations;', pol.policyname);
    END LOOP;
END $$;

-- Drop FK to auth.users and convert user_id to TEXT
ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'conversations'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    EXECUTE 'ALTER TABLE public.conversations ALTER COLUMN user_id TYPE TEXT USING user_id::text';
  END IF;
END $$;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Secure policies: allow service role; otherwise enforce ownership via aura_user_id
CREATE POLICY conversations_service_role_all
  ON public.conversations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY conversations_owner_select
  ON public.conversations
  FOR SELECT
  USING (user_id = public.current_aura_user_id());

CREATE POLICY conversations_owner_insert
  ON public.conversations
  FOR INSERT
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY conversations_owner_update
  ON public.conversations
  FOR UPDATE
  USING (user_id = public.current_aura_user_id())
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY conversations_owner_delete
  ON public.conversations
  FOR DELETE
  USING (user_id = public.current_aura_user_id());

-------------------------------
-- documents_generated
-------------------------------

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'documents_generated'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.documents_generated;', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE public.documents_generated
  DROP CONSTRAINT IF EXISTS documents_generated_user_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'documents_generated'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    EXECUTE 'ALTER TABLE public.documents_generated ALTER COLUMN user_id TYPE TEXT USING user_id::text';
  END IF;
END $$;

ALTER TABLE public.documents_generated ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_generated_service_role_all
  ON public.documents_generated
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY documents_generated_owner_select
  ON public.documents_generated
  FOR SELECT
  USING (user_id = public.current_aura_user_id());

CREATE POLICY documents_generated_owner_insert
  ON public.documents_generated
  FOR INSERT
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY documents_generated_owner_update
  ON public.documents_generated
  FOR UPDATE
  USING (user_id = public.current_aura_user_id())
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY documents_generated_owner_delete
  ON public.documents_generated
  FOR DELETE
  USING (user_id = public.current_aura_user_id());

-------------------------------
-- execution_logs
-------------------------------

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'execution_logs'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.execution_logs;', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE public.execution_logs
  DROP CONSTRAINT IF EXISTS execution_logs_user_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'execution_logs'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    EXECUTE 'ALTER TABLE public.execution_logs ALTER COLUMN user_id TYPE TEXT USING user_id::text';
  END IF;
END $$;

ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY execution_logs_service_role_all
  ON public.execution_logs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY execution_logs_owner_select
  ON public.execution_logs
  FOR SELECT
  USING (user_id = public.current_aura_user_id());

CREATE POLICY execution_logs_owner_insert
  ON public.execution_logs
  FOR INSERT
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY execution_logs_owner_update
  ON public.execution_logs
  FOR UPDATE
  USING (user_id = public.current_aura_user_id())
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY execution_logs_owner_delete
  ON public.execution_logs
  FOR DELETE
  USING (user_id = public.current_aura_user_id());

-------------------------------
-- tasks_v2
-------------------------------

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'tasks_v2'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tasks_v2;', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE public.tasks_v2
  DROP CONSTRAINT IF EXISTS tasks_v2_user_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'tasks_v2'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    EXECUTE 'ALTER TABLE public.tasks_v2 ALTER COLUMN user_id TYPE TEXT USING user_id::text';
  END IF;
END $$;

ALTER TABLE public.tasks_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY tasks_v2_service_role_all
  ON public.tasks_v2
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY tasks_v2_owner_select
  ON public.tasks_v2
  FOR SELECT
  USING (user_id = public.current_aura_user_id());

CREATE POLICY tasks_v2_owner_insert
  ON public.tasks_v2
  FOR INSERT
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY tasks_v2_owner_update
  ON public.tasks_v2
  FOR UPDATE
  USING (user_id = public.current_aura_user_id())
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY tasks_v2_owner_delete
  ON public.tasks_v2
  FOR DELETE
  USING (user_id = public.current_aura_user_id());

-------------------------------
-- messages
-------------------------------

-- messages.user_id is already TEXT in the current schema; we just normalize RLS.
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'messages'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.messages;', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_service_role_all
  ON public.messages
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY messages_owner_select
  ON public.messages
  FOR SELECT
  USING (user_id = public.current_aura_user_id());

CREATE POLICY messages_owner_insert
  ON public.messages
  FOR INSERT
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY messages_owner_delete
  ON public.messages
  FOR DELETE
  USING (user_id = public.current_aura_user_id());

-------------------------------
-- user_tokens
-------------------------------

-- user_tokens.user_id is already TEXT and has no FK; normalize RLS only.
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'user_tokens'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_tokens;', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_tokens_service_role_all
  ON public.user_tokens
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY user_tokens_owner_select
  ON public.user_tokens
  FOR SELECT
  USING (user_id = public.current_aura_user_id());

CREATE POLICY user_tokens_owner_insert
  ON public.user_tokens
  FOR INSERT
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY user_tokens_owner_update
  ON public.user_tokens
  FOR UPDATE
  USING (user_id = public.current_aura_user_id())
  WITH CHECK (user_id = public.current_aura_user_id());

CREATE POLICY user_tokens_owner_delete
  ON public.user_tokens
  FOR DELETE
  USING (user_id = public.current_aura_user_id());

-------------------------------
-- task_steps_v2
-------------------------------

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'task_steps_v2'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.task_steps_v2;', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE public.task_steps_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY task_steps_v2_service_role_all
  ON public.task_steps_v2
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Secure task_steps_v2 via ownership derived from the parent task
CREATE POLICY task_steps_v2_owner_select
  ON public.task_steps_v2
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks_v2 t
      WHERE t.id = task_steps_v2.task_uuid
        AND t.user_id = public.current_aura_user_id()
    )
  );

CREATE POLICY task_steps_v2_owner_insert
  ON public.task_steps_v2
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks_v2 t
      WHERE t.id = task_steps_v2.task_uuid
        AND t.user_id = public.current_aura_user_id()
    )
  );

CREATE POLICY task_steps_v2_owner_update
  ON public.task_steps_v2
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks_v2 t
      WHERE t.id = task_steps_v2.task_uuid
        AND t.user_id = public.current_aura_user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks_v2 t
      WHERE t.id = task_steps_v2.task_uuid
        AND t.user_id = public.current_aura_user_id()
    )
  );

CREATE POLICY task_steps_v2_owner_delete
  ON public.task_steps_v2
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks_v2 t
      WHERE t.id = task_steps_v2.task_uuid
        AND t.user_id = public.current_aura_user_id()
    )
  );
