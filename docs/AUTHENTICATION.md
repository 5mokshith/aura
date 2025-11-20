# Authentication System

This document describes the OAuth authentication system for AURA, including token management, encryption, and automatic refresh.

## Overview

AURA uses Google OAuth 2.0 to authenticate users and access Google Workspace APIs (Gmail, Drive, Docs, Sheets, Calendar). The system includes:

- OAuth 2.0 flow with Google
- Secure token storage with AES-256-GCM encryption
- Automatic token refresh
- Session management with HTTP-only cookies

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Initiate OAuth
       ▼
┌─────────────────────────────┐
│ POST /api/auth/google/redirect │
└──────┬──────────────────────┘
       │
       │ 2. Redirect to Google
       ▼
┌─────────────────┐
│ Google OAuth    │
│ Consent Screen  │
└──────┬──────────┘
       │
       │ 3. User approves
       ▼
┌──────────────────────────────┐
│ GET /api/auth/google/callback │
└──────┬───────────────────────┘
       │
       │ 4. Exchange code for tokens
       │ 5. Encrypt and store tokens
       │ 6. Set session cookies
       ▼
┌─────────────┐
│ Main App    │
└─────────────┘
```

## Setup

### 1. Environment Variables

Add the following to your `.env.local`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000

# Token Encryption (generate with command below)
ENCRYPTION_KEY=your_64_character_hex_string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Generate Encryption Key

Run this command to generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and set it as `ENCRYPTION_KEY` in your `.env.local`.

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Gmail API
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Copy Client ID and Client Secret to `.env.local`

### 4. Database Setup

Ensure the `user_tokens` table exists in Supabase:

```sql
CREATE TABLE user_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_expires_at ON user_tokens(expires_at);
```

## API Routes

### POST /api/auth/google/redirect

Initiates the OAuth flow by generating a Google authorization URL.

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Usage:**
```typescript
const response = await fetch('/api/auth/google/redirect', {
  method: 'POST',
});
const { redirectUrl } = await response.json();
window.location.href = redirectUrl;
```

### GET /api/auth/google/callback

Handles the OAuth callback from Google. This is called automatically by Google after user consent.

**Query Parameters:**
- `code`: Authorization code from Google
- `error`: Error message if OAuth failed

**Behavior:**
- Exchanges code for access and refresh tokens
- Encrypts tokens using AES-256-GCM
- Stores tokens in Supabase
- Sets session cookies
- Redirects to main app (`/`)

### POST /api/auth/logout

Logs out the user and optionally revokes tokens.

**Request:**
```json
{
  "revokeTokens": true  // Optional, default: false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Usage:**
```typescript
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ revokeTokens: true }),
});
```

## Token Management

### Encryption

Tokens are encrypted using AES-256-GCM before storage:

```typescript
import { encrypt, decrypt } from '@/app/lib/crypto';

// Encrypt
const encrypted = encrypt('my-secret-token');
// Format: "iv:authTag:encryptedData"

// Decrypt
const decrypted = decrypt(encrypted);
```

### Automatic Refresh

Tokens are automatically refreshed when:
- Token is expired
- Token will expire in the next 5 minutes

```typescript
import { getValidTokens, getOAuth2Client } from '@/app/lib/google/auth';

// Get valid tokens (auto-refreshes if needed)
const tokens = await getValidTokens(userId);

// Get OAuth2 client (auto-refreshes if needed)
const oauth2Client = await getOAuth2Client(userId);
```

### Token Lifecycle

1. **Initial Grant**: User authorizes app, receives access + refresh tokens
2. **Storage**: Tokens encrypted and stored in Supabase
3. **Usage**: Access token used for API calls
4. **Expiration**: Access token expires after ~1 hour
5. **Refresh**: System automatically refreshes using refresh token
6. **Update**: New access token encrypted and stored
7. **Revocation**: User logs out, tokens revoked with Google

## Session Management

### Session Cookies

Two HTTP-only cookies are set after successful authentication:

- `aura_user_id`: Google user ID
- `aura_user_email`: User email address

**Properties:**
- `httpOnly: true` - Not accessible via JavaScript
- `secure: true` - Only sent over HTTPS (production)
- `sameSite: 'lax'` - CSRF protection
- `maxAge: 30 days`

### Getting Current User

**In Server Components:**
```typescript
import { getCurrentUser } from '@/app/lib/auth/session';

const user = await getCurrentUser();
if (!user) {
  redirect('/auth/setup');
}
```

**In API Routes:**
```typescript
import { getCurrentUserFromRequest } from '@/app/lib/auth/session';

export async function GET(request: NextRequest) {
  const user = getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

**Require Authentication:**
```typescript
import { requireAuth } from '@/app/lib/auth/session';

// Throws if not authenticated
const user = await requireAuth();
```

## Security Considerations

### Token Storage

- ✅ Tokens encrypted with AES-256-GCM
- ✅ Encryption key stored in environment variable
- ✅ Tokens never exposed in API responses
- ✅ Tokens never logged

### Session Security

- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite protection against CSRF
- ✅ 30-day expiration

### OAuth Security

- ✅ `access_type: 'offline'` for refresh tokens
- ✅ `prompt: 'consent'` to ensure refresh token
- ✅ State parameter for CSRF protection (future enhancement)
- ✅ Token revocation on logout

## Error Handling

### Common Errors

**TOKEN_EXPIRED**
- Cause: Access token expired and refresh failed
- Solution: User must reconnect Google account
- User message: "Your Google connection expired. Please reconnect."

**NO_TOKENS_FOUND**
- Cause: User not authenticated or tokens deleted
- Solution: Redirect to OAuth setup
- User message: "Please connect your Google account."

**OAUTH_INIT_ERROR**
- Cause: Failed to generate OAuth URL
- Solution: Check environment variables
- User message: "Failed to initialize authentication."

**LOGOUT_ERROR**
- Cause: Error during logout process
- Solution: Clear cookies manually
- User message: "Failed to logout. Please try again."

## Testing

### Manual Testing

1. **OAuth Flow:**
   ```bash
   # Start dev server
   npm run dev
   
   # Navigate to
   http://localhost:3000/auth/setup
   
   # Click "Connect Google Workspace"
   # Approve permissions
   # Should redirect to main app
   ```

2. **Token Refresh:**
   ```typescript
   // In browser console (after auth)
   await fetch('/api/test-token-refresh', { method: 'POST' });
   ```

3. **Logout:**
   ```typescript
   await fetch('/api/auth/logout', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ revokeTokens: true }),
   });
   ```

### Encryption Testing

```typescript
import { encrypt, decrypt, generateEncryptionKey } from '@/app/lib/crypto';

