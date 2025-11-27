-- Add metadata column for storing plan steps and title in task_history
ALTER TABLE IF EXISTS public.task_history
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Optional: GIN index on metadata for querying
CREATE INDEX IF NOT EXISTS idx_task_history_metadata ON public.task_history USING GIN (metadata);
