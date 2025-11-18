#***REMOVED***Design***REMOVED***Document:***REMOVED***Workflow***REMOVED***Execution***REMOVED***Fixes

##***REMOVED***Overview

This***REMOVED***design***REMOVED***addresses***REMOVED***three***REMOVED***critical***REMOVED***failure***REMOVED***points***REMOVED***in***REMOVED***the***REMOVED***workflow***REMOVED***execution***REMOVED***system:

1.***REMOVED*****JSON***REMOVED***Parsing***REMOVED***Failures**:***REMOVED***LLM***REMOVED***responses***REMOVED***wrapped***REMOVED***in***REMOVED***markdown***REMOVED***code***REMOVED***blocks***REMOVED***cause***REMOVED***`JSON.parse()`***REMOVED***to***REMOVED***fail
2.***REMOVED*****RLS***REMOVED***Policy***REMOVED***Violations**:***REMOVED***Server-side***REMOVED***workflow***REMOVED***operations***REMOVED***fail***REMOVED***due***REMOVED***to***REMOVED***using***REMOVED***the***REMOVED***anon***REMOVED***key***REMOVED***instead***REMOVED***of***REMOVED***service***REMOVED***role
3.***REMOVED*****Model***REMOVED***Configuration***REMOVED***Issues**:***REMOVED***Invalid***REMOVED***Gemini***REMOVED***model***REMOVED***names***REMOVED***cause***REMOVED***404***REMOVED***errors***REMOVED***from***REMOVED***the***REMOVED***API

The***REMOVED***solution***REMOVED***implements***REMOVED***robust***REMOVED***JSON***REMOVED***extraction,***REMOVED***proper***REMOVED***Supabase***REMOVED***client***REMOVED***separation,***REMOVED***and***REMOVED***model***REMOVED***validation***REMOVED***with***REMOVED***fallback***REMOVED***mechanisms.

##***REMOVED***Architecture

###***REMOVED***Component***REMOVED***Overview

```
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***API***REMOVED***Route***REMOVED***Layer***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***/api/workflow/execute***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Uses***REMOVED***Service***REMOVED***Role***REMOVED***Client***REMOVED***for***REMOVED***DB***REMOVED***operations***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Handles***REMOVED***authentication***REMOVED***with***REMOVED***Anon***REMOVED***Client***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Workflow***REMOVED***Service***REMOVED***Layer***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***createAndPlanWorkflow()***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Uses***REMOVED***Service***REMOVED***Role***REMOVED***Client***REMOVED***for***REMOVED***all***REMOVED***DB***REMOVED***writes***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***LLM***REMOVED***Client***REMOVED***Layer***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***generateWorkflowPlan()***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Validates***REMOVED***model***REMOVED***names***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Strips***REMOVED***markdown***REMOVED***from***REMOVED***responses***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Implements***REMOVED***retry***REMOVED***logic***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
```

###***REMOVED***Client***REMOVED***Separation***REMOVED***Strategy

**Two***REMOVED***Distinct***REMOVED***Supabase***REMOVED***Clients:**

1.***REMOVED*****Anon***REMOVED***Client*****REMOVED***(`lib/supabase/client.ts`)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Uses***REMOVED***`NEXT_PUBLIC_SUPABASE_ANON_KEY`
***REMOVED******REMOVED******REMOVED***-***REMOVED***For***REMOVED***user***REMOVED***authentication***REMOVED***and***REMOVED***client-side***REMOVED***operations
***REMOVED******REMOVED******REMOVED***-***REMOVED***Subject***REMOVED***to***REMOVED***RLS***REMOVED***policies

2.***REMOVED*****Service***REMOVED***Role***REMOVED***Client*****REMOVED***(`lib/supabase/server.ts`)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Uses***REMOVED***`SUPABASE_SERVICE_ROLE_KEY`
***REMOVED******REMOVED******REMOVED***-***REMOVED***For***REMOVED***server-side***REMOVED***system***REMOVED***operations
***REMOVED******REMOVED******REMOVED***-***REMOVED***Bypasses***REMOVED***RLS***REMOVED***policies
***REMOVED******REMOVED******REMOVED***-***REMOVED***Never***REMOVED***exposed***REMOVED***to***REMOVED***client

##***REMOVED***Components***REMOVED***and***REMOVED***Interfaces

###***REMOVED***1.***REMOVED***Enhanced***REMOVED***LLM***REMOVED***Client***REMOVED***(`lib/llm/client.ts`)