// Generate key
const key = generateEncryptionKey();
console.log('ENCRYPTION_KEY=' + key);

// Test encryption
const original = 'my-secret-token';
const encrypted = encrypt(original);
const decrypted = decrypt(encrypted);

console.assert(original === decrypted, 'Encryption/decryption failed');
```

## Troubleshooting

### "ENCRYPTION_KEY environment variable is not set"

**Solution:** Add `ENCRYPTION_KEY` to `.env.local`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Failed to obtain tokens from Google"

**Possible causes:**
1. Invalid OAuth credentials
2. Redirect URI mismatch
3. User denied permissions

**Solution:** Check Google Cloud Console configuration

### "Failed to refresh access token"

**Possible causes:**
1. Refresh token revoked
2. OAuth credentials changed
3. User revoked app access

**Solution:** User must reconnect Google account

### Tokens not persisting

**Possible causes:**
1. Supabase connection issue
2. Database table missing
3. Service role key incorrect

**Solution:** Check Supabase configuration and run migrations

## Future Enhancements

- [ ] Add state parameter for CSRF protection in OAuth flow
- [ ] Implement token rotation for refresh tokens
- [ ] Add support for multiple OAuth providers
- [ ] Implement session expiration and renewal
- [ ] Add audit logging for authentication events
- [ ] Implement rate limiting on auth endpoints
- [ ] Add 2FA support
- [ ] Implement device management
