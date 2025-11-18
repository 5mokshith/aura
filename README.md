#***REMOVED***AURA***REMOVED***-***REMOVED***Agentic***REMOVED***Unified***REMOVED***Reasoning***REMOVED***Assistant

An***REMOVED***AI-powered***REMOVED***agent***REMOVED***system***REMOVED***that***REMOVED***integrates***REMOVED***with***REMOVED***Google***REMOVED***Workspace***REMOVED***to***REMOVED***automate***REMOVED***real-world***REMOVED***workflows.

##***REMOVED***📌***REMOVED***Overview

AURA***REMOVED***is***REMOVED***an***REMOVED***agentic***REMOVED***AI***REMOVED***system***REMOVED***that***REMOVED***can***REMOVED***plan***REMOVED***and***REMOVED***execute***REMOVED***multi-step***REMOVED***tasks***REMOVED***across***REMOVED***Gmail,***REMOVED***Google***REMOVED***Drive,***REMOVED***Docs,***REMOVED***Sheets,***REMOVED***and***REMOVED***Google***REMOVED***Calendar.

Users***REMOVED***describe***REMOVED***what***REMOVED***they***REMOVED***want***REMOVED***in***REMOVED***natural***REMOVED***language,***REMOVED***for***REMOVED***example:

>***REMOVED***“Find***REMOVED***the***REMOVED***latest***REMOVED***sales***REMOVED***report***REMOVED***from***REMOVED***Drive,***REMOVED***summarize***REMOVED***it,***REMOVED***create***REMOVED***a***REMOVED***Google***REMOVED***Doc,***REMOVED***and***REMOVED***email***REMOVED***it***REMOVED***to***REMOVED***the***REMOVED***Marketing***REMOVED***team.”

AURA***REMOVED***automatically:

-***REMOVED***Understands***REMOVED***the***REMOVED***request
-***REMOVED***Breaks***REMOVED***it***REMOVED***into***REMOVED***steps
-***REMOVED***Executes***REMOVED***each***REMOVED***step***REMOVED***using***REMOVED***integrated***REMOVED***Google***REMOVED***services
-***REMOVED***Validates***REMOVED***results
-***REMOVED***Returns***REMOVED***a***REMOVED***final***REMOVED***response***REMOVED***to***REMOVED***the***REMOVED***user

This***REMOVED***is***REMOVED***a***REMOVED***Gemini-style***REMOVED***workflow***REMOVED***automation***REMOVED***system,***REMOVED***built***REMOVED***with***REMOVED***Next.js***REMOVED***+***REMOVED***Node.js***REMOVED***+***REMOVED***Supabase***REMOVED***+***REMOVED***LLM***REMOVED***Agents.

---

##***REMOVED***🚀***REMOVED***Features

###***REMOVED***🧠***REMOVED***Agentic***REMOVED***Automation

-***REMOVED***Natural***REMOVED***language***REMOVED***instructions
-***REMOVED***Automatic***REMOVED***task***REMOVED***planning
-***REMOVED***Execution***REMOVED***across***REMOVED***multiple***REMOVED***apps
-***REMOVED***Multi-step***REMOVED***reasoning
-***REMOVED***Automatic***REMOVED***verification***REMOVED***&***REMOVED***correction

###***REMOVED***📧***REMOVED***Gmail***REMOVED***Integration

-***REMOVED***Send***REMOVED***emails***REMOVED***(with/without***REMOVED***attachments)
-***REMOVED***Fetch***REMOVED***latest***REMOVED***emails
-***REMOVED***Search***REMOVED***inbox***REMOVED***(e.g.,***REMOVED***“emails***REMOVED***from***REMOVED***HR”,***REMOVED***“unread***REMOVED***mails”)
-***REMOVED***Compose***REMOVED***formatted***REMOVED***messages

###***REMOVED***📄***REMOVED***Google***REMOVED***Docs***REMOVED***Integration

-***REMOVED***Create***REMOVED***new***REMOVED***documents
-***REMOVED***Insert***REMOVED***formatted***REMOVED***text***REMOVED***(headings,***REMOVED***lists,***REMOVED***tables)
-***REMOVED***Read***REMOVED***document***REMOVED***content
-***REMOVED***Append***REMOVED***summaries***REMOVED***to***REMOVED***existing***REMOVED***docs

###***REMOVED***📁***REMOVED***Google***REMOVED***Drive***REMOVED***Integration

