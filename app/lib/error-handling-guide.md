# Error Handling and User Feedback - Implementation Guide

This document describes the comprehensive error handling system implemented for AURA.

## Overview

The error handling system provides:
- Categorized error types with user-friendly messages
- Standardized API error responses with Supabase logging
- Toast notifications, error modals, and inline error displays
- Automatic retry mechanisms with exponential backoff
- OAuth token expiration detection and reconnection prompts

## Components

### 1. Error Utilities (`app/lib/errorHandler.ts`)

**AuraError Class**
- Custom error class with categorization
- Properties: code, message, userMessage, recoverable, statusCode, category, details

**Error Categories**
- AUTHENTICATION: OAuth and credential errors
- API: Rate limits and external API errors
- AGENT: Task planning, execution, and validation errors
- DATABASE: Supabase and data errors
- VALIDATION: Input validation errors
- NETWORK: Connection and timeout errors
- UNKNOWN: Uncategorized errors

**Key Functions**
- `categorizeError()`: Automatically categorize errors
- `handleApiError()`: Transform errors into AuraError instances
- `apiErrorResponse()`: Create standardized API responses with logging
- `logErrorToSupabase()`: Log errors to execution_logs table
- `getErrorMessage()`: Get user-friendly messages
- `getRecoveryAction()`: Determine recovery action (reconnect, retry, wait)

### 2. Retry Mechanisms (`app/lib/retry.ts`)

**Features**
- Exponential backoff with configurable parameters
- Retryable error detection
- Retry state management for UI components

**Key Functions**
- `retryWithBackoff()`: Retry function with exponential backoff
- `calculateBackoffDelay()`: Calculate delay for next retry
- `isRetryableError()`: Check if error can be retried
- `RetryManager`: Class for managing retry states across tasks

**React Hook** (`app/hooks/useRetry.ts`)
- `useRetry()`: Hook for retry functionality in components

### 3. Token Management (`app/lib/auth/token.ts`)

**Features**
- Token validation and expiration checking
- Automatic detection of tokens expiring soon (< 5 minutes)
- Scope validation

**Key Functions**
- `getUserTokens()`: Retrieve and decrypt user tokens
- `validateToken()`: Check token validity and expiration
- `hasValidTokens()`: Check if user has valid tokens
- `requireValidTokens()`: Throw error if tokens invalid
- `requireScopes()`: Throw error if missing required scopes
- `getExpirationTimeString()`: Human-readable expiration time

**React Hook** (`app/hooks/useTokenStatus.ts`)
- `useTokenStatus()`: Monitor token status with periodic checks
- Automatic reconnection prompts for expired tokens

### 4. Auth Middleware (`app/lib/auth/middleware.ts`)

**Wrapper Functions**
- `withAuth()`: Require authentication
- `withOAuth()`: Require valid OAuth tokens
- `withScopes()`: Require specific OAuth scopes

**Usage Example**
```typescript
export const POST = withOAuth(async (request, { session, tokens }) => {
  // Your handler code with guaranteed valid tokens
});
```

### 5. UI Components

#### Toast Notifications (`app/components/ui/Toast.tsx`, `ToastContainer.tsx`)
- Success, error, warning, and info toasts
- Auto-dismiss with configurable duration
- Slide-in/out animations
- Context provider for global toast management

**Usage**
```typescript
const { showError, showSuccess } = useToast();
showError('Something went wrong');
showSuccess('Task completed!');
```

#### Error Modal (`app/components/ui/ErrorModal.tsx`)
- Critical error display
- Shows error details and recovery actions
- Retry and reconnect buttons based on error type
- Glassmorphism styling

#### Inline Errors (`app/components/ui/InlineError.tsx`)
- `InlineError`: Red error messages
- `InlineWarning`: Yellow warning messages
- Dismissible with optional close button

#### Retry Button (`app/components/ui/RetryButton.tsx`)
- `RetryButton`: Manual retry with countdown
- `AutoRetryIndicator`: Shows automatic retry progress
- Loading and disabled states

#### Token Expiration (`app/components/auth/TokenExpiredPrompt.tsx`)
- `TokenExpiredPrompt`: Modal for expired tokens
- `TokenExpiringWarning`: Warning for tokens expiring soon
- Reconnection flow integration

