#***REMOVED***Component***REMOVED***Migration***REMOVED***Checklist

This***REMOVED***checklist***REMOVED***helps***REMOVED***you***REMOVED***migrate***REMOVED***existing***REMOVED***components***REMOVED***from***REMOVED***the***REMOVED***old***REMOVED***`AuthContext`***REMOVED***to***REMOVED***the***REMOVED***new***REMOVED***`SupabaseAuthContext`.

##***REMOVED***✅***REMOVED***What's***REMOVED***Already***REMOVED***Done

-***REMOVED***✅***REMOVED***`SupabaseAuthContext`***REMOVED***created***REMOVED***with***REMOVED***Google***REMOVED***OAuth***REMOVED***token***REMOVED***management
-***REMOVED***✅***REMOVED***Database***REMOVED***schema***REMOVED***with***REMOVED***`oauth_tokens`***REMOVED***table
-***REMOVED***✅***REMOVED***API***REMOVED***routes***REMOVED***for***REMOVED***auth***REMOVED***management
-***REMOVED***✅***REMOVED***Root***REMOVED***layout***REMOVED***updated***REMOVED***to***REMOVED***use***REMOVED***`SupabaseAuthProvider`
-***REMOVED***✅***REMOVED***Error***REMOVED***boundary***REMOVED***and***REMOVED***toast***REMOVED***notifications***REMOVED***added

##***REMOVED***🔄***REMOVED***Components***REMOVED***to***REMOVED***Update

###***REMOVED***High***REMOVED***Priority***REMOVED***(Auth-Related)

####***REMOVED***1.***REMOVED***Login***REMOVED***Page
**File**:***REMOVED***`app/(auth)/login/page.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***OLD
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
const***REMOVED***{***REMOVED***login***REMOVED***}***REMOVED***=***REMOVED***useAuth();

//***REMOVED***NEW
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";
const***REMOVED***{***REMOVED***signInWithGoogle***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
```

####***REMOVED***2.***REMOVED***Settings***REMOVED***Page***REMOVED***-***REMOVED***OAuth***REMOVED***Status
**File**:***REMOVED***`app/(dashboard)/settings/page.tsx`***REMOVED***or***REMOVED***`components/settings/OAuthStatus.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***OLD
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
const***REMOVED***{***REMOVED***session,***REMOVED***logout***REMOVED***}***REMOVED***=***REMOVED***useAuth();

//***REMOVED***NEW
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";
const***REMOVED***{***REMOVED***user,***REMOVED***googleOAuthStatus,***REMOVED***signOut***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***Access***REMOVED***Google***REMOVED***OAuth***REMOVED***info
const***REMOVED***isConnected***REMOVED***=***REMOVED***googleOAuthStatus.isConnected;
const***REMOVED***expiresAt***REMOVED***=***REMOVED***googleOAuthStatus.expiresAt;
const***REMOVED***scopes***REMOVED***=***REMOVED***googleOAuthStatus.scopes;
```

####***REMOVED***3.***REMOVED***Top***REMOVED***Navigation
**File**:***REMOVED***`components/layout/TopNavigation.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***OLD
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
const***REMOVED***{***REMOVED***session,***REMOVED***logout***REMOVED***}***REMOVED***=***REMOVED***useAuth();

//***REMOVED***NEW
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";
const***REMOVED***{***REMOVED***user,***REMOVED***signOut***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***Display***REMOVED***user***REMOVED***info
<p>{user?.email}</p>
<button***REMOVED***onClick={signOut}>Sign***REMOVED***Out</button>
```

###***REMOVED***Medium***REMOVED***Priority***REMOVED***(Data***REMOVED***Fetching)

####***REMOVED***4.***REMOVED***Dashboard***REMOVED***Page
**File**:***REMOVED***`app/(dashboard)/page.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***OLD
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
const***REMOVED***{***REMOVED***session***REMOVED***}***REMOVED***=***REMOVED***useAuth();

//***REMOVED***NEW
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";
const***REMOVED***{***REMOVED***user,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

if***REMOVED***(isLoading)***REMOVED***return***REMOVED***<LoadingSpinner***REMOVED***/>;
if***REMOVED***(!user)***REMOVED***redirect("/login");
```

####***REMOVED***5.***REMOVED***History***REMOVED***Page
**File**:***REMOVED***`app/(dashboard)/history/page.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***OLD***REMOVED***-***REMOVED***Fetching***REMOVED***from***REMOVED***old***REMOVED***API
const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/history");

//***REMOVED***NEW***REMOVED***-***REMOVED***Fetch***REMOVED***from***REMOVED***Supabase
import***REMOVED***{***REMOVED***getUserWorkflowHistory***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";
const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
const***REMOVED***history***REMOVED***=***REMOVED***await***REMOVED***getUserWorkflowHistory(user.id);
```

####***REMOVED***6.***REMOVED***Workflow***REMOVED***Context
**File**:***REMOVED***`contexts/WorkflowContext.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***Add***REMOVED***Supabase***REMOVED***integration***REMOVED***for***REMOVED***storing***REMOVED***workflows
import***REMOVED***{***REMOVED***createWorkflow,***REMOVED***updateWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";

const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***When***REMOVED***creating***REMOVED***a***REMOVED***workflow
const***REMOVED***workflow***REMOVED***=***REMOVED***await***REMOVED***createWorkflow({
***REMOVED******REMOVED***user_id:***REMOVED***user.id,
***REMOVED******REMOVED***command:***REMOVED***command,
***REMOVED******REMOVED***status:***REMOVED***"planning",
***REMOVED******REMOVED***steps:***REMOVED***[],
***REMOVED******REMOVED***results:***REMOVED***[],
});

//***REMOVED***When***REMOVED***updating***REMOVED***workflow
await***REMOVED***updateWorkflow(workflowId,***REMOVED***{
***REMOVED******REMOVED***status:***REMOVED***"completed",
***REMOVED******REMOVED***results:***REMOVED***results,
***REMOVED******REMOVED***end_time:***REMOVED***new***REMOVED***Date().toISOString(),
});
```

###***REMOVED***Low***REMOVED***Priority***REMOVED***(Optional)

####***REMOVED***7.***REMOVED***Quick***REMOVED***Actions***REMOVED***Sidebar
**File**:***REMOVED***`components/layout/QuickActionsSidebar.tsx`

**Changes***REMOVED***needed**:
```tsx
//***REMOVED***Store***REMOVED***favorites***REMOVED***in***REMOVED***Supabase***REMOVED***profile***REMOVED***preferences
import***REMOVED***{***REMOVED***updateProfile***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";
const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabas