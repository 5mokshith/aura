#***REMOVED***Component***REMOVED***Migration***REMOVED***Checklist

Quick***REMOVED***reference***REMOVED***for***REMOVED***migrating***REMOVED***components***REMOVED***from***REMOVED***old***REMOVED***`AuthContext`***REMOVED***to***REMOVED***`SupabaseAuthContext`.

##***REMOVED***✅***REMOVED***Already***REMOVED***Completed

-***REMOVED***✅***REMOVED***Database***REMOVED***schema***REMOVED***with***REMOVED***OAuth***REMOVED***token***REMOVED***storage
-***REMOVED***✅***REMOVED***SupabaseAuthContext***REMOVED***with***REMOVED***Google***REMOVED***OAuth
-***REMOVED***✅***REMOVED***API***REMOVED***routes***REMOVED***for***REMOVED***auth***REMOVED***management
-***REMOVED***✅***REMOVED***Root***REMOVED***layout***REMOVED***updated
-***REMOVED***✅***REMOVED***Error***REMOVED***boundary***REMOVED***and***REMOVED***toast***REMOVED***system

##***REMOVED***🔄***REMOVED***Import***REMOVED***Changes

###***REMOVED***Old***REMOVED***Import
```tsx
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
```

###***REMOVED***New***REMOVED***Import
```tsx
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";
```

##***REMOVED***📝***REMOVED***API***REMOVED***Changes

###***REMOVED***Authentication

|***REMOVED***Old***REMOVED***API***REMOVED***|***REMOVED***New***REMOVED***API***REMOVED***|***REMOVED***Notes***REMOVED***|
|---------|---------|-------|
|***REMOVED***`login()`***REMOVED***|***REMOVED***`signInWithGoogle()`***REMOVED***|***REMOVED***Sign***REMOVED***in***REMOVED***with***REMOVED***Google***REMOVED***|
|***REMOVED***`logout()`***REMOVED***|***REMOVED***`signOut()`***REMOVED***|***REMOVED***Sign***REMOVED***out***REMOVED***and***REMOVED***clear***REMOVED***tokens***REMOVED***|
|***REMOVED***`session`***REMOVED***|***REMOVED***`user`***REMOVED***|***REMOVED***User***REMOVED***object***REMOVED***|
|***REMOVED***`session?.email`***REMOVED***|***REMOVED***`user?.email`***REMOVED***|***REMOVED***User***REMOVED***email***REMOVED***|
|***REMOVED***`isLoading`***REMOVED***|***REMOVED***`isLoading`***REMOVED***|***REMOVED***Same***REMOVED***|
|***REMOVED***`refreshAuth()`***REMOVED***|***REMOVED***`refreshSession()`***REMOVED***|***REMOVED***Refresh***REMOVED***session***REMOVED***|

###***REMOVED***Google***REMOVED***OAuth***REMOVED***Status

```tsx
const***REMOVED***{***REMOVED***googleOAuthStatus***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***Available***REMOVED***properties:
googleOAuthStatus.isConnected***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***boolean
googleOAuthStatus.accessToken***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***string***REMOVED***|***REMOVED***null
googleOAuthStatus.refreshToken***REMOVED******REMOVED******REMOVED***//***REMOVED***string***REMOVED***|***REMOVED***null
googleOAuthStatus.expiresAt***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Date***REMOVED***|***REMOVED***null
googleOAuthStatus.scopes***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***string[]
```

###***REMOVED***Getting***REMOVED***Google***REMOVED***Access***REMOVED***Token

```tsx
const***REMOVED***{***REMOVED***getGoogleAccessToken***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***Automatically***REMOVED***refreshes***REMOVED***if***REMOVED***expired
const***REMOVED***token***REMOVED***=***REMOVED***await***REMOVED***getGoogleAccessToken();

//***REMOVED***Use***REMOVED***with***REMOVED***Google***REMOVED***APIs
fetch("https://www.googleapis.com/gmail/v1/users/me/messages",***REMOVED***{
***REMOVED******REMOVED***headers:***REMOVED***{***REMOVED***Authorization:***REMOVED***`Bearer***REMOVED***${token}`***REMOVED***}
});
```

##***REMOVED***🎯***REMOVED***Components***REMOVED***to***REMOVED***Update

###***REMOVED***1.***REMOVED***Login***REMOVED***Page
**File**:***REMOVED***`app/(auth)/login/page.tsx`

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***login***REMOVED***}***REMOVED***=***REMOVED***useAuth();
<button***REMOVED***onClick={login}>Connect***REMOVED***Google</button>

