#***REMOVED***Implementation***REMOVED***Plan

-***REMOVED***[x]***REMOVED***1.***REMOVED***Create***REMOVED***service***REMOVED***role***REMOVED***Supabase***REMOVED***client***REMOVED***infrastructure




***REMOVED******REMOVED***-***REMOVED***Create***REMOVED***new***REMOVED***`lib/supabase/server.ts`***REMOVED***file***REMOVED***with***REMOVED***two***REMOVED***client***REMOVED***functions:***REMOVED***`createClient()`***REMOVED***for***REMOVED***anon***REMOVED***auth***REMOVED***operations***REMOVED***and***REMOVED***`createServiceClient()`***REMOVED***for***REMOVED***system***REMOVED***operations***REMOVED***that***REMOVED***bypass***REMOVED***RLS
***REMOVED******REMOVED***-***REMOVED***Add***REMOVED***`SUPABASE_SERVICE_ROLE_KEY`***REMOVED***to***REMOVED***`.env.local.example`***REMOVED***with***REMOVED***documentation
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***3.1,***REMOVED***3.2,***REMOVED***3.3,***REMOVED***3.4_

-***REMOVED***[x]***REMOVED***2.***REMOVED***Implement***REMOVED***JSON***REMOVED***extraction***REMOVED***and***REMOVED***parsing***REMOVED***utilities




***REMOVED******REMOVED***-***REMOVED***Add***REMOVED***`extractJSON()`***REMOVED***function***REMOVED***to***REMOVED***strip***REMOVED***markdown***REMOVED***code***REMOVED***fences***REMOVED***(```json***REMOVED***and***REMOVED***```)***REMOVED***from***REMOVED***LLM***REMOVED***responses
***REMOVED******REMOVED***-***REMOVED***Add***REMOVED***`safeJSONParse()`***REMOVED***function***REMOVED***that***REMOVED***uses***REMOVED***`extractJSON()`***REMOVED***and***REMOVED***provides***REMOVED***detailed***REMOVED***error***REMOVED***logging***REMOVED***with***REMOVED***raw***REMOVED***response***REMOVED***content
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***2.1,***REMOVED***2.2,***REMOVED***2.3,***REMOVED***2.4_

-***REMOVED***[x]***REMOVED***3.***REMOVED***Add***REMOVED***model***REMOVED***validation***REMOVED***and***REMOVED***fallback***REMOVED***logic





***REMOVED******REMOVED***-***REMOVED***Define***REMOVED***`VALID_GEMINI_MODELS`***REMOVED***constant***REMOVED***array***REMOVED***with***REMOVED***supported***REMOVED***model***REMOVED***names
***REMOVED******REMOVED***-***REMOVED***Implement***REMOVED***`validateAndGetModel()`***REMOVED***function***REMOVED***that***REMOVED***checks***REMOVED***configured***REMOVED***model***REMOVED***against***REMOVED***valid***REMOVED***list***REMOVED***and***REMOVED***returns***REMOVED***fallback***REMOVED***with***REMOVED***warning***REMOVED***if***REMOVED***invalid
***REMOVED******REMOVED***-***REMOVED***Update***REMOVED***Gemini***REMOVED***client***REMOVED***initialization***REMOVED***to***REMOVED***use***REMOVED***validated***REMOVED***model***REMOVED***name
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***1.1,***REMOVED***1.2,***REMOVED***1.3,***REMOVED***1.4_

-***REMOVED***[x]***REMOVED***4.***REMOVED***Implement***REMOVED***retry***REMOVED***logic***REMOVED***with***REMOVED***exponential***REMOVED***backoff





***REMOVED******REMOVED***-***REMOVED***Create***REMOVED***`withRetry()`***REMOVED***utility***REMOVED***function***REMOVED***that***REMOVED***implements***REMOVED***exponential***REMOVED***backoff***REMOVED***for***REMOVED***retryable***REMOVED***errors
***REMOVED******REMOVED***-***REMOVED***Configure***REMOVED***retry***REMOVED***parameters***REMOVED***from***REMOVED***environment***REMOVED***variables***REMOVED***with***REMOVED***sensible***REMOVED***defaults
***REMOVED******REMOVED***-***REMOVED***Wrap***REMOVED***Gemini***REMOVED***API***REMOVED***calls***REMOVED***in***REMOVED***`geminiChatCompletion()`***REMOVED***with***REMOVED***retry***REMOVED***logic***REMOVED***for***REMOVED***503***REMOVED***errors
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***5.1,***REMOVED***5.2,***REMOVED***5.3,***REMOVED***5.4_

-***REMOVED***[x]***REMOVED***5.***REMOVED***Update***REMOVED***LLM***REMOVED***client***REMOVED***to***REMOVED***use***REMOVED***enhanced***REMOVED***parsing***REMOVED***and***REMOVED***error***REMOVED***handling




***REMOVED******REMOVED***-***REMOVED***Replace***REMOVED***`JSON.parse()`***REMOVED***calls***REMOVED***in***REMOVED***`parseCommand()`***REMOVED***with***REMOVED***`safeJSONParse()`
***REMOVED******REMOVED***-***REMOVED***Replace***REMOVED***`JSON.parse()`***REMOVED***calls***REMOVED***in***REMOVED***`generateWorkflowPlan()`***REMOVED***with***REMOVED***`safeJSONParse()`
***REMOVED******REMOVED***-***REMOVED***Add***REMOVED***detailed***REMOVED***error***REMOVED***logging***REMOVED***with***REMOVED***model***REMOVED***name***REMOVED***and***REMOVED***attempt***REMOVED***number***REMOVED***in***REMOVED***catch***REMOVED***blocks
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***2.4,***REMOVED***4.1,***REMOVED***4.2,***REMOVED***4.4_