####***REMOVED***Model***REMOVED***Validation

```typescript
interface***REMOVED***ModelConfig***REMOVED***{
***REMOVED******REMOVED***name:***REMOVED***string;
***REMOVED******REMOVED***provider:***REMOVED***'gemini'***REMOVED***|***REMOVED***'openai';
***REMOVED******REMOVED***isValid:***REMOVED***boolean;
***REMOVED******REMOVED***fallback?:***REMOVED***string;
}

const***REMOVED***VALID_GEMINI_MODELS***REMOVED***=***REMOVED***[
***REMOVED******REMOVED***'gemini-2.0-flash-exp',
***REMOVED******REMOVED***'gemini-1.5-flash',
***REMOVED******REMOVED***'gemini-1.5-pro',
***REMOVED******REMOVED***'gemini-1.0-pro'
];

function***REMOVED***validateAndGetModel(configuredModel:***REMOVED***string):***REMOVED***ModelConfig***REMOVED***{
***REMOVED******REMOVED***//***REMOVED***Check***REMOVED***if***REMOVED***model***REMOVED***exists***REMOVED***in***REMOVED***valid***REMOVED***list
***REMOVED******REMOVED***//***REMOVED***Return***REMOVED***fallback***REMOVED***if***REMOVED***invalid
***REMOVED******REMOVED***//***REMOVED***Log***REMOVED***warning***REMOVED***for***REMOVED***invalid***REMOVED***models
}
```

####***REMOVED***JSON***REMOVED***Response***REMOVED***Parser

```typescript
function***REMOVED***extractJSON(response:***REMOVED***string):***REMOVED***string***REMOVED***{
***REMOVED******REMOVED***//***REMOVED***Remove***REMOVED***markdown***REMOVED***code***REMOVED***fences:***REMOVED***```json***REMOVED***and***REMOVED***```
***REMOVED******REMOVED***//***REMOVED***Handle***REMOVED***both***REMOVED***```json***REMOVED***and***REMOVED***```***REMOVED***variants
***REMOVED******REMOVED***//***REMOVED***Trim***REMOVED***whitespace
***REMOVED******REMOVED***//***REMOVED***Return***REMOVED***clean***REMOVED***JSON***REMOVED***string
}

function***REMOVED***safeJSONParse<T>(response:***REMOVED***string,***REMOVED***context:***REMOVED***string):***REMOVED***T***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***cleaned***REMOVED***=***REMOVED***extractJSON(response);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***JSON.parse(cleaned);
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Log***REMOVED***raw***REMOVED***response***REMOVED***for***REMOVED***debugging
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Throw***REMOVED***descriptive***REMOVED***error***REMOVED***with***REMOVED***context
***REMOVED******REMOVED***}
}
```

####***REMOVED***Retry***REMOVED***Logic***REMOVED***with***REMOVED***Exponential***REMOVED***Backoff

```typescript
interface***REMOVED***RetryConfig***REMOVED***{
***REMOVED******REMOVED***maxAttempts:***REMOVED***number;
***REMOVED******REMOVED***baseDelay:***REMOVED***number;
***REMOVED******REMOVED***maxDelay:***REMOVED***number;
}

async***REMOVED***function***REMOVED***withRetry<T>(
***REMOVED******REMOVED***operation:***REMOVED***()***REMOVED***=>***REMOVED***Promise<T>,
***REMOVED******REMOVED***config:***REMOVED***RetryConfig
):***REMOVED***Promise<T>***REMOVED***{
***REMOVED******REMOVED***//***REMOVED***Implement***REMOVED***exponential***REMOVED***backoff
***REMOVED******REMOVED***//***REMOVED***Retry***REMOVED***on***REMOVED***503***REMOVED***errors
***REMOVED******REMOVED***//***REMOVED***Preserve***REMOVED***original***REMOVED***error***REMOVED***on***REMOVED***final***REMOVED***failure
}
```

###***REMOVED***2.***REMOVED***Service***REMOVED***Role***REMOVED***Supabase***REMOVED***Client***REMOVED***(`lib/supabase/server.ts`)

