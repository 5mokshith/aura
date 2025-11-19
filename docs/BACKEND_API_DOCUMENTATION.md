# Backend API Documentation

Complete API documentation for AURA's Next.js backend with Supabase and LLM integration.

## 🎯 Overview

The backend is built using Next.js API routes (Express-style) with:
- **Supabase** for authentication and database
- **OpenAI GPT-4** for LLM-powered workflow planning
- **Server-Sent Events (SSE)** for real-time updates
- **Type-safe** queries and responses

## 🔐 Authentication

All API routes require authentication via Supabase. The user's session is verified using:

```typescript
const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();
```

## 📡 API Routes

### Workflow Execution

#### `POST /api/workflow/execute`
Create and plan a new workflow from a natural language command.

**Request:**
```json
{
  "command": "Send a summary of my unread emails to john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "workflowId": "uuid",
  "steps": [
    {
      "id": "step_1",
      "agentName": "EmailAgent",
      "action": "search_emails",
      "description": "Search for unread emails",
      "status": "pending",
      "order": 0
    }
  ],
  "message": "Workflow created and planned successfully"
}
```

**Validation:**
- Command must be at least 10 characters
- User must have Google OAuth tokens
- Tokens must not be expired

**Process:**
1. Validates user authentication
2. Checks Google OAuth token status
3. Uses LLM to generate workflow plan
4. Creates workflow in database
5. Records in history
6. Returns workflow ID and steps

---

#### `GET /api/workflow/stream?workflowId={id}`
Stream real-time workflow execution updates via Server-Sent Events (SSE).

**Query Parameters:**
- `workflowId` (required): The workflow ID to stream

**Response:** SSE stream with events:

```
event: connected
data: {"type":"connected","workflowId":"uuid"}

event: step_start
data: {"type":"step_start","stepId":"step_1","data":{...}}

event: step_complete
data: {"type":"step_complete","stepId":"step_1","data":{...}}

event: step_error
data: {"type":"step_error","stepId":"step_1","data":{"error":"..."}}

event: workflow_complete
data: {"type":"workflow_complete","data":{"status":"completed"}}
```

**Features:**
- Automatic heartbeat every 30 seconds
- Reconnection support
- Clean disconnection handling

---

#### `POST /api/workflow/cancel`
Cancel a running workflow.

**Request:**
```json
{
  "workflowId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow cancelled successfully",
  "responseTime": 150
}
```

**Performance:**
- Target response time: <200ms
- Logs warning if exceeds target

---

### History Management

#### `GET /api/history`
Get user's workflow history with filtering and pagination.

**Query Parameters:**
- `limit` (optional, default: 20): Number of results
- `offset` (optional, default: 0): Pagination offset
- `status` (optional): Filter by status (success/failed/cancelled)
- `search` (optional): Search in command text
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date (ISO 8601)

**Response:**
```json
{
  "history": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "workflow_id": "uuid",
      "command": "Send email summary",
      "status": "completed",
      "executed_at": "2024-01-01T12:00:00Z",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 45,
    "hasMore": true
  }
}
```

---

#### `GET /api/history/[id]`
Get detailed information about a specific workflow.

**Response:**
```json
{
  "workflow": {
    "id": "uuid",
    "user_id": "uuid",
    "command": "Send email summary",
    "status": "completed",
    "steps": [...],
    "results": [...],
    "start_time": "2024-01-01T12:00:00Z",
    "end_time": "2024-01-01T12:05:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

---

#### `POST /api/history/rerun`
Re-run a previous workflow with the same command.

**Request:**
```json
{
  "workflowId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "workflowId": "new-uuid",
  "steps": [...],
  "message": "Workflow rerun initiated successfully"
}
```

---

### Authentication

#### `GET /api/auth/status`
Check current authentication and Google OAuth status.

**Response:**
```json
{
  "isAuthenticated": true,
  "session": {
    "userId": "uuid",
    "email": "user@example.com",
    "isAuthenticated": true,
    "oauthStatus": {
      "isConnected": true,
      "userEmail": "user@example.com",
      "scopes": ["gmail.modify", "drive.file", ...],
      "expiresAt": "2024-01-01T12:00:00Z"
    },
    "preferences": {
      "theme": "system",
      "notificationsEnabled": true,
      "defaultView": "dashboard",
      "favoriteActions": []
    }
  }
}
```

---

#### `POST /api/auth/refresh-google-token`
Refresh Google OAuth access token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "access_token": "new_access_token",
  "expires_in": 3600,
  "token_type": "Bearer",
  "refresh_token": "new_refresh_token"
}
```

---

#### `POST /api/auth/disconnect`
Disconnect Google account and revoke tokens.

**Response:**
```json
{
  "success": true,
  "message": "Successfully disconnected Google account"
}
```

**Process:**
1. Revokes token with Google
2. Deletes tokens from database
3. Returns success

---

### Quick Actions

#### `GET /api/quick-actions`
Get all quick actions with user's favorites marked.

**Response:**
```json
{
  "actions": [
    {
      "id": "send-email",
      "title": "Send Email",
      "description": "Compose and send an email",
      "template": "Send an email to {recipient} about {topic}",
      "icon": "mail",
      "category": "email",
      "isFavorite": true,
      "usageCount": 5
    }
  ]
}
```

