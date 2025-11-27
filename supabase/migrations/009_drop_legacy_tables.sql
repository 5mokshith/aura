-- Danger: This migration drops legacy tables. Run only after verifying V2 is fully adopted.
-- Drops: task_history, workflow_history, workflows, and related enum type.

BEGIN;

-- Drop legacy tables if they exist
DROP TABLE IF EXISTS public.task_history CASCADE;
DROP TABLE IF EXISTS public.workflow_history CASCADE;
DROP TABLE IF EXISTS public.workflows CASCADE;

-- Drop legacy enum type if unused
DROP TYPE IF EXISTS public.workflow_status;

COMMIT;