-***REMOVED***Search***REMOVED***files***REMOVED***by***REMOVED***name,***REMOVED***type,***REMOVED***or***REMOVED***recency
-***REMOVED***Download***REMOVED***PDFs,***REMOVED***Docs,***REMOVED***Sheets
-***REMOVED***Upload***REMOVED***generated***REMOVED***documents
-***REMOVED***Organize***REMOVED***files***REMOVED***in***REMOVED***folders

###***REMOVED***📊***REMOVED***Google***REMOVED***Sheets***REMOVED***Integration

-***REMOVED***Read***REMOVED***sheet***REMOVED***data
-***REMOVED***Append***REMOVED***new***REMOVED***rows
-***REMOVED***Update***REMOVED***cells
-***REMOVED***Extract***REMOVED***tables***REMOVED***for***REMOVED***analysis
-***REMOVED***Generate***REMOVED***insights

###***REMOVED***🗓***REMOVED***Google***REMOVED***Calendar***REMOVED***Integration

-***REMOVED***Create***REMOVED***events
-***REMOVED***Modify***REMOVED***or***REMOVED***delete***REMOVED***events
-***REMOVED***Fetch***REMOVED***upcoming***REMOVED***schedules
-***REMOVED***Auto-scheduling***REMOVED***on***REMOVED***request

---

##***REMOVED***🏗***REMOVED***System***REMOVED***Architecture

Next.js***REMOVED***UI***REMOVED***→***REMOVED***API***REMOVED***Gateway***REMOVED***(Next)***REMOVED***→***REMOVED***Node.js***REMOVED***Backend***REMOVED***(BFF)***REMOVED***→***REMOVED***Agent***REMOVED***Orchestration***REMOVED***→***REMOVED***Google***REMOVED***Workspace***REMOVED***Integrations***REMOVED***→***REMOVED***Supabase***REMOVED***DB

```
┌──────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Next.js***REMOVED***UI***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***User***REMOVED***Interface***REMOVED***Layer***REMOVED***│
└──────────┬───────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌──────────────────────┐
│***REMOVED******REMOVED******REMOVED***API***REMOVED***Gateway***REMOVED***(Next)***REMOVED***│
│***REMOVED******REMOVED***Auth***REMOVED***+***REMOVED***Routes***REMOVED***Layer***REMOVED***│
└──────────┬───────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌──────────────────────┐
│***REMOVED***Node.js***REMOVED***Backend***REMOVED***(BFF)│
│***REMOVED***Orchestrator***REMOVED***+***REMOVED***Agents│
└──────────┬───────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Agent***REMOVED***Orchestration***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***Planner***REMOVED***→***REMOVED***Workers***REMOVED***→***REMOVED***Checker│
└──────────┬─────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌───────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Google***REMOVED***Workspace***REMOVED***Integrations***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED***Gmail***REMOVED***|***REMOVED***Drive***REMOVED***|***REMOVED***Docs***REMOVED***|***REMOVED***Sheets***REMOVED***|***REMOVED***Calendar***REMOVED***APIs***REMOVED***│
└───────────────────────────────────────────────┘

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌──────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Supabase***REMOVED***DB***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED***Tokens***REMOVED***|***REMOVED***Files***REMOVED***|***REMOVED***Logs***REMOVED***│
└──────────────────────┘
```

---

##***REMOVED***🧩***REMOVED***Agent***REMOVED***Architecture

AURA***REMOVED***uses***REMOVED***modular***REMOVED***worker***REMOVED***agents***REMOVED***with***REMOVED***a***REMOVED***central***REMOVED***Planner***REMOVED***and***REMOVED***Evaluator.

1.***REMOVED***Planner***REMOVED***Agent
***REMOVED******REMOVED******REMOVED***-***REMOVED***Interprets***REMOVED***user***REMOVED***request
***REMOVED******REMOVED******REMOVED***-***REMOVED***Generates***REMOVED***workflow***REMOVED***steps
***REMOVED******REMOVED******REMOVED***-***REMOVED***Assigns***REMOVED***tasks***REMOVED***to***REMOVED***worker***REMOVED***agents

