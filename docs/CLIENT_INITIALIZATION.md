# Client Initialization Guide

This guide explains how to use AURA's client initialization utilities in your code.

## Overview

AURA provides pre-configured clients for:
- **Supabase** (database, auth, realtime)
- **Google OAuth** (Workspace API access)
- **Encryption** (secure token storage)
- **Environment validation** (configuration checks)

All clients are initialized with proper error handling and type safety.

## Supabase Clients

### Browser Client (Client Components)

Use in React Client Components:

```typescript
import { createSupabaseClient } from '@/app/lib';

export default function MyComponent() {
  const supabase = createSupabaseClient();
  
  // Use for client-side operations
  const { data, error } = await supabase
    .from('execution_logs')
    .select('*')
    .limit(10);
}
```

### Server Client (Server Components & API Routes)

Use in React Server Components and API routes:

```typescript
import { createSupabaseServerClient } from '@/app/lib';

export default async function MyServerComponent() {
  const supabase = await createSupabaseServerClient();
  
  // Automatically handles cookies and auth
  const { data: { user } } = await supabase.auth.getUser();
}
```

### Service Client (Admin Operations)

Use for admin operations that bypass Row Level Security:

```typescript
import { createSupabaseServiceClient } from '@/app/lib';

// API route example
export async function POST(request: Request) {
  const supabase = createSupabaseServiceClient();
  
  // Has full access - use carefully!
  const { data, error } = await supabase
    .from('user_tokens')
    .insert({ ... });
}
```

**⚠️ Warning:** Service client bypasses RLS. Only use in trusted server-side code.

## Google OAuth Client

### Initialize OAuth Client

```typescript
import { createOAuth2Client, GOOGLE_SCOPES } from '@/app/lib';

const oauth2Client = createOAuth2Client();
```

### Generate Authorization URL

```typescript
import { generateAuthUrl } from '@/app/lib';

// In your OAuth setup page or API route
const authUrl = generateAuthUrl();

// Redirect user to authUrl
```

### Exchange Code for Tokens

```typescript
import { getTokensFromCode } from '@/app/lib';

// In your OAuth callback handler
const tokens = await getTokensFromCode(code);

// tokens contains:
// - access_token
// - refresh_token
// - expiry_date
// - scope
```

### Refresh Access Token

```typescript
import { refreshAccessToken } from '@/app/lib';

// When access token expires
const newTokens = await refreshAccessToken(refreshToken);
```

### Set Credentials for API Calls

```typescript
import { setCredentials } from '@/app/lib';
import { google } from 'googleapis';

// Create authenticated client
const oauth2Client = setCredentials(accessToken, refreshToken);

// Use with Google APIs
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
```

## Encryption Utilities

### Encrypt Sensitive Data

```typescript
import { encrypt } from '@/app/lib';

// Encrypt OAuth tokens before storing
const encryptedToken = encrypt(accessToken);

// Store in database
await supabase.from('user_tokens').insert({
  access_token: encryptedToken,
  // ...
});
```

### Decrypt Sensitive Data

```typescript
import { decrypt } from '@/app/lib';

// Retrieve from database
const { data } = await supabase
  .from('user_tokens')
  .select('access_token')
  .single();

// Decrypt before use
const accessToken = decrypt(data.access_token);
```

### Generate Encryption Key

```typescript
import { generateEncryptionKey } from '@/app/lib';

// For setup scripts only
const newKey = generateEncryptionKey();
console.log('Add to .env.local:', newKey);
```

## Environment Validation

### Check Configuration Status

```typescript
import { isEnvConfigured, getEnvErrors } from '@/app/lib';

// Quick check
if (!isEnvConfigured()) {
  const errors = getEnvErrors();
  console.error('Configuration errors:', errors);
}
```

### Get Validated Environment

```typescript
import { getEnv } from '@/app/lib';

// Get type-safe environment config
const env = getEnv();

// Access with autocomplete
console.log(env.supabase.url);
console.log(env.google.clientId);
console.log(env.llm.provider);
```

### Validate Setup (Comprehensive)

```typescript
import { validateSetup } from '@/app/lib';

// Run all validation checks
const result = await validateSetup();

if (!result.isValid) {
  console.error('Setup errors:', result.errors);
  console.warn('Setup warnings:', result.warnings);
}

// Check individual components
console.log('Checks:', result.checks);
// {
//   environment: true,
//   supabase: true,
//   googleOAuth: true,
//   encryption: true,
//   llm: true
// }
```

### Get Setup Status for UI

```typescript
import { getSetupStatus } from '@/app/lib';

// Use in setup page
const status = getSetupStatus();

if (!status.configured) {
  return (
    <div>
      <h2>Missing Configuration</h2>
      <ul>
        {status.missingVariables.map(v => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Error Handling

### Handle API Errors

```typescript
import { handleApiError, AuraError } from '@/app/lib';

