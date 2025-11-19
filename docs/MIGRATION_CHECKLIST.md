# Component Migration Checklist

Quick reference for migrating components from old `AuthContext` to `SupabaseAuthContext`.

## ✅ Already Completed

- ✅ Database schema with OAuth token storage
- ✅ SupabaseAuthContext with Google OAuth
- ✅ API routes for auth management
- ✅ Root layout updated
- ✅ Error boundary and toast system

## 🔄 Import Changes

### Old Import
```tsx
import { useAuth } from "@/contexts/AuthContext";
```

### New Import
```tsx
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
```

## 📝 API Changes

### Authentication

| Old API | New API | Notes |
|---------|---------|-------|
| `login()` | `signInWithGoogle()` | Sign in with Google |
| `logout()` | `signOut()` | Sign out and clear tokens |
| `session` | `user` | User object |
| `session?.email` | `user?.email` | User email |
| `isLoading` | `isLoading` | Same |
| `refreshAuth()` | `refreshSession()` | Refresh session |

### Google OAuth Status

```tsx
const { googleOAuthStatus } = useSupabaseAuth();

// Available properties:
googleOAuthStatus.isConnected    // boolean
googleOAuthStatus.accessToken    // string | null
googleOAuthStatus.refreshToken   // string | null
googleOAuthStatus.expiresAt      // Date | null
googleOAuthStatus.scopes         // string[]
```

### Getting Google Access Token

```tsx
const { getGoogleAccessToken } = useSupabaseAuth();

// Automatically refreshes if expired
const token = await getGoogleAccessToken();

// Use with Google APIs
fetch("https://www.googleapis.com/gmail/v1/users/me/messages", {
  headers: { Authorization: `Bearer ${token}` }
});
```

## 🎯 Components to Update

### 1. Login Page
**File**: `app/(auth)/login/page.tsx`

```tsx
// Before
const { login } = useAuth();
<button onClick={login}>Connect Google</button>

// After
const { signInWithGoogle } = useSupabaseAuth();
<button onClick={signInWithGoogle}>Connect Google</button>
```

### 2. Navigation
**File**: `components/layout/TopNavigation.tsx`

```tsx
// Before
const { session, logout } = useAuth();
<p>{session?.email}</p>
<button onClick={logout}>Sign Out</button>

// After
const { user, signOut } = useSupabaseAuth();
<p>{user?.email}</p>
<button onClick={signOut}>Sign Out</button>
```

### 3. Protected Pages
**File**: Any dashboard page

```tsx
// Before
const { session, isLoading } = useAuth();
if (isLoading) return <Loading />;
if (!session) redirect("/login");

// After
const { user, isLoading } = useSupabaseAuth();
if (isLoading) return <Loading />;
if (!user) redirect("/login");
```

### 4. Settings/OAuth Status
**File**: `components/settings/OAuthStatus.tsx`

```tsx
// Before
const { session } = useAuth();
const isConnected = session?.oauthStatus?.isConnected;

// After
const { googleOAuthStatus } = useSupabaseAuth();
const isConnected = googleOAuthStatus.isConnected;
const expiresAt = googleOAuthStatus.expiresAt;
const scopes = googleOAuthStatus.scopes;
```

## 💾 Database Integration

### Storing Workflows

```tsx
import { createWorkflow, updateWorkflow } from "@/lib/supabase/queries";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

const { user } = useSupabaseAuth();

// Create workflow
const workflow = await createWorkflow({
  user_id: user!.id,
  command: "Your command",
  status: "planning",
  steps: [],
  results: [],
});

// Update workflow
await updateWorkflow(workflow.id, {
  status: "completed",
  results: [...],
  end_time: new Date().toISOString(),
});
```

### Fetching History

```tsx
import { getUserWorkflowHistory } from "@/lib/supabase/queries";

const { user } = useSupabaseAuth();
const history = await getUserWorkflowHistory(user!.id, 20);
```

### Storing Preferences

```tsx
import { updateProfile } from "@/lib/supabase/queries";

const { user } = useSupabaseAuth();
await updateProfile(user!.id, {
  preferences: {
    theme: "dark",
    favoriteActions: ["action1", "action2"],
  },
});
```

## 🔧 Testing Checklist

- [ ] Sign in with Google works
- [ ] User info displays correctly
- [ ] Sign out clears session
- [ ] Protected routes redirect when not authenticated
- [ ] Google OAuth tokens are stored
- [ ] Token refresh works automatically
- [ ] Workflows save to database
- [ ] History loads from database
- [ ] Preferences persist

## 📚 Quick Reference

### useSupabaseAuth Hook

```tsx
const {
  user,                    // User | null
  session,                 // Session | null
  isLoading,              // boolean
  error,                  // string | null
  googleOAuthStatus,      // GoogleOAuthStatus
  signInWithGoogle,       // () => Promise<void>
  signOut,                // () => Promise<void>
  refreshSession,         // () => Promise<void>
  refreshGoogleToken,     // () => Promise<void>
  getGoogleAccessToken,   // () => Promise<string | null>
} = useSupabaseAuth();
```

### Database Queries

```tsx
// Profiles
getProfile(userId)
updateProfile(userId, updates)
upsertProfile(profile)

// Workflows
createWorkflow(workflow)
getWorkflow(workflowId)
updateWorkflow(workflowId, updates)
getUserWorkflows(userId, limit)

// History
addWorkflowHistory(history)
getUserWorkflowHistory(userId, limit)
deleteWorkflowHistory(historyId)

// OAuth Tokens
storeGoogleOAuthTokens(userId, accessToken, refreshToken, expiresAt, scopes)
getGoogleOAuthTokens(userId)
deleteGoogleOAuthTokens(userId)
isGoogleTokenExpired(userId)
```

## 🚨 Common Issues

### Issue: "Cannot read property 'id' of null"
**Solution**: Check if user exists before using
```tsx
if (!user) return;
await createWorkflow({ user_id: user.id, ... });
```

### Issue: "RLS policy violation"
**Solution**: Ensure migrations ran successfully and user is authenticated

### Issue: "Token expired"
**Solution**: Use `getGoogleAccessToken()` which auto-refreshes

### Issue: "Redirect loop"
**Solution**: Check middleware.ts and ensure auth routes are excluded

---

**Ready to migrate?** Start with the login page and work your way through the checklist!

