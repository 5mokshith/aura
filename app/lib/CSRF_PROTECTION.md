# CSRF Protection Implementation Guide

## Overview

AURA implements CSRF (Cross-Site Request Forgery) protection to prevent unauthorized actions on behalf of authenticated users. The implementation uses token-based verification and state parameters for OAuth flows.

## What is CSRF?

CSRF attacks trick authenticated users into executing unwanted actions on a web application. For example:
- An attacker creates a malicious website with a form that submits to your API
- A logged-in user visits the malicious site
- The form auto-submits, using the user's session cookies
- Your API executes the action, thinking it's legitimate

## Protection Mechanisms

### 1. CSRF Tokens

For standard API routes, AURA uses CSRF tokens that must be included in request headers.

**How it works:**
1. Server generates a random CSRF token
2. Token is stored in session/cookie
3. Client includes token in `X-CSRF-Token` header
4. Server verifies token matches stored value

### 2. OAuth State Parameter

For OAuth flows, AURA uses the `state` parameter to prevent CSRF attacks.

**How it works:**
1. Server generates CSRF token before OAuth redirect
2. Token is encoded in the `state` parameter
3. Google returns the `state` parameter in callback
4. Server verifies the state matches the stored token

### 3. Origin Checking

Additional layer that verifies requests come from the same origin.

## Implementation

### OAuth Flow Protection (Already Implemented)

The OAuth flow is protected using state parameters:

```typescript
// 1. Initiate OAuth (app/api/auth/google/redirect/route.ts)
import { generateCsrfToken, generateOAuthState } from '@/lib/csrf';

const csrfToken = generateCsrfToken();
const state = generateOAuthState(csrfToken, redirectUrl);

const authUrl = oauth2Client.generateAuthUrl({
  // ... other options
  state, // CSRF protection
});

// Store token in cookie
response.cookies.set('oauth_csrf_token', csrfToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 10 * 60, // 10 minutes
});
```

```typescript
// 2. Verify in callback (app/api/auth/google/callback/route.ts)
import { verifyOAuthState } from '@/lib/csrf';

const state = searchParams.get('state');
const storedCsrfToken = request.cookies.get('oauth_csrf_token')?.value;

const verifiedState = verifyOAuthState(state, storedCsrfToken);

if (!verifiedState) {
  // Reject the request
  return NextResponse.redirect(new URL('/auth/setup?error=csrf_invalid', request.url));
}

// Clear the CSRF token cookie after verification
response.cookies.delete('oauth_csrf_token');
```

### API Route Protection

For standard API routes that modify data (POST, PUT, DELETE, PATCH):

```typescript
import { csrfProtection } from '@/lib/csrf';

export async function POST(request: Request) {
  // Verify CSRF token
  const csrfResponse = await csrfProtection(request, async () => {
    // Get stored CSRF token from session/cookie
    const cookies = request.headers.get('cookie');
    // Parse and return the CSRF token
    return getCsrfTokenFromCookies(cookies);
  });
  
  if (csrfResponse) {
    return csrfResponse; // CSRF validation failed
  }
  
  // Your API logic here
  return Response.json({ success: true });
}
```

### Using the Higher-Order Function

```typescript
import { withCsrfProtection } from '@/lib/csrf';

export const POST = withCsrfProtection(
  async (request: Request) => {
    // Your API logic
    return Response.json({ success: true });
  },
  async () => {
    // Get stored CSRF token
    return getSessionCsrfToken();
  }
);
```

### Combined CSRF and Origin Protection

```typescript
import { csrfAndOriginProtection } from '@/lib/csrf';

export async function POST(request: Request) {
  const protectionResponse = await csrfAndOriginProtection(
    request,
    async () => getSessionCsrfToken()
  );
  
  if (protectionResponse) {
    return protectionResponse;
  }
  
  // Your API logic
}
```

## Client-Side Implementation

### Storing CSRF Token

When initiating OAuth:

```typescript
// Client-side code
async function initiateOAuth() {
  const response = await fetch('/api/auth/google/redirect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ redirectUrl: '/dashboard' }),
  });
  
  const data = await response.json();
  
  // Store CSRF token (optional, as it's also in cookie)
  sessionStorage.setItem('oauth_csrf_token', data.csrfToken);
  
  // Redirect to Google OAuth
  window.location.href = data.redirectUrl;
}
```

### Including CSRF Token in API Requests

For protected API routes:

```typescript
// Get CSRF token from cookie or session
const csrfToken = getCsrfToken();

const response = await fetch('/api/protected-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken, // Include CSRF token
  },
  body: JSON.stringify(data),
});
```

## Next.js Built-in CSRF Protection

Next.js provides some built-in CSRF protection through:

1. **SameSite Cookies**: Cookies are set with `sameSite: 'lax'` by default
2. **Origin Checking**: Next.js middleware can check request origins
3. **Server Actions**: Automatically protected in Next.js 13+

