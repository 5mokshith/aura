# AURA Database Migrations

This directory contains Supabase migrations for the AURA (Agentic Unified Reasoning Assistant) system.

## Migration Files

### 001_initial_schema.sql
- Creates initial database schema
- Sets up profiles, workflows, and workflow_history tables
- Establishes RLS policies and triggers

### 002_add_google_oauth_tokens.sql
- Adds Google OAuth token storage to profiles table
- Creates oauth_tokens table for secure token management
- Implements helper functions for token management

### 003_create_user_tokens_table.sql ✨ NEW
- Creates user_tokens table for encrypted OAuth token storage
- Stores access tokens, refresh tokens, and expiration data
- Includes helper functions for token management
- **Requirements**: 6.4, 14.1, 14.2

### 004_create_execution_logs_table.sql ✨ NEW
- Creates execution_logs table for real-time task tracking
- Enables Supabase Realtime for live updates
- Stores detailed agent execution logs with metadata
- Includes filtering and cleanup functions
- **Requirements**: 2.5, 9.2, 14.3, 17.1, 17.2, 17.3

### 005_create_task_history_table.sql ✨ NEW
- Creates task_history table for completed task records
- Stores task results, outputs, and execution metrics
- Includes statistics and filtering functions
- **Requirements**: 5.2, 5.3, 5.4, 5.5

### 006_create_documents_generated_table.sql ✨ NEW
- Creates documents_generated table for tracking created resources
- Links to Google Workspace documents, emails, and calendar events
- Includes batch operations and statistics functions
- **Requirements**: 5.3, 10.1, 10.2

## Applying Migrations

### Using Supabase CLI

```bash
# Apply all pending migrations
supabase db push

# Or apply migrations to a specific environment
supabase db push --db-url "postgresql://..."
```

### Manual Application

If you need to apply migrations manually:

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Apply each migration in order
\i supabase/migrations/003_create_user_tokens_table.sql
\i supabase/migrations/004_create_execution_logs_table.sql
\i supabase/migrations/005_create_task_history_table.sql
\i supabase/migrations/006_create_documents_generated_table.sql
```

## Database Schema Overview

### user_tokens
Stores encrypted OAuth tokens for Google Workspace integration.
- Encrypted access and refresh tokens
- Token expiration tracking
- Multi-provider support

### execution_logs
Real-time execution logs for agent operations.
- Task and step tracking
- Agent type identification (planner, worker, evaluator)
- Log levels (info, success, error, warning)
- Realtime-enabled for live updates

### task_history
Historical record of all executed tasks.
- Task status and results
- Output summaries and links
- Google services used
- Execution duration metrics

### documents_generated
Tracks all documents created by AURA agents.
- Google Docs, Sheets, emails, calendar events
- Direct links to resources
- Task association

## Helper Functions

Each table includes helper functions for common operations:

### user_tokens
- `upsert_user_tokens()` - Insert or update tokens
- `get_user_tokens()` - Retrieve tokens with expiration check
- `delete_user_tokens()` - Remove tokens for disconnect

### execution_logs
- `insert_execution_log()` - Add new log entry
- `get_execution_logs_by_task()` - Get logs for specific task
- `get_execution_logs_filtered()` - Advanced filtering
- `delete_old_execution_logs()` - Cleanup old logs

### task_history
- `insert_task_history()` - Create task record
- `update_task_history_status()` - Update task status
- `get_task_history_filtered()` - Filter by status, service, date
- `get_recent_task_history()` - Get recent tasks
- `get_task_statistics()` - Usage statistics

### documents_generated
- `insert_generated_document()` - Add document record
- `get_documents_by_task()` - Get all documents for a task
- `get_documents_by_type()` - Filter by document type
- `batch_insert_generated_documents()` - Bulk insert
- `get_document_statistics()` - Document statistics

## Security Features

All tables include:
- ✅ Row Level Security (RLS) enabled
- ✅ User-scoped policies (users can only access their own data)
- ✅ Secure function execution with SECURITY DEFINER
- ✅ Proper foreign key constraints with CASCADE delete
- ✅ Optimized indexes for query performance

## Realtime Support

The `execution_logs` table is enabled for Supabase Realtime, allowing clients to subscribe to live updates:

```typescript
// Example: Subscribe to execution logs
const channel = supabase
  .channel('execution_logs')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'execution_logs' },
    (payload) => {
      console.log('New log:', payload.new);
    }
  )
  .subscribe();
```

## Testing Migrations

After applying migrations, verify the schema:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_tokens', 'execution_logs', 'task_history', 'documents_generated');

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('user_tokens', 'execution_logs', 'task_history', 'documents_generated');

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Check Realtime publication
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

## Rollback

If you need to rollback these migrations:

```sql
-- Drop tables in reverse order (respects foreign keys)
DROP TABLE IF EXISTS public.documents_generated CASCADE;
DROP TABLE IF EXISTS public.task_history CASCADE;
DROP TABLE IF EXISTS public.execution_logs CASCADE;
DROP TABLE IF EXISTS public.user_tokens CASCADE;
```

## Next Steps

After applying these migrations:

1. ✅ Verify all tables are created
2. ✅ Test RLS policies with authenticated users
3. ✅ Verify Realtime is working for execution_logs
4. ✅ Test helper functions
5. ✅ Set up encryption keys for token storage
6. ✅ Configure Supabase client in your application

## Support

For issues or questions about these migrations, refer to:
- Design document: `.kiro/specs/aura-ui-system/design.md`
- Requirements: `.kiro/specs/aura-ui-system/requirements.md`
- Supabase documentation: https://supabase.com/docs
