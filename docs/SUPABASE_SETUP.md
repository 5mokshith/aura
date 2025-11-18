#***REMOVED***Supabase***REMOVED***Setup***REMOVED***Guide

This***REMOVED***guide***REMOVED***explains***REMOVED***how***REMOVED***to***REMOVED***set***REMOVED***up***REMOVED***Supabase***REMOVED***for***REMOVED***authentication***REMOVED***and***REMOVED***database***REMOVED***in***REMOVED***AURA.

##***REMOVED***Prerequisites

1.***REMOVED***A***REMOVED***Supabase***REMOVED***account***REMOVED***(sign***REMOVED***up***REMOVED***at***REMOVED***[supabase.com](https://supabase.com))
2.***REMOVED***Node.js***REMOVED***and***REMOVED***npm***REMOVED***installed
3.***REMOVED***Supabase***REMOVED***CLI***REMOVED***(optional,***REMOVED***for***REMOVED***local***REMOVED***development)

##***REMOVED***Quick***REMOVED***Start

###***REMOVED***1.***REMOVED***Create***REMOVED***a***REMOVED***Supabase***REMOVED***Project

1.***REMOVED***Go***REMOVED***to***REMOVED***[app.supabase.com](https://app.supabase.com)
2.***REMOVED***Click***REMOVED***"New***REMOVED***Project"
3.***REMOVED***Fill***REMOVED***in***REMOVED***project***REMOVED***details:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Name**:***REMOVED***aura-app***REMOVED***(or***REMOVED***your***REMOVED***preferred***REMOVED***name)
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Database***REMOVED***Password**:***REMOVED***Generate***REMOVED***a***REMOVED***strong***REMOVED***password
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Region**:***REMOVED***Choose***REMOVED***closest***REMOVED***to***REMOVED***your***REMOVED***users
4.***REMOVED***Click***REMOVED***"Create***REMOVED***new***REMOVED***project"
5.***REMOVED***Wait***REMOVED***for***REMOVED***the***REMOVED***project***REMOVED***to***REMOVED***be***REMOVED***provisioned***REMOVED***(~2***REMOVED***minutes)

###***REMOVED***2.***REMOVED***Get***REMOVED***Your***REMOVED***API***REMOVED***Keys

1.***REMOVED***In***REMOVED***your***REMOVED***Supabase***REMOVED***project***REMOVED***dashboard,***REMOVED***go***REMOVED***to***REMOVED*****Settings*****REMOVED***>***REMOVED*****API**
2.***REMOVED***Copy***REMOVED***the***REMOVED***following***REMOVED***values:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Project***REMOVED***URL**:***REMOVED***`https://xxxxx.supabase.co`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****anon***REMOVED***public***REMOVED***key**:***REMOVED***`eyJhbGc...`***REMOVED***(safe***REMOVED***to***REMOVED***use***REMOVED***in***REMOVED***client-side***REMOVED***code)
***REMOVED******REMOVED******REMOVED***-***REMOVED*****service_role***REMOVED***key**:***REMOVED***`eyJhbGc...`***REMOVED***(keep***REMOVED***secret,***REMOVED***server-side***REMOVED***only)

###***REMOVED***3.***REMOVED***Configure***REMOVED***Environment***REMOVED***Variables

Update***REMOVED***your***REMOVED***`.env.local`***REMOVED***file:

```env
#***REMOVED***Supabase***REMOVED***Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
```

###***REMOVED***4.***REMOVED***Set***REMOVED***Up***REMOVED***Database***REMOVED***Schema

####***REMOVED***Option***REMOVED***A:***REMOVED***Using***REMOVED***Supabase***REMOVED***Dashboard***REMOVED***(Recommended)

1.***REMOVED***Go***REMOVED***to***REMOVED*****SQL***REMOVED***Editor*****REMOVED***in***REMOVED***your***REMOVED***Supabase***REMOVED***dashboard
2.***REMOVED***Click***REMOVED***"New***REMOVED***Query"
3.***REMOVED***Copy***REMOVED***the***REMOVED***contents***REMOVED***of***REMOVED***`supabase/migrations/001_initial_schema.sql`
4.***REMOVED***Paste***REMOVED***into***REMOVED***the***REMOVED***SQL***REMOVED***editor
5.***REMOVED***Click***REMOVED***"Run"***REMOVED***to***REMOVED***execute***REMOVED***the***REMOVED***migration

####***REMOVED***Option***REMOVED***B:***REMOVED***Using***REMOVED***Supabase***REMOVED***CLI

```bash
#***REMOVED***Install***REMOVED***Supabase***REMOVED***CLI
npm***REMOVED***install***REMOVED***-g***REMOVED***supabase

#***REMOVED***Login***REMOVED***to***REMOVED***Supabase
supabase***REMOVED***login

#***REMOVED***Link***REMOVED***to***REMOVED***your***REMOVED***project
supabase***REMOVED***link***REMOVED***--project-ref***REMOVED***your-project-ref

#***REMOVED***Run***REMOVED***migrations
supabase***REMOVED***db***REMOVED***push
```

###***REMOVED***5.***REMOVED***Configure***REMOVED***Google***REMOVED***OAuth

1.***REMOVED***In***REMOVED***Supabase***REMOVED***dashboard,***REMOVED***go***REMOVED***to***REMOVED*****Authentication*****REMOVED***>***REMOVED*****Providers**
2.***REMOVED***Find***REMOVED*****Google*****REMOVED***and***REMOVED***click***REMOVED***to***REMOVED***expand
3.***REMOVED***Enable***REMOVED***Google***REMOVED***provider
4.***REMOVED***Add***REMOVED***your***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Client***REMOVED***ID**:***REMOVED***Your***REMOVED***Google***REMOVED***OAuth***REMOVED***client***REMOVED***ID
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Client***REMOVED***Secret**:***REMOVED***Your***REMOVED***Google***REMOVED***OAuth***REMOVED***client***REMOVED***secret
5.***REMOVED***Add***REMOVED***authorized***REMOVED***redirect***REMOVED***URLs:
***REMOVED******REMOVED******REMOVED***-***REMOVED***Development:***REMOVED***`http://localhost:3000/auth/callback`
***REMOVED******REMOVED******REMOVED***-***REMOVED***Production:***REMOVED***`https://yourdomain.com/auth/callback`
6.***REMOVED***Configure***REMOVED***OAuth***REMOVED***scopes***REMOVED***(optional):
***REMOVED******REMOVED******REMOVED***```
***REMOVED******REMOVED******REMOVED***https://www.googleapis.com/auth/gmail.modify
***REMOVED******REMOVED******REMOVED***https://www.googleapis.com/auth/drive.file
***REMOVED******REMOVED******REMOVED***https://www.googleapis.com/auth/documents
***REMOVED******REMOVED******REMOVED***https://www.googleapis.com/auth/spreadsheets
***REMOVED******REMOVED******REMOVED***https://www.googleapis.com/auth/calendar
***REMOVED******REMOVED******REMOVED***```
7.***REMOVED***Click***REMOVED***"Save"

###***REMOVED***6.***REMOVED***Configure***REMOVED***Email***REMOVED***Settings***REMOVED***(Optional)

For***REMOVED***email***REMOVED***confirmations***REMOVED***and***REMOVED***password***REMOVED***resets:

1.***REMOVED***Go***REMOVED***to***REMOVED*****Authentication*****REMOVED***>***REMOVED*****Email***REMOVED***Templates**
2.***REMOVED***Customize***REMOVED***templates***REMOVED***as***REMOVED***needed
3.***REMOVED***Go***REMOVED***to***REMOVED*****Settings*****REMOVED***>***REMOVED*****Auth**
4.***REMOVED***Configure:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Site***REMOVED***URL**:***REMOVED***Your***REMOVED***production***REMOVED***URL
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Redirect***REMOVED***URLs**:***REMOVED***Add***REMOVED***allowed***REMOVED***redirect***REMOVED***URLs
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Email***REMOVED***Auth**:***REMOVED***Enable/disable***REMOVED***as***REMOVED***needed

##***REMOVED***Database***REMOVED***Schema

###***REMOVED***Tables

####***REMOVED***`profiles`
Stores***REMOVED***user***REMOVED***profile***REMOVED***information.

```sql
-***REMOVED***id:***REMOVED***UUID***REMOVED***(references***REMOVED***auth.users)
-***REMOVED***email:***REMOVED***TEXT
-***REMOVED***full_name:***REMOVED***TEXT
-***REMOVED***avatar_url:***REMOVED***TEXT
-***REMOVED***preferences:***REMOVED***JSONB
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***updated_at:***REMOVED***TIMESTAMPTZ
```

####***REMOVED***`workflows`
Stores***REMOVED***workflow***REMOVED***execution***REMOVED***data.

```sql
-***REMOVED***id:***REMOVED***UUID
-***REMOVED***user_id:***REMOVED***UUID***REMOVED***(references***REMOVED***profiles)
-***REMOVED***command:***REMOVED***TEXT
-***REMOVED***status:***REMOVED***workflow_status***REMOVED***ENUM
-***REMOVED***steps:***REMOVED***JSONB
-***REMOVED***results:***REMOVED***JSONB
-***REMOVED***error:***REMOVED***TEXT
-***REMOVED***start_time:***REMOVED***TIMESTAMPTZ
-***REMOVED***end_time:***REMOVED***TIMESTAMPTZ
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***updated_at:***REMOVED***TIMESTAMPTZ
```

####***REMOVED***`workflow_history`
Stores***REMOVED***workflow***REMOVED***execution***REMOVED***history.

```sql
-***REMOVED***id:***REMOVED***UUID
-***REMOVED***user_id:***REMOVED***UUID***REMOVED***(references***REMOVED***profiles)
-***REMOVED***workflow_id:***REMOVED***UUID***REMOVED***(references***REMOVED***workflows)
-***REMOVED***command:***REMOVED***TEXT
-***REMOVED***status:***REMOVED***TEXT
-***REMOVED***executed_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
```

##***REMOVED***Usage***REMOVED***in***REMOVED***Your***REMOVED***App

###***REMOVED***Client-Side***REMOVED***Authentication

```tsx
"use***REMOVED***client";

import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";

export***REMOVED***default***REMOVED***function***REMOVED***LoginButton()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***signInWithGoogle,***REMOVED***signOut,***REMOVED***user,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();

***REMOVED******REMOVED***if***REMOVED***(isLoading)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<div>Loading...</div>;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***if***REMOVED***(user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p>Welcome,***REMOVED***{user.email}!</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button***REMOVED***onClick={signOut}>Sign***REMOVED***Out</button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}

***REMOVED******REMOVED***return***REMOVED***<button***REMOVED***onClick={signInWithGoogle}>Sign***REMOVED***in***REMOVED***with***REMOVED***Google</button>;
}
```

###***REMOVED***Server-Side***REMOVED***Data***REMOVED***Fetching

```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

export***REMOVED***default***REMOVED***async***REMOVED***function***REMOVED***ProfilePage()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();
***REMOVED******REMOVED***
***REMOVED******REMOVED***if***REMOVED***(!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***redirect("/login");
***REMOVED******REMOVED***}

***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***profile***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("profiles")
***REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***user.id)
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h1>Profile</h1>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p>Email:***REMOVED***{profile.email}</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p>Name:***REMOVED***{profile.full_name}</p>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
```

###***REMOVED***Using***REMOVED***Database***REMOVED***Queries

```tsx
import***REMOVED***{***REMOVED***getProfile,***REMOVED***updateProfile,***REMOVED***getUserWorkflows***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

//***REMOVED***Get***REMOVED***user***REMOVED***profile
const***REMOVED***profile***REMOVED***=***REMOVED***await***REMOVED***getProfile(userId);

//***REMOVED***Update***REMOVED***profile
const***REMOVED***updated***REMOVED***=***REMOVED***await***REMOVED***updateProfile(userId,***REMOVED***{
***REMOVED******REMOVED***full_name:***REMOVED***"John***REMOVED***Doe",
***REMOVED******REMOVED***preferences:***REMOVED***{***REMOVED***theme:***REMOVED***"dark"***REMOVED***}
});

//***REMOVED***Get***REMOVED***user***REMOVED***workflows
const***REMOVED***workflows***REMOVED***=***REMOVED***await***REMOVED***getUserWorkflows(userId,***REMOVED***10);
```

##***REMOVED***Row***REMOVED***Level***REMOVED***Security***REMOVED***(RLS)

All***REMOVED***tables***REMOVED***have***REMOVED***RLS***REMOVED***enabled***REMOVED***with***REMOVED***policies***REMOVED***that***REMOVED***ensure:

-***REMOVED***Users***REMOVED***can***REMOVED***only***REMOVED***access***REMOVED***their***REMOVED***own***REMOVED***data
-***REMOVED***Automatic***REMOVED***user***REMOVED***profile***REMOVED***creation***REMOVED***on***REMOVED***signup
-***REMOVED***Secure***REMOVED***data***REMOVED***isolation***REMOVED***between***REMOVED***users

##***REMOVED***Real-time***REMOVED***Subscriptions***REMOVED***(Optional)

Subscribe***REMOVED***to***REMOVED***real-time***REMOVED***changes:

```tsx
const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();

//***REMOVED***Subscribe***REMOVED***to***REMOVED***workflow***REMOVED***updates
const***REMOVED***channel***REMOVED***=***REMOVED***supabase
***REMOVED******REMOVED***.channel('workflow-changes')
***REMOVED******REMOVED***.on(
***REMOVED******REMOVED******REMOVED******REMOVED***'postgres_changes',
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***event:***REMOVED***'UPDATE',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***schema:***REMOVED***'public',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***table:***REMOVED***'workflows',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***filter:***REMOVED***`user_id=eq.${userId}`
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***(payload)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log('Workflow***REMOVED***updated:',***REMOVED***payload);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***)
***REMOVED******REMOVED***.subscribe();

//***REMOVED***Cleanup
return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED***supabase.removeChannel(channel);
};
```

##***REMOVED***Local***REMOVED***Development***REMOVED***with***REMOVED***Supabase***REMOVED***CLI

###***REMOVED***Setup

```bash
#***REMOVED***Initialize***REMOVED***Supabase***REMOVED***in***REMOVED***your***REMOVED***project
supabase***REMOVED***init

#***REMOVED***Start***REMOVED***local***REMOVED***Supabase***REMOVED***(Docker***REMOVED***required)
supabase***REMOVED***start

#***REMOVED***This***REMOVED***will***REMOVED***start:
#***REMOVED***-***REMOVED***PostgreSQL***REMOVED***database
#***REMOVED***-***REMOVED***Auth***REMOVED***server
#***REMOVED***-***REMOVED***Storage***REMOVED***server
#***REMOVED***-***REMOVED***Realtime***REMOVED***server
```

###***REMOVED***Local***REMOVED***Environment***REMOVED***Variables

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
```

###***REMOVED***Generate***REMOVED***TypeScript***REMOVED***Types

```bash
#***REMOVED***Generate***REMOVED***types***REMOVED***from***REMOVED***your***REMOVED***database***REMOVED***schema
npx***REMOVED***supabase***REMOVED***gen***REMOVED***types***REMOVED***typescript***REMOVED***--project-id***REMOVED***your-project-ref***REMOVED***>***REMOVED***lib/supabase/database.types.ts
```

##***REMOVED***Security***REMOVED***Best***REMOVED***Practices

1.***REMOVED*****Never***REMOVED***expose***REMOVED***service_role***REMOVED***key*****REMOVED***in***REMOVED***client-side***REMOVED***code
2.***REMOVED*****Use***REMOVED***RLS***REMOVED***policies*****REMOVED***for***REMOVED***all***REMOVED***tables
3.***REMOVED*****Validate***REMOVED***user***REMOVED***input*****REMOVED***before***REMOVED***database***REMOVED***operations
4.***REMOVED*****Use***REMOVED***prepared***REMOVED***statements*****REMOVED***(Supabase***REMOVED***does***REMOVED***this***REMOVED***automatically)
5.***REMOVED*****Enable***REMOVED***MFA*****REMOVED***for***REMOVED***admin***REMOVED***accounts
6.***REMOVED*****Regularly***REMOVED***rotate*****REMOVED***API***REMOVED***keys
7.***REMOVED*****Monitor*****REMOVED***authentication***REMOVED***logs***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard

##***REMOVED***Troubleshooting

###***REMOVED***"Invalid***REMOVED***API***REMOVED***key"
-***REMOVED***Verify***REMOVED***your***REMOVED***API***REMOVED***keys***REMOVED***in***REMOVED***`.env.local`
-***REMOVED***Check***REMOVED***that***REMOVED***you're***REMOVED***using***REMOVED***the***REMOVED***correct***REMOVED***project***REMOVED***URL
-***REMOVED***Ensure***REMOVED***keys***REMOVED***are***REMOVED***not***REMOVED***wrapped***REMOVED***in***REMOVED***quotes

###***REMOVED***"Row***REMOVED***Level***REMOVED***Security***REMOVED***policy***REMOVED***violation"
-***REMOVED***Check***REMOVED***that***REMOVED***RLS***REMOVED***policies***REMOVED***are***REMOVED***set***REMOVED***up***REMOVED***correctly
-***REMOVED***Verify***REMOVED***user***REMOVED***is***REMOVED***authenticated
-***REMOVED***Check***REMOVED***that***REMOVED***`auth.uid()`***REMOVED***matches***REMOVED***the***REMOVED***user_id***REMOVED***in***REMOVED***queries

###***REMOVED***"Failed***REMOVED***to***REMOVED***fetch"
-***REMOVED***Check***REMOVED***network***REMOVED***connectivity
-***REMOVED***Verify***REMOVED***Supabase***REMOVED***project***REMOVED***is***REMOVED***running
-***REMOVED***Check***REMOVED***CORS***REMOVED***settings***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard

###***REMOVED***Google***REMOVED***OAuth***REMOVED***not***REMOVED***working
-***REMOVED***Verify***REMOVED***redirect***REMOVED***URLs***REMOVED***match***REMOVED***exactly
-***REMOVED***Check***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials***REMOVED***are***REMOVED***correct
-***REMOVED***Ensure***REMOVED***Google***REMOVED***provider***REMOVED***is***REMOVED***enabled***REMOVED***in***REMOVED***Supabase

##***REMOVED***Migration***REMOVED***from***REMOVED***Existing***REMOVED***Auth

If***REMOVED***migrating***REMOVED***from***REMOVED***the***REMOVED***existing***REMOVED***Google***REMOVED***OAuth***REMOVED***setup:

1.***REMOVED***Keep***REMOVED***both***REMOVED***auth***REMOVED***systems***REMOVED***running***REMOVED***initially
2.***REMOVED***Update***REMOVED***components***REMOVED***to***REMOVED***use***REMOVED***`useSupabaseAuth`***REMOVED***instead***REMOVED***of***REMOVED***`useAuth`
3.***REMOVED***Migrate***REMOVED***user***REMOVED***data***REMOVED***to***REMOVED***Supabase***REMOVED***profiles***REMOVED***table
4.***REMOVED***Test***REMOVED***thoroughly***REMOVED***before***REMOVED***removing***REMOVED***old***REMOVED***auth***REMOVED***code
5.***REMOVED***Update***REMOVED***all***REMOVED***API***REMOVED***routes***REMOVED***to***REMOVED***use***REMOVED***Supabase***REMOVED***auth

##***REMOVED***Resources

-***REMOVED***[Supabase***REMOVED***Documentation](https://supabase.com/docs)
-***REMOVED***[Supabase***REMOVED***Auth***REMOVED***Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
-***REMOVED***[Row***REMOVED***Level***REMOVED***Security](https://supabase.com/docs/guides/auth/row-level-security)
-***REMOVED***[Supabase***REMOVED***CLI](https://supabase.com/docs/guides/cli)

##***REMOVED***Support

For***REMOVED***issues***REMOVED***or***REMOVED***questions:
-***REMOVED***Check***REMOVED***[Supabase***REMOVED***Discord](https://discord.supabase.com)
-***REMOVED***Review***REMOVED***[GitHub***REMOVED***Discussions](https://github.com/supabase/supabase/discussions)
-***REMOVED***Contact***REMOVED***Supabase***REMOVED***support***REMOVED***through***REMOVED***dashboard
