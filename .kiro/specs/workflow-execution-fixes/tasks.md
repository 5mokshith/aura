# Implementation Plan

- [x] 1. Create service role Supabase client infrastructure




  - Create new `lib/supabase/server.ts` file with two client functions: `createClient()` for anon auth operations and `createServiceClient()` for system operations that bypass RLS
  - Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local.example` with documentation
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 2. Implement JSON extraction and parsing utilities




  - Add `extractJSON()` function to strip markdown code fences (```json and ```) from LLM responses
  - Add `safeJSONParse()` function that uses `extractJSON()` and provides detailed error logging with raw response content
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Add model validation and fallback logic





  - Define `VALID_GEMINI_MODELS` constant array with supported model names
  - Implement `validateAndGetModel()` function that checks configured model against valid list and returns fallback with warning if invalid
  - Update Gemini client initialization to use validated model name
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. Implement retry logic with exponential backoff





  - Create `withRetry()` utility function that implements exponential backoff for retryable errors
  - Configure retry parameters from environment variables with sensible defaults
  - Wrap Gemini API calls in `geminiChatCompletion()` with retry logic for 503 errors
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. Update LLM client to use enhanced parsing and error handling




  - Replace `JSON.parse()` calls in `parseCommand()` with `safeJSONParse()`
  - Replace `JSON.parse()` calls in `generateWorkflowPlan()` with `safeJSONParse()`
  - Add detailed error logging with model name and attempt number in catch blocks
  - _Requirements: 2.4, 4.1, 4.2, 4.4_

- [x] 6. Update workflow service to use service role client







  - Import `createServiceClient` from `lib/supabase/server`
  - Update `createAndPlanWorkflow()` to use service client for database insert operations
  - Update `updateWorkflowStatus()` to use service client for database update operations
  - Update `recordWorkflowHistory()` to use service client for history insert operations
  - _Requirements: 3.1, 3.2_

- [x] 7. Update workflow API route to use proper client separation







  - Keep anon client usage for `auth.getUser()` authentication check
  - Pass service client to workflow service functions for database mutations
  - Ensure service role key is never exposed in responses or client-side code
  - _Requirements: 3.3, 3.4_
-

- [x] 8. Add comprehensive error logging throughout the workflow execution path










  - Add structured error logging in LLM client with operation context
  - Add error logging in workflow service with user ID and workflow ID context
  - Log retry attempts with attempt number and delay duration
  - Log model validation warnings when fallback is used
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 9. Write integration tests for workflow creation flow



  - Test workflow creation with service role client bypasses RLS policies
  - Test markdown-wrapped JSON responses are parsed correctly
  - Test invalid model names trigger fallback with warning
  - Test 503 errors trigger retry logic with exponential backoff
  - _Requirements: 1.1, 2.1, 3.1, 5.1_

