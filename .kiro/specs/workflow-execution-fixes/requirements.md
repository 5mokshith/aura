# Requirements Document

## Introduction

This specification addresses critical issues preventing workflow execution in the Aura application. The system currently fails to create and execute workflows due to LLM API configuration errors, JSON parsing failures, and database security policy violations. This feature will resolve these issues to enable reliable workflow creation and execution.

## Glossary

- **Workflow System**: The core system that orchestrates multi-step AI-powered tasks using specialized agents
- **LLM Client**: The abstraction layer that communicates with language model APIs (Gemini, OpenAI, etc.)
- **Gemini API**: Google's generative AI API service used for natural language processing
- **RLS Policy**: Row-Level Security policy in Supabase that controls data access at the row level
- **Workflow Plan**: A structured JSON object containing steps, agents, and dependencies for task execution
- **Service Role**: Supabase administrative role with elevated permissions for server-side operations

## Requirements

### Requirement 1

**User Story:** As a developer, I want the LLM client to use the correct Gemini model name, so that API requests succeed without 404 errors

#### Acceptance Criteria

1. WHEN the LLM Client initializes, THE Workflow System SHALL use a valid Gemini model identifier that exists in the API
2. WHEN the environment variable GOOGLE_GEMINI_MODEL is set, THE LLM Client SHALL validate the model name against known valid models
3. IF the configured model name is invalid, THEN THE LLM Client SHALL fall back to a known working model and log a warning
4. THE LLM Client SHALL support both `gemini-2.0-flash-exp` and `gemini-1.5-flash` model identifiers

### Requirement 2

**User Story:** As a developer, I want the workflow plan parser to handle markdown-wrapped JSON responses, so that workflow creation doesn't fail with parsing errors

#### Acceptance Criteria

1. WHEN the LLM returns JSON wrapped in markdown code blocks, THE Workflow System SHALL extract the JSON content before parsing
2. THE Workflow System SHALL remove markdown code fence markers (```json and ```) from LLM responses
3. WHEN JSON parsing fails, THE Workflow System SHALL log the raw response content for debugging
4. THE Workflow System SHALL successfully parse workflow plans regardless of markdown formatting

### Requirement 3

**User Story:** As a system administrator, I want workflow database operations to use the service role key, so that RLS policies don't block legitimate server-side operations

#### Acceptance Criteria

1. WHEN the Workflow API creates a workflow record, THE Workflow System SHALL use the Supabase service role client
2. WHEN the Workflow API updates workflow status, THE Workflow System SHALL use the Supabase service role client
3. THE Workflow System SHALL maintain separate Supabase clients for user operations (anon key) and system operations (service role)
4. THE Workflow System SHALL never expose the service role key to client-side code

### Requirement 4

**User Story:** As a developer, I want clear error messages when LLM requests fail, so that I can quickly diagnose and fix configuration issues

#### Acceptance Criteria

1. WHEN a Gemini API request fails, THE LLM Client SHALL log the complete error message including status code and error details
2. WHEN the API key is missing or invalid, THE LLM Client SHALL throw an error with specific instructions for configuration
3. WHEN the API returns a 503 overload error, THE LLM Client SHALL implement exponential backoff retry logic
4. THE LLM Client SHALL include the attempted model name in error messages

### Requirement 5

**User Story:** As a user, I want the system to handle temporary API unavailability gracefully, so that transient errors don't permanently break my workflows

#### Acceptance Criteria

1. WHEN the Gemini API returns a 503 service unavailable error, THE LLM Client SHALL retry the request up to 3 times
2. THE LLM Client SHALL wait with exponential backoff between retry attempts (1s, 2s, 4s)
3. IF all retries fail, THEN THE LLM Client SHALL return a user-friendly error message
4. THE Workflow System SHALL preserve the user's command input when retries are exhausted

