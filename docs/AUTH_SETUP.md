# Authentication Setup Guide

This guide explains how to set up Google OAuth authentication for AURA.

## Prerequisites

1. A Google Cloud Platform (GCP) project
2. OAuth 2.0 credentials configured in GCP Console

## Google Cloud Setup

### 1. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Configure the OAuth consent screen if prompted

### 2. Configure Authorized Redirect URIs

Add the following redirect URIs:

- Development: `http://localhost:3000/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

### 3. Enable Required APIs

Enable the following Google APIs in your project:

- Gmail API
- Google Drive API
- Google Docs API
- Google Sheets API
- Google Calendar API

## Environment Configuration

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in your OAuth credentials:

```env
# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=REDACTED
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

## OAuth Scopes

AURA requests the following OAuth scopes:

- `https://www.googleapis.com/auth/gmail.modify` - Read and send emails
- `https://www.googleapis.com/auth/drive.file` - Create and manage Drive files
- `https://www.googleapis.com/auth/documents` - Create and edit Google Docs
- `https://www.googleapis.com/auth/spreadsheets` - Create and edit Google Sheets
- `https://www.googleapis.com/auth/calendar` - Manage calendar events

## Authentication Flow

1. **Login**: User clicks "Connect Google Account" on `/login`
2. **OAuth Redirect**: User is redirected to Google's OAuth consent screen
3. **Authorization**: User grants permissions to AURA
4. **Callback**: Google redirects back to `/auth/callback` with authorization code
5. **Token Exchange**: Backend exchanges code for access and refresh tokens
6. **Session Creation**: Tokens are stored in httpOnly cookies
7. **Dashboard**: User is redirected to the dashboard

## Token Management

### Access Tokens

- Stored in httpOnly cookies for security
- Expire after 1 hour
- Automatically refreshed using refresh token

### Refresh Tokens

- Stored in httpOnly cookies
- Valid for 30 days
- Used to obtain new access tokens without re-authentication

### Token Refresh

The `AuthContext` automatically:

- Checks token expiration on every auth status request
- Refreshes expired tokens using the refresh token
- Prompts re-authentication if refresh fails
- Checks token status every 5 minutes

## Security Features

1. **httpOnly Cookies**: Tokens stored in httpOnly cookies prevent XSS attacks
2. **Secure Flag**: Cookies use secure flag in production (HTTPS only)
3. **SameSite**: Cookies use SameSite=lax to prevent CSRF
4. **Token Revocation**: Disconnect properly revokes tokens with Google
5. **Automatic Cleanup**: Expired/invalid tokens are automatically cleared

## API Routes

### GET /api/auth/status

Check current authentication status.

**Response:**

```json
{
  "isAuthenticated": true,
  "session": {
    "userId": "123456789",
    "email": "user@example.com",
    "isAuthenticated": true,
    "oauthStatus": {
      "isConnected": true,
      "userEmail": "user@example.com",
      "scopes": ["..."],
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

### POST /api/auth/callback

Exchange authorization code for tokens.

**Request:**

```json
{
  "code": "authorization_code_from_google"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Authentication successful"
}
```

### POST /api/auth/disconnect

Revoke tokens and disconnect Google account.

**Response:**

```json
{
  "success": true,
  "message": "Successfully disconnected"
}
```

## Usage in Components

### Using the Auth Hook

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { session, isLoading, login, logout, refreshAuth } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session?.isAuthenticated) {
    return <button onClick={login}>Connect Google Account</button>;
  }

  return (
    <div>
      <p>Welcome, {session.email}!</p>
      <button onClick={logout}>Disconnect</button>
    </div>
  );
}
```

### Protected Routes

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  if (isLoading || !session?.isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

## Troubleshooting

### "Failed to exchange authorization code"

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URI matches exactly in GCP Console
- Ensure authorization code hasn't expired (valid for 10 minutes)

### "Token refresh failed"

- Refresh token may have expired (30 days)
- User may have revoked access in Google account settings
- Prompt user to reconnect their account

### "Authentication failed"

- Check that all required APIs are enabled in GCP
- Verify OAuth consent screen is configured
- Check browser console for detailed error messages

## Testing

To test the authentication flow locally:

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You should be redirected to `/login`
4. Click "Connect Google Account"
5. Complete OAuth flow with your Google account
6. You should be redirected back to the dashboard

## Production Deployment

Before deploying to production:

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URI to GCP Console
3. Ensure all environment variables are set in your hosting platform
4. Test the complete OAuth flow in production
5. Monitor token refresh and expiration handling