```typescript
//***REMOVED***New***REMOVED***file:***REMOVED***lib/supabase/server.ts
import***REMOVED***{***REMOVED***createServerClient***REMOVED***}***REMOVED***from***REMOVED***'@supabase/ssr';
import***REMOVED***{***REMOVED***cookies***REMOVED***}***REMOVED***from***REMOVED***'next/headers';

//***REMOVED***Anon***REMOVED***client***REMOVED***for***REMOVED***auth***REMOVED***verification
export***REMOVED***async***REMOVED***function***REMOVED***createClient()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***cookieStore***REMOVED***=***REMOVED***await***REMOVED***cookies();
***REMOVED******REMOVED***return***REMOVED***createServerClient(
***REMOVED******REMOVED******REMOVED******REMOVED***process.env.NEXT_PUBLIC_SUPABASE_URL!,
***REMOVED******REMOVED******REMOVED******REMOVED***process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***cookies:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***getAll:***REMOVED***()***REMOVED***=>***REMOVED***cookieStore.getAll(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setAll:***REMOVED***(cookies)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***cookies.forEach(({***REMOVED***name,***REMOVED***value,***REMOVED***options***REMOVED***})***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***cookieStore.set(name,***REMOVED***value,***REMOVED***options);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***);
}

//***REMOVED***Service***REMOVED***role***REMOVED***client***REMOVED***for***REMOVED***system***REMOVED***operations
export***REMOVED***function***REMOVED***createServiceClient()***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***createServerClient(
***REMOVED******REMOVED******REMOVED******REMOVED***process.env.NEXT_PUBLIC_SUPABASE_URL!,
***REMOVED******REMOVED******REMOVED******REMOVED***process.env.SUPABASE_SERVICE_ROLE_KEY!,
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***cookies:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***getAll:***REMOVED***()***REMOVED***=>***REMOVED***[],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setAll:***REMOVED***()***REMOVED***=>***REMOVED***{},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***);
}
```

###***REMOVED***3.***REMOVED***Updated***REMOVED***Workflow***REMOVED***Service***REMOVED***(`lib/services/workflowService.ts`)

```typescript
import***REMOVED***{***REMOVED***createServiceClient***REMOVED***}***REMOVED***from***REMOVED***'@/lib/supabase/server';

export***REMOVED***async***REMOVED***function***REMOVED***createAndPlanWorkflow(
***REMOVED******REMOVED***userId:***REMOVED***string,
***REMOVED******REMOVED***command:***REMOVED***string
):***REMOVED***Promise<{***REMOVED***workflowId:***REMOVED***string;***REMOVED***steps:***REMOVED***WorkflowStep[]***REMOVED***}>***REMOVED***{
***REMOVED******REMOVED***//***REMOVED***Use***REMOVED***service***REMOVED***client***REMOVED***for***REMOVED***all***REMOVED***DB***REMOVED***operations
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createServiceClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Generate***REMOVED***plan***REMOVED***with***REMOVED***enhanced***REMOVED***error***REMOVED***handling
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***plan***REMOVED***=***REMOVED***await***REMOVED***generateWorkflowPlan(command);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***workflow***REMOVED***using***REMOVED***service***REMOVED***role
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***workflow,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from('workflows')
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.insert({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***user_id:***REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***command,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***'planning',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***plan.steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results:***REMOVED***[],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***start_time:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***})
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.single();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId:***REMOVED***workflow.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***plan.steps,
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Enhanced***REMOVED***error***REMOVED***logging
***REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***}
}
```

###***REMOVED***4.***REMOVED***Updated***REMOVED***Supabase***REMOVED***Queries***REMOVED***(`lib/supabase/queries.ts`)

```typescript
//***REMOVED***All***REMOVED***workflow***REMOVED***mutation***REMOVED***functions***REMOVED***accept***REMOVED***a***REMOVED***Supabase***REMOVED***client***REMOVED***parameter
//***REMOVED***This***REMOVED***allows***REMOVED***passing***REMOVED***the***REMOVED***service***REMOVED***role***REMOVED***client***REMOVED***from***REMOVED***the***REMOVED***caller

export***REMOVED***async***REMOVED***function***REMOVED***createWorkflow(
***REMOVED******REMOVED***client:***REMOVED***SupabaseClient,
***REMOVED******REMOVED***data:***REMOVED***WorkflowInsert
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***workflow,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***client
***REMOVED******REMOVED******REMOVED******REMOVED***.from('workflows')
***REMOVED******REMOVED******REMOVED******REMOVED***.insert(data)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***workflow;
}

export***REMOVED***async***REMOVED***function***REMOVED***updateWorkflow(
***REMOVED******REMOVED***client:***REMOVED***SupabaseClient,
***REMOVED******REMOVED***id:***REMOVED***string,
***REMOVED******REMOVED***updates:***REMOVED***WorkflowUpdate
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***client
***REMOVED******REMOVED******REMOVED******REMOVED***.from('workflows')
***REMOVED******REMOVED******REMOVED******REMOVED***.update(updates)
***REMOVED******REMOVED******REMOVED******REMOVED***.eq('id',***REMOVED***id)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data;
}
```

