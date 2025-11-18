#***REMOVED***Supabase***REMOVED***Integration

This***REMOVED***directory***REMOVED***contains***REMOVED***all***REMOVED***Supabase-related***REMOVED***utilities***REMOVED***for***REMOVED***AURA.

##***REMOVED***Files***REMOVED***Overview

###***REMOVED***`client.ts`
Browser-side***REMOVED***Supabase***REMOVED***client***REMOVED***for***REMOVED***use***REMOVED***in***REMOVED***React***REMOVED***components.

```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/client";

const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.from("profiles").select("*");
```

###***REMOVED***`server.ts`
Server-side***REMOVED***Supabase***REMOVED***client***REMOVED***for***REMOVED***use***REMOVED***in***REMOVED***Server***REMOVED***Components***REMOVED***and***REMOVED***API***REMOVED***routes.

```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();
```

###***REMOVED***`middleware.ts`
Middleware***REMOVED***utilities***REMOVED***for***REMOVED***handling***REMOVED***auth***REMOVED***state***REMOVED***in***REMOVED***Next.js***REMOVED***middleware.

```tsx
import***REMOVED***{***REMOVED***updateSession***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/middleware";

export***REMOVED***async***REMOVED***function***REMOVED***middleware(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***await***REMOVED***updateSession(request);
}
```

###***REMOVED***`database.types.ts`
TypeScript***REMOVED***types***REMOVED***generated***REMOVED***from***REMOVED***your***REMOVED***Supabase***REMOVED***database***REMOVED***schema.

**Regenerate***REMOVED***types:**
```bash
npx***REMOVED***supabase***REMOVED***gen***REMOVED***types***REMOVED***typescript***REMOVED***--project-id***REMOVED***YOUR_PROJECT_ID***REMOVED***>***REMOVED***lib/supabase/database.types.ts
```

###***REMOVED***`queries.ts`
Pre-built***REMOVED***database***REMOVED***query***REMOVED***functions***REMOVED***with***REMOVED***proper***REMOVED***typing.

```tsx
import***REMOVED***{***REMOVED***getProfile,***REMOVED***updateProfile,***REMOVED***getUserWorkflows***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

//***REMOVED***Get***REMOVED***user***REMOVED***profile
const***REMOVED***profile***REMOVED***=***REMOVED***await***REMOVED***getProfile(userId);

//***REMOVED***Update***REMOVED***profile
await***REMOVED***updateProfile(userId,***REMOVED***{***REMOVED***full_name:***REMOVED***"John***REMOVED***Doe"***REMOVED***});

//***REMOVED***Get***REMOVED***workflows
const***REMOVED***workflows***REMOVED***=***REMOVED***await***REMOVED***getUserWorkflows(userId,***REMOVED***10);
```

##***REMOVED***Usage***REMOVED***Patterns

###***REMOVED***Client***REMOVED***Components

```tsx
"use***REMOVED***client";

import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/client";
import***REMOVED***{***REMOVED***useEffect,***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";

export***REMOVED***default***REMOVED***function***REMOVED***MyComponent()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[data,***REMOVED***setData]***REMOVED***=***REMOVED***useState(null);
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***async***REMOVED***function***REMOVED***fetchData()***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.from("profiles").select("*");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setData(data);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***fetchData();
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***return***REMOVED***<div>{/****REMOVED***render***REMOVED***data***REMOVED****/}</div>;
}
```

###***REMOVED***Server***REMOVED***Components

```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

export***REMOVED***default***REMOVED***async***REMOVED***function***REMOVED***MyPage()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.from("profiles").select("*");

***REMOVED******REMOVED***return***REMOVED***<div>{/****REMOVED***render***REMOVED***data***REMOVED****/}</div>;
}
```

###***REMOVED***API***REMOVED***Routes

```tsx
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";
import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";

export***REMOVED***async***REMOVED***function***REMOVED***GET(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();
***REMOVED******REMOVED***if***REMOVED***(!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},***REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***});
***REMOVED******REMOVED***}

***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.from("profiles").select("*");
***REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***data***REMOVED***});
}
```

###***REMOVED***Using***REMOVED***Query***REMOVED***Helpers

