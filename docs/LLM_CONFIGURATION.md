#***REMOVED***LLM***REMOVED***Configuration***REMOVED***Guide

This***REMOVED***guide***REMOVED***explains***REMOVED***how***REMOVED***to***REMOVED***configure***REMOVED***and***REMOVED***switch***REMOVED***between***REMOVED***different***REMOVED***LLM***REMOVED***providers***REMOVED***in***REMOVED***AURA.

##***REMOVED***Supported***REMOVED***Providers

AURA***REMOVED***supports***REMOVED***multiple***REMOVED***LLM***REMOVED***providers:

1.***REMOVED*****Google***REMOVED***Gemini*****REMOVED***(Recommended)***REMOVED***-***REMOVED***Fast,***REMOVED***cost-effective,***REMOVED***and***REMOVED***powerful
2.***REMOVED*****OpenAI***REMOVED***GPT*****REMOVED***-***REMOVED***Industry***REMOVED***standard***REMOVED***with***REMOVED***excellent***REMOVED***performance
3.***REMOVED*****Anthropic***REMOVED***Claude*****REMOVED***-***REMOVED***Coming***REMOVED***soon

##***REMOVED***Current***REMOVED***Configuration:***REMOVED***Google***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash

The***REMOVED***application***REMOVED***is***REMOVED***currently***REMOVED***configured***REMOVED***to***REMOVED***use***REMOVED*****Google***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash**,***REMOVED***which***REMOVED***offers:

-***REMOVED*****Speed**:***REMOVED***Extremely***REMOVED***fast***REMOVED***response***REMOVED***times
-***REMOVED*****Cost**:***REMOVED***Very***REMOVED***cost-effective***REMOVED***compared***REMOVED***to***REMOVED***GPT-4
-***REMOVED*****Quality**:***REMOVED***High-quality***REMOVED***responses***REMOVED***for***REMOVED***most***REMOVED***tasks
-***REMOVED*****Context**:***REMOVED***Large***REMOVED***context***REMOVED***window***REMOVED***(up***REMOVED***to***REMOVED***1M***REMOVED***tokens)
-***REMOVED*****Multimodal**:***REMOVED***Supports***REMOVED***text,***REMOVED***images,***REMOVED***and***REMOVED***more

##***REMOVED***Environment***REMOVED***Variables

###***REMOVED***Google***REMOVED***Gemini***REMOVED***Configuration

```bash
#***REMOVED***Set***REMOVED***the***REMOVED***provider
LLM_PROVIDER=gemini

#***REMOVED***Gemini***REMOVED***API***REMOVED***Key***REMOVED***(get***REMOVED***from:***REMOVED***https://aistudio.google.com/app/apikey)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

#***REMOVED***Model***REMOVED***selection
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp

#***REMOVED***Max***REMOVED***output***REMOVED***tokens
GEMINI_MAX_TOKENS=8192
```

###***REMOVED***Available***REMOVED***Gemini***REMOVED***Models

-***REMOVED***`gemini-2.0-flash-exp`***REMOVED***-***REMOVED***Latest***REMOVED***experimental***REMOVED***flash***REMOVED***model***REMOVED***(fastest,***REMOVED***recommended)
-***REMOVED***`gemini-1.5-flash`***REMOVED***-***REMOVED***Stable***REMOVED***flash***REMOVED***model
-***REMOVED***`gemini-1.5-pro`***REMOVED***-***REMOVED***More***REMOVED***capable***REMOVED***but***REMOVED***slower
-***REMOVED***`gemini-1.0-pro`***REMOVED***-***REMOVED***Legacy***REMOVED***model

##***REMOVED******REMOVED***Configuration***REMOVED***(Alternative)

```bash
#***REMOVED***Set***REMOVED***the***REMOVED***provider
LLM_PROVIDER=openai

***REMOVED******REMOVED***API***REMOVED***Key
OPENAI_API_KEY=your_openai_api_key_here

#***REMOVED***Model***REMOVED***selection
OPENAI_MODEL=gpt-4-turbo-preview

#***REMOVED***Max***REMOVED***output***REMOVED***tokens
OPENAI_MAX_TOKENS=4096
```