-***REMOVED***[x]***REMOVED***6.***REMOVED***Update***REMOVED***workflow***REMOVED***service***REMOVED***to***REMOVED***use***REMOVED***service***REMOVED***role***REMOVED***client







***REMOVED******REMOVED***-***REMOVED***Import***REMOVED***`createServiceClient`***REMOVED***from***REMOVED***`lib/supabase/server`
***REMOVED******REMOVED***-***REMOVED***Update***REMOVED***`createAndPlanWorkflow()`***REMOVED***to***REMOVED***use***REMOVED***service***REMOVED***client***REMOVED***for***REMOVED***database***REMOVED***insert***REMOVED***operations
***REMOVED******REMOVED***-***REMOVED***Update***REMOVED***`updateWorkflowStatus()`***REMOVED***to***REMOVED***use***REMOVED***service***REMOVED***client***REMOVED***for***REMOVED***database***REMOVED***update***REMOVED***operations
***REMOVED******REMOVED***-***REMOVED***Update***REMOVED***`recordWorkflowHistory()`***REMOVED***to***REMOVED***use***REMOVED***service***REMOVED***client***REMOVED***for***REMOVED***history***REMOVED***insert***REMOVED***operations
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***3.1,***REMOVED***3.2_

-***REMOVED***[x]***REMOVED***7.***REMOVED***Update***REMOVED***workflow***REMOVED***API***REMOVED***route***REMOVED***to***REMOVED***use***REMOVED***proper***REMOVED***client***REMOVED***separation







***REMOVED******REMOVED***-***REMOVED***Keep***REMOVED***anon***REMOVED***client***REMOVED***usage***REMOVED***for***REMOVED***`auth.getUser()`***REMOVED***authentication***REMOVED***check
***REMOVED******REMOVED***-***REMOVED***Pass***REMOVED***service***REMOVED***client***REMOVED***to***REMOVED***workflow***REMOVED***service***REMOVED***functions***REMOVED***for***REMOVED***database***REMOVED***mutations
***REMOVED******REMOVED***-***REMOVED***Ensure***REMOVED***service***REMOVED***role***REMOVED***key***REMOVED***is***REMOVED***never***REMOVED***exposed***REMOVED***in***REMOVED***responses***REMOVED***or***REMOVED***client-side***REMOVED***code
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***3.3,***REMOVED***3.4_
-

-***REMOVED***[x]***REMOVED***8.***REMOVED***Add***REMOVED***comprehensive***REMOVED***error***REMOVED***logging***REMOVED***throughout***REMOVED***the***REMOVED***workflow***REMOVED***execution***REMOVED***path










***REMOVED******REMOVED***-***REMOVED***Add***REMOVED***structured***REMOVED***error***REMOVED***logging***REMOVED***in***REMOVED***LLM***REMOVED***client***REMOVED***with***REMOVED***operation***REMOVED***context
***REMOVED******REMOVED***-***REMOVED***Add***REMOVED***error***REMOVED***logging***REMOVED***in***REMOVED***workflow***REMOVED***service***REMOVED***with***REMOVED***user***REMOVED***ID***REMOVED***and***REMOVED***workflow***REMOVED***ID***REMOVED***context
***REMOVED******REMOVED***-***REMOVED***Log***REMOVED***retry***REMOVED***attempts***REMOVED***with***REMOVED***attempt***REMOVED***number***REMOVED***and***REMOVED***delay***REMOVED***duration
***REMOVED******REMOVED***-***REMOVED***Log***REMOVED***model***REMOVED***validation***REMOVED***warnings***REMOVED***when***REMOVED***fallback***REMOVED***is***REMOVED***used
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***4.1,***REMOVED***4.2,***REMOVED***4.3,***REMOVED***4.4_

-***REMOVED***[***REMOVED***]***REMOVED***9.***REMOVED***Write***REMOVED***integration***REMOVED***tests***REMOVED***for***REMOVED***workflow***REMOVED***creation***REMOVED***flow



***REMOVED******REMOVED***-***REMOVED***Test***REMOVED***workflow***REMOVED***creation***REMOVED***with***REMOVED***service***REMOVED***role***REMOVED***client***REMOVED***bypasses***REMOVED***RLS***REMOVED***policies
***REMOVED******REMOVED***-***REMOVED***Test***REMOVED***markdown-wrapped***REMOVED***JSON***REMOVED***responses***REMOVED***are***REMOVED***parsed***REMOVED***correctly
***REMOVED******REMOVED***-***REMOVED***Test***REMOVED***invalid***REMOVED***model***REMOVED***names***REMOVED***trigger***REMOVED***fallback***REMOVED***with***REMOVED***warning
***REMOVED******REMOVED***-***REMOVED***Test***REMOVED***503***REMOVED***errors***REMOVED***trigger***REMOVED***retry***REMOVED***logic***REMOVED***with***REMOVED***exponential***REMOVED***backoff
***REMOVED******REMOVED***-***REMOVED***_Requirements:***REMOVED***1.1,***REMOVED***2.1,***REMOVED***3.1,***REMOVED***5.1_