```tsx
import***REMOVED***{***REMOVED***getProfile,***REMOVED***updateProfile***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

//***REMOVED***In***REMOVED***a***REMOVED***Server***REMOVED***Component***REMOVED***or***REMOVED***API***REMOVED***route
const***REMOVED***profile***REMOVED***=***REMOVED***await***REMOVED***getProfile(userId);

await***REMOVED***updateProfile(userId,***REMOVED***{
***REMOVED******REMOVED***full_name:***REMOVED***"Jane***REMOVED***Doe",
***REMOVED******REMOVED***preferences:***REMOVED***{***REMOVED***theme:***REMOVED***"dark"***REMOVED***}
});
```

##***REMOVED***Authentication

###***REMOVED***Check***REMOVED***Auth***REMOVED***Status

```tsx
const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***}***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();

if***REMOVED***(user)***REMOVED***{
***REMOVED******REMOVED***console.log("User***REMOVED***is***REMOVED***authenticated:",***REMOVED***user.email);
}
```

###***REMOVED***Sign***REMOVED***In***REMOVED***with***REMOVED***Google

```tsx
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.signInWithOAuth({
***REMOVED******REMOVED***provider:***REMOVED***"google",
***REMOVED******REMOVED***options:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***redirectTo:***REMOVED***`${window.location.origin}/auth/callback`,
***REMOVED******REMOVED***},
});
```

###***REMOVED***Sign***REMOVED***Out

```tsx
const***REMOVED***{***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.signOut();
```

##***REMOVED***Database***REMOVED***Operations

###***REMOVED***Select

```tsx
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED***.eq("user_id",***REMOVED***userId)
***REMOVED******REMOVED***.order("created_at",***REMOVED***{***REMOVED***ascending:***REMOVED***false***REMOVED***})
***REMOVED******REMOVED***.limit(10);
```

###***REMOVED***Insert

```tsx
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED***.insert({
***REMOVED******REMOVED******REMOVED******REMOVED***user_id:***REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED***command:***REMOVED***"Create***REMOVED***summary",
***REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"planning",
***REMOVED******REMOVED***})
***REMOVED******REMOVED***.select()
***REMOVED******REMOVED***.single();
```

###***REMOVED***Update

```tsx
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED***.update({***REMOVED***status:***REMOVED***"completed"***REMOVED***})
***REMOVED******REMOVED***.eq("id",***REMOVED***workflowId)
***REMOVED******REMOVED***.select()
***REMOVED******REMOVED***.single();
```

###***REMOVED***Delete

```tsx
const***REMOVED***{***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED***.from("workflow_history")
***REMOVED******REMOVED***.delete()
***REMOVED******REMOVED***.eq("id",***REMOVED***historyId);
```

##***REMOVED***Real-time***REMOVED***Subscriptions

```tsx
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log('Change***REMOVED***received!',***REMOVED***payload);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***)
***REMOVED******REMOVED***.subscribe();

//***REMOVED***Cleanup
return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED***supabase.removeChannel(channel);
};
```

##***REMOVED***Error***REMOVED***Handling

```tsx
const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED***.from("profiles")
***REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED***.eq("id",***REMOVED***userId)
***REMOVED******REMOVED***.single();

if***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED***console.error("Database***REMOVED***error:",***REMOVED***error.message);
***REMOVED******REMOVED***//***REMOVED***Handle***REMOVED***error***REMOVED***appropriately
***REMOVED******REMOVED***return;
}

//***REMOVED***Use***REMOVED***data***REMOVED***safely
console.log(data);
```

##***REMOVED***Type***REMOVED***Safety

All***REMOVED***queries***REMOVED***are***REMOVED***fully***REMOVED***typed***REMOVED***when***REMOVED***using***REMOVED***the***REMOVED***generated***REMOVED***types:

```tsx
import***REMOVED***type***REMOVED***{***REMOVED***Database***REMOVED***}***REMOVED***from***REMOVED***"./database.types";

type***REMOVED***Profile***REMOVED***=***REMOVED***Database["public"]["Tables"]["profiles"]["Row"];
type***REMOVED***WorkflowInsert***REMOVED***=***REMOVED***Database["public"]["Tables"]["workflows"]["Insert"];

const***REMOVED***profile:***REMOVED***Profile***REMOVED***=***REMOVED***await***REMOVED***getProfile(userId);
```

##***REMOVED***Best***REMOVED***Practices

