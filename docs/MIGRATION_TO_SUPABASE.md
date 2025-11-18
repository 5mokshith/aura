#***REMOVED***Migration***REMOVED***Guide:***REMOVED***From***REMOVED***Custom***REMOVED***Auth***REMOVED***to***REMOVED***Supabase

This***REMOVED***guide***REMOVED***helps***REMOVED***you***REMOVED***migrate***REMOVED***from***REMOVED***the***REMOVED***existing***REMOVED***Google***REMOVED***OAuth***REMOVED***implementation***REMOVED***to***REMOVED***Supabase.

##***REMOVED***Overview

**What's***REMOVED***changing:**
-***REMOVED***Authentication***REMOVED***now***REMOVED***handled***REMOVED***by***REMOVED***Supabase***REMOVED***Auth
-***REMOVED***User***REMOVED***sessions***REMOVED***managed***REMOVED***by***REMOVED***Supabase
-***REMOVED***Database***REMOVED***operations***REMOVED***use***REMOVED***Supabase***REMOVED***client
-***REMOVED***Middleware***REMOVED***handles***REMOVED***auth***REMOVED***state***REMOVED***automatically

**What***REMOVED***stays***REMOVED***the***REMOVED***same:**
-***REMOVED***Google***REMOVED***OAuth***REMOVED***flow***REMOVED***(users***REMOVED***won't***REMOVED***notice***REMOVED***a***REMOVED***difference)
-***REMOVED***Same***REMOVED***OAuth***REMOVED***scopes***REMOVED***for***REMOVED***Google***REMOVED***APIs
-***REMOVED***Similar***REMOVED***API***REMOVED***structure
-***REMOVED***Component***REMOVED***interfaces***REMOVED***remain***REMOVED***familiar

##***REMOVED***Migration***REMOVED***Steps

###***REMOVED***Phase***REMOVED***1:***REMOVED***Setup***REMOVED***(15***REMOVED***minutes)

1.***REMOVED*****Install***REMOVED***dependencies*****REMOVED***✅***REMOVED***(Already***REMOVED***done)
***REMOVED******REMOVED******REMOVED***```bash
***REMOVED******REMOVED******REMOVED***npm***REMOVED***install***REMOVED***@supabase/supabase-js***REMOVED***@supabase/ssr
***REMOVED******REMOVED******REMOVED***```

2.***REMOVED*****Configure***REMOVED***environment***REMOVED***variables*****REMOVED***✅***REMOVED***(Already***REMOVED***done)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***`.env.local`***REMOVED***with***REMOVED***Supabase***REMOVED***credentials

3.***REMOVED*****Set***REMOVED***up***REMOVED***database***REMOVED***schema*****REMOVED***(Do***REMOVED***this***REMOVED***now)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Run***REMOVED***the***REMOVED***SQL***REMOVED***migration***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard
***REMOVED******REMOVED******REMOVED***-***REMOVED***See***REMOVED***[SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)

4.***REMOVED*****Configure***REMOVED***Google***REMOVED***OAuth***REMOVED***in***REMOVED***Supabase*****REMOVED***(Do***REMOVED***this***REMOVED***now)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Enable***REMOVED***Google***REMOVED***provider
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***your***REMOVED***OAuth***REMOVED***credentials

###***REMOVED***Phase***REMOVED***2:***REMOVED***Update***REMOVED***Components***REMOVED***(30***REMOVED***minutes)

####***REMOVED***Update***REMOVED***Auth***REMOVED***Provider

**Old***REMOVED***way:**
```tsx
import***REMOVED***{***REMOVED***AuthProvider***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";

<AuthProvider>
***REMOVED******REMOVED***<App***REMOVED***/>
</AuthProvider>
```

**New***REMOVED***way:**
```tsx
import***REMOVED***{***REMOVED***SupabaseAuthProvider***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";

<SupabaseAuthProvider>
***REMOVED******REMOVED***<App***REMOVED***/>
</SupabaseAuthProvider>
```

####***REMOVED***Update***REMOVED***Auth***REMOVED***Hook***REMOVED***Usage

**Old***REMOVED***way:**
```tsx
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";

const***REMOVED***{***REMOVED***session,***REMOVED***isLoading,***REMOVED***login,***REMOVED***logout***REMOVED***}***REMOVED***=***REMOVED***useAuth();

//***REMOVED***Check***REMOVED***if***REMOVED***authenticated
if***REMOVED***(session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED***//***REMOVED***User***REMOVED***is***REMOVED***logged***REMOVED***in
}
```

**New***REMOVED***way:**
```tsx
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";

const***REMOVED***{***REMOVED***user,***REMOVED***session,***REMOVED***isLoading,***REMOVED***signInWithGoogle,***REMOVED***signOut***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

//***REMOVED***Check***REMOVED***if***REMOVED***authenticated
if***REMOVED***(user)***REMOVED***{
***REMOVED******REMOVED***//***REMOVED***User***REMOVED***is***REMOVED***logged***REMOVED***in
}
```

####***REMOVED***Component***REMOVED***Migration***REMOVED***Examples

**Login***REMOVED***Button:**

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***login***REMOVED***}***REMOVED***=***REMOVED***useAuth();
<button***REMOVED***onClick={login}>Connect***REMOVED***Google***REMOVED***Account</button>