try {
  // Your API call
  await someApiCall();
} catch (error) {
  const auraError = handleApiError(error);
  
  // Show user-friendly message
  toast.error(auraError.userMessage);
  
  // Check if recoverable
  if (auraError.recoverable) {
    // Show retry button
  }
}
```

### API Route Error Responses

```typescript
import { apiErrorResponse } from '@/app/lib';

export async function POST(request: Request) {
  try {
    // Your logic
  } catch (error) {
    return apiErrorResponse(error);
  }
}
```

## Complete Examples

### API Route with Full Setup

```typescript
// app/api/gmail/send/route.ts
import { 
  createSupabaseServerClient,
  setCredentials,
  decrypt,
  apiErrorResponse 
} from '@/app/lib';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user's OAuth tokens
    const { data: tokenData } = await supabase
      .from('user_tokens')
      .select('access_token, refresh_token')
      .eq('user_id', user.id)
      .single();
    
    if (!tokenData) {
      return Response.json(
        { error: 'OAuth tokens not found' },
        { status: 400 }
      );
    }
    
    // Decrypt tokens
    const accessToken = decrypt(tokenData.access_token);
    const refreshToken = decrypt(tokenData.refresh_token);
    
    // Create authenticated Google client
    const oauth2Client = setCredentials(accessToken, refreshToken);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Parse request
    const { to, subject, body } = await request.json();
    
    // Send email
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');
    
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    
    return Response.json({
      success: true,
      messageId: result.data.id,
    });
    
  } catch (error) {
    return apiErrorResponse(error);
  }
}
```

### Client Component with Realtime

```typescript
// app/components/ExecutionFeed.tsx
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/app/lib';

export default function ExecutionFeed({ taskId }: { taskId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const supabase = createSupabaseClient();
  
  useEffect(() => {
    // Fetch initial logs
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('execution_logs')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });
      
      if (data) setLogs(data);
    };
    
    fetchLogs();
    
    // Subscribe to new logs
    const channel = supabase
      .channel(`task-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'execution_logs',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          setLogs((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId]);
  
  return (
    <div>
      {logs.map((log) => (
        <div key={log.id}>
          {log.message}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Always Use Type-Safe Clients

```typescript
// ✅ Good - type-safe
import { createSupabaseClient } from '@/app/lib';

// ❌ Bad - manual initialization
import { createBrowserClient } from '@supabase/ssr';
```

### 2. Validate Environment Early

```typescript
// In app/layout.tsx or middleware
import { isEnvConfigured } from '@/app/lib';

if (!isEnvConfigured()) {
  // Redirect to setup page
}
```

### 3. Handle Errors Gracefully

```typescript
// ✅ Good - user-friendly errors
import { handleApiError } from '@/app/lib';

try {
  await apiCall();
} catch (error) {
  const auraError = handleApiError(error);
  toast.error(auraError.userMessage);
}

// ❌ Bad - raw errors
catch (error) {
  console.error(error); // User sees nothing
}
```

### 4. Use Service Client Sparingly

```typescript
// ✅ Good - only for admin operations
const supabase = createSupabaseServiceClient();
await supabase.from('user_tokens').insert({ ... });

// ❌ Bad - bypassing RLS unnecessarily
const supabase = createSupabaseServiceClient();
await supabase.from('execution_logs').select('*'); // Use regular client
```

### 5. Always Encrypt Sensitive Data

```typescript
// ✅ Good - encrypted storage
import { encrypt, decrypt } from '@/app/lib';

const encrypted = encrypt(token);
await db.insert({ token: encrypted });

// ❌ Bad - plain text storage
await db.insert({ token }); // Security risk!
```

## Troubleshooting

### "Missing required environment variable"

Run the validation script:
```bash
npm run validate-env
```

### "Failed to create Supabase client"

Check your Supabase URL and keys in `.env.local`

### "Google OAuth configuration error"

Verify your Google OAuth credentials and redirect URI

### "Failed to decrypt data"

Ensure `ENCRYPTION_KEY` hasn't changed since data was encrypted

## Next Steps

- See [Environment Setup Guide](./ENVIRONMENT_SETUP.md) for configuration
- Check [API Routes Design](../specs/aura-ui-system/design.md) for usage examples
- Review [Error Handling](./ERROR_HANDLING.md) for error management

## Reference

All utilities are exported from `@/app/lib`:

```typescript
import {
  // Environment
  validateEnv,
  getEnv,
  isEnvConfigured,
  getEnvErrors,
  
  // Supabase
  createSupabaseClient,
  createSupabaseServerClient,
  createSupabaseServiceClient,
  
  // Google OAuth
  createOAuth2Client,
  generateAuthUrl,
  getTokensFromCode,
  refreshAccessToken,
  setCredentials,
  GOOGLE_SCOPES,
  
  // Encryption
  encrypt,
  decrypt,
  generateEncryptionKey,
  
  // Validation
  validateSetup,
  getSetupStatus,
  
  // Error Handling
  AuraError,
  handleApiError,
  apiErrorResponse,
  
  // Utils
  cn,
} from '@/app/lib';
```
