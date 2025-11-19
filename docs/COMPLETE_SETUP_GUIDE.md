# Complete Supabase Setup Guide for AURA

This guide will walk you through setting up Supabase with Google OAuth and token storage for accessing Google Workspace APIs.

## 🎯 What We've Built

- ✅ Supabase authentication with Google OAuth
- ✅ Secure Google OAuth token storage (access & refresh tokens)
- ✅ Automatic token refresh mechanism
- ✅ Database schema with Row Level Security (RLS)
- ✅ API routes for auth management
- ✅ Updated components to use Supabase

## 📋 Prerequisites

1. A Supabase account ([sign up here](https://supabase.com))
2. Google Cloud Console project with OAuth credentials
3. Node.js and npm installed

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project (5 minutes)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `aura-app`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

### Step 2: Get Your Supabase Credentials (2 minutes)

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long key starting with `eyJhbGc...`
   - **service_role key**: Another long key (keep this SECRET!)

### Step 3: Update Environment Variables (2 minutes)

Edit your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED

# Google OAuth (already configured)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Step 4: Run Database Migrations (3 minutes)

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste and click **"Run"**
5. You should see "Success. No rows returned"
6. Click **"New Query"** again
7. Copy the entire content from `supabase/migrations/002_add_google_oauth_tokens.sql`
8. Paste and click **"Run"**
9. You should see "Success. No rows returned"

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 5: Configure Google OAuth in Supabase (5 minutes)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **"Enable Google provider"** to ON
4. Enter your credentials:
   - **Client ID**: `REDACTED_GOOGLE_CLIENT_ID`
   - **Client Secret**: `REDACTED_GOOGLE_CLIENT_SECRET`
5. In **"Authorized Client IDs"**, leave empty (optional)
6. Click **"Save"**

### Step 6: Configure Redirect URLs (2 minutes)

1. Still in **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback` (when you deploy)
3. Set **Site URL**: `http://localhost:3000` (or your production URL)
4. Click **"Save"**

### Step 7: Configure Google Cloud Console (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-project.supabase.co/auth/v1/callback`
6. Click **"Save"**

### Step 8: Enable Required Google APIs (3 minutes)

In Google Cloud Console, go to **APIs & Services** → **Library** and enable:

- ✅ Gmail API
- ✅ Google Drive API
- ✅ Google Docs API
- ✅ Google Sheets API
- ✅ Google Calendar API

### Step 9: Test Your Setup (2 minutes)

```bash
# Start your development server
npm run dev
```

Visit `http://localhost:3000` and try signing in with Google!

## 🗄️ Database Schema

### Tables Created

#### 1. `profiles`
Stores user profile information.

```sql
- id: UUID (references auth.users)
- email: TEXT
- full_name: TEXT
- avatar_url: TEXT
- preferences: JSONB
- google_access_token: TEXT (deprecated, use oauth_tokens)
- google_refresh_token: TEXT (deprecated, use oauth_tokens)
- google_token_expires_at: TIMESTAMPTZ (deprecated)
- google_scopes: TEXT[] (deprecated)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 2. `oauth_tokens` (Secure Token Storage)
Stores Google OAuth tokens securely.

```sql
- id: UUID
- user_id: UUID (references profiles)
- provider: TEXT (default: 'google')
- access_token: TEXT
- refresh_token: TEXT
- token_type: TEXT (default: 'Bearer')
- expires_at: TIMESTAMPTZ
- scopes: TEXT[]
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 3. `workflows`
Stores workflow execution data.

```sql
- id: UUID
- user_id: UUID (references profiles)
- command: TEXT
- status: workflow_status ENUM
- steps: JSONB
- results: JSONB
- error: TEXT
- start_time: TIMESTAMPTZ
- end_time: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 4. `workflow_history`
Stores workflow execution history.

```sql
- id: UUID
- user_id: UUID (references profiles)
- workflow_id: UUID (references workflows)
- command: TEXT
- status: TEXT
- executed_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
```

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled. Users can only access their own data.

### Token Storage
- OAuth tokens stored in separate `oauth_tokens` table
- Encrypted at rest by Supabase
- Only accessible by the token owner
- Automatic cleanup on user deletion

### API Security
- All API routes verify authentication
- Service role key never exposed to client
- Tokens refreshed automatically before expiry

## 🔄 How Token Management Works

### 1. Initial Sign-In
```
User clicks "Sign in with Google"
  ↓
Supabase redirects to Google OAuth
  ↓
User grants permissions
  ↓
Google redirects back with tokens
  ↓
Tokens stored in oauth_tokens table
  ↓
User redirected to dashboard
```

### 2. Token Refresh (Automatic)
```
User makes API call
  ↓
Check if token expires in < 5 minutes
  ↓
If yes: Call refresh endpoint
  ↓
Exchange refresh_token for new access_token
  ↓
Update oauth_tokens table
  ↓
Return new access_token
```

### 3. Using Tokens in Your Code

```tsx
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

function MyComponent() {
  const { getGoogleAccessToken } = useSupabaseAuth();
  
  const callGoogleAPI = async () => {
    // Automatically gets fresh token (refreshes if needed)
    const token = await getGoogleAccessToken();
    
    if (!token) {
      console.error("No valid token available");
      return;
    }
    
    // Use token to call Google APIs
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    return data;
  };
  
  return <button onClick={callGoogleAPI}>Fetch Emails</button>;
}
```

## 📝 API Routes Created

### `GET /api/auth/status`
Check current authentication status and Google OAuth connection.

**Response:**
```json
{
  "isAuthenticated": true,
  "session": {
    "userId": "uuid",
    "email": "user@example.com",
    "oauthStatus": {
      "isConnected": true,
      "userEmail": "user@example.com",
      "scopes": ["gmail.modify", "drive.file", ...],
      "expiresAt": "2024-01-01T12:00:00Z"
    },
    "preferences": { ... }
  }
}
```

### `POST /api/auth/refresh-google-token`
Refresh Google OAuth access token.

**Request:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response:**
```json
{
  "access_token": "new_access_token",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### `POST /api/auth/disconnect`
Disconnect Google account and revoke tokens.

**Response:**
```json
{
  "success": true,
  "message": "Successfully disconnected Google account"
}
```

### `GET /auth/callback`
OAuth callback handler (automatically called by Supabase).

## 🧪 Testing Your Setup

### 1. Test Authentication
```bash
npm run dev
```
- Visit `http://localhost:3000`
- Click "Sign in with Google"
- Grant permissions
- Should redirect to dashboard

### 2. Test Token Storage
```sql
-- In Supabase SQL Editor
SELECT * FROM oauth_tokens WHERE user_id = 'your-user-id';
```

### 3. Test Token Refresh
```tsx
// In your component
const { refreshGoogleToken } = useSupabaseAuth();
await refreshGoogleToken();
```

## 🐛 Troubleshooting

### "Invalid API key"
- ✅ Check `.env.local` has correct Supabase credentials
- ✅ Restart dev server after changing env vars
- ✅ Verify no extra spaces or quotes in env values

### "Redirect URI mismatch"
- ✅ Check redirect URLs in Supabase match Google Cloud Console
- ✅ Ensure `http://localhost:3000/auth/callback` is added to both
- ✅ Add Supabase callback URL: `https://your-project.supabase.co/auth/v1/callback`

### "Failed to fetch"
- ✅ Check Supabase project is active
- ✅ Verify network connectivity
- ✅ Check browser console for detailed errors

### "Token refresh failed"
- ✅ Verify refresh token exists in database
- ✅ Check Google OAuth credentials are correct
- ✅ Ensure user hasn't revoked access in Google account settings

### "RLS policy violation"
- ✅ Verify migrations ran successfully
- ✅ Check user is authenticated
- ✅ Ensure RLS policies are created

## 📚 Next Steps

1. ✅ **Update existing components** to use `useSupabaseAuth()` instead of old `useAuth()`
2. ✅ **Test Google API calls** with stored tokens
3. ✅ **Implement workflow storage** in Supabase
4. ✅ **Add history tracking** using workflow_history table
5. ✅ **Deploy to production** and update environment variables

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Reference](https://developers.google.com/gmail/api)
- [Google Drive API Reference](https://developers.google.com/drive/api)

## 💡 Tips

- **Development**: Use `http://localhost:3000` for testing
- **Production**: Update all URLs to your production domain
- **Security**: Never commit `.env.local` to git
- **Monitoring**: Check Supabase dashboard for auth logs
- **Debugging**: Enable verbose logging in Supabase settings

---

**Need help?** Check the [Supabase Discord](https://discord.supabase.com) or [GitHub Discussions](https://github.com/supabase/supabase/discussions)