1.***REMOVED*****Use***REMOVED***query***REMOVED***helpers*****REMOVED***from***REMOVED***`queries.ts`***REMOVED***for***REMOVED***common***REMOVED***operations
2.***REMOVED*****Always***REMOVED***check***REMOVED***for***REMOVED***errors*****REMOVED***after***REMOVED***database***REMOVED***operations
3.***REMOVED*****Use***REMOVED***server-side***REMOVED***client*****REMOVED***for***REMOVED***sensitive***REMOVED***operations
4.***REMOVED*****Leverage***REMOVED***RLS***REMOVED***policies*****REMOVED***for***REMOVED***security
5.***REMOVED*****Type***REMOVED***your***REMOVED***queries*****REMOVED***using***REMOVED***generated***REMOVED***types
6.***REMOVED*****Handle***REMOVED***loading***REMOVED***states*****REMOVED***in***REMOVED***components
7.***REMOVED*****Clean***REMOVED***up***REMOVED***subscriptions*****REMOVED***in***REMOVED***useEffect***REMOVED***cleanup

##***REMOVED***Security***REMOVED***Notes

-***REMOVED***Never***REMOVED***expose***REMOVED***`SUPABASE_SERVICE_ROLE_KEY`***REMOVED***in***REMOVED***client***REMOVED***code
-***REMOVED***Always***REMOVED***use***REMOVED***RLS***REMOVED***policies***REMOVED***for***REMOVED***data***REMOVED***access***REMOVED***control
-***REMOVED***Validate***REMOVED***user***REMOVED***input***REMOVED***before***REMOVED***database***REMOVED***operations
-***REMOVED***Use***REMOVED***server-side***REMOVED***client***REMOVED***for***REMOVED***admin***REMOVED***operations
-***REMOVED***Monitor***REMOVED***auth***REMOVED***logs***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard

##***REMOVED***Performance***REMOVED***Tips

-***REMOVED***Use***REMOVED***`.select()`***REMOVED***to***REMOVED***fetch***REMOVED***only***REMOVED***needed***REMOVED***columns
-***REMOVED***Add***REMOVED***`.limit()`***REMOVED***to***REMOVED***prevent***REMOVED***large***REMOVED***data***REMOVED***fetches
-***REMOVED***Use***REMOVED***indexes***REMOVED***on***REMOVED***frequently***REMOVED***queried***REMOVED***columns
-***REMOVED***Consider***REMOVED***pagination***REMOVED***for***REMOVED***large***REMOVED***datasets
-***REMOVED***Cache***REMOVED***frequently***REMOVED***accessed***REMOVED***data
-***REMOVED***Use***REMOVED***real-time***REMOVED***subscriptions***REMOVED***sparingly

##***REMOVED***Troubleshooting

###***REMOVED***"Invalid***REMOVED***API***REMOVED***key"
-***REMOVED***Check***REMOVED***environment***REMOVED***variables
-***REMOVED***Restart***REMOVED***dev***REMOVED***server
-***REMOVED***Verify***REMOVED***keys***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard

###***REMOVED***"Row***REMOVED***Level***REMOVED***Security***REMOVED***policy***REMOVED***violation"
-***REMOVED***Check***REMOVED***RLS***REMOVED***policies***REMOVED***are***REMOVED***set***REMOVED***up
-***REMOVED***Verify***REMOVED***user***REMOVED***is***REMOVED***authenticated
-***REMOVED***Ensure***REMOVED***user_id***REMOVED***matches***REMOVED***auth.uid()

###***REMOVED***"Failed***REMOVED***to***REMOVED***fetch"
-***REMOVED***Check***REMOVED***network***REMOVED***connectivity
-***REMOVED***Verify***REMOVED***Supabase***REMOVED***project***REMOVED***is***REMOVED***active
-***REMOVED***Check***REMOVED***CORS***REMOVED***settings

##***REMOVED***Resources

-***REMOVED***[Supabase***REMOVED***Docs](https://supabase.com/docs)
-***REMOVED***[JavaScript***REMOVED***Client](https://supabase.com/docs/reference/javascript)
-***REMOVED***[Auth***REMOVED***Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
-***REMOVED***[Row***REMOVED***Level***REMOVED***Security](https://supabase.com/docs/guides/auth/row-level-security)