##***REMOVED***Data***REMOVED***Models

###***REMOVED***Environment***REMOVED***Variables

```typescript
//***REMOVED***Required***REMOVED***additions***REMOVED***to***REMOVED***.env.local
SUPABASE_SERVICE_ROLE_KEY=REDACTED

//***REMOVED***LLM***REMOVED***Configuration
LLM_PROVIDER=gemini
GOOGLE_GEMINI_API_KEY=your_api_key
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
LLM_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

//***REMOVED***Retry***REMOVED***Configuration***REMOVED***(optional)
LLM_MAX_RETRIES=3
LLM_RETRY_BASE_DELAY=1000
LLM_RETRY_MAX_DELAY=8000
```

###***REMOVED***Model***REMOVED***Configuration***REMOVED***Type

```typescript
interface***REMOVED***LLMConfig***REMOVED***{
***REMOVED******REMOVED***provider:***REMOVED***'gemini'***REMOVED***|***REMOVED***'openai';
***REMOVED******REMOVED***model:***REMOVED***string;
***REMOVED******REMOVED***apiKey:***REMOVED***string;
***REMOVED******REMOVED***temperature:***REMOVED***number;
***REMOVED******REMOVED***maxTokens:***REMOVED***number;
***REMOVED******REMOVED***retryConfig:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***maxAttempts:***REMOVED***number;
***REMOVED******REMOVED******REMOVED******REMOVED***baseDelay:***REMOVED***number;
***REMOVED******REMOVED******REMOVED******REMOVED***maxDelay:***REMOVED***number;
***REMOVED******REMOVED***};
}
```

##***REMOVED***Error***REMOVED***Handling

###***REMOVED***Error***REMOVED***Categories***REMOVED***and***REMOVED***Responses

1.***REMOVED*****Model***REMOVED***Configuration***REMOVED***Errors**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Invalid***REMOVED***model***REMOVED***name***REMOVED***→***REMOVED***Log***REMOVED***warning,***REMOVED***use***REMOVED***fallback
***REMOVED******REMOVED******REMOVED***-***REMOVED***Missing***REMOVED***API***REMOVED***key***REMOVED***→***REMOVED***Throw***REMOVED***descriptive***REMOVED***error***REMOVED***with***REMOVED***setup***REMOVED***instructions
***REMOVED******REMOVED******REMOVED***-***REMOVED***Example:***REMOVED***`"Gemini***REMOVED***API***REMOVED***key***REMOVED***not***REMOVED***configured.***REMOVED***Set***REMOVED***GOOGLE_GEMINI_API_KEY***REMOVED***in***REMOVED***.env.local"`

2.***REMOVED*****JSON***REMOVED***Parsing***REMOVED***Errors**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Markdown-wrapped***REMOVED***JSON***REMOVED***→***REMOVED***Strip***REMOVED***markers***REMOVED***automatically
***REMOVED******REMOVED******REMOVED***-***REMOVED***Invalid***REMOVED***JSON***REMOVED***→***REMOVED***Log***REMOVED***raw***REMOVED***response,***REMOVED***throw***REMOVED***with***REMOVED***context
***REMOVED******REMOVED******REMOVED***-***REMOVED***Example:***REMOVED***`"Failed***REMOVED***to***REMOVED***parse***REMOVED***workflow***REMOVED***plan.***REMOVED***Raw***REMOVED***response:***REMOVED***{...}"`