2.***REMOVED***Worker***REMOVED***Agents
***REMOVED******REMOVED******REMOVED***-***REMOVED***Email***REMOVED***Agent***REMOVED***—***REMOVED***Gmail***REMOVED***send/search
***REMOVED******REMOVED******REMOVED***-***REMOVED***Docs***REMOVED***Agent***REMOVED***—***REMOVED***Create/edit/read***REMOVED***Docs
***REMOVED******REMOVED******REMOVED***-***REMOVED***Drive***REMOVED***Agent***REMOVED***—***REMOVED***Search/download/upload
***REMOVED******REMOVED******REMOVED***-***REMOVED***Sheets***REMOVED***Agent***REMOVED***—***REMOVED***Read/write***REMOVED***Sheets
***REMOVED******REMOVED******REMOVED***-***REMOVED***Calendar***REMOVED***Agent***REMOVED***—***REMOVED***Create/update***REMOVED***events
***REMOVED******REMOVED******REMOVED***-***REMOVED***File***REMOVED***Parser***REMOVED***Agent***REMOVED***—***REMOVED***Extract***REMOVED***content***REMOVED***from***REMOVED***PDFs/images
***REMOVED******REMOVED******REMOVED***-***REMOVED***Summarizer***REMOVED***Agent***REMOVED***—***REMOVED***Summaries***REMOVED***+***REMOVED***insights
***REMOVED******REMOVED******REMOVED***-***REMOVED***Data***REMOVED***Agent***REMOVED***—***REMOVED***Spreadsheet***REMOVED***analysis

3.***REMOVED***Evaluator***REMOVED***Agent
***REMOVED******REMOVED******REMOVED***-***REMOVED***Validates***REMOVED***results
***REMOVED******REMOVED******REMOVED***-***REMOVED***Re-runs***REMOVED***failed***REMOVED***steps
***REMOVED******REMOVED******REMOVED***-***REMOVED***Produces***REMOVED***final***REMOVED***response

---

##***REMOVED***🔑***REMOVED***Authentication***REMOVED***&***REMOVED***OAuth***REMOVED***Flow

AURA***REMOVED***uses***REMOVED***Google***REMOVED***OAuth***REMOVED***2.0***REMOVED***for***REMOVED***user-level***REMOVED***permissions.

###***REMOVED***Scopes***REMOVED***Requested

Gmail

-***REMOVED***https://www.googleapis.com/auth/gmail.send
-***REMOVED***https://www.googleapis.com/auth/gmail.readonly

Drive

-***REMOVED***https://www.googleapis.com/auth/drive

Docs

-***REMOVED***https://www.googleapis.com/auth/documents
-***REMOVED***https://www.googleapis.com/auth/drive.file

Sheets

-***REMOVED***https://www.googleapis.com/auth/spreadsheets

Calendar

-***REMOVED***https://www.googleapis.com/auth/calendar

---

##***REMOVED***🔒***REMOVED***Token***REMOVED***Storage***REMOVED***(Supabase***REMOVED***Schema)

Table:***REMOVED***`user_tokens`

Fields:

-***REMOVED***`id`***REMOVED***(uuid)***REMOVED***—***REMOVED***PK
-***REMOVED***`user_id`***REMOVED***(uuid)***REMOVED***—***REMOVED***FK***REMOVED***→***REMOVED***auth.users
-***REMOVED***`provider`***REMOVED***(text)***REMOVED***—***REMOVED***"google"
-***REMOVED***`access_token`***REMOVED***(text)***REMOVED***—***REMOVED***Encrypted
-***REMOVED***`refresh_token`***REMOVED***(text)***REMOVED***—***REMOVED***Encrypted
-***REMOVED***`expires_at`***REMOVED***(timestamp)***REMOVED***—***REMOVED***Token***REMOVED***expiry
-***REMOVED***`scopes`***REMOVED***(text[])***REMOVED***—***REMOVED***Scopes***REMOVED***granted

Tokens***REMOVED***are***REMOVED***encrypted***REMOVED***before***REMOVED***storage.***REMOVED***Refresh***REMOVED***tokens***REMOVED***allow***REMOVED***long-term***REMOVED***access.

---

##***REMOVED***⚙️***REMOVED***Execution***REMOVED***Flow***REMOVED***(Example)

User***REMOVED***request:

>***REMOVED***“Find***REMOVED***the***REMOVED***latest***REMOVED***sales***REMOVED***sheet,***REMOVED***summarize***REMOVED***it,***REMOVED***create***REMOVED***a***REMOVED***Google***REMOVED***Doc,***REMOVED***and***REMOVED***email***REMOVED***it***REMOVED***to***REMOVED***the***REMOVED***finance***REMOVED***team.”

