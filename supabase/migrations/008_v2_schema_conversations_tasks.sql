-- V2 schema: conversations, messages, tasks_v2, task_steps_v2, and augment execution_logs
-- Non-destructive: creates new tables; does not drop existing ones. Apply once you are ready to migrate codepaths.

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' | 'assistant' | 'system'
  type TEXT DEFAULT 'chat', -- 'chat' | 'tool_call' | 'tool_result'
  content TEXT NOT NULL,
  suggested_tasks JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users can delete messages in own conversations" ON public.messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
);

-- Tasks V2
CREATE TABLE IF NOT EXISTS public.tasks_v2 (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  task_id TEXT UNIQUE NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
  input_prompt TEXT NOT NULL,
  output_summary TEXT,
  outputs JSONB,
  google_services TEXT[],
  metadata JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_v2_user_id ON public.tasks_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_v2_status ON public.tasks_v2(status);
CREATE INDEX IF NOT EXISTS idx_tasks_v2_created_at ON public.tasks_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_v2_conversation_id ON public.tasks_v2(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tasks_v2_services ON public.tasks_v2 USING GIN (google_services);

ALTER TABLE public.tasks_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks_v2" ON public.tasks_v2 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks_v2" ON public.tasks_v2 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks_v2" ON public.tasks_v2 FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks_v2" ON public.tasks_v2 FOR DELETE USING (auth.uid() = user_id);

-- Task Steps V2
CREATE TABLE IF NOT EXISTS public.task_steps_v2 (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_uuid UUID REFERENCES public.tasks_v2(id) ON DELETE CASCADE NOT NULL,
  step_id TEXT NOT NULL,
  description TEXT NOT NULL,
  service TEXT,
  action TEXT,
  parameters JSONB,
  dependencies TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_steps_v2_task_uuid ON public.task_steps_v2(task_uuid);
CREATE INDEX IF NOT EXISTS idx_task_steps_v2_step_id ON public.task_steps_v2(step_id);
CREATE INDEX IF NOT EXISTS idx_task_steps_v2_status ON public.task_steps_v2(status);

ALTER TABLE public.task_steps_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view steps of own tasks" ON public.task_steps_v2 FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks_v2 t WHERE t.id = task_uuid AND t.user_id = auth.uid())
);
CREATE POLICY "Users can insert steps of own tasks" ON public.task_steps_v2 FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks_v2 t WHERE t.id = task_uuid AND t.user_id = auth.uid())
);
CREATE POLICY "Users can update steps of own tasks" ON public.task_steps_v2 FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks_v2 t WHERE t.id = task_uuid AND t.user_id = auth.uid())
);
CREATE POLICY "Users can delete steps of own tasks" ON public.task_steps_v2 FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks_v2 t WHERE t.id = task_uuid AND t.user_id = auth.uid())
);

-- Augment execution_logs with conversation_id (optional but helpful)
ALTER TABLE IF EXISTS public.execution_logs
  ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_execution_logs_conversation_id ON public.execution_logs(conversation_id);

-- Enable Realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_steps_v2;
