# AURA — Agentic Unified Reasoning Assistant

An AI-powered agent system that integrates with Google Workspace to automate real-world workflows.

## 📌 Overview

AURA is an agentic AI system that can plan and execute multi-step tasks across Gmail, Google Drive, Docs, Sheets, and Google Calendar.

Users describe what they want in natural language, for example:
> “Find the latest sales report from Drive, summarize it, create a Google Doc, and email it to the Marketing team.”

AURA automatically:
- Understands the request
- Breaks it into steps
- Executes each step using integrated Google services
- Validates results
- Returns a final response to the user

This is a Gemini-style workflow automation system, built with Next.js + Node.js + Supabase + LLM Agents.

---

## 🚀 Features

### 🧠 Agentic Automation
- Natural language instructions
- Automatic task planning
- Execution across multiple apps
- Multi-step reasoning
- Automatic verification & correction

### 📧 Gmail Integration
- Send emails (with/without attachments)
- Fetch latest emails
- Search inbox (e.g., “emails from HR”, “unread mails”)
- Compose formatted messages

### 📄 Google Docs Integration
- Create new documents
- Insert formatted text (headings, lists, tables)
- Read document content
- Append summaries to existing docs

### 📁 Google Drive Integration
- Search files by name, type, or recency
- Download PDFs, Docs, Sheets
- Upload generated documents
- Organize files in folders

### 📊 Google Sheets Integration
- Read sheet data
- Append new rows
- Update cells
- Extract tables for analysis
- Generate insights

### 🗓 Google Calendar Integration
- Create events
- Modify or delete events
- Fetch upcoming schedules
- Auto-scheduling on request

---

## 🏗 System Architecture

Next.js UI → API Gateway (Next) → Node.js Backend (BFF) → Agent Orchestration → Google Workspace Integrations → Supabase DB

```
┌──────────────────────┐
│      Next.js UI       │
│  User Interface Layer │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   API Gateway (Next) │
│  Auth + Routes Layer │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Node.js Backend (BFF)│
│ Orchestrator + Agents│
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────┐
│     Agent Orchestration     │
│  Planner → Workers → Checker│
└──────────┬─────────────────┘
           │
           ▼
┌───────────────────────────────────────────────┐
│           Google Workspace Integrations        │
│ Gmail | Drive | Docs | Sheets | Calendar APIs │
└───────────────────────────────────────────────┘

           ▼
┌──────────────────────┐
│      Supabase DB      │
│ Tokens | Files | Logs │
└──────────────────────┘
```

---

## 🧩 Agent Architecture

AURA uses modular worker agents with a central Planner and Evaluator.

1. Planner Agent
   - Interprets user request
   - Generates workflow steps
   - Assigns tasks to worker agents

2. Worker Agents
   - Email Agent — Gmail send/search
   - Docs Agent — Create/edit/read Docs
   - Drive Agent — Search/download/upload
   - Sheets Agent — Read/write Sheets
   - Calendar Agent — Create/update events
   - File Parser Agent — Extract content from PDFs/images
   - Summarizer Agent — Summaries + insights
   - Data Agent — Spreadsheet analysis

3. Evaluator Agent
   - Validates results
   - Re-runs failed steps
   - Produces final response

---

## 🔑 Authentication & OAuth Flow

AURA uses Google OAuth 2.0 for user-level permissions.

### Scopes Requested

Gmail
- https://www.googleapis.com/auth/gmail.send
- https://www.googleapis.com/auth/gmail.readonly

Drive
- https://www.googleapis.com/auth/drive

Docs
- https://www.googleapis.com/auth/documents
- https://www.googleapis.com/auth/drive.file

Sheets
- https://www.googleapis.com/auth/spreadsheets

Calendar
- https://www.googleapis.com/auth/calendar

---

## 🔒 Token Storage (Supabase Schema)

Table: `user_tokens`

Fields:
- `id` (uuid) — PK
- `user_id` (uuid) — FK → auth.users
- `provider` (text) — "google"
- `access_token` (text) — Encrypted
- `refresh_token` (text) — Encrypted
- `expires_at` (timestamp) — Token expiry
- `scopes` (text[]) — Scopes granted

Tokens are encrypted before storage. Refresh tokens allow long-term access.

---

## ⚙️ Execution Flow (Example)

User request:
> “Find the latest sales sheet, summarize it, create a Google Doc, and email it to the finance team.”

Steps:
1. User sends instruction
2. Planner Agent generates workflow
3. Drive Agent → find file
4. File Parser → extract content
5. Summarizer Agent → summarize
6. Docs Agent → create a new Google Doc
7. Email Agent → send email with doc link
8. Evaluator Agent → verify final result
9. Next.js UI returns the output

---

## 🧱 Tech Stack

Frontend
- Next.js 15
- Tailwind CSS
- OAuth UI
- Realtime task logs

Backend
- Node.js
- TypeScript
- LLM Integration
- Google API Clients

Database
- Supabase (Postgres)
- Supabase Auth
- Supabase Storage (optional)