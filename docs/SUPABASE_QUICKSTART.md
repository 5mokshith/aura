# Supabase Quick Start

Get up and running with Supabase in 5 minutes.

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Enter project name: `aura-app`
4. Generate and save a strong database password
5. Select region closest to you
6. Click "Create new project"

## Step 2: Get API Keys (1 min)

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: The long key starting with `eyJhbGc...`
   - **service_role**: The other long key (keep this secret!)

## Step 3: Update Environment Variables (1 min)

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
```

## Step 4: Set Up Database (1 min)

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy all content from `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

## Step 5: Configure Google OAuth (2 min)

1. Go to **Authentication** → **Providers**
2. Find and enable **Google**
3. Enter your Google OAuth credentials:
   - Client ID: 
   - Client Secret: 
4. Click "Save"

## Step 6: Test It! (1 min)

```bash
npm run dev
```

Visit `http://localhost:3000` and try signing in with Google!

## What's Next?

- Read the full [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Explore the [database queries](../lib/supabase/queries.ts)
- Check out the [API routes](../app/api/)

## Troubleshooting

**"Invalid API key"**
- Double-check your `.env.local` file
- Make sure there are no extra spaces or quotes
- Restart your dev server

**"Failed to fetch"**
- Check your internet connection
- Verify the Supabase project URL is correct
- Make sure your Supabase project is active

**Google OAuth not working**
- Verify redirect URL: `http://localhost:3000/auth/callback`
- Check that Google provider is enabled in Supabase
- Ensure your Google OAuth credentials are correct

## Need Help?

- Check the [full documentation](./SUPABASE_SETUP.md)
- Visit [Supabase Discord](https://discord.supabase.com)
- Review [Supabase Docs](https://supabase.com/docs)

