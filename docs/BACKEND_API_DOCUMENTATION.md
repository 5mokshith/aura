#***REMOVED***Backend***REMOVED***API***REMOVED***Documentation

Complete***REMOVED***API***REMOVED***documentation***REMOVED***for***REMOVED***AURA's***REMOVED***Next.js***REMOVED***backend***REMOVED***with***REMOVED***Supabase***REMOVED***and***REMOVED***LLM***REMOVED***integration.

##***REMOVED***🎯***REMOVED***Overview

The***REMOVED***backend***REMOVED***is***REMOVED***built***REMOVED***using***REMOVED***Next.js***REMOVED***API***REMOVED***routes***REMOVED***(Express-style)***REMOVED***with:
-***REMOVED*****Supabase*****REMOVED***for***REMOVED***authentication***REMOVED***and***REMOVED***database
-***REMOVED*****OpenAI***REMOVED***GPT-4*****REMOVED***for***REMOVED***LLM-powered***REMOVED***workflow***REMOVED***planning
-***REMOVED*****Server-Sent***REMOVED***Events***REMOVED***(SSE)*****REMOVED***for***REMOVED***real-time***REMOVED***updates
-***REMOVED*****Type-safe*****REMOVED***queries***REMOVED***and***REMOVED***responses

##***REMOVED***🔐***REMOVED***Authentication

All***REMOVED***API***REMOVED***routes***REMOVED***require***REMOVED***authentication***REMOVED***via***REMOVED***Supabase.***REMOVED***The***REMOVED***user's***REMOVED***session***REMOVED***is***REMOVED***verified***REMOVED***using:

```typescript
const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();
```

##***REMOVED***📡***REMOVED***API***REMOVED***Routes

###***REMOVED***Workflow***REMOVED***Execution

####***REMOVED***`POST***REMOVED***/api/workflow/execute`
Create***REMOVED***and***REMOVED***plan***REMOVED***a***REMOVED***new***REMOVED***workflow***REMOVED***from***REMOVED***a***REMOVED***natural***REMOVED***language***REMOVED***command.

**Request:**
```json
{
***REMOVED******REMOVED***"command":***REMOVED***"Send***REMOVED***a***REMOVED***summary***REMOVED***of***REMOVED***my***REMOVED***unread***REMOVED***emails***REMOVED***to***REMOVED***john@example.com"
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"workflowId":***REMOVED***"uuid",
***REMOVED******REMOVED***"steps":***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"id":***REMOVED***"step_1",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"agentName":***REMOVED***"EmailAgent",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"action":***REMOVED***"search_emails",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"description":***REMOVED***"Search***REMOVED***for***REMOVED***unread***REMOVED***emails",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"status":***REMOVED***"pending",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"order":***REMOVED***0
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***],
***REMOVED******REMOVED***"message":***REMOVED***"Workflow***REMOVED***created***REMOVED***and***REMOVED***planned***REMOVED***successfully"
}
```

**Validation:**
-***REMOVED***Command***REMOVED***must***REMOVED***be***REMOVED***at***REMOVED***least***REMOVED***10***REMOVED***characters
-***REMOVED***User***REMOVED***must***REMOVED***have***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens
-***REMOVED***Tokens***REMOVED***must***REMOVED***not***REMOVED***be***REMOVED***expired

**Process:**
1.***REMOVED***Validates***REMOVED***user***REMOVED***authentication
2.***REMOVED***Checks***REMOVED***Google***REMOVED***OAuth***REMOVED***token***REMOVED***status
3.***REMOVED***Uses***REMOVED***LLM***REMOVED***to***REMOVED***generate***REMOVED***workflow***REMOVED***plan
4.***REMOVED***Creates***REMOVED***workflow***REMOVED***in***REMOVED***database
5.***REMOVED***Records***REMOVED***in***REMOVED***history
6.***REMOVED***Returns***REMOVED***workflow***REMOVED***ID***REMOVED***and***REMOVED***steps

