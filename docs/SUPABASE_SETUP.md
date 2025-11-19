# Supabase Setup Guide

This guide explains how to set up Supabase for authentication and database in AURA.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Supabase CLI (optional, for local development)

## Quick Start

### 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: aura-app (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (safe to use in client-side code)
   - **service_role key**: `eyJhbGc...` (keep secret, server-side only)

### 3. Configure Environment Variables

Update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
```

### 4. Set Up Database Schema

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Configure Google OAuth

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to expand
3. Enable Google provider
4. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
5. Add authorized redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
6. Configure OAuth scopes (optional):
   ```
   https://www.googleapis.com/auth/gmail.modify
   https://www.googleapis.com/auth/drive.file
   https://www.googleapis.com/auth/documents
   https://www.googleapis.com/auth/spreadsheets
   https://www.googleapis.com/auth/calendar
   ```
7. Click "Save"

### 6. Configure Email Settings (Optional)

For email confirmations and password resets:

1. Go to **Authentication** > **Email Templates**
2. Customize templates as needed
3. Go to **Settings** > **Auth**
4. Configure:
   - **Site URL**: Your production URL
   - **Redirect URLs**: Add allowed redirect URLs
   - **Email Auth**: Enable/disable as needed

## Database Schema

### Tables

#### `profiles`
Stores user profile information.

```sql
- id: UUID (references auth.users)
- email: TEXT
- full_name: TEXT
- avatar_url: TEXT
- preferences: JSONB
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `workflows`
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

#### `workflow_history`
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

## Usage in Your App

### Client-Side Authentication

```tsx
"use client";

import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

export default function LoginButton() {
  const { signInWithGoogle, signOut, user, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}
```

### Server-Side Data Fetching

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.full_name}</p>
    </div>
  );
}
```

### Using Database Queries

```tsx
import { getProfile, updateProfile, getUserWorkflows } from "@/lib/supabase/queries";

// Get user profile
const profile = await getProfile(userId);

// Update profile
const updated = await updateProfile(userId, {
  full_name: "John Doe",
  preferences: { theme: "dark" }
});

// Get user workflows
const workflows = await getUserWorkflows(userId, 10);
```

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

- Users can only access their own data
- Automatic user profile creation on signup
- Secure data isolation between users

## Real-time Subscriptions (Optional)

Subscribe to real-time changes:

```tsx
const supabase = createClient();

// Subscribe to workflow updates
const channel = supabase
  .channel('workflow-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'workflows',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Workflow updated:', payload);
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

## Local Development with Supabase CLI

### Setup

```bash
# Initialize Supabase in your project
supabase init

# Start local Supabase (Docker required)
supabase start

# This will start:
# - PostgreSQL database
# - Auth server
# - Storage server
# - Realtime server
```

### Local Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
```

### Generate TypeScript Types

```bash
# Generate types from your database schema
npx supabase gen types typescript --project-id your-project-ref > lib/supabase/database.types.ts
```

## Security Best Practices

1. **Never expose service_role key** in client-side code
2. **Use RLS policies** for all tables
3. **Validate user input** before database operations
4. **Use prepared statements** (Supabase does this automatically)
5. **Enable MFA** for admin accounts
6. **Regularly rotate** API keys
7. **Monitor** authentication logs in Supabase dashboard

## Troubleshooting

### "Invalid API key"
- Verify your API keys in `.env.local`
- Check that you're using the correct project URL
- Ensure keys are not wrapped in quotes

### "Row Level Security policy violation"
- Check that RLS policies are set up correctly
- Verify user is authenticated
- Check that `auth.uid()` matches the user_id in queries

### "Failed to fetch"
- Check network connectivity
- Verify Supabase project is running
- Check CORS settings in Supabase dashboard

### Google OAuth not working
- Verify redirect URLs match exactly
- Check Google OAuth credentials are correct
- Ensure Google provider is enabled in Supabase

## Migration from Existing Auth

If migrating from the existing Google OAuth setup:

1. Keep both auth systems running initially
2. Update components to use `useSupabaseAuth` instead of `useAuth`
3. Migrate user data to Supabase profiles table
4. Test thoroughly before removing old auth code
5. Update all API routes to use Supabase auth

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Support

For issues or questions:
- Check [Supabase Discord](https://discord.supabase.com)
- Review [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- Contact Supabase support through dashboard

