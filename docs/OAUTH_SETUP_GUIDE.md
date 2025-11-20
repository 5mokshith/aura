# OAuth Setup Guide

Quick guide to set up Google OAuth for AURA.

## Prerequisites

- Google Cloud Console account
- Supabase project
- Node.js installed

## Step 1: Generate Encryption Key

Run this command to generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64 character hex string).

## Step 2: Configure Environment Variables

Create or update `.env.local` with:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000

# Token Encryption (paste the key from Step 1)
ENCRYPTION_KEY=paste_your_64_character_hex_string_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 3: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Gmail API
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Calendar API

### Enable APIs via Console:
- Navigate to "APIs & Services" > "Library"
- Search for each API and click "Enable"

### Or use gcloud CLI:
```bash
gcloud services enable gmail.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable docs.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable calendar-json.googleapis.com
```

## Step 4: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure OAuth consent screen (if not done):
   - User Type: External
   - App name: AURA
   - User support email: your email
   - Developer contact: your email
4. Application type: **Web application**
5. Name: AURA OAuth Client
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Click "Create"
8. Copy the **Client ID** and **Client Secret**
9. Paste them into `.env.local`

## Step 5: Configure OAuth Scopes

In the OAuth consent screen configuration, add these scopes:

- `userinfo.email`
- `userinfo.profile`
- `gmail.send`
- `gmail.readonly`
- `gmail.modify`
- `drive`
- `drive.file`
- `documents`
- `spreadsheets`
- `calendar`
- `calendar.events`

## Step 6: Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create user_tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_expires_at ON user_tokens(expires_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" ON user_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the OAuth setup page (you'll create this in the next task):
   ```
   http://localhost:3000/auth/setup
   ```

3. Click "Connect Google Workspace"

4. You should be redirected to Google's consent screen

5. Approve the permissions

6. You should be redirected back to the main app

7. Check Supabase to verify tokens were stored:
   ```sql
   SELECT user_id, provider, expires_at, scopes, created_at 
   FROM user_tokens;
   ```

## Troubleshooting

### Error: "ENCRYPTION_KEY environment variable is not set"

**Solution:** Make sure you added the `ENCRYPTION_KEY` to `.env.local` and restarted the dev server.

### Error: "redirect_uri_mismatch"

**Solution:** 
1. Check that the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/google/callback`
2. No trailing slash
3. Correct protocol (http for localhost, https for production)

### Error: "access_denied"

**Solution:** User clicked "Cancel" on the consent screen. Try again.

### Error: "Failed to store tokens in database"

**Solution:**
1. Check Supabase connection
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
3. Ensure `user_tokens` table exists
4. Check Supabase logs for errors

### Tokens not refreshing

**Solution:**
1. Verify `refresh_token` is stored in database
2. Check that OAuth was configured with `access_type: 'offline'` (already done in code)
3. Ensure `prompt: 'consent'` was used (already done in code)

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain:
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. Add production redirect URI to Google Cloud Console:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

3. Ensure all environment variables are set in your hosting platform

4. Use HTTPS (required for OAuth in production)

5. Consider adding your domain to Google's authorized domains list

## Security Checklist

- [ ] `ENCRYPTION_KEY` is 64 characters (32 bytes hex)
- [ ] `ENCRYPTION_KEY` is kept secret and not committed to git
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret
- [ ] `GOOGLE_CLIENT_SECRET` is kept secret
- [ ] OAuth redirect URI uses HTTPS in production
- [ ] Row Level Security enabled on `user_tokens` table
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables are set in production hosting platform

## Next Steps

After completing this setup:

1. Create the OAuth setup page UI (`/auth/setup`)
2. Test the complete OAuth flow
3. Implement the main chat interface
4. Add token refresh testing
5. Implement logout functionality

For more details, see [AUTHENTICATION.md](./AUTHENTICATION.md)