---

#### `POST /api/quick-actions/favorite`
Add or remove a quick action from favorites.

**Request:**
```json
{
  "actionId": "send-email",
  "isFavorite": true
}
```

**Response:**
```json
{
  "success": true,
  "favoriteActions": ["send-email", "create-doc", ...]
}
```

**Limits:**
- Maximum 20 favorites per user
- Automatically removes oldest if limit exceeded

---

### Feedback

#### `POST /api/feedback`
Submit feedback for a workflow result.

**Request:**
```json
{
  "workflowId": "uuid",
  "resultId": "result_1",
  "rating": "positive",
  "comment": "Great summary!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded successfully"
}
```

**Validation:**
- Rating must be "positive" or "negative"
- Comment is optional

---

## 🤖 LLM Integration

### LLM Client (`lib/llm/client.ts`)

#### `chatCompletion(messages, options)`
Send a chat completion request to OpenAI.

```typescript
const response = await chatCompletion([
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "Hello!" }
], {
  model: "gpt-4-turbo-preview",
  temperature: 0.7,
  maxTokens: 4096
});
```

---

#### `streamChatCompletion(messages, options)`
Stream a chat completion response.

```typescript
for await (const chunk of streamChatCompletion(messages)) {
  console.log(chunk); // Partial response
}
```

---

#### `parseCommand(command)`
Parse natural language command and extract intent.

```typescript
const result = await parseCommand("Send an email to john@example.com");
// Returns:
{
  "intent": "send_email",
  "parameters": {
    "recipient": "john@example.com"
  },
  "confidence": 0.95
}
```

---

#### `generateWorkflowPlan(command)`
Generate a workflow execution plan.

```typescript
const plan = await generateWorkflowPlan("Summarize my emails and create a doc");
// Returns:
{
  "steps": [
    {
      "id": "step_1",
      "agentName": "EmailAgent",
      "action": "search_emails",
      "description": "Search for recent emails",
      "dependencies": []
    },
    {
      "id": "step_2",
      "agentName": "DocsAgent",
      "action": "create_document",
      "description": "Create summary document",
      "dependencies": ["step_1"]
    }
  ],
  "estimatedDuration": 45
}
```

---

## 💾 Database Services

### Workflow Service (`lib/services/workflowService.ts`)

#### `createAndPlanWorkflow(userId, command)`
Create and plan a new workflow.

```typescript
const { workflowId, steps } = await createAndPlanWorkflow(
  user.id,
  "Send email summary"
);
```

---

#### `executeWorkflowStep(workflowId, stepId, accessToken)`
Execute a single workflow step.

```typescript
const result = await executeWorkflowStep(
  workflowId,
  "step_1",
  googleAccessToken
);
```

---

#### `updateWorkflowStatus(workflowId, status, updates)`
Update workflow status and data.

```typescript
await updateWorkflowStatus(workflowId, "completed", {
  results: [...],
  steps: [...]
});
```

---

#### `cancelWorkflow(workflowId)`
Cancel a running workflow.

```typescript
await cancelWorkflow(workflowId);
```

---

#### `recordWorkflowHistory(userId, workflowId, command, status)`
Record workflow in history.

```typescript
await recordWorkflowHistory(
  user.id,
  workflowId,
  "Send email",
  "completed"
);
```

---

## 🔒 Security

### Authentication
- All routes verify Supabase session
- User ID extracted from authenticated session
- No manual token handling required

### Authorization
- Users can only access their own data
- Workflow ownership verified before operations
- Row Level Security (RLS) enforced at database level

### Token Management
- Google OAuth tokens stored securely in database
- Automatic token refresh before expiry
- Tokens revoked on disconnect

### Input Validation
- Command length validation (min 10 characters)
- Required parameters checked
- Type validation on all inputs

---

## 📊 Error Handling

### Standard Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized for resource)
- `500` - Internal Server Error

### Error Logging
All errors are logged to console with context:
```typescript
console.error("Error executing workflow:", error);
```

---

## 🚀 Performance

### Response Time Targets
- Workflow execution: <2s for planning
- Cancel operation: <200ms
- History fetch: <500ms
- SSE connection: <100ms

### Optimization
- Database queries use indexes
- Pagination for large datasets
- Streaming for real-time updates
- Connection pooling via Supabase

---

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test workflow execution
curl -X POST http://localhost:3000/api/workflow/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"Send an email summary"}'

# Test SSE stream
curl -N http://localhost:3000/api/workflow/stream?workflowId=uuid
```

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
OPENAI_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=REDACTED
```

---

## 📝 Next Steps

1. **Implement Agent Execution** - Add actual Google API calls
2. **Add Error Recovery** - Retry logic for failed steps
3. **Implement Caching** - Cache LLM responses
4. **Add Rate Limiting** - Prevent API abuse
5. **Add Monitoring** - Track performance metrics
6. **Add Tests** - Unit and integration tests

---

## 🔗 Related Documentation

- [Supabase Setup Guide](./COMPLETE_SETUP_GUIDE.md)
- [Database Schema](./DATABASE_SETUP.md)
- [Migration Checklist](./MIGRATION_CHECKLIST.md)
- [Quick Start](../QUICK_START.md)