---

####***REMOVED***`GET***REMOVED***/api/workflow/stream?workflowId={id}`
Stream***REMOVED***real-time***REMOVED***workflow***REMOVED***execution***REMOVED***updates***REMOVED***via***REMOVED***Server-Sent***REMOVED***Events***REMOVED***(SSE).

**Query***REMOVED***Parameters:**
-***REMOVED***`workflowId`***REMOVED***(required):***REMOVED***The***REMOVED***workflow***REMOVED***ID***REMOVED***to***REMOVED***stream

**Response:*****REMOVED***SSE***REMOVED***stream***REMOVED***with***REMOVED***events:

```
event:***REMOVED***connected
data:***REMOVED***{"type":"connected","workflowId":"uuid"}

event:***REMOVED***step_start
data:***REMOVED***{"type":"step_start","stepId":"step_1","data":{...}}

event:***REMOVED***step_complete
data:***REMOVED***{"type":"step_complete","stepId":"step_1","data":{...}}

event:***REMOVED***step_error
data:***REMOVED***{"type":"step_error","stepId":"step_1","data":{"error":"..."}}

event:***REMOVED***workflow_complete
data:***REMOVED***{"type":"workflow_complete","data":{"status":"completed"}}
```

**Features:**
-***REMOVED***Automatic***REMOVED***heartbeat***REMOVED***every***REMOVED***30***REMOVED***seconds
-***REMOVED***Reconnection***REMOVED***support
-***REMOVED***Clean***REMOVED***disconnection***REMOVED***handling

---

####***REMOVED***`POST***REMOVED***/api/workflow/cancel`
Cancel***REMOVED***a***REMOVED***running***REMOVED***workflow.

**Request:**
```json
{
***REMOVED******REMOVED***"workflowId":***REMOVED***"uuid"
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"message":***REMOVED***"Workflow***REMOVED***cancelled***REMOVED***successfully",
***REMOVED******REMOVED***"responseTime":***REMOVED***150
}
```

**Performance:**
-***REMOVED***Target***REMOVED***response***REMOVED***time:***REMOVED***<200ms
-***REMOVED***Logs***REMOVED***warning***REMOVED***if***REMOVED***exceeds***REMOVED***target

---

###***REMOVED***History***REMOVED***Management

####***REMOVED***`GET***REMOVED***/api/history`
Get***REMOVED***user's***REMOVED***workflow***REMOVED***history***REMOVED***with***REMOVED***filtering***REMOVED***and***REMOVED***pagination.

**Query***REMOVED***Parameters:**
-***REMOVED***`limit`***REMOVED***(optional,***REMOVED***default:***REMOVED***20):***REMOVED***Number***REMOVED***of***REMOVED***results
-***REMOVED***`offset`***REMOVED***(optional,***REMOVED***default:***REMOVED***0):***REMOVED***Pagination***REMOVED***offset
-***REMOVED***`status`***REMOVED***(optional):***REMOVED***Filter***REMOVED***by***REMOVED***status***REMOVED***(success/failed/cancelled)
-***REMOVED***`search`***REMOVED***(optional):***REMOVED***Search***REMOVED***in***REMOVED***command***REMOVED***text
-***REMOVED***`startDate`***REMOVED***(optional):***REMOVED***Filter***REMOVED***by***REMOVED***start***REMOVED***date***REMOVED***(ISO***REMOVED***8601)
-***REMOVED***`endDate`***REMOVED***(optional):***REMOVED***Filter***REMOVED***by***REMOVED***end***REMOVED***date***REMOVED***(ISO***REMOVED***8601)

