# AURA Agent System

This directory contains the complete agent orchestration system for AURA (Agentic Unified Reasoning Assistant).

## Architecture

The agent system consists of three main components:

### 1. Planner Agent (`planner.ts`)
- **Purpose**: Decomposes user prompts into executable steps
- **Technology**: Gemini 2.0 Flash Exp
- **Key Features**:
  - Natural language understanding
  - Task decomposition into atomic steps
  - Google service identification
  - Dependency management
  - Structured JSON output

### 2. Worker Agents (`workers/`)
Specialized agents for each Google Workspace service:

- **Gmail Worker** (`workers/gmail.ts`)
  - Send emails with attachments
  - Search emails with queries
  - Read email content

- **Drive Worker** (`workers/drive.ts`)
  - Search files
  - Download file content
  - Upload files to Drive

- **Docs Worker** (`workers/docs.ts`)
  - Create documents with formatted content
  - Update existing documents
  - Read document content

- **Sheets Worker** (`workers/sheets.ts`)
  - Read spreadsheet data
  - Append rows
  - Update cell values

- **Calendar Worker** (`workers/calendar.ts`)
  - Create events with attendees
  - List upcoming events
  - Delete events

### 3. Evaluator Agent (`evaluator.ts`)
- **Purpose**: Validates task execution results
- **Technology**: Gemini 2.0 Flash Exp (lower temperature for consistency)
- **Key Features**:
  - Quick validation (fast path)
  - Deep AI-powered evaluation
  - Failure identification
  - Retry suggestions
  - Result summarization

## API Routes

### POST /api/agent/plan
Decomposes user prompt into executable steps.

**Request:**
```json
{
  "prompt": "Send an email to team@company.com with the Q4 report",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task_1234567890_abc123",
    "steps": [
      {
        "id": "step_1",
        "description": "Search for Q4 report in Drive",
        "status": "pending",
        "agent": "worker",
        "googleService": "drive"
      },
      {
        "id": "step_2",
        "description": "Send email with report attachment",
        "status": "pending",
        "agent": "worker",
        "googleService": "gmail"
      }
    ]
  }
}
```

### POST /api/agent/execute
Executes planned task steps sequentially.

**Request:**
```json
{
  "taskId": "task_1234567890_abc123",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task_1234567890_abc123",
    "status": "completed",
    "outputs": [
      {
        "type": "file",
        "title": "Q4 Report.pdf",
        "googleId": "file_xyz",
        "url": "https://drive.google.com/..."
      },
      {
        "type": "email",
        "title": "Email: Q4 Report",
        "googleId": "msg_abc"
      }
    ]
  }
}
```

### POST /api/agent/evaluate
Validates task execution results.

**Request:**
```json
{
  "taskId": "task_1234567890_abc123",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "issues": [],
    "suggestions": [],
    "summary": "Task completed successfully with 2 steps."
  }
}
```

### GET /api/agent/logs
Retrieves execution logs with filtering.

**Query Parameters:**
- `userId` (required)
- `taskId` (optional)
- `agentType` (optional): planner, worker, evaluator
- `startDate` (optional)
- `endDate` (optional)
- `limit` (optional, default: 100)
- `offset` (optional, default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123",
        "timestamp": "2025-01-15T10:30:00Z",
        "agent": "planner",
        "message": "Task planned: Send Q4 report with 2 steps",
        "level": "info"
      }
    ],
    "totalCount": 15
  }
}
```

## Storage

Task plans and execution state are stored in Supabase:

- **task_history**: Main task records with status and metadata
- **execution_logs**: Detailed step-by-step execution logs
- **documents_generated**: References to created Google Workspace resources

The `storage.ts` module provides utilities for:
- Saving task plans
- Retrieving task plans
- Updating task status

## Error Handling

All agents implement comprehensive error handling:

1. **Validation Errors**: Missing parameters, invalid input
2. **Authentication Errors**: Token expiration, invalid credentials
3. **API Errors**: Rate limits, network failures
4. **Execution Errors**: Step failures, dependency issues

Errors are logged to Supabase and returned with user-friendly messages.

## Retry Logic

The execution system includes automatic retry for transient failures:
- Maximum 2 retries per step
- Exponential backoff (1s, 2s)
- Only retries network/timeout errors
- Logs all retry attempts

## Usage Example

```typescript
import { plannerAgent, evaluatorAgent, getWorker } from '@/app/lib/agents';

// Plan a task
const plan = await plannerAgent.planTask(
  "Create a Google Doc with meeting notes",
  "user_123"
);

// Execute steps
const worker = getWorker('docs');
const result = await worker.executeStep(plan.steps[0], "user_123");

// Evaluate results
const evaluation = await evaluatorAgent.evaluateResults(plan, [result]);
```

## Dependencies

- `@google/generative-ai`: Gemini AI integration
- `googleapis`: Google Workspace APIs
- `@supabase/supabase-js`: Database and realtime
- Custom utilities: crypto, auth, error handling

## Future Enhancements

1. Parallel step execution for independent steps
2. Streaming execution updates via Server-Sent Events
3. Step result caching for repeated operations
4. Advanced dependency resolution
5. Multi-agent collaboration
6. Learning from execution history