###***REMOVED***Common***REMOVED***Settings***REMOVED***(All***REMOVED***Providers)

```bash
#***REMOVED***Temperature***REMOVED***(0.0***REMOVED***-***REMOVED***2.0,***REMOVED***higher***REMOVED***=***REMOVED***more***REMOVED***creative)
LLM_TEMPERATURE=0.7

#***REMOVED***Max***REMOVED***retry***REMOVED***attempts***REMOVED***on***REMOVED***failure
LLM_MAX_RETRIES=3

#***REMOVED***Request***REMOVED***timeout***REMOVED***in***REMOVED***milliseconds
LLM_TIMEOUT=30000
```

##***REMOVED***Getting***REMOVED***API***REMOVED***Keys

###***REMOVED***Google***REMOVED***Gemini***REMOVED***API***REMOVED***Key

1.***REMOVED***Go***REMOVED***to***REMOVED***[Google***REMOVED***AI***REMOVED***Studio](https://aistudio.google.com/app/apikey)
2.***REMOVED***Sign***REMOVED***in***REMOVED***with***REMOVED***your***REMOVED***Google***REMOVED***account
3.***REMOVED***Click***REMOVED***"Get***REMOVED***API***REMOVED***Key"***REMOVED***or***REMOVED***"Create***REMOVED***API***REMOVED***Key"
4.***REMOVED***Copy***REMOVED***the***REMOVED***API***REMOVED***key
5.***REMOVED***Add***REMOVED***it***REMOVED***to***REMOVED***your***REMOVED***`.env.local`***REMOVED***file:
***REMOVED******REMOVED******REMOVED***```bash
***REMOVED******REMOVED******REMOVED***GOOGLE_GEMINI_API_KEY=AIza...your_key_here
***REMOVED******REMOVED******REMOVED***```

##***REMOVED******REMOVED***API***REMOVED***Key

1.***REMOVED***Go***REMOVED***to***REMOVED***[OpenAI***REMOVED***Platform](https://platform.openai.com/api-keys)
2.***REMOVED***Sign***REMOVED***in***REMOVED***or***REMOVED***create***REMOVED***an***REMOVED***account
3.***REMOVED***Click***REMOVED***"Create***REMOVED***new***REMOVED***secret***REMOVED***key"
4.***REMOVED***Copy***REMOVED***the***REMOVED***API***REMOVED***key
5.***REMOVED***Add***REMOVED***it***REMOVED***to***REMOVED***your***REMOVED***`.env.local`***REMOVED***file:
***REMOVED******REMOVED******REMOVED***```bash
***REMOVED******REMOVED******REMOVED***OPENAI_API_KEY=sk-...your_key_here
***REMOVED******REMOVED******REMOVED***```

##***REMOVED***Switching***REMOVED***Providers

To***REMOVED***switch***REMOVED***between***REMOVED***providers,***REMOVED***simply***REMOVED***update***REMOVED***the***REMOVED***`LLM_PROVIDER`***REMOVED***environment***REMOVED***variable:

```bash
#***REMOVED***Use***REMOVED***Gemini***REMOVED***(current)
LLM_PROVIDER=gemini

#***REMOVED***Use***REMOVED***OpenAI
LLM_PROVIDER=openai
```

Then***REMOVED***restart***REMOVED***your***REMOVED***development***REMOVED***server:

```bash
npm***REMOVED***run***REMOVED***dev
```

##***REMOVED***Implementation***REMOVED***Details

The***REMOVED***LLM***REMOVED***client***REMOVED***(`lib/llm/client.ts`)***REMOVED***provides***REMOVED***a***REMOVED***unified***REMOVED***interface***REMOVED***that***REMOVED***works***REMOVED***with***REMOVED***all***REMOVED***providers:

###***REMOVED***Chat***REMOVED***Completion

```typescript
import***REMOVED***{***REMOVED***chatCompletion***REMOVED***}***REMOVED***from***REMOVED***"@/lib/llm/client";

const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***chatCompletion([
***REMOVED******REMOVED***{***REMOVED***role:***REMOVED***"system",***REMOVED***content:***REMOVED***"You***REMOVED***are***REMOVED***a***REMOVED***helpful***REMOVED***assistant."***REMOVED***},
***REMOVED******REMOVED***{***REMOVED***role:***REMOVED***"user",***REMOVED***content:***REMOVED***"Hello!"***REMOVED***},
]);

console.log(response.content);
```

###***REMOVED***Streaming

```typescript
import***REMOVED***{***REMOVED***streamChatCompletion***REMOVED***}***REMOVED***from***REMOVED***"@/lib/llm/client";

for***REMOVED***await***REMOVED***(const***REMOVED***chunk***REMOVED***of***REMOVED***streamChatCompletion(messages))***REMOVED***{
***REMOVED******REMOVED***process.stdout.write(chunk);
}
```

###***REMOVED***Command***REMOVED***Parsing

```typescript
import***REMOVED***{***REMOVED***parseCommand***REMOVED***}***REMOVED***from***REMOVED***"@/lib/llm/client";

const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***parseCommand("Send***REMOVED***an***REMOVED***email***REMOVED***to***REMOVED***john@example.com");
console.log(result.intent);***REMOVED***//***REMOVED***"send_email"
console.log(result.parameters);***REMOVED***//***REMOVED***{***REMOVED***to:***REMOVED***"john@example.com"***REMOVED***}
```

###***REMOVED***Workflow***REMOVED***Planning

```typescript
import***REMOVED***{***REMOVED***generateWorkflowPlan***REMOVED***}***REMOVED***from***REMOVED***"@/lib/llm/client";

const***REMOVED***plan***REMOVED***=***REMOVED***await***REMOVED***generateWorkflowPlan("Summarize***REMOVED***my***REMOVED***emails***REMOVED***and***REMOVED***create***REMOVED***a***REMOVED***report");
console.log(plan.steps);***REMOVED***//***REMOVED***Array***REMOVED***of***REMOVED***workflow***REMOVED***steps
```

##***REMOVED***Provider***REMOVED***Comparison

|***REMOVED***Feature***REMOVED***|***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash***REMOVED***|***REMOVED***GPT-4***REMOVED***Turbo***REMOVED***|***REMOVED***Claude***REMOVED***3***REMOVED***Opus***REMOVED***|
|---------|------------------|-------------|---------------|
|***REMOVED***Speed***REMOVED***|***REMOVED***⚡⚡⚡***REMOVED***Very***REMOVED***Fast***REMOVED***|***REMOVED***⚡⚡***REMOVED***Fast***REMOVED***|***REMOVED***⚡⚡***REMOVED***Fast***REMOVED***|
|***REMOVED***Cost***REMOVED***|***REMOVED***💰***REMOVED***Very***REMOVED***Low***REMOVED***|***REMOVED***💰💰💰***REMOVED***High***REMOVED***|***REMOVED***💰💰***REMOVED***Medium***REMOVED***|
|***REMOVED***Quality***REMOVED***|***REMOVED***⭐⭐⭐⭐***REMOVED***Excellent***REMOVED***|***REMOVED***⭐⭐⭐⭐⭐***REMOVED***Best***REMOVED***|***REMOVED***⭐⭐⭐⭐⭐***REMOVED***Best***REMOVED***|
|***REMOVED***Context***REMOVED***|***REMOVED***1M***REMOVED***tokens***REMOVED***|***REMOVED***128K***REMOVED***tokens***REMOVED***|***REMOVED***200K***REMOVED***tokens***REMOVED***|
|***REMOVED***Multimodal***REMOVED***|***REMOVED***✅***REMOVED***Yes***REMOVED***|***REMOVED***✅***REMOVED***Yes***REMOVED***|***REMOVED***✅***REMOVED***Yes***REMOVED***|

##***REMOVED***Cost***REMOVED***Considerations

###***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash***REMOVED***Pricing***REMOVED***(as***REMOVED***of***REMOVED***2024)

-***REMOVED*****Input**:***REMOVED***$0.075***REMOVED***per***REMOVED***1M***REMOVED***tokens
-***REMOVED*****Output**:***REMOVED***$0.30***REMOVED***per***REMOVED***1M***REMOVED***tokens
-***REMOVED*****Free***REMOVED***tier**:***REMOVED***15***REMOVED***requests***REMOVED***per***REMOVED***minute

##***REMOVED******REMOVED***GPT-4***REMOVED***Turbo***REMOVED***Pricing

-***REMOVED*****Input**:***REMOVED***$10***REMOVED***per***REMOVED***1M***REMOVED***tokens
-***REMOVED*****Output**:***REMOVED***$30***REMOVED***per***REMOVED***1M***REMOVED***tokens

**Gemini***REMOVED***is***REMOVED***~133x***REMOVED***cheaper***REMOVED***than***REMOVED***GPT-4***REMOVED***Turbo!**

##***REMOVED***Performance***REMOVED***Optimization

###***REMOVED***Caching

The***REMOVED***application***REMOVED***uses***REMOVED***SWR***REMOVED***for***REMOVED***API***REMOVED***response***REMOVED***caching,***REMOVED***which***REMOVED***reduces***REMOVED***LLM***REMOVED***calls:

```typescript
//***REMOVED***Cached***REMOVED***for***REMOVED***5***REMOVED***minutes
const***REMOVED***{***REMOVED***data***REMOVED***}***REMOVED***=***REMOVED***useSWR("/api/workflow/plan",***REMOVED***fetcher);
```

###***REMOVED***Streaming

For***REMOVED***long***REMOVED***responses,***REMOVED***use***REMOVED***streaming***REMOVED***to***REMOVED***improve***REMOVED***perceived***REMOVED***performance:

```typescript
const***REMOVED***stream***REMOVED***=***REMOVED***streamChatCompletion(messages);
//***REMOVED***Display***REMOVED***chunks***REMOVED***as***REMOVED***they***REMOVED***arrive
```

###***REMOVED***Temperature***REMOVED***Tuning

Adjust***REMOVED***temperature***REMOVED***based***REMOVED***on***REMOVED***use***REMOVED***case:

-***REMOVED*****0.0-0.3**:***REMOVED***Deterministic,***REMOVED***factual***REMOVED***responses***REMOVED***(data***REMOVED***analysis)
-***REMOVED*****0.4-0.7**:***REMOVED***Balanced***REMOVED***creativity***REMOVED***and***REMOVED***accuracy***REMOVED***(general***REMOVED***use)
-***REMOVED*****0.8-1.0**:***REMOVED***Creative,***REMOVED***varied***REMOVED***responses***REMOVED***(content***REMOVED***generation)

##***REMOVED***Troubleshooting

###***REMOVED***"API***REMOVED***key***REMOVED***not***REMOVED***found"***REMOVED***Error

Make***REMOVED***sure***REMOVED***your***REMOVED***`.env.local`***REMOVED***file***REMOVED***has***REMOVED***the***REMOVED***correct***REMOVED***API***REMOVED***key:

```bash
#***REMOVED***For***REMOVED***Gemini
GOOGLE_GEMINI_API_KEY=AIza...

#***REMOVED***For***REMOVED***OpenAI
OPENAI_API_KEY=sk-...
```

Restart***REMOVED***the***REMOVED***dev***REMOVED***server***REMOVED***after***REMOVED***updating***REMOVED***environment***REMOVED***variables.

###***REMOVED***Rate***REMOVED***Limit***REMOVED***Errors

**Gemini***REMOVED***Free***REMOVED***Tier**:***REMOVED***15***REMOVED***requests***REMOVED***per***REMOVED***minute

**Solution**:***REMOVED***
-***REMOVED***Upgrade***REMOVED***to***REMOVED***paid***REMOVED***tier
-***REMOVED***Implement***REMOVED***request***REMOVED***queuing
-***REMOVED***Use***REMOVED***caching***REMOVED***to***REMOVED***reduce***REMOVED***calls

###***REMOVED***Timeout***REMOVED***Errors

Increase***REMOVED***the***REMOVED***timeout***REMOVED***in***REMOVED***`.env.local`:

```bash
LLM_TIMEOUT=60000***REMOVED******REMOVED***#***REMOVED***60***REMOVED***seconds
```

###***REMOVED***Model***REMOVED***Not***REMOVED***Found

Ensure***REMOVED***you're***REMOVED***using***REMOVED***a***REMOVED***valid***REMOVED***model***REMOVED***name:

```bash
#***REMOVED***Valid***REMOVED***Gemini***REMOVED***models
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
GOOGLE_GEMINI_MODEL=gemini-1.5-flash
GOOGLE_GEMINI_MODEL=gemini-1.5-pro

#***REMOVED***Valid***REMOVED***OpenAI***REMOVED***models
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MODEL=gpt-4
OPENAI_MODEL=gpt-3.5-turbo
```

##***REMOVED***Best***REMOVED***Practices

1.***REMOVED*****Use***REMOVED***Gemini***REMOVED***for***REMOVED***most***REMOVED***tasks*****REMOVED***-***REMOVED***It's***REMOVED***fast***REMOVED***and***REMOVED***cost-effective
2.***REMOVED*****Cache***REMOVED***responses*****REMOVED***-***REMOVED***Reduce***REMOVED***API***REMOVED***calls***REMOVED***with***REMOVED***SWR
3.***REMOVED*****Stream***REMOVED***long***REMOVED***responses*****REMOVED***-***REMOVED***Better***REMOVED***UX***REMOVED***for***REMOVED***users
4.***REMOVED*****Set***REMOVED***appropriate***REMOVED***timeouts*****REMOVED***-***REMOVED***Prevent***REMOVED***hanging***REMOVED***requests
5.***REMOVED*****Monitor***REMOVED***usage*****REMOVED***-***REMOVED***Track***REMOVED***API***REMOVED***costs***REMOVED***in***REMOVED***provider***REMOVED***dashboard
6.***REMOVED*****Handle***REMOVED***errors***REMOVED***gracefully*****REMOVED***-***REMOVED***Implement***REMOVED***retry***REMOVED***logic
7.***REMOVED*****Use***REMOVED***system***REMOVED***prompts*****REMOVED***-***REMOVED***Guide***REMOVED***model***REMOVED***behavior***REMOVED***consistently

##***REMOVED***Migration***REMOVED***Guide

###***REMOVED***From***REMOVED***OpenAI***REMOVED***to***REMOVED***Gemini

1.***REMOVED***Get***REMOVED***a***REMOVED***Gemini***REMOVED***API***REMOVED***key***REMOVED***from***REMOVED***[Google***REMOVED***AI***REMOVED***Studio](https://aistudio.google.com/app/apikey)
2.***REMOVED***Update***REMOVED***`.env.local`:
***REMOVED******REMOVED******REMOVED***```bash
***REMOVED******REMOVED******REMOVED***LLM_PROVIDER=gemini
***REMOVED******REMOVED******REMOVED***GOOGLE_GEMINI_API_KEY=your_key_here
***REMOVED******REMOVED******REMOVED***GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
***REMOVED******REMOVED******REMOVED***```
3.***REMOVED***Restart***REMOVED***the***REMOVED***server:***REMOVED***`npm***REMOVED***run***REMOVED***dev`
4.***REMOVED***Test***REMOVED***your***REMOVED***workflows

No***REMOVED***code***REMOVED***changes***REMOVED***required!***REMOVED***The***REMOVED***unified***REMOVED***client***REMOVED***handles***REMOVED***the***REMOVED***switch***REMOVED***automatically.

##***REMOVED***Resources

-***REMOVED***[Google***REMOVED***Gemini***REMOVED***Documentation](https://ai.google.dev/docs)
-***REMOVED***[OpenAI***REMOVED***API***REMOVED***Documentation](https://platform.openai.com/docs)
-***REMOVED***[Gemini***REMOVED***API***REMOVED***Pricing](https://ai.google.dev/pricing)
-***REMOVED***[OpenAI***REMOVED***Pricing](https://openai.com/pricing)

##***REMOVED***Support

For***REMOVED***issues***REMOVED***or***REMOVED***questions:
1.***REMOVED***Check***REMOVED***the***REMOVED***troubleshooting***REMOVED***section***REMOVED***above
2.***REMOVED***Review***REMOVED***the***REMOVED***provider's***REMOVED***documentation
3.***REMOVED***Check***REMOVED***API***REMOVED***status***REMOVED***pages
4.***REMOVED***Contact***REMOVED***support***REMOVED***if***REMOVED***needed