//***REMOVED***After
const***REMOVED***{***REMOVED***signInWithGoogle***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
<button***REMOVED***onClick={signInWithGoogle}>Connect***REMOVED***Google***REMOVED***Account</button>
```

**Logout***REMOVED***Button:**

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***logout***REMOVED***}***REMOVED***=***REMOVED***useAuth();
<button***REMOVED***onClick={logout}>Disconnect</button>

//***REMOVED***After
const***REMOVED***{***REMOVED***signOut***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
<button***REMOVED***onClick={signOut}>Sign***REMOVED***Out</button>
```

**User***REMOVED***Info***REMOVED***Display:**

```tsx
//***REMOVED***Before
const***REMOVED***{***REMOVED***session***REMOVED***}***REMOVED***=***REMOVED***useAuth();
<p>Welcome,***REMOVED***{session?.email}!</p>

//***REMOVED***After
const***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
<p>Welcome,***REMOVED***{user?.email}!</p>
```

###***REMOVED***Phase***REMOVED***3:***REMOVED***Update***REMOVED***API***REMOVED***Routes***REMOVED***(20***REMOVED***minutes)

####***REMOVED***Authentication***REMOVED***Check

**Old***REMOVED***way:**
```tsx
//***REMOVED***Custom***REMOVED***auth***REMOVED***check
const***REMOVED***session***REMOVED***=***REMOVED***await***REMOVED***getSession(request);
if***REMOVED***(!session)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},***REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***});
}
```

**New***REMOVED***way:**
```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();

if***REMOVED***(error***REMOVED***||***REMOVED***!user)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},***REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***});
}
```

####***REMOVED***Database***REMOVED***Operations

**Old***REMOVED***way:**
```tsx
//***REMOVED***Custom***REMOVED***database***REMOVED***queries
const***REMOVED***profile***REMOVED***=***REMOVED***await***REMOVED***db.query("SELECT***REMOVED*******REMOVED***FROM***REMOVED***profiles***REMOVED***WHERE***REMOVED***id***REMOVED***=***REMOVED***?",***REMOVED***[userId]);
```

**New***REMOVED***way:**
```tsx
import***REMOVED***{***REMOVED***getProfile***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

const***REMOVED***profile***REMOVED***=***REMOVED***await***REMOVED***getProfile(userId);
```

###***REMOVED***Phase***REMOVED***4:***REMOVED***Update***REMOVED***Protected***REMOVED***Routes***REMOVED***(10***REMOVED***minutes)

The***REMOVED***middleware***REMOVED***now***REMOVED***handles***REMOVED***route***REMOVED***protection***REMOVED***automatically!

**Old***REMOVED***way:**
```tsx
//***REMOVED***Manual***REMOVED***redirect***REMOVED***in***REMOVED***each***REMOVED***page
useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED***if***REMOVED***(!session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***router.push("/login");
***REMOVED******REMOVED***}
},***REMOVED***[session]);
```

**New***REMOVED***way:**
```tsx
//***REMOVED***Middleware***REMOVED***handles***REMOVED***it***REMOVED***automatically!
//***REMOVED***Just***REMOVED***use***REMOVED***the***REMOVED***auth***REMOVED***hook***REMOVED***to***REMOVED***show***REMOVED***loading***REMOVED***state
const***REMOVED***{***REMOVED***user,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

if***REMOVED***(isLoading)***REMOVED***return***REMOVED***<LoadingSpinner***REMOVED***/>;
//***REMOVED***If***REMOVED***not***REMOVED***authenticated,***REMOVED***middleware***REMOVED***already***REMOVED***redirected
```

###***REMOVED***Phase***REMOVED***5:***REMOVED***Testing***REMOVED***(15***REMOVED***minutes)

1.***REMOVED*****Test***REMOVED***authentication***REMOVED***flow:**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Sign***REMOVED***in***REMOVED***with***REMOVED***Google
***REMOVED******REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***redirect***REMOVED***to***REMOVED***dashboard
***REMOVED******REMOVED******REMOVED***-***REMOVED***Check***REMOVED***user***REMOVED***profile***REMOVED***loads
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***sign***REMOVED***out

2.***REMOVED*****Test***REMOVED***protected***REMOVED***routes:**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Try***REMOVED***accessing***REMOVED***`/dashboard`***REMOVED***without***REMOVED***auth
***REMOVED******REMOVED******REMOVED***-***REMOVED***Should***REMOVED***redirect***REMOVED***to***REMOVED***`/login`
***REMOVED******REMOVED******REMOVED***-***REMOVED***Sign***REMOVED***in***REMOVED***and***REMOVED***verify***REMOVED***access***REMOVED***granted

3.***REMOVED*****Test***REMOVED***API***REMOVED***routes:**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Create***REMOVED***a***REMOVED***workflow
***REMOVED******REMOVED******REMOVED***-***REMOVED***Fetch***REMOVED***workflows
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***profile

4.***REMOVED*****Test***REMOVED***error***REMOVED***handling:**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Invalid***REMOVED***credentials
***REMOVED******REMOVED******REMOVED***-***REMOVED***Network***REMOVED***errors
***REMOVED******REMOVED******REMOVED***-***REMOVED***Session***REMOVED***expiration

##***REMOVED***Component***REMOVED***Mapping***REMOVED***Reference

|***REMOVED***Old***REMOVED***|***REMOVED***New***REMOVED***|***REMOVED***Notes***REMOVED***|
|-----|-----|-------|
|***REMOVED***`useAuth()`***REMOVED***|***REMOVED***`useSupabaseAuth()`***REMOVED***|***REMOVED***Different***REMOVED***return***REMOVED***values***REMOVED***|
|***REMOVED***`session.isAuthenticated`***REMOVED***|***REMOVED***`user***REMOVED***!==***REMOVED***null`***REMOVED***|***REMOVED***Check***REMOVED***user***REMOVED***object***REMOVED***instead***REMOVED***|
|***REMOVED***`session.email`***REMOVED***|***REMOVED***`user.email`***REMOVED***|***REMOVED***Direct***REMOVED***user***REMOVED***properties***REMOVED***|
|***REMOVED***`login()`***REMOVED***|***REMOVED***`signInWithGoogle()`***REMOVED***|***REMOVED***More***REMOVED***explicit***REMOVED***naming***REMOVED***|
|***REMOVED***`logout()`***REMOVED***|***REMOVED***`signOut()`***REMOVED***|***REMOVED***Standard***REMOVED***Supabase***REMOVED***naming***REMOVED***|
|***REMOVED***`refreshAuth()`***REMOVED***|***REMOVED***`refreshSession()`***REMOVED***|***REMOVED***Handled***REMOVED***automatically***REMOVED***|

##***REMOVED***Database***REMOVED***Query***REMOVED***Migration

###***REMOVED***Old***REMOVED***Pattern
```tsx
const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/workflows");
const***REMOVED***data***REMOVED***=***REMOVED***await***REMOVED***response.json();
```

###***REMOVED***New***REMOVED***Pattern***REMOVED***(Client-side)
```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/client";

const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED***.eq("user_id",***REMOVED***user.id);
```

###***REMOVED***New***REMOVED***Pattern***REMOVED***(Server-side)
```tsx
import***REMOVED***{***REMOVED***getUserWorkflows***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

const***REMOVED***workflows***REMOVED***=***REMOVED***await***REMOVED***getUserWorkflows(userId);
```

##***REMOVED***Rollback***REMOVED***Plan

If***REMOVED***you***REMOVED***need***REMOVED***to***REMOVED***rollback:

1.***REMOVED***Keep***REMOVED***old***REMOVED***auth***REMOVED***files***REMOVED***(don't***REMOVED***delete***REMOVED***yet)
2.***REMOVED***Switch***REMOVED***provider***REMOVED***back***REMOVED***in***REMOVED***root***REMOVED***layout
3.***REMOVED***Revert***REMOVED***API***REMOVED***route***REMOVED***changes
4.***REMOVED***Update***REMOVED***components***REMOVED***to***REMOVED***use***REMOVED***old***REMOVED***hooks

##***REMOVED***Common***REMOVED***Issues

###***REMOVED***"Invalid***REMOVED***API***REMOVED***key"
-***REMOVED***Check***REMOVED***`.env.local`***REMOVED***has***REMOVED***correct***REMOVED***Supabase***REMOVED***keys
-***REMOVED***Restart***REMOVED***dev***REMOVED***server***REMOVED***after***REMOVED***changing***REMOVED***env***REMOVED***vars

###***REMOVED***"User***REMOVED***not***REMOVED***found"
-***REMOVED***Ensure***REMOVED***database***REMOVED***migration***REMOVED***ran***REMOVED***successfully
-***REMOVED***Check***REMOVED***RLS***REMOVED***policies***REMOVED***are***REMOVED***set***REMOVED***up
-***REMOVED***Verify***REMOVED***user***REMOVED***profile***REMOVED***was***REMOVED***created***REMOVED***on***REMOVED***signup

###***REMOVED***"Redirect***REMOVED***loop"
-***REMOVED***Check***REMOVED***middleware***REMOVED***configuration
-***REMOVED***Verify***REMOVED***protected***REMOVED***paths***REMOVED***are***REMOVED***correct
-***REMOVED***Clear***REMOVED***browser***REMOVED***cookies***REMOVED***and***REMOVED***try***REMOVED***again

###***REMOVED***Google***REMOVED***OAuth***REMOVED***not***REMOVED***working
-***REMOVED***Verify***REMOVED***redirect***REMOVED***URL***REMOVED***in***REMOVED***Supabase***REMOVED***matches***REMOVED***exactly
-***REMOVED***Check***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials***REMOVED***are***REMOVED***correct
-***REMOVED***Ensure***REMOVED***Google***REMOVED***provider***REMOVED***is***REMOVED***enabled

##***REMOVED***Benefits***REMOVED***of***REMOVED***Migration

✅***REMOVED*****Automatic***REMOVED***session***REMOVED***management*****REMOVED***-***REMOVED***No***REMOVED***manual***REMOVED***token***REMOVED***refresh
✅***REMOVED*****Built-in***REMOVED***security*****REMOVED***-***REMOVED***Row***REMOVED***Level***REMOVED***Security***REMOVED***out***REMOVED***of***REMOVED***the***REMOVED***box
✅***REMOVED*****Real-time***REMOVED***capabilities*****REMOVED***-***REMOVED***Subscribe***REMOVED***to***REMOVED***database***REMOVED***changes
✅***REMOVED*****Better***REMOVED***DX*****REMOVED***-***REMOVED***Type-safe***REMOVED***queries***REMOVED***with***REMOVED***TypeScript
✅***REMOVED*****Scalability*****REMOVED***-***REMOVED***Supabase***REMOVED***handles***REMOVED***infrastructure
✅***REMOVED*****Monitoring*****REMOVED***-***REMOVED***Built-in***REMOVED***auth***REMOVED***logs***REMOVED***and***REMOVED***analytics

##***REMOVED***Next***REMOVED***Steps

After***REMOVED***migration:

1.***REMOVED***Remove***REMOVED***old***REMOVED***auth***REMOVED***files***REMOVED***(after***REMOVED***thorough***REMOVED***testing)
2.***REMOVED***Set***REMOVED***up***REMOVED***real-time***REMOVED***subscriptions***REMOVED***for***REMOVED***workflows
3.***REMOVED***Configure***REMOVED***email***REMOVED***templates***REMOVED***in***REMOVED***Supabase
4.***REMOVED***Enable***REMOVED***MFA***REMOVED***for***REMOVED***enhanced***REMOVED***security
5.***REMOVED***Set***REMOVED***up***REMOVED***database***REMOVED***backups
6.***REMOVED***Monitor***REMOVED***auth***REMOVED***logs***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard

##***REMOVED***Need***REMOVED***Help?

-***REMOVED***Review***REMOVED***[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)***REMOVED***for***REMOVED***detailed***REMOVED***setup
-***REMOVED***Check***REMOVED***[SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)***REMOVED***for***REMOVED***quick***REMOVED***reference
-***REMOVED***Visit***REMOVED***[Supabase***REMOVED***Discord](https://discord.supabase.com)***REMOVED***for***REMOVED***community***REMOVED***support