//***REMOVED***After
const***REMOVED***{***REMOVED***signInWithGoogle***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
<button***REMOVED***onClick={signInWithGoogle}>Connect***REMOVED***Google</button>
```

###***REMOVED***2.***REMOVED***Navigation
**File**:***REMOVED***`components/layout/TopNavigation.tsx`

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***session,***REMOVED***logout***REMOVED***}***REMOVED***=***REMOVED***useAuth();
<p>{session?.email}</p>
<button***REMOVED***onClick={logout}>Sign***REMOVED***Out</button>

//***REMOVED***After
const***REMOVED***{***REMOVED***user,***REMOVED***signOut***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
<p>{user?.email}</p>
<button***REMOVED***onClick={signOut}>Sign***REMOVED***Out</button>
```

###***REMOVED***3.***REMOVED***Protected***REMOVED***Pages
**File**:***REMOVED***Any***REMOVED***dashboard***REMOVED***page

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***session,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useAuth();
if***REMOVED***(isLoading)***REMOVED***return***REMOVED***<Loading***REMOVED***/>;
if***REMOVED***(!session)***REMOVED***redirect("/login");

//***REMOVED***After
const***REMOVED***{***REMOVED***user,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
if***REMOVED***(isLoading)***REMOVED***return***REMOVED***<Loading***REMOVED***/>;
if***REMOVED***(!user)***REMOVED***redirect("/login");
```

###***REMOVED***4.***REMOVED***Settings/OAuth***REMOVED***Status
**File**:***REMOVED***`components/settings/OAuthStatus.tsx`

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***session***REMOVED***}***REMOVED***=***REMOVED***useAuth();
const***REMOVED***isConnected***REMOVED***=***REMOVED***session?.oauthStatus?.isConnected;

//***REMOVED***After
const***REMOVED***{***REMOVED***googleOAuthStatus***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
const***REMOVED***isConnected***REMOVED***=***REMOVED***googleOAuthStatus.isConnected;
const***REMOVED***expiresAt***REMOVED***=***REMOVED***googleOAuthStatus.expiresAt;
const***REMOVED***scopes***REMOVED***=***REMOVED***googleOAuthStatus.scopes;
```

##***REMOVED***💾***REMOVED***Database***REMOVED***Integration

###***REMOVED***Storing***REMOVED***Workflows

```tsx
import***REMOVED***{***REMOVED***createWorkflow,***REMOVED***updateWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";

const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***Create***REMOVED***workflow
const***REMOVED***workflow***REMOVED***=***REMOVED***await***REMOVED***createWorkflow({
***REMOVED******REMOVED***user_id:***REMOVED***user!.id,
***REMOVED******REMOVED***command:***REMOVED***"Your***REMOVED***command",
***REMOVED******REMOVED***status:***REMOVED***"planning",
***REMOVED******REMOVED***steps:***REMOVED***[],
***REMOVED******REMOVED***results:***REMOVED***[],
});

//***REMOVED***Update***REMOVED***workflow
await***REMOVED***updateWorkflow(workflow.id,***REMOVED***{
***REMOVED******REMOVED***status:***REMOVED***"completed",
***REMOVED******REMOVED***results:***REMOVED***[...],
***REMOVED******REMOVED***end_time:***REMOVED***new***REMOVED***Date().toISOString(),
});
```

###***REMOVED***Fetching***REMOVED***History

```tsx
import***REMOVED***{***REMOVED***getUserWorkflowHistory***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
const***REMOVED***history***REMOVED***=***REMOVED***await***REMOVED***getUserWorkflowHistory(user!.id,***REMOVED***20);
```

###***REMOVED***Storing***REMOVED***Preferences

```tsx
import***REMOVED***{***REMOVED***updateProfile***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
await***REMOVED***updateProfile(user!.id,***REMOVED***{
***REMOVED******REMOVED***preferences:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***theme:***REMOVED***"dark",
***REMOVED******REMOVED******REMOVED******REMOVED***favoriteActions:***REMOVED***["action1",***REMOVED***"action2"],
***REMOVED******REMOVED***},
});
```

##***REMOVED***🔧***REMOVED***Testing***REMOVED***Checklist

-***REMOVED***[***REMOVED***]***REMOVED***Sign***REMOVED***in***REMOVED***with***REMOVED***Google***REMOVED***works
-***REMOVED***[***REMOVED***]***REMOVED***User***REMOVED***info***REMOVED***displays***REMOVED***correctly
-***REMOVED***[***REMOVED***]***REMOVED***Sign***REMOVED***out***REMOVED***clears***REMOVED***session
-***REMOVED***[***REMOVED***]***REMOVED***Protected***REMOVED***routes***REMOVED***redirect***REMOVED***when***REMOVED***not***REMOVED***authenticated
-***REMOVED***[***REMOVED***]***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***are***REMOVED***stored
-***REMOVED***[***REMOVED***]***REMOVED***Token***REMOVED***refresh***REMOVED***works***REMOVED***automatically
-***REMOVED***[***REMOVED***]***REMOVED***Workflows***REMOVED***save***REMOVED***to***REMOVED***database
-***REMOVED***[***REMOVED***]***REMOVED***History***REMOVED***loads***REMOVED***from***REMOVED***database
-***REMOVED***[***REMOVED***]***REMOVED***Preferences***REMOVED***persist

##***REMOVED***📚***REMOVED***Quick***REMOVED***Reference

###***REMOVED***useSupabaseAuth***REMOVED***Hook

```tsx
const***REMOVED***{
***REMOVED******REMOVED***user,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***User***REMOVED***|***REMOVED***null
***REMOVED******REMOVED***session,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Session***REMOVED***|***REMOVED***null
***REMOVED******REMOVED***isLoading,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***boolean
***REMOVED******REMOVED***error,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***string***REMOVED***|***REMOVED***null
***REMOVED******REMOVED***googleOAuthStatus,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***GoogleOAuthStatus
***REMOVED******REMOVED***signInWithGoogle,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>
***REMOVED******REMOVED***signOut,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>
***REMOVED******REMOVED***refreshSession,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>
***REMOVED******REMOVED***refreshGoogleToken,***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>
***REMOVED******REMOVED***getGoogleAccessToken,***REMOVED******REMOVED******REMOVED***//***REMOVED***()***REMOVED***=>***REMOVED***Promise<string***REMOVED***|***REMOVED***null>
}***REMOVED***=***REMOVED***useSupabaseAuth();
```

###***REMOVED***Database***REMOVED***Queries

```tsx
//***REMOVED***Profiles
getProfile(userId)
updateProfile(userId,***REMOVED***updates)
upsertProfile(profile)

//***REMOVED***Workflows
createWorkflow(workflow)
getWorkflow(workflowId)
updateWorkflow(workflowId,***REMOVED***updates)
getUserWorkflows(userId,***REMOVED***limit)

//***REMOVED***History
addWorkflowHistory(history)
getUserWorkflowHistory(userId,***REMOVED***limit)
deleteWorkflowHistory(historyId)

//***REMOVED***OAuth***REMOVED***Tokens
storeGoogleOAuthTokens(userId,***REMOVED***accessToken,***REMOVED***refreshToken,***REMOVED***expiresAt,***REMOVED***scopes)
getGoogleOAuthTokens(userId)
deleteGoogleOAuthTokens(userId)
isGoogleTokenExpired(userId)
```

##***REMOVED***🚨***REMOVED***Common***REMOVED***Issues

###***REMOVED***Issue:***REMOVED***"Cannot***REMOVED***read***REMOVED***property***REMOVED***'id'***REMOVED***of***REMOVED***null"
**Solution**:***REMOVED***Check***REMOVED***if***REMOVED***user***REMOVED***exists***REMOVED***before***REMOVED***using
```tsx
if***REMOVED***(!user)***REMOVED***return;
await***REMOVED***createWorkflow({***REMOVED***user_id:***REMOVED***user.id,***REMOVED***...***REMOVED***});
```

###***REMOVED***Issue:***REMOVED***"RLS***REMOVED***policy***REMOVED***violation"
**Solution**:***REMOVED***Ensure***REMOVED***migrations***REMOVED***ran***REMOVED***successfully***REMOVED***and***REMOVED***user***REMOVED***is***REMOVED***authenticated

###***REMOVED***Issue:***REMOVED***"Token***REMOVED***expired"
**Solution**:***REMOVED***Use***REMOVED***`getGoogleAccessToken()`***REMOVED***which***REMOVED***auto-refreshes

###***REMOVED***Issue:***REMOVED***"Redirect***REMOVED***loop"
**Solution**:***REMOVED***Check***REMOVED***middleware.ts***REMOVED***and***REMOVED***ensure***REMOVED***auth***REMOVED***routes***REMOVED***are***REMOVED***excluded

---

**Ready***REMOVED***to***REMOVED***migrate?*****REMOVED***Start***REMOVED***with***REMOVED***the***REMOVED***login***REMOVED***page***REMOVED***and***REMOVED***work***REMOVED***your***REMOVED***way***REMOVED***through***REMOVED***the***REMOVED***checklist!