### Using Next.js Server Actions

Server Actions have built-in CSRF protection:

```typescript
// app/actions/example.ts
'use server';

export async function protectedAction(formData: FormData) {
  // Automatically protected by Next.js
  // No manual CSRF token needed
}
```

## Security Best Practices

### 1. Always Use HTTPS in Production

CSRF tokens should only be transmitted over HTTPS:

```typescript
response.cookies.set('csrf_token', token, {
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  httpOnly: true,
  sameSite: 'lax',
});
```

### 2. Set Appropriate Cookie Attributes

```typescript
{
  httpOnly: true,      // Prevent JavaScript access
  secure: true,        // HTTPS only
  sameSite: 'lax',     // Prevent cross-site requests
  maxAge: 600,         // Short expiration (10 minutes for OAuth)
  path: '/',           // Scope to entire application
}
```

### 3. Validate All State-Changing Requests

Only GET, HEAD, and OPTIONS should be exempt from CSRF protection:

```typescript
const method = request.method.toUpperCase();
if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
  // Require CSRF token
}
```

### 4. Use Short Token Expiration

CSRF tokens should expire quickly:

```typescript
// OAuth state tokens: 10 minutes
maxAge: 10 * 60

// Session CSRF tokens: 1 hour
maxAge: 60 * 60
```

### 5. Regenerate Tokens After Authentication

```typescript
// After successful login
const newCsrfToken = generateCsrfToken();
response.cookies.set('csrf_token', newCsrfToken, { /* ... */ });
```

## Error Handling

### CSRF Validation Errors

The system returns specific error codes:

- `CSRF_TOKEN_MISSING`: No CSRF token in session
- `CSRF_TOKEN_REQUIRED`: No CSRF token in request header
- `CSRF_TOKEN_INVALID`: Token doesn't match
- `INVALID_ORIGIN`: Request from different origin

### Client-Side Error Handling

```typescript
const response = await fetch('/api/protected', {
  method: 'POST',
  headers: { 'X-CSRF-Token': csrfToken },
  body: JSON.stringify(data),
});

if (response.status === 403) {
  const error = await response.json();
  
  if (error.error.code === 'CSRF_TOKEN_INVALID') {
    // Refresh CSRF token and retry
    await refreshCsrfToken();
    return retryRequest();
  }
}
```

## Testing

### Test CSRF Protection

```typescript
// Test that requests without CSRF token are rejected
test('rejects requests without CSRF token', async () => {
  const response = await fetch('/api/protected', {
    method: 'POST',
    body: JSON.stringify({ data: 'test' }),
  });
  
  expect(response.status).toBe(403);
  const data = await response.json();
  expect(data.error.code).toBe('CSRF_TOKEN_REQUIRED');
});

// Test that requests with invalid token are rejected
test('rejects requests with invalid CSRF token', async () => {
  const response = await fetch('/api/protected', {
    method: 'POST',
    headers: { 'X-CSRF-Token': 'invalid-token' },
    body: JSON.stringify({ data: 'test' }),
  });
  
  expect(response.status).toBe(403);
  expect(data.error.code).toBe('CSRF_TOKEN_INVALID');
});
```

### Bypass CSRF in Tests

```typescript
// For testing purposes only
if (process.env.NODE_ENV === 'test') {
  // Skip CSRF validation
  return handler(request);
}
```

## Migration Guide

### Adding CSRF Protection to Existing Routes

1. **Import CSRF utilities**:
   ```typescript
   import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
   import { csrfProtection } from '@/lib/csrf';
   ```

2. **Add CSRF check**:
   ```typescript
   export async function POST(request: Request) {
     // Add CSRF protection
     const csrfResponse = await csrfProtection(request, getStoredToken);
     if (csrfResponse) return csrfResponse;
     
     // Existing logic...
   }
   ```

3. **Update client code**:
   ```typescript
   // Include CSRF token in requests
   headers: {
     'X-CSRF-Token': getCsrfToken(),
   }
   ```

## Troubleshooting

### CSRF Token Not Found

**Problem**: `CSRF_TOKEN_MISSING` error

**Solutions**:
- Ensure CSRF token is set in cookie/session
- Check cookie settings (httpOnly, secure, sameSite)
- Verify cookie domain matches request domain

### Token Mismatch

**Problem**: `CSRF_TOKEN_INVALID` error

**Solutions**:
- Check token is correctly passed in header
- Verify token hasn't expired
- Ensure token storage is consistent

### OAuth State Verification Fails

**Problem**: `csrf_invalid` error in OAuth callback

**Solutions**:
- Check cookie is set before OAuth redirect
- Verify cookie isn't blocked by browser
- Ensure state parameter is returned by OAuth provider
- Check token hasn't expired (10 minute limit)

## Additional Resources

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