## API Routes

### Token Status Check (`app/api/auth/token-status/route.ts`)
- POST endpoint to check token validity
- Returns expiration status and time remaining
- Used by `useTokenStatus` hook

## Error Flow Examples

### 1. API Error with Retry
```typescript
try {
  const response = await fetch('/api/agent/execute', {
    method: 'POST',
    body: JSON.stringify({ taskId }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    if (data.error.recoveryAction === 'retry') {
      // Show retry button
    }
  }
} catch (error) {
  showError('Network error occurred');
}
```

### 2. Token Expiration Detection
```typescript
const { tokenStatus, reconnect } = useTokenStatus(userId);

if (tokenStatus?.isExpired) {
  // Show TokenExpiredPrompt
  return <TokenExpiredPrompt isOpen={true} />;
}

if (tokenStatus?.needsRefresh && tokenStatus.expiresIn < 5 * 60 * 1000) {
  // Show warning
  return <TokenExpiringWarning expiresIn={tokenStatus.expiresIn} onReconnect={reconnect} />;
}
```

### 3. Automatic Retry with Backoff
```typescript
import { retryWithBackoff } from '@/app/lib/retry';

const result = await retryWithBackoff(
  async () => {
    return await executeTask(taskId);
  },
  {
    maxAttempts: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
  }
);
```

## Error Messages Map

| Error Code | User Message | Recovery Action |
|------------|--------------|-----------------|
| TOKEN_EXPIRED | Your Google connection expired. Please reconnect. | reconnect |
| INVALID_CREDENTIALS | Authentication failed. Please sign in again. | reconnect |
| MISSING_SCOPES | Additional permissions required. Please reconnect your account. | reconnect |
| PERMISSION_DENIED | Missing required permissions. Please reconnect your Google account. | reconnect |
| RATE_LIMIT | Too many requests. Please wait a moment. | wait |
| NETWORK_ERROR | Connection lost. Retrying... | auto-retry |
| TASK_FAILED | Task execution failed. Would you like to retry? | retry |
| EXECUTION_FAILED | Task execution failed. Would you like to retry? | retry |
| PLANNING_FAILED | Unable to plan this task. Please try rephrasing your request. | none |
| VALIDATION_FAILED | Task completed but validation failed. Please review the results. | none |
| INVALID_INPUT | Invalid request. Please check your input. | none |
| DATABASE_ERROR | A database error occurred. Please try again. | retry |
| GOOGLE_API_ERROR | Google service temporarily unavailable. Please try again. | retry |
| UNKNOWN_ERROR | Something went wrong. Please try again. | retry |

## Integration Checklist

To integrate error handling in your components:

1. **Wrap app with ToastProvider**
   ```typescript
   <ToastProvider>
     <YourApp />
   </ToastProvider>
   ```

2. **Use error handling in API routes**
   ```typescript
   import { apiErrorResponse, apiSuccessResponse } from '@/app/lib/errorHandler';
   
   export async function POST(request: NextRequest) {
     try {
       // Your logic
       return apiSuccessResponse(data);
     } catch (error) {
       return apiErrorResponse(error);
     }
   }
   ```

3. **Add token validation to protected routes**
   ```typescript
   import { withOAuth } from '@/app/lib/auth/middleware';
   
   export const POST = withOAuth(async (request, { session, tokens }) => {
     // Your handler with guaranteed valid tokens
   });
   ```

4. **Monitor token status in components**
   ```typescript
   const { tokenStatus, reconnect } = useTokenStatus(userId);
   ```

5. **Show appropriate error UI**
   ```typescript
   const { showError } = useToast();
   
   if (error) {
     showError(error.userMessage);
   }
   ```

## Testing

Test error scenarios:
- Expired OAuth tokens
- Network failures
- Rate limiting
- Invalid inputs
- Task execution failures
- Missing permissions

Verify:
- Appropriate error messages displayed
- Recovery actions work correctly
- Errors logged to Supabase
- Retry mechanisms function properly
- Token expiration prompts appear

## Future Enhancements

- Error analytics and monitoring
- Custom error pages for different error types
- Offline mode support
- Error recovery suggestions based on context
- Internationalization of error messages