Steps:

1.***REMOVED***User***REMOVED***sends***REMOVED***instruction
2.***REMOVED***Planner***REMOVED***Agent***REMOVED***generates***REMOVED***workflow
3.***REMOVED***Drive***REMOVED***Agent***REMOVED***→***REMOVED***find***REMOVED***file
4.***REMOVED***File***REMOVED***Parser***REMOVED***→***REMOVED***extract***REMOVED***content
5.***REMOVED***Summarizer***REMOVED***Agent***REMOVED***→***REMOVED***summarize
6.***REMOVED***Docs***REMOVED***Agent***REMOVED***→***REMOVED***create***REMOVED***a***REMOVED***new***REMOVED***Google***REMOVED***Doc
7.***REMOVED***Email***REMOVED***Agent***REMOVED***→***REMOVED***send***REMOVED***email***REMOVED***with***REMOVED***doc***REMOVED***link
8.***REMOVED***Evaluator***REMOVED***Agent***REMOVED***→***REMOVED***verify***REMOVED***final***REMOVED***result
9.***REMOVED***Next.js***REMOVED***UI***REMOVED***returns***REMOVED***the***REMOVED***output

---

##***REMOVED***🧱***REMOVED***Tech***REMOVED***Stack

Frontend

-***REMOVED***Next.js***REMOVED***16***REMOVED***(App***REMOVED***Router)
-***REMOVED***React***REMOVED***19
-***REMOVED***TypeScript
-***REMOVED***Tailwind***REMOVED***CSS***REMOVED***v4
-***REMOVED***shadcn/ui***REMOVED***components
-***REMOVED***Lucide***REMOVED***React***REMOVED***icons

Backend

-***REMOVED***Node.js
-***REMOVED***TypeScript
-***REMOVED*****Google***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash*****REMOVED***(LLM)***REMOVED***-***REMOVED***Fast,***REMOVED***cost-effective***REMOVED***AI
-***REMOVED***OpenAI***REMOVED***GPT***REMOVED***(alternative***REMOVED***LLM***REMOVED***provider)
-***REMOVED***Google***REMOVED***API***REMOVED***Clients

Database

-***REMOVED***Supabase***REMOVED***(Postgres)
-***REMOVED***Supabase***REMOVED***Auth
-***REMOVED***Supabase***REMOVED***Storage***REMOVED***(optional)

---

##***REMOVED***🛠️***REMOVED***Development***REMOVED***Setup

###***REMOVED***Prerequisites

-***REMOVED***Node.js***REMOVED***20+***REMOVED***and***REMOVED***npm
-***REMOVED***Google***REMOVED***Cloud***REMOVED***Project***REMOVED***with***REMOVED***OAuth***REMOVED***credentials
-***REMOVED***Supabase***REMOVED***account***REMOVED***(optional***REMOVED***for***REMOVED***local***REMOVED***development)

###***REMOVED***Installation

1.***REMOVED***Clone***REMOVED***the***REMOVED***repository:

```bash
git***REMOVED***clone***REMOVED***<repository-url>
cd***REMOVED***aura
```

2.***REMOVED***Install***REMOVED***dependencies:

```bash
npm***REMOVED***install
```

3.***REMOVED***Set***REMOVED***up***REMOVED***environment***REMOVED***variables:

```bash
cp***REMOVED***.env.local.example***REMOVED***.env.local
```

Edit***REMOVED***`.env.local`***REMOVED***and***REMOVED***add***REMOVED***your***REMOVED***configuration:

-***REMOVED***`GOOGLE_GEMINI_API_KEY`***REMOVED***-***REMOVED***Get***REMOVED***from***REMOVED***[Google***REMOVED***AI***REMOVED***Studio](https://aistudio.google.com/app/apikey)***REMOVED***(free!)
-***REMOVED***`LLM_PROVIDER`***REMOVED***-***REMOVED***Set***REMOVED***to***REMOVED***`gemini`***REMOVED***(recommended)***REMOVED***or***REMOVED***`openai`
-***REMOVED***`GOOGLE_CLIENT_ID`***REMOVED***-***REMOVED***Your***REMOVED***Google***REMOVED***OAuth***REMOVED***client***REMOVED***ID
-***REMOVED***`GOOGLE_CLIENT_SECRET`***REMOVED***-***REMOVED***Your***REMOVED***Google***REMOVED***OAuth***REMOVED***client***REMOVED***secret
-***REMOVED***`NEXTAUTH_SECRET`***REMOVED***-***REMOVED***Generate***REMOVED***with***REMOVED***`openssl***REMOVED***rand***REMOVED***-base64***REMOVED***32`
-***REMOVED***`BFF_API_URL`***REMOVED***-***REMOVED***Backend***REMOVED***API***REMOVED***URL***REMOVED***(if***REMOVED***separate)

**Quick***REMOVED***LLM***REMOVED***Setup**:***REMOVED***See***REMOVED***[Gemini***REMOVED***Setup***REMOVED***Guide](./docs/GEMINI_SETUP.md)***REMOVED***for***REMOVED***a***REMOVED***5-minute***REMOVED***setup!

4.***REMOVED***Run***REMOVED***the***REMOVED***development***REMOVED***server:

```bash
npm***REMOVED***run***REMOVED***dev
```

Open***REMOVED***[http://localhost:3000](http://localhost:3000)***REMOVED***in***REMOVED***your***REMOVED***browser.

###***REMOVED***Available***REMOVED***Scripts

-***REMOVED***`npm***REMOVED***run***REMOVED***dev`***REMOVED***-***REMOVED***Start***REMOVED***development***REMOVED***server
-***REMOVED***`npm***REMOVED***run***REMOVED***build`***REMOVED***-***REMOVED***Build***REMOVED***for***REMOVED***production
-***REMOVED***`npm***REMOVED***run***REMOVED***start`***REMOVED***-***REMOVED***Start***REMOVED***production***REMOVED***server
-***REMOVED***`npm***REMOVED***run***REMOVED***lint`***REMOVED***-***REMOVED***Run***REMOVED***ESLint
-***REMOVED***`npm***REMOVED***run***REMOVED***format`***REMOVED***-***REMOVED***Format***REMOVED***code***REMOVED***with***REMOVED***Prettier
-***REMOVED***`npm***REMOVED***run***REMOVED***format:check`***REMOVED***-***REMOVED***Check***REMOVED***code***REMOVED***formatting

###***REMOVED***Project***REMOVED***Structure

```
aura/
├──***REMOVED***app/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Next.js***REMOVED***App***REMOVED***Router***REMOVED***pages
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***(auth)/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Authentication***REMOVED***routes
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***(dashboard)/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Dashboard***REMOVED***routes
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***api/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***API***REMOVED***routes
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***globals.css***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Global***REMOVED***styles***REMOVED***with***REMOVED***Tailwind
│***REMOVED******REMOVED******REMOVED***└──***REMOVED***layout.tsx***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Root***REMOVED***layout
├──***REMOVED***components/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***React***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***command/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Command***REMOVED***input***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***execution/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Execution***REMOVED***tracker***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***history/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***History***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***layout/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Layout***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***results/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Results***REMOVED***display***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***settings/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Settings***REMOVED***components
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***shared/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Shared***REMOVED***components
│***REMOVED******REMOVED******REMOVED***└──***REMOVED***ui/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***shadcn/ui***REMOVED***components
├──***REMOVED***hooks/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Custom***REMOVED***React***REMOVED***hooks
├──***REMOVED***lib/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Utility***REMOVED***functions
│***REMOVED******REMOVED******REMOVED***├──***REMOVED***env.ts***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Environment***REMOVED***variables
│***REMOVED******REMOVED******REMOVED***└──***REMOVED***utils.ts***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Helper***REMOVED***functions
├──***REMOVED***types/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***TypeScript***REMOVED***type***REMOVED***definitions
│***REMOVED******REMOVED******REMOVED***└──***REMOVED***index.ts***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Core***REMOVED***types
└──***REMOVED***public/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***#***REMOVED***Static***REMOVED***assets
```

###***REMOVED***Code***REMOVED***Quality

This***REMOVED***project***REMOVED***uses:

-***REMOVED*****ESLint*****REMOVED***for***REMOVED***code***REMOVED***linting
-***REMOVED*****Prettier*****REMOVED***for***REMOVED***code***REMOVED***formatting
-***REMOVED*****TypeScript*****REMOVED***for***REMOVED***type***REMOVED***safety
-***REMOVED*****Tailwind***REMOVED***CSS*****REMOVED***for***REMOVED***styling

All***REMOVED***code***REMOVED***is***REMOVED***automatically***REMOVED***formatted***REMOVED***on***REMOVED***commit.