**Response:**
```json
{
***REMOVED******REMOVED***"history":***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"id":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"user_id":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"workflow_id":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"command":***REMOVED***"Send***REMOVED***email***REMOVED***summary",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"status":***REMOVED***"completed",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"executed_at":***REMOVED***"2024-01-01T12:00:00Z",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"created_at":***REMOVED***"2024-01-01T12:00:00Z"
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***],
***REMOVED******REMOVED***"pagination":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***"limit":***REMOVED***20,
***REMOVED******REMOVED******REMOVED******REMOVED***"offset":***REMOVED***0,
***REMOVED******REMOVED******REMOVED******REMOVED***"total":***REMOVED***45,
***REMOVED******REMOVED******REMOVED******REMOVED***"hasMore":***REMOVED***true
***REMOVED******REMOVED***}
}
```

---

####***REMOVED***`GET***REMOVED***/api/history/[id]`
Get***REMOVED***detailed***REMOVED***information***REMOVED***about***REMOVED***a***REMOVED***specific***REMOVED***workflow.

**Response:**
```json
{
***REMOVED******REMOVED***"workflow":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***"id":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED***"user_id":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED***"command":***REMOVED***"Send***REMOVED***email***REMOVED***summary",
***REMOVED******REMOVED******REMOVED******REMOVED***"status":***REMOVED***"completed",
***REMOVED******REMOVED******REMOVED******REMOVED***"steps":***REMOVED***[...],
***REMOVED******REMOVED******REMOVED******REMOVED***"results":***REMOVED***[...],
***REMOVED******REMOVED******REMOVED******REMOVED***"start_time":***REMOVED***"2024-01-01T12:00:00Z",
***REMOVED******REMOVED******REMOVED******REMOVED***"end_time":***REMOVED***"2024-01-01T12:05:00Z",
***REMOVED******REMOVED******REMOVED******REMOVED***"created_at":***REMOVED***"2024-01-01T12:00:00Z"
***REMOVED******REMOVED***}
}
```

---

####***REMOVED***`POST***REMOVED***/api/history/rerun`
Re-run***REMOVED***a***REMOVED***previous***REMOVED***workflow***REMOVED***with***REMOVED***the***REMOVED***same***REMOVED***command.

**Request:**
```json
{
***REMOVED******REMOVED***"workflowId":***REMOVED***"uuid"
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"workflowId":***REMOVED***"new-uuid",
***REMOVED******REMOVED***"steps":***REMOVED***[...],
***REMOVED******REMOVED***"message":***REMOVED***"Workflow***REMOVED***rerun***REMOVED***initiated***REMOVED***successfully"
}
```

---

###***REMOVED***Authentication

####***REMOVED***`GET***REMOVED***/api/auth/status`
Check***REMOVED***current***REMOVED***authentication***REMOVED***and***REMOVED***Google***REMOVED***OAuth***REMOVED***status.

**Response:**
```json
{
***REMOVED******REMOVED***"isAuthenticated":***REMOVED***true,
***REMOVED******REMOVED***"session":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***"userId":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED***"email":***REMOVED***"user@example.com",
***REMOVED******REMOVED******REMOVED******REMOVED***"isAuthenticated":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED***"oauthStatus":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"isConnected":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"userEmail":***REMOVED***"user@example.com",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"scopes":***REMOVED***["gmail.modify",***REMOVED***"drive.file",***REMOVED***...],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"expiresAt":***REMOVED***"2024-01-01T12:00:00Z"
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***"preferences":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"theme":***REMOVED***"system",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"notificationsEnabled":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"defaultView":***REMOVED***"dashboard",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"favoriteActions":***REMOVED***[]
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}
}
```

---

####***REMOVED***`POST***REMOVED***/api/auth/refresh-google-token`
Refresh***REMOVED***Google***REMOVED***OAuth***REMOVED***access***REMOVED***token.

**Request:**
```json
{
***REMOVED******REMOVED***"refreshToken":***REMOVED***"refresh_token_here"
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"access_token":***REMOVED***"new_access_token",
***REMOVED******REMOVED***"expires_in":***REMOVED***3600,
***REMOVED******REMOVED***"token_type":***REMOVED***"Bearer",
***REMOVED******REMOVED***"refresh_token":***REMOVED***"new_refresh_token"
}
```