3.***REMOVED*****API***REMOVED***Request***REMOVED***Errors**
***REMOVED******REMOVED******REMOVED***-***REMOVED***503***REMOVED***Service***REMOVED***Unavailable***REMOVED***→***REMOVED***Retry***REMOVED***with***REMOVED***exponential***REMOVED***backoff
***REMOVED******REMOVED******REMOVED***-***REMOVED***404***REMOVED***Model***REMOVED***Not***REMOVED***Found***REMOVED***→***REMOVED***Log***REMOVED***error***REMOVED***with***REMOVED***model***REMOVED***name,***REMOVED***suggest***REMOVED***valid***REMOVED***models
***REMOVED******REMOVED******REMOVED***-***REMOVED***401***REMOVED***Unauthorized***REMOVED***→***REMOVED***Throw***REMOVED***with***REMOVED***API***REMOVED***key***REMOVED***validation***REMOVED***message
***REMOVED******REMOVED******REMOVED***-***REMOVED***Other***REMOVED***errors***REMOVED***→***REMOVED***Log***REMOVED***full***REMOVED***error,***REMOVED***throw***REMOVED***with***REMOVED***sanitized***REMOVED***message

4.***REMOVED*****Database***REMOVED***Errors**
***REMOVED******REMOVED******REMOVED***-***REMOVED***RLS***REMOVED***Policy***REMOVED***Violation***REMOVED***→***REMOVED***Should***REMOVED***not***REMOVED***occur***REMOVED***with***REMOVED***service***REMOVED***client
***REMOVED******REMOVED******REMOVED***-***REMOVED***Connection***REMOVED***errors***REMOVED***→***REMOVED***Throw***REMOVED***with***REMOVED***retry***REMOVED***suggestion
***REMOVED******REMOVED******REMOVED***-***REMOVED***Validation***REMOVED***errors***REMOVED***→***REMOVED***Pass***REMOVED***through***REMOVED***with***REMOVED***context

###***REMOVED***Error***REMOVED***Logging***REMOVED***Strategy

```typescript
interface***REMOVED***ErrorContext***REMOVED***{
***REMOVED******REMOVED***operation:***REMOVED***string;
***REMOVED******REMOVED***userId?:***REMOVED***string;
***REMOVED******REMOVED***workflowId?:***REMOVED***string;
***REMOVED******REMOVED***model?:***REMOVED***string;
***REMOVED******REMOVED***attempt?:***REMOVED***number;
***REMOVED******REMOVED***rawResponse?:***REMOVED***string;
}

function***REMOVED***logError(error:***REMOVED***Error,***REMOVED***context:***REMOVED***ErrorContext):***REMOVED***void***REMOVED***{
***REMOVED******REMOVED***console.error(`[${context.operation}]***REMOVED***Error:`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***error.message,
***REMOVED******REMOVED******REMOVED******REMOVED***stack:***REMOVED***error.stack,
***REMOVED******REMOVED******REMOVED******REMOVED***context,
***REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED***});
}
```

##***REMOVED***Testing***REMOVED***Strategy

###***REMOVED***Unit***REMOVED***Tests

1.***REMOVED*****JSON***REMOVED***Extraction***REMOVED***Tests*****REMOVED***(`lib/llm/client.test.ts`)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***markdown***REMOVED***code***REMOVED***fence***REMOVED***removal
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***various***REMOVED***fence***REMOVED***formats***REMOVED***(```json,***REMOVED***```,***REMOVED***etc.)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***already-clean***REMOVED***JSON
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***malformed***REMOVED***JSON***REMOVED***with***REMOVED***good***REMOVED***error***REMOVED***messages

2.***REMOVED*****Model***REMOVED***Validation***REMOVED***Tests**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***valid***REMOVED***model***REMOVED***names
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***invalid***REMOVED***model***REMOVED***names***REMOVED***with***REMOVED***fallback
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***missing***REMOVED***configuration

3.***REMOVED*****Retry***REMOVED***Logic***REMOVED***Tests**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***successful***REMOVED***retry***REMOVED***after***REMOVED***503
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***exponential***REMOVED***backoff***REMOVED***timing
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***max***REMOVED***attempts***REMOVED***exhaustion
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***non-retryable***REMOVED***errors

###***REMOVED***Integration***REMOVED***Tests

1.***REMOVED*****Workflow***REMOVED***Creation***REMOVED***Flow**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***end-to-end***REMOVED***workflow***REMOVED***creation
***REMOVED******REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***service***REMOVED***role***REMOVED***client***REMOVED***usage
***REMOVED******REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***RLS***REMOVED***bypass
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***with***REMOVED***authenticated***REMOVED***user

2.***REMOVED*****LLM***REMOVED***Response***REMOVED***Handling**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***with***REMOVED***real***REMOVED***Gemini***REMOVED***API***REMOVED***responses
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***markdown-wrapped***REMOVED***responses
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***retry***REMOVED***on***REMOVED***transient***REMOVED***failures

