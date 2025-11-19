# Design Document: Workflow Execution Fixes

## Overview

This design addresses three critical failure points in the workflow execution system:

1. **JSON Parsing Failures**: LLM responses wrapped in markdown code blocks cause `JSON.parse()` to fail
2. **RLS Policy Violations**: Server-side workflow operations fail due to using the anon key instead of service role
3. **Model Configuration Issues**: Invalid Gemini model names cause 404 errors from the API

The solution implements robust JSON extraction, proper Supabase client separation, and model validation with fallback mechanisms.

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     API Route Layer                          │
│  /api/workflow/execute                                       │
│  - Uses Service Role Client for DB operations                │
│  - Handles authentication with Anon Client                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Workflow Service Layer                      │
│  - createAndPlanWorkflow()                                   │
│  - Uses Service Role Client for all DB writes                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     LLM Client Layer                         │
│  - generateWorkflowPlan()                                    │
│  - Validates model names                                     │
│  - Strips markdown from responses                            │
│  - Implements retry logic                                    │
└─────────────────────────────────────────────────────────────┘
```

### Client Separation Strategy

**Two Distinct Supabase Clients:**

1. **Anon Client** (`lib/supabase/client.ts`)
   - Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - For user authentication and client-side operations
   - Subject to RLS policies

2. **Service Role Client** (`lib/supabase/server.ts`)
   - Uses `SUPABASE_SERVICE_ROLE_KEY`
   - For server-side system operations
   - Bypasses RLS policies
   - Never exposed to client

## Components and Interfaces

### 1. Enhanced LLM Client (`lib/llm/client.ts`)

#### Model Validation

```typescript
interface ModelConfig {
  name: string;
  provider: 'gemini' | 'openai';
  isValid: boolean;
  fallback?: string;
}

const VALID_GEMINI_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro'
];

function validateAndGetModel(configuredModel: string): ModelConfig {
  // Check if model exists in valid list
  // Return fallback if invalid
  // Log warning for invalid models
}
```

#### JSON Response Parser

```typescript
function extractJSON(response: string): string {
  // Remove markdown code fences: ```json and ```
  // Handle both ```json and ``` variants
  // Trim whitespace
  // Return clean JSON string
}

function safeJSONParse<T>(response: string, context: string): T {
  try {
    const cleaned = extractJSON(response);
    return JSON.parse(cleaned);
  } catch (error) {
    // Log raw response for debugging
    // Throw descriptive error with context
  }
}
```

#### Retry Logic with Exponential Backoff

```typescript
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  // Implement exponential backoff
  // Retry on 503 errors
  // Preserve original error on final failure
}
```

### 2. Service Role Supabase Client (`lib/supabase/server.ts`)

```typescript
// New file: lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Anon client for auth verification
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

// Service role client for system operations
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
```

### 3. Updated Workflow Service (`lib/services/workflowService.ts`)

```typescript
import { createServiceClient } from '@/lib/supabase/server';