---

####***REMOVED***`POST***REMOVED***/api/auth/disconnect`
Disconnect***REMOVED***Google***REMOVED***account***REMOVED***and***REMOVED***revoke***REMOVED***tokens.

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"message":***REMOVED***"Successfully***REMOVED***disconnected***REMOVED***Google***REMOVED***account"
}
```

**Process:**
1.***REMOVED***Revokes***REMOVED***token***REMOVED***with***REMOVED***Google
2.***REMOVED***Deletes***REMOVED***tokens***REMOVED***from***REMOVED***database
3.***REMOVED***Returns***REMOVED***success

---

###***REMOVED***Quick***REMOVED***Actions

####***REMOVED***`GET***REMOVED***/api/quick-actions`
Get***REMOVED***all***REMOVED***quick***REMOVED***actions***REMOVED***with***REMOVED***user's***REMOVED***favorites***REMOVED***marked.

**Response:**
```json
{
***REMOVED******REMOVED***"actions":***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"id":***REMOVED***"send-email",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"title":***REMOVED***"Send***REMOVED***Email",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"description":***REMOVED***"Compose***REMOVED***and***REMOVED***send***REMOVED***an***REMOVED***email",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"template":***REMOVED***"Send***REMOVED***an***REMOVED***email***REMOVED***to***REMOVED***{recipient}***REMOVED***about***REMOVED***{topic}",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"icon":***REMOVED***"mail",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"category":***REMOVED***"email",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"isFavorite":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"usageCount":***REMOVED***5
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***]
}
```

---

####***REMOVED***`POST***REMOVED***/api/quick-actions/favorite`
Add***REMOVED***or***REMOVED***remove***REMOVED***a***REMOVED***quick***REMOVED***action***REMOVED***from***REMOVED***favorites.

**Request:**
```json
{
***REMOVED******REMOVED***"actionId":***REMOVED***"send-email",
***REMOVED******REMOVED***"isFavorite":***REMOVED***true
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"favoriteActions":***REMOVED***["send-email",***REMOVED***"create-doc",***REMOVED***...]
}
```

**Limits:**
-***REMOVED***Maximum***REMOVED***20***REMOVED***favorites***REMOVED***per***REMOVED***user
-***REMOVED***Automatically***REMOVED***removes***REMOVED***oldest***REMOVED***if***REMOVED***limit***REMOVED***exceeded

---

###***REMOVED***Feedback

####***REMOVED***`POST***REMOVED***/api/feedback`
Submit***REMOVED***feedback***REMOVED***for***REMOVED***a***REMOVED***workflow***REMOVED***result.

**Request:**
```json
{
***REMOVED******REMOVED***"workflowId":***REMOVED***"uuid",
***REMOVED******REMOVED***"resultId":***REMOVED***"result_1",
***REMOVED******REMOVED***"rating":***REMOVED***"positive",
***REMOVED******REMOVED***"comment":***REMOVED***"Great***REMOVED***summary!"
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"message":***REMOVED***"Feedback***REMOVED***recorded***REMOVED***successfully"
}
```

**Validation:**
-***REMOVED***Rating***REMOVED***must***REMOVED***be***REMOVED***"positive"***REMOVED***or***REMOVED***"negative"
-***REMOVED***Comment***REMOVED***is***REMOVED***optional

---

##***REMOVED***🤖***REMOVED***LLM***REMOVED***Integration

###***REMOVED***LLM***REMOVED***Client***REMOVED***(`lib/llm/client.ts`)

####***REMOVED***`chatCompletion(messages,***REMOVED***options)`
Send***REMOVED***a***REMOVED***chat***REMOVED***completion***REMOVED***request***REMOVED***to***REMOVED***OpenAI.

```typescript
const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***chatCompletion([
***REMOVED******REMOVED***{***REMOVED***role:***REMOVED***"system",***REMOVED***content:***REMOVED***"You***REMOVED***are***REMOVED***a***REMOVED***helpful***REMOVED***assistant"***REMOVED***},
***REMOVED******REMOVED***{***REMOVED***role:***REMOVED***"user",***REMOVED***content:***REMOVED***"Hello!"***REMOVED***}
],***REMOVED***{
***REMOVED******REMOVED***model:***REMOVED***"gpt-4-turbo-preview",
***REMOVED******REMOVED***temperature:***REMOVED***0.7,
***REMOVED******REMOVED***maxTokens:***REMOVED***4096
});
```

---

####***REMOVED***`streamChatCompletion(messages,***REMOVED***options)`
Stream***REMOVED***a***REMOVED***chat***REMOVED***completion***REMOVED***response.

```typescript
for***REMOVED***await***REMOVED***(const***REMOVED***chunk***REMOVED***of***REMOVED***streamChatCompletion(messages))***REMOVED***{
***REMOVED******REMOVED***console.log(chunk);***REMOVED***//***REMOVED***Partial***REMOVED***response
}
```

---

####***REMOVED***`parseCommand(command)`
Parse***REMOVED***natural***REMOVED***language***REMOVED***command***REMOVED***and***REMOVED***extract***REMOVED***intent.

```typescript
const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***parseCommand("Send***REMOVED***an***REMOVED***email***REMOVED***to***REMOVED***john@example.com");
//***REMOVED***Returns:
{
***REMOVED******REMOVED***"intent":***REMOVED***"send_email",
***REMOVED******REMOVED***"parameters":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***"recipient":***REMOVED***"john@example.com"
***REMOVED******REMOVED***},
***REMOVED******REMOVED***"confidence":***REMOVED***0.95
}
```

---

####***REMOVED***`generateWorkflowPlan(command)`
Generate***REMOVED***a***REMOVED***workflow***REMOVED***execution***REMOVED***plan.

```typescript
const***REMOVED***plan***REMOVED***=***REMOVED***await***REMOVED***generateWorkflowPlan("Summarize***REMOVED***my***REMOVED***emails***REMOVED***and***REMOVED***create***REMOVED***a***REMOVED***doc");
//***REMOVED***Returns:
{
***REMOVED******REMOVED***"steps":***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"id":***REMOVED***"step_1",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"agentName":***REMOVED***"EmailAgent",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"action":***REMOVED***"search_emails",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"description":***REMOVED***"Search***REMOVED***for***REMOVED***recent***REMOVED***emails",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"dependencies":***REMOVED***[]
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"id":***REMOVED***"step_2",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"agentName":***REMOVED***"DocsAgent",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"action":***REMOVED***"create_document",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"description":***REMOVED***"Create***REMOVED***summary***REMOVED***document",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"dependencies":***REMOVED***["step_1"]
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***],
***REMOVED******REMOVED***"estimatedDuration":***REMOVED***45
}
```

---

##***REMOVED***💾***REMOVED***Database***REMOVED***Services

###***REMOVED***Workflow***REMOVED***Service***REMOVED***(`lib/services/workflowService.ts`)

####***REMOVED***`createAndPlanWorkflow(userId,***REMOVED***command)`
Create***REMOVED***and***REMOVED***plan***REMOVED***a***REMOVED***new***REMOVED***workflow.

```typescript
const***REMOVED***{***REMOVED***workflowId,***REMOVED***steps***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***createAndPlanWorkflow(
***REMOVED******REMOVED***user.id,
***REMOVED******REMOVED***"Send***REMOVED***email***REMOVED***summary"
);
```

---

####***REMOVED***`executeWorkflowStep(workflowId,***REMOVED***stepId,***REMOVED***accessToken)`
Execute***REMOVED***a***REMOVED***single***REMOVED***workflow***REMOVED***step.

```typescript
const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***executeWorkflowStep(
***REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED***"step_1",
***REMOVED******REMOVED***googleAccessToken
);
```

---

####***REMOVED***`updateWorkflowStatus(workflowId,***REMOVED***status,***REMOVED***updates)`
Update***REMOVED***workflow***REMOVED***status***REMOVED***and***REMOVED***data.

```typescript
await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"completed",***REMOVED***{
***REMOVED******REMOVED***results:***REMOVED***[...],
***REMOVED******REMOVED***steps:***REMOVED***[...]
});
```

---

####***REMOVED***`cancelWorkflow(workflowId)`
Cancel***REMOVED***a***REMOVED***running***REMOVED***workflow.

```typescript
await***REMOVED***cancelWorkflow(workflowId);
```

---

####***REMOVED***`recordWorkflowHistory(userId,***REMOVED***workflowId,***REMOVED***command,***REMOVED***status)`
Record***REMOVED***workflow***REMOVED***in***REMOVED***history.

```typescript
await***REMOVED***recordWorkflowHistory(
***REMOVED******REMOVED***user.id,
***REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED***"Send***REMOVED***email",
***REMOVED******REMOVED***"completed"
);
```

---

##***REMOVED***🔒***REMOVED***Security

###***REMOVED***Authentication
-***REMOVED***All***REMOVED***routes***REMOVED***verify***REMOVED***Supabase***REMOVED***session
-***REMOVED***User***REMOVED***ID***REMOVED***extracted***REMOVED***from***REMOVED***authenticated***REMOVED***session
-***REMOVED***No***REMOVED***manual***REMOVED***token***REMOVED***handling***REMOVED***required

###***REMOVED***Authorization
-***REMOVED***Users***REMOVED***can***REMOVED***only***REMOVED***access***REMOVED***their***REMOVED***own***REMOVED***data
-***REMOVED***Workflow***REMOVED***ownership***REMOVED***verified***REMOVED***before***REMOVED***operations
-***REMOVED***Row***REMOVED***Level***REMOVED***Security***REMOVED***(RLS)***REMOVED***enforced***REMOVED***at***REMOVED***database***REMOVED***level

###***REMOVED***Token***REMOVED***Management
-***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***stored***REMOVED***securely***REMOVED***in***REMOVED***database
-***REMOVED***Automatic***REMOVED***token***REMOVED***refresh***REMOVED***before***REMOVED***expiry
-***REMOVED***Tokens***REMOVED***revoked***REMOVED***on***REMOVED***disconnect

###***REMOVED***Input***REMOVED***Validation
-***REMOVED***Command***REMOVED***length***REMOVED***validation***REMOVED***(min***REMOVED***10***REMOVED***characters)
-***REMOVED***Required***REMOVED***parameters***REMOVED***checked
-***REMOVED***Type***REMOVED***validation***REMOVED***on***REMOVED***all***REMOVED***inputs

---

##***REMOVED***📊***REMOVED***Error***REMOVED***Handling

###***REMOVED***Standard***REMOVED***Error***REMOVED***Response
```json
{
***REMOVED******REMOVED***"error":***REMOVED***"Error***REMOVED***type",
***REMOVED******REMOVED***"message":***REMOVED***"Detailed***REMOVED***error***REMOVED***message"
}
```

###***REMOVED***HTTP***REMOVED***Status***REMOVED***Codes
-***REMOVED***`200`***REMOVED***-***REMOVED***Success
-***REMOVED***`400`***REMOVED***-***REMOVED***Bad***REMOVED***Request***REMOVED***(validation***REMOVED***error)
-***REMOVED***`401`***REMOVED***-***REMOVED***Unauthorized***REMOVED***(not***REMOVED***authenticated)
-***REMOVED***`403`***REMOVED***-***REMOVED***Forbidden***REMOVED***(not***REMOVED***authorized***REMOVED***for***REMOVED***resource)
-***REMOVED***`500`***REMOVED***-***REMOVED***Internal***REMOVED***Server***REMOVED***Error

###***REMOVED***Error***REMOVED***Logging
All***REMOVED***errors***REMOVED***are***REMOVED***logged***REMOVED***to***REMOVED***console***REMOVED***with***REMOVED***context:
```typescript
console.error("Error***REMOVED***executing***REMOVED***workflow:",***REMOVED***error);
```

---

##***REMOVED***🚀***REMOVED***Performance

###***REMOVED***Response***REMOVED***Time***REMOVED***Targets
-***REMOVED***Workflow***REMOVED***execution:***REMOVED***<2s***REMOVED***for***REMOVED***planning
-***REMOVED***Cancel***REMOVED***operation:***REMOVED***<200ms
-***REMOVED***History***REMOVED***fetch:***REMOVED***<500ms
-***REMOVED***SSE***REMOVED***connection:***REMOVED***<100ms

###***REMOVED***Optimization
-***REMOVED***Database***REMOVED***queries***REMOVED***use***REMOVED***indexes
-***REMOVED***Pagination***REMOVED***for***REMOVED***large***REMOVED***datasets
-***REMOVED***Streaming***REMOVED***for***REMOVED***real-time***REMOVED***updates
-***REMOVED***Connection***REMOVED***pooling***REMOVED***via***REMOVED***Supabase

---

##***REMOVED***🧪***REMOVED***Testing

###***REMOVED***Manual***REMOVED***Testing
```bash
#***REMOVED***Start***REMOVED***dev***REMOVED***server
npm***REMOVED***run***REMOVED***dev