###***REMOVED***Manual***REMOVED***Testing***REMOVED***Checklist

-***REMOVED***[***REMOVED***]***REMOVED***Create***REMOVED***workflow***REMOVED***with***REMOVED***valid***REMOVED***command
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***workflow***REMOVED***appears***REMOVED***in***REMOVED***database
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***that***REMOVED***user_id***REMOVED***is***REMOVED***correctly***REMOVED***set
-***REMOVED***[***REMOVED***]***REMOVED***Test***REMOVED***with***REMOVED***markdown-wrapped***REMOVED***LLM***REMOVED***response
-***REMOVED***[***REMOVED***]***REMOVED***Test***REMOVED***with***REMOVED***invalid***REMOVED***model***REMOVED***name***REMOVED***(should***REMOVED***fallback)
-***REMOVED***[***REMOVED***]***REMOVED***Test***REMOVED***with***REMOVED***missing***REMOVED***API***REMOVED***key***REMOVED***(should***REMOVED***error***REMOVED***clearly)
-***REMOVED***[***REMOVED***]***REMOVED***Test***REMOVED***retry***REMOVED***logic***REMOVED***by***REMOVED***simulating***REMOVED***503***REMOVED***error
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***service***REMOVED***role***REMOVED***key***REMOVED***is***REMOVED***never***REMOVED***exposed***REMOVED***to***REMOVED***client

##***REMOVED***Implementation***REMOVED***Notes

###***REMOVED***Migration***REMOVED***Path

1.***REMOVED*****Phase***REMOVED***1:***REMOVED***Service***REMOVED***Role***REMOVED***Client**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Create***REMOVED***`lib/supabase/server.ts`***REMOVED***with***REMOVED***both***REMOVED***clients
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***workflow***REMOVED***service***REMOVED***to***REMOVED***use***REMOVED***service***REMOVED***client
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***API***REMOVED***routes***REMOVED***to***REMOVED***use***REMOVED***service***REMOVED***client***REMOVED***for***REMOVED***mutations
***REMOVED******REMOVED******REMOVED***-***REMOVED***Keep***REMOVED***anon***REMOVED***client***REMOVED***for***REMOVED***auth***REMOVED***verification

2.***REMOVED*****Phase***REMOVED***2:***REMOVED***JSON***REMOVED***Parsing**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***`extractJSON()`***REMOVED***helper***REMOVED***function
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***`generateWorkflowPlan()`***REMOVED***to***REMOVED***use***REMOVED***safe***REMOVED***parser
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***`parseCommand()`***REMOVED***to***REMOVED***use***REMOVED***safe***REMOVED***parser
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***error***REMOVED***logging***REMOVED***for***REMOVED***debugging

3.***REMOVED*****Phase***REMOVED***3:***REMOVED***Model***REMOVED***Validation**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***model***REMOVED***validation***REMOVED***constants
***REMOVED******REMOVED******REMOVED***-***REMOVED***Implement***REMOVED***`validateAndGetModel()`***REMOVED***function
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***client***REMOVED***initialization***REMOVED***to***REMOVED***validate***REMOVED***model
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***fallback***REMOVED***logic***REMOVED***with***REMOVED***warnings

4.***REMOVED*****Phase***REMOVED***4:***REMOVED***Retry***REMOVED***Logic**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Implement***REMOVED***`withRetry()`***REMOVED***utility
***REMOVED******REMOVED******REMOVED***-***REMOVED***Wrap***REMOVED***Gemini***REMOVED***API***REMOVED***calls***REMOVED***with***REMOVED***retry***REMOVED***logic
***REMOVED******REMOVED******REMOVED***-***REMOVED***Configure***REMOVED***retry***REMOVED***parameters***REMOVED***from***REMOVED***environment
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***retry***REMOVED***attempt***REMOVED***logging

###***REMOVED***Security***REMOVED***Considerations

-***REMOVED*****Service***REMOVED***Role***REMOVED***Key***REMOVED***Protection**
***REMOVED******REMOVED***-***REMOVED***Never***REMOVED***log***REMOVED***the***REMOVED***service***REMOVED***role***REMOVED***key
***REMOVED******REMOVED***-***REMOVED***Never***REMOVED***send***REMOVED***to***REMOVED***client
***REMOVED******REMOVED***-***REMOVED***Only***REMOVED***use***REMOVED***in***REMOVED***server-side***REMOVED***code
***REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***`.env.local`***REMOVED***is***REMOVED***in***REMOVED***`.gitignore`

