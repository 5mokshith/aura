# Component Migration Checklist

This checklist helps you migrate existing components from the old `AuthContext` to the new `SupabaseAuthContext`.

## ✅ What's Already Done

- ✅ `SupabaseAuthContext` created with Google OAuth token management
- ✅ Database schema with `oauth_tokens` table
- ✅ API routes for auth management
- ✅ Root layout updated to use `SupabaseAuthProvider`
- ✅ Error boundary and toast notifications added

## 🔄 Components to Update

### High Priority (Auth-Related)

#### 1. Login Page
**File**: `app/(auth)/login/page.tsx`

**Changes needed**:
```tsx
// OLD
import { useAuth } from "@/contexts/AuthContext";
const { login } = useAuth();

// NEW
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
const { signInWithGoogle } = useSupabaseAuth();
```

#### 2. Settings Page - OAuth Status
**File**: `app/(dashboard)/settings/page.tsx` or `components/settings/OAuthStatus.tsx`

**Changes needed**:
```tsx
// OLD
import { useAuth } from "@/contexts/AuthContext";
const { session, logout } = useAuth();

// NEW
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
const { user, googleOAuthStatus, signOut } = useSupabaseAuth();

// Access Google OAuth info
const isConnected = googleOAuthStatus.isConnected;
const expiresAt = googleOAuthStatus.expiresAt;
const scopes = googleOAuthStatus.scopes;
```

#### 3. Top Navigation
**File**: `components/layout/TopNavigation.tsx`

**Changes needed**:
```tsx
// OLD
import { useAuth } from "@/contexts/AuthContext";
const { session, logout } = useAuth();

// NEW
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
const { user, signOut } = useSupabaseAuth();

// Display user info
<p>{user?.email}</p>
<button onClick={signOut}>Sign Out</button>
```

### Medium Priority (Data Fetching)

#### 4. Dashboard Page
**File**: `app/(dashboard)/page.tsx`

**Changes needed**:
```tsx
// OLD
import { useAuth } from "@/contexts/AuthContext";
const { session } = useAuth();

// NEW
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
const { user, isLoading } = useSupabaseAuth();

if (isLoading) return <LoadingSpinner />;
if (!user) redirect("/login");
```

#### 5. History Page
**File**: `app/(dashboard)/history/page.tsx`

**Changes needed**:
```tsx
// OLD - Fetching from old API
const response = await fetch("/api/history");

// NEW - Fetch from Supabase
import { getUserWorkflowHistory } from "@/lib/supabase/queries";
const { user } = useSupabaseAuth();
const history = await getUserWorkflowHistory(user.id);
```

#### 6. Workflow Context
**File**: `contexts/WorkflowContext.tsx`

**Changes needed**:
```tsx
// Add Supabase integration for storing workflows
import { createWorkflow, updateWorkflow } from "@/lib/supabase/queries";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

const { user } = useSupabaseAuth();

// When creating a workflow
const workflow = await createWorkflow({
  user_id: user.id,
  command: command,
  status: "planning",
  steps: [],
  results: [],
});

// When updating workflow
await updateWorkflow(workflowId, {
  status: "completed",
  results: results,
  end_time: new Date().toISOString(),
});
```

### Low Priority (Optional)

#### 7. Quick Actions Sidebar
**File**: `components/layout/QuickActionsSidebar.tsx`

**Changes needed**:
```tsx
// Store favorites in Supabase profile preferences
import { updateProfile } from "@/lib/supabase/queries";
const { user } = useSupabas
