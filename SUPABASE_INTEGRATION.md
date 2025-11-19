# Supabase Integration for AURA

This document provides an overview of the Supabase integration in AURA.

## What's Been Set Up

### ✅ Core Infrastructure

1. **Supabase Client Utilities**
   - Browser client (`lib/supabase/client.ts`)
   - Server client (`lib/supabase/server.ts`)
   - Middleware utilities (`lib/supabase/middleware.ts`)

2. **Authentication**
   - Supabase Auth context (`contexts/SupabaseAuthContext.tsx`)
   - Google OAuth integration
   - Automatic session management
   - Protected route middleware (`middleware.ts`)

3. **Database**
   - Type-safe database schema (`lib/supabase/database.types.ts`)
   - Pre-built query helpers (`lib/supabase/queries.ts`)
   - SQL migrations (`supabase/migrations/001_initial_schema.sql`)

4. **API Routes**
   - Profile management (`app/api/profile/route.ts`)
   - Workflow operations (`app/api/workflows/route.ts`)

### ✅ Documentation

- **Quick Start**: [docs/SUPABASE_QUICKSTART.md](docs/SUPABASE_QUICKSTART.md)
- **Full Setup Guide**: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
- **Migration Guide**: [docs/MIGRATION_TO_SUPABASE.md](docs/MIGRATION_TO_SUPABASE.md)
- **Setup Checklist**: [docs/SUPABASE_CHECKLIST.md](docs/SUPABASE_CHECKLIST.md)
- **Usage Guide**: [lib/supabase/README.md](lib/supabase/README.md)

## Quick Start

### 1. Install Dependencies ✅

Already installed:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Configure Environment Variables

Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
```

### 3. Set Up Supabase Project

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL migration from `supabase/migrations/001_initial_schema.sql`
3. Enable Google OAuth provider
4. Add your Google OAuth credentials

### 4. Start Using Supabase

```tsx
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

function MyComponent() {
  const { user, signInWithGoogle, signOut } = useSupabaseAuth();
  
  if (!user) {
    return <button onClick={signInWithGoogle}>Sign In</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Database Schema

### Tables

**profiles**
- User profile information
- Automatically created on signup
- Stores preferences and settings

**workflows**
- Workflow execution data
- Tracks status and results
- Linked to user profiles

**workflow_history**
- Historical workflow executions
- Audit trail for user actions
- Searchable and filterable

## Key Features

### 🔐 Authentication
- Google OAuth integration
- Automatic session management
- Protected routes via middleware
- Token refresh handled automatically

### 💾 Database
- Type-safe queries with TypeScript
- Row Level Security (RLS) enabled
- Automatic timestamps
- Pre-built query helpers

### 🛡️ Security
- RLS policies on all tables
- Users can only access their own data
- Service role key kept server-side
- Automatic auth checks in middleware

### 📊 Real-time (Optional)
- Subscribe to database changes
- Live workflow updates
- Real-time notifications

## File Structure

```
├── lib/supabase/
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   ├── middleware.ts          # Middleware utilities
│   ├── database.types.ts      # TypeScript types
│   ├── queries.ts             # Query helpers
│   └── README.md              # Usage guide
├── contexts/
│   └── SupabaseAuthContext.tsx # Auth context
├── middleware.ts              # Route protection
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
├── app/api/
│   ├── profile/route.ts       # Profile API
│   └── workflows/route.ts     # Workflows API
└── docs/
    ├── SUPABASE_QUICKSTART.md
    ├── SUPABASE_SETUP.md
    ├── MIGRATION_TO_SUPABASE.md
    └── SUPABASE_CHECKLIST.md
```

## Next Steps

1. **Set up Supabase project** - Follow [SUPABASE_QUICKSTART.md](docs/SUPABASE_QUICKSTART.md)
2. **Configure environment** - Add your Supabase credentials
3. **Run database migration** - Set up tables and RLS policies
4. **Test authentication** - Try signing in with Google
5. **Migrate components** - Follow [MIGRATION_TO_SUPABASE.md](docs/MIGRATION_TO_SUPABASE.md)

## Benefits

✅ **Automatic session management** - No manual token refresh needed
✅ **Built-in security** - Row Level Security protects user data
✅ **Type safety** - Full TypeScript support
✅ **Scalability** - Supabase handles infrastructure
✅ **Real-time** - Optional real-time subscriptions
✅ **Monitoring** - Built-in auth logs and analytics
✅ **Developer experience** - Simple, intuitive API

## Support

- **Documentation**: See `docs/` folder
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

## Migration from Old Auth

If you're migrating from the existing Google OAuth setup:

1. Review [MIGRATION_TO_SUPABASE.md](docs/MIGRATION_TO_SUPABASE.md)
2. Follow the phase-by-phase migration guide
3. Test thoroughly before removing old code
4. Keep rollback plan ready

## Troubleshooting

Common issues and solutions:

- **"Invalid API key"** - Check `.env.local` and restart server
- **"Unauthorized"** - Verify RLS policies and auth state
- **"Failed to fetch"** - Check network and Supabase project status
- **Google OAuth issues** - Verify redirect URLs and credentials

See [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for detailed troubleshooting.

---

**Ready to get started?** Follow the [Quick Start Guide](docs/SUPABASE_QUICKSTART.md)!