-***REMOVED*****User***REMOVED***Authorization**
***REMOVED******REMOVED***-***REMOVED***Always***REMOVED***verify***REMOVED***user***REMOVED***authentication***REMOVED***with***REMOVED***anon***REMOVED***client
***REMOVED******REMOVED***-***REMOVED***Pass***REMOVED***verified***REMOVED***user***REMOVED***ID***REMOVED***to***REMOVED***service***REMOVED***operations
***REMOVED******REMOVED***-***REMOVED***Never***REMOVED***trust***REMOVED***client-provided***REMOVED***user***REMOVED***IDs

###***REMOVED***Performance***REMOVED***Considerations

-***REMOVED*****Retry***REMOVED***Delays**:***REMOVED***Exponential***REMOVED***backoff***REMOVED***prevents***REMOVED***API***REMOVED***hammering
-***REMOVED*****Model***REMOVED***Fallback**:***REMOVED***Automatic***REMOVED***fallback***REMOVED***prevents***REMOVED***complete***REMOVED***failure
-***REMOVED*****Error***REMOVED***Logging**:***REMOVED***Structured***REMOVED***logging***REMOVED***aids***REMOVED***debugging***REMOVED***without***REMOVED***performance***REMOVED***impact

##***REMOVED***Dependencies

###***REMOVED***New***REMOVED***Dependencies
None***REMOVED***-***REMOVED***uses***REMOVED***existing***REMOVED***packages

###***REMOVED***Updated***REMOVED***Dependencies
-***REMOVED***`@supabase/ssr`***REMOVED***-***REMOVED***Already***REMOVED***installed
-***REMOVED***`@google/generative-ai`***REMOVED***-***REMOVED***Already***REMOVED***installed

##***REMOVED***Rollback***REMOVED***Plan

If***REMOVED***issues***REMOVED***arise:

1.***REMOVED*****Service***REMOVED***Client***REMOVED***Issues**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Revert***REMOVED***to***REMOVED***anon***REMOVED***client***REMOVED***temporarily
***REMOVED******REMOVED******REMOVED***-***REMOVED***Disable***REMOVED***RLS***REMOVED***policies***REMOVED***on***REMOVED***workflows***REMOVED***table***REMOVED***(not***REMOVED***recommended)
***REMOVED******REMOVED******REMOVED***-***REMOVED***Investigate***REMOVED***service***REMOVED***role***REMOVED***key***REMOVED***configuration

2.***REMOVED*****JSON***REMOVED***Parsing***REMOVED***Issues**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***more***REMOVED***robust***REMOVED***markdown***REMOVED***detection
***REMOVED******REMOVED******REMOVED***-***REMOVED***Implement***REMOVED***multiple***REMOVED***parsing***REMOVED***strategies
***REMOVED******REMOVED******REMOVED***-***REMOVED***Add***REMOVED***manual***REMOVED***JSON***REMOVED***cleanup***REMOVED***step

3.***REMOVED*****Model***REMOVED***Issues**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Hard-code***REMOVED***known***REMOVED***working***REMOVED***model
***REMOVED******REMOVED******REMOVED***-***REMOVED***Remove***REMOVED***validation***REMOVED***temporarily
***REMOVED******REMOVED******REMOVED***-***REMOVED***Use***REMOVED***OpenAI***REMOVED***as***REMOVED***fallback***REMOVED***provider

##***REMOVED***Success***REMOVED***Metrics

-***REMOVED***✅***REMOVED***Zero***REMOVED***RLS***REMOVED***policy***REMOVED***violation***REMOVED***errors
-***REMOVED***✅***REMOVED***Zero***REMOVED***JSON***REMOVED***parsing***REMOVED***errors***REMOVED***from***REMOVED***markdown
-***REMOVED***✅***REMOVED***Successful***REMOVED***fallback***REMOVED***on***REMOVED***invalid***REMOVED***model***REMOVED***names
-***REMOVED***✅***REMOVED***Successful***REMOVED***retry***REMOVED***on***REMOVED***503***REMOVED***errors
-***REMOVED***✅***REMOVED***Clear***REMOVED***error***REMOVED***messages***REMOVED***for***REMOVED***configuration***REMOVED***issues
-***REMOVED***✅***REMOVED***No***REMOVED***service***REMOVED***role***REMOVED***key***REMOVED***exposure***REMOVED***to***REMOVED***client
