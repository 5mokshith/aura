# Environment Setup Guide

This guide walks you through setting up all required environment variables for AURA.

## Quick Start

1. **Copy the template:**
   ```bash
   cp .env.local.template .env.local
   ```

2. **Fill in the required values** (see sections below)

3. **Validate your configuration:**
   ```bash
   npm run validate-env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Required Configuration

### 1. Supabase Setup

AURA uses Supabase for database, authentication, and real-time updates.

1. **Create a Supabase project:**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Click "New Project"
   - Choose a name and password

2. **Get your credentials:**
   - Go to Project Settings → API
   - Copy the following values to `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret!)

3. **Run database migrations:**
   ```bash
   # See supabase/migrations/ for SQL files
   # Apply them in the Supabase SQL Editor
   ```

### 2. Google OAuth Setup

AURA needs Google OAuth to access Google Workspace APIs.

1. **Create OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"

2. **Configure authorized redirect URIs:**
   - For development: `http://localhost:3000/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`

3. **Copy credentials to `.env.local`:**
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   ```

4. **Enable required APIs:**
   - Gmail API
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Calendar API

### 3. Encryption Key

Generate a secure encryption key for storing OAuth tokens:

```bash
openssl rand -base64 32
```

Copy the output to `.env.local`:
```env
ENCRYPTION_KEY=your_generated_key_here
```

**Important:** Never commit this key to version control!

### 4. LLM Configuration

AURA supports multiple LLM providers. Choose one:

#### Option A: Google Gemini (Recommended)

1. **Get API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Create API Key"

2. **Configure in `.env.local`:**
   ```env
   LLM_PROVIDER=gemini
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
   ```

#### Option B: OpenAI

1. **Get API key:**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new secret key

2. **Configure in `.env.local`:**
   ```env
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

#### Option C: Anthropic Claude

1. **Get API key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Create new API key

2. **Configure in `.env.local`:**
   ```env
   LLM_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your_api_key_here
   ANTHROPIC_MODEL=claude-3-opus-20240229
   ```

### 5. Next.js Configuration

Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

Configure in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

## Optional Configuration

### Backend BFF URL

If you're using a separate backend service:

```env
BFF_API_URL=http://localhost:8000
```

### LLM Settings

Fine-tune LLM behavior:

```env
LLM_TEMPERATURE=0.7        # Creativity (0.0-1.0)
GEMINI_MAX_TOKENS=8192     # Max response length
LLM_MAX_RETRIES=3          # Retry attempts on failure
LLM_TIMEOUT=30000          # Timeout in milliseconds
```

## Validation

After configuring your environment, validate it:

```bash
npm run validate-env
```

This will check:
- ✓ All required variables are set
- ✓ URLs are valid
- ✓ Encryption key is properly formatted
- ✓ LLM provider is configured correctly

## Troubleshooting

### "Missing required environment variable"

Make sure you've copied `.env.local.template` to `.env.local` and filled in all required values.

### "Invalid ENCRYPTION_KEY format"

The encryption key must be a base64-encoded 32-byte key. Generate a new one:

```bash
openssl rand -base64 32
```

### "Supabase connection error"

1. Check that your Supabase URL is correct
2. Verify your API keys are valid
3. Ensure your Supabase project is active

### "Google OAuth configuration error"

1. Verify your Client ID and Secret are correct
2. Check that the redirect URI matches your Google Console configuration
3. Ensure all required APIs are enabled in Google Cloud Console

### "Invalid LLM_PROVIDER"

The provider must be one of: `gemini`, `openai`, or `anthropic`

## Security Best Practices

1. **Never commit `.env.local` to version control**
   - It's already in `.gitignore`
   - Double-check before pushing

2. **Use different keys for development and production**
   - Generate new keys for each environment
   - Never use development keys in production

3. **Rotate keys regularly**
   - Especially after team member changes
   - Update both ENCRYPTION_KEY and NEXTAUTH_SECRET

4. **Keep service role keys secret**
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
   - Only use in server-side code (API routes)

5. **Enable Row Level Security (RLS) in Supabase**
   - Protect your data even if keys are compromised
   - See Supabase documentation for RLS setup

## Production Deployment

When deploying to production:

1. **Update URLs:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   ```

2. **Generate new secrets:**
   ```bash
   openssl rand -base64 32  # For NEXTAUTH_SECRET
   openssl rand -base64 32  # For ENCRYPTION_KEY
   ```

3. **Configure environment variables in your hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - AWS/GCP: Use secrets manager

4. **Update Google OAuth redirect URIs:**
   - Add production URL to authorized redirect URIs
   - Keep development URL for local testing

5. **Test thoroughly:**
   - Verify OAuth flow works
   - Test all Google Workspace integrations
   - Check Supabase connection

## Need Help?

- Check the [Setup Checklist](../SETUP_CHECKLIST.md)
- Review [Supabase Integration Guide](../SUPABASE_INTEGRATION.md)
- See [Quick Start Guide](../QUICK_START.md)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | Yes | OAuth callback URL |
| `ENCRYPTION_KEY` | Yes | 32-byte base64 key for token encryption |
| `LLM_PROVIDER` | Yes | LLM provider: gemini, openai, or anthropic |
| `GOOGLE_GEMINI_API_KEY` | If using Gemini | Gemini API key |
| `OPENAI_API_KEY` | If using OpenAI | OpenAI API key |
| `ANTHROPIC_API_KEY` | If using Anthropic | Anthropic API key |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret key |
| `BFF_API_URL` | No | Backend BFF URL (if separate) |
| `LLM_TEMPERATURE` | No | LLM temperature (default: 0.7) |
| `GEMINI_MAX_TOKENS` | No | Max tokens (default: 8192) |
| `LLM_MAX_RETRIES` | No | Max retry attempts (default: 3) |
| `LLM_TIMEOUT` | No | Timeout in ms (default: 30000) |
