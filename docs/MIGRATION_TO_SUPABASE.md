# Migration Guide: From Custom Auth to Supabase

This guide helps you migrate from the existing Google OAuth implementation to Supabase.

## Overview

**What's changing:**
- Authentication now handled by Supabase Auth
- User sessions managed by Supabase
- Database operations use Supabase client
- Middleware handles auth state automatically

**What stays the same:**
- Google OAuth flow (users won't notice a difference)
- Same OAuth scopes for Google APIs
- Similar API structure
- Component interfaces remain familiar

## Migration Steps

### Phase 1: Setup (15 minutes)

1. **Install dependencies** ✅ (Already done)
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Configure environment variables** ✅ (Already done)
   - Update `.env.local` with Supabase credentials

3. **Set up database schema** (Do this now)
   - Run the SQL migration in Supabase dashboard
   - See [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)

4. **Configure Google OAuth in Supabase** (Do this now)
   - Enable Google provider
   - Add your OAuth credentials

### Phase 2: Update Components (30 minutes)

#### Update Auth Provider

**Old way:**
```tsx
import { AuthProvider } from "@/contexts/AuthContext";

<AuthProvider>
  <App />
</AuthProvider>
```

**New way:**
```tsx
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

<SupabaseAuthProvider>
  <App />
</SupabaseAuthProvider>
```

#### Update Auth Hook Usage

**Old way:**
```tsx
import { useAuth } from "@/contexts/AuthContext";

const { session, isLoading, login, logout } = useAuth();

// Check if authenticated
if (session?.isAuthenticated) {
  // User is logged in
}
```

**New way:**
```tsx
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

const { user, session, isLoading, signInWithGoogle, signOut } = useSupabaseAuth();

// Check if authenticated
if (user) {
  // User is logged in
}
```

#### Component Migration Examples

**Login Button:**

```tsx
// Before
const { login } = useAuth();
<button onClick={login}>Connect Google Account</button>

// After
const { signInWithGoogle } = useSupabaseAuth();
<button onClick={signInWithGoogle}>Connect Google Account</button>
```

**Logout Button:**

```tsx
// Before
const { logout } = useAuth();
<button onClick={logout}>Disconnect</button>

// After
const { signOut } = useSupabaseAuth();
<button onClick={signOut}>Sign Out</button>
```

**User Info Display:**

```tsx
// Before
const { session } = useAuth();
<p>Welcome, {session?.email}!</p>

// After
const { user } = useSupabaseAuth();
<p>Welcome, {user?.email}!</p>
```

### Phase 3: Update API Routes (20 minutes)

#### Authentication Check

**Old way:**
```tsx
// Custom auth check
const session = await getSession(request);
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**New way:**
```tsx
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

#### Database Operations

**Old way:**
```tsx
// Custom database queries
const profile = await db.query("SELECT * FROM profiles WHERE id = ?", [userId]);
```

**New way:**
```tsx
import { getProfile } from "@/lib/supabase/queries";

const profile = await getProfile(userId);
```

### Phase 4: Update Protected Routes (10 minutes)

The middleware now handles route protection automatically!

**Old way:**
```tsx
// Manual redirect in each page
useEffect(() => {
  if (!session?.isAuthenticated) {
    router.push("/login");
  }
}, [session]);
```

**New way:**
```tsx
// Middleware handles it automatically!
// Just use the auth hook to show loading state
const { user, isLoading } = useSupabaseAuth();

if (isLoading) return <LoadingSpinner />;
// If not authenticated, middleware already redirected
```

### Phase 5: Testing (15 minutes)

1. **Test authentication flow:**
   - Sign in with Google
   - Verify redirect to dashboard
   - Check user profile loads
   - Test sign out

2. **Test protected routes:**
   - Try accessing `/dashboard` without auth
   - Should redirect to `/login`
   - Sign in and verify access granted

3. **Test API routes:**
   - Create a workflow
   - Fetch workflows
   - Update profile

4. **Test error handling:**
   - Invalid credentials
   - Network errors
   - Session expiration

## Component Mapping Reference

| Old | New | Notes |
|-----|-----|-------|
| `useAuth()` | `useSupabaseAuth()` | Different return values |
| `session.isAuthenticated` | `user !== null` | Check user object instead |
| `session.email` | `user.email` | Direct user properties |
| `login()` | `signInWithGoogle()` | More explicit naming |
| `logout()` | `signOut()` | Standard Supabase naming |
| `refreshAuth()` | `refreshSession()` | Handled automatically |

## Database Query Migration

### Old Pattern
```tsx
const response = await fetch("/api/workflows");
const data = await response.json();
```

### New Pattern (Client-side)
```tsx
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data, error } = await supabase
  .from("workflows")
  .select("*")
  .eq("user_id", user.id);
```

### New Pattern (Server-side)
```tsx
import { getUserWorkflows } from "@/lib/supabase/queries";

const workflows = await getUserWorkflows(userId);
```

## Rollback Plan

If you need to rollback:

1. Keep old auth files (don't delete yet)
2. Switch provider back in root layout
3. Revert API route changes
4. Update components to use old hooks

## Common Issues

### "Invalid API key"
- Check `.env.local` has correct Supabase keys
- Restart dev server after changing env vars

### "User not found"
- Ensure database migration ran successfully
- Check RLS policies are set up
- Verify user profile was created on signup

### "Redirect loop"
- Check middleware configuration
- Verify protected paths are correct
- Clear browser cookies and try again

### Google OAuth not working
- Verify redirect URL in Supabase matches exactly
- Check Google OAuth credentials are correct
- Ensure Google provider is enabled

## Benefits of Migration

✅ **Automatic session management** - No manual token refresh
✅ **Built-in security** - Row Level Security out of the box
✅ **Real-time capabilities** - Subscribe to database changes
✅ **Better DX** - Type-safe queries with TypeScript
✅ **Scalability** - Supabase handles infrastructure
✅ **Monitoring** - Built-in auth logs and analytics

## Next Steps

After migration:

1. Remove old auth files (after thorough testing)
2. Set up real-time subscriptions for workflows
3. Configure email templates in Supabase
4. Enable MFA for enhanced security
5. Set up database backups
6. Monitor auth logs in Supabase dashboard

## Need Help?

- Review [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup
- Check [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md) for quick reference
- Visit [Supabase Discord](https://discord.supabase.com) for community support

