# Supabase Database API Routes

This directory contains API routes for interacting with the Supabase database for token management and execution logging.

## Routes

### POST /api/db/save-token

Save encrypted OAuth tokens to the `user_tokens` table.

**Request Body:**
```json
{
  "userId": "string",
  "accessToken": "string",
  "refreshToken": "string",
  "expiresAt": "ISO 8601 timestamp",
  "scopes": ["array", "of", "scopes"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "string",
    "provider": "google",
    "expiresAt": "ISO 8601 timestamp"
  }
}
```

**Features:**
- Encrypts tokens using AES-256-GCM before storage
- Upserts to prevent duplicate entries
- Uses service role client for admin operations

---

### GET /api/db/get-tokens

Retrieve and decrypt OAuth tokens for a user.

**Query Parameters:**
- `userId` (required): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "decrypted string",
    "refreshToken": "decrypted string",
    "expiresAt": "ISO 8601 timestamp",
    "scopes": ["array", "of", "scopes"],
    "isExpired": false,
    "expiresInSeconds": 3600,
    "provider": "google",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Features:**
- Decrypts tokens before returning
- Checks token expiration status
- Calculates time until expiration
- Returns 404 if no tokens found

---

### POST /api/db/save-logs

Insert execution logs to the `execution_logs` table.

**Request Body:**
```json
{
  "userId": "string",
  "taskId": "string",
  "stepId": "string (optional)",
  "agentType": "planner | worker | evaluator",
  "message": "string",
  "logLevel": "info | success | error (default: info)",
  "metadata": {
    "optional": "json object"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logId": "uuid",
    "taskId": "string",
    "stepId": "string or null",
    "agentType": "string",
    "message": "string",
    "logLevel": "string",
    "createdAt": "ISO 8601 timestamp"
  }
}
```

**Features:**
- Validates agent type and log level
- Supports optional metadata JSON
- Automatically triggers Supabase Realtime updates
- Uses service role client for admin operations

---

## Error Responses

All routes return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Optional additional details"
  }
}
```

### Common Error Codes

- `INVALID_REQUEST`: Missing or invalid request parameters
- `DATABASE_ERROR`: Supabase operation failed
- `DECRYPTION_ERROR`: Failed to decrypt tokens
- `TOKENS_NOT_FOUND`: No tokens found for user
- `INVALID_AGENT_TYPE`: Invalid agent type provided
- `INVALID_LOG_LEVEL`: Invalid log level provided
- `INTERNAL_ERROR`: Unexpected server error

---

## Requirements Fulfilled

- **Requirement 14.1**: Encrypted token storage in Supabase
- **Requirement 14.2**: Token retrieval with expiration checking
- **Requirement 14.3**: Execution log persistence
- **Requirement 14.4**: AES-256-GCM encryption for sensitive data
- **Requirement 17.1**: Realtime updates via Supabase

---

## Security Notes

1. All tokens are encrypted using AES-256-GCM before storage
2. Service role client is used for admin operations
3. Tokens are never logged or exposed in error messages
4. All database operations use parameterized queries (via Supabase client)
5. Input validation is performed on all requests

---

## Testing

To test these routes, ensure:

1. `NEXT_PUBLIC_SUPABASE_URL` is set in environment
2. `SUPABASE_SERVICE_ROLE_KEY` is set in environment
3. `ENCRYPTION_KEY` is set (32-byte hex string)
4. Database tables exist (user_tokens, execution_logs)
5. Supabase Realtime is enabled for execution_logs table

Example test with curl:

```bash
# Save token
curl -X POST http://localhost:3000/api/db/save-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "accessToken": "ya29.test-token",
    "refreshToken": "1//test-refresh",
    "expiresAt": "2025-11-19T12:00:00Z",
    "scopes": ["https://www.googleapis.com/auth/gmail.send"]
  }'

# Get tokens
curl "http://localhost:3000/api/db/get-tokens?userId=test-user-123"

# Save log
curl -X POST http://localhost:3000/api/db/save-logs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "taskId": "task_123",
    "stepId": "step_1",
    "agentType": "planner",
    "message": "Task planning started",
    "logLevel": "info",
    "metadata": {"prompt": "Send an email"}
  }'
```