#***REMOVED***Test***REMOVED***workflow***REMOVED***execution
curl***REMOVED***-X***REMOVED***POST***REMOVED***http://localhost:3000/api/workflow/execute***REMOVED***\
***REMOVED******REMOVED***-H***REMOVED***"Content-Type:***REMOVED***application/json"***REMOVED***\
***REMOVED******REMOVED***-d***REMOVED***'{"command":"Send***REMOVED***an***REMOVED***email***REMOVED***summary"}'

#***REMOVED***Test***REMOVED***SSE***REMOVED***stream
curl***REMOVED***-N***REMOVED***http://localhost:3000/api/workflow/stream?workflowId=uuid
```

###***REMOVED***Environment***REMOVED***Variables***REMOVED***Required
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
OPENAI_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=REDACTED
```

---

##***REMOVED***📝***REMOVED***Next***REMOVED***Steps

1.***REMOVED*****Implement***REMOVED***Agent***REMOVED***Execution*****REMOVED***-***REMOVED***Add***REMOVED***actual***REMOVED***Google***REMOVED***API***REMOVED***calls
2.***REMOVED*****Add***REMOVED***Error***REMOVED***Recovery*****REMOVED***-***REMOVED***Retry***REMOVED***logic***REMOVED***for***REMOVED***failed***REMOVED***steps
3.***REMOVED*****Implement***REMOVED***Caching*****REMOVED***-***REMOVED***Cache***REMOVED***LLM***REMOVED***responses
4.***REMOVED*****Add***REMOVED***Rate***REMOVED***Limiting*****REMOVED***-***REMOVED***Prevent***REMOVED***API***REMOVED***abuse
5.***REMOVED*****Add***REMOVED***Monitoring*****REMOVED***-***REMOVED***Track***REMOVED***performance***REMOVED***metrics
6.***REMOVED*****Add***REMOVED***Tests*****REMOVED***-***REMOVED***Unit***REMOVED***and***REMOVED***integration***REMOVED***tests

---

##***REMOVED***🔗***REMOVED***Related***REMOVED***Documentation

-***REMOVED***[Supabase***REMOVED***Setup***REMOVED***Guide](./COMPLETE_SETUP_GUIDE.md)
-***REMOVED***[Database***REMOVED***Schema](./DATABASE_SETUP.md)
-***REMOVED***[Migration***REMOVED***Checklist](./MIGRATION_CHECKLIST.md)
-***REMOVED***[Quick***REMOVED***Start](../QUICK_START.md)