export async function createAndPlanWorkflow(
  userId: string,
  command: string
): Promise<{ workflowId: string; steps: WorkflowStep[] }> {
  // Use service client for all DB operations
  const supabase = createServiceClient();
  
  try {
    // Generate plan with enhanced error handling
    const plan = await generateWorkflowPlan(command);
    
    // Create workflow using service role
    const { data: workflow, error } = await supabase
      .from('workflows')
      .insert({
        user_id: userId,
        command,
        status: 'planning',
        steps: plan.steps,
        results: [],
        start_time: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      workflowId: workflow.id,
      steps: plan.steps,
    };
  } catch (error) {
    // Enhanced error logging
    throw error;
  }
}
```

### 4. Updated Supabase Queries (`lib/supabase/queries.ts`)

```typescript
// All workflow mutation functions accept a Supabase client parameter
// This allows passing the service role client from the caller

export async function createWorkflow(
  client: SupabaseClient,
  data: WorkflowInsert
) {
  const { data: workflow, error } = await client
    .from('workflows')
    .insert(data)
    .select()
    .single();
    
  if (error) throw error;
  return workflow;
}

export async function updateWorkflow(
  client: SupabaseClient,
  id: string,
  updates: WorkflowUpdate
) {
  const { data, error } = await client
    .from('workflows')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

## Data Models

### Environment Variables

```typescript
// Required additions to .env.local
SUPABASE_SERVICE_ROLE_KEY=REDACTED

// LLM Configuration
LLM_PROVIDER=gemini
GOOGLE_GEMINI_API_KEY=your_api_key
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
LLM_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

// Retry Configuration (optional)
LLM_MAX_RETRIES=3
LLM_RETRY_BASE_DELAY=1000
LLM_RETRY_MAX_DELAY=8000
```

### Model Configuration Type

```typescript
interface LLMConfig {
  provider: 'gemini' | 'openai';
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  retryConfig: {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
  };
}
```

## Error Handling

### Error Categories and Responses

1. **Model Configuration Errors**
   - Invalid model name → Log warning, use fallback
   - Missing API key → Throw descriptive error with setup instructions
   - Example: `"Gemini API key not configured. Set GOOGLE_GEMINI_API_KEY in .env.local"`

2. **JSON Parsing Errors**
   - Markdown-wrapped JSON → Strip markers automatically
   - Invalid JSON → Log raw response, throw with context
   - Example: `"Failed to parse workflow plan. Raw response: {...}"`

3. **API Request Errors**
   - 503 Service Unavailable → Retry with exponential backoff
   - 404 Model Not Found → Log error with model name, suggest valid models
   - 401 Unauthorized → Throw with API key validation message
   - Other errors → Log full error, throw with sanitized message

4. **Database Errors**
   - RLS Policy Violation → Should not occur with service client
   - Connection errors → Throw with retry suggestion
   - Validation errors → Pass through with context

### Error Logging Strategy

```typescript
interface ErrorContext {
  operation: string;
  userId?: string;
  workflowId?: string;
  model?: string;
  attempt?: number;
  rawResponse?: string;
}

function logError(error: Error, context: ErrorContext): void {
  console.error(`[${context.operation}] Error:`, {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}
```

## Testing Strategy

### Unit Tests

1. **JSON Extraction Tests** (`lib/llm/client.test.ts`)
   - Test markdown code fence removal
   - Test various fence formats (```json, ```, etc.)
   - Test already-clean JSON
   - Test malformed JSON with good error messages

2. **Model Validation Tests**
   - Test valid model names
   - Test invalid model names with fallback
   - Test missing configuration

3. **Retry Logic Tests**
   - Test successful retry after 503
   - Test exponential backoff timing
   - Test max attempts exhaustion
   - Test non-retryable errors

### Integration Tests

1. **Workflow Creation Flow**
   - Test end-to-end workflow creation
   - Verify service role client usage
   - Verify RLS bypass
   - Test with authenticated user

2. **LLM Response Handling**
   - Test with real Gemini API responses
   - Test markdown-wrapped responses
   - Test retry on transient failures

### Manual Testing Checklist

- [ ] Create workflow with valid command
- [ ] Verify workflow appears in database
- [ ] Check that user_id is correctly set
- [ ] Test with markdown-wrapped LLM response
- [ ] Test with invalid model name (should fallback)
- [ ] Test with missing API key (should error clearly)
- [ ] Test retry logic by simulating 503 error
- [ ] Verify service role key is never exposed to client

## Implementation Notes

### Migration Path

1. **Phase 1: Service Role Client**
   - Create `lib/supabase/server.ts` with both clients
   - Update workflow service to use service client
   - Update API routes to use service client for mutations
   - Keep anon client for auth verification

2. **Phase 2: JSON Parsing**
   - Add `extractJSON()` helper function
   - Update `generateWorkflowPlan()` to use safe parser
   - Update `parseCommand()` to use safe parser
   - Add error logging for debugging

3. **Phase 3: Model Validation**
   - Add model validation constants
   - Implement `validateAndGetModel()` function
   - Update client initialization to validate model
   - Add fallback logic with warnings

4. **Phase 4: Retry Logic**
   - Implement `withRetry()` utility
   - Wrap Gemini API calls with retry logic
   - Configure retry parameters from environment
   - Add retry attempt logging

### Security Considerations

- **Service Role Key Protection**
  - Never log the service role key
  - Never send to client
  - Only use in server-side code
  - Verify `.env.local` is in `.gitignore`

- **User Authorization**
  - Always verify user authentication with anon client
  - Pass verified user ID to service operations
  - Never trust client-provided user IDs

### Performance Considerations

- **Retry Delays**: Exponential backoff prevents API hammering
- **Model Fallback**: Automatic fallback prevents complete failure
- **Error Logging**: Structured logging aids debugging without performance impact

## Dependencies

### New Dependencies
None - uses existing packages

### Updated Dependencies
- `@supabase/ssr` - Already installed
- `@google/generative-ai` - Already installed

## Rollback Plan

If issues arise:

1. **Service Client Issues**
   - Revert to anon client temporarily
   - Disable RLS policies on workflows table (not recommended)
   - Investigate service role key configuration

2. **JSON Parsing Issues**
   - Add more robust markdown detection
   - Implement multiple parsing strategies
   - Add manual JSON cleanup step

3. **Model Issues**
   - Hard-code known working model
   - Remove validation temporarily
   - Use OpenAI as fallback provider

## Success Metrics

- ✅ Zero RLS policy violation errors
- ✅ Zero JSON parsing errors from markdown
- ✅ Successful fallback on invalid model names
- ✅ Successful retry on 503 errors
- ✅ Clear error messages for configuration issues
- ✅ No service role key exposure to client

