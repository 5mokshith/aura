# Design Document

## Overview

AURA's UI/UX system is built on a Gemini-inspired conversational interface with glassmorphism design principles. The architecture leverages Next.js 15 App Router, React Server Components, Tailwind CSS, and Supabase Realtime to deliver a futuristic, responsive, and performant experience. The design emphasizes transparency in AI operations, real-time feedback, and seamless Google Workspace integration.

### Design Principles

1. **Conversational First**: The chat interface is the primary interaction model
2. **Transparency**: Users see task decomposition and execution in real-time
3. **Glassmorphism**: Frosted glass effects, soft shadows, and neon accents
4. **Performance**: Sub-1.5s FCP, optimistic updates, intelligent caching
5. **Security**: Zero hardcoded secrets, encrypted storage, secure OAuth flows

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat UI (CSR)│  │Task Visualizer│  │ Pages (RSC) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                   Next.js 15 App Router                       │
│  ┌─────────────────────────┴──────────────────────────┐     │
│  │              API Routes Layer                       │     │
│  │  /api/auth/*  /api/agent/*  /api/gmail/*          │     │
│  │  /api/drive/* /api/docs/*   /api/sheets/*         │     │
│  │  /api/calendar/* /api/db/*                         │     │
│  └─────────────────────┬──────────────────────────────┘     │
└────────────────────────┼─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Gemini AI  │  │Google Workspace│  │  Supabase   │
│   (LLM)      │  │     APIs       │  │  Database   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Frontend Architecture

**Technology Stack:**
- Next.js 15 (App Router)
- React 18 (Server Components + Client Components)
- TypeScript 5.x
- Tailwind CSS 3.x with custom glassmorphism utilities
- Shadcn UI components (optional, customized)
- Supabase Realtime client
- Framer Motion for animations

**Rendering Strategy:**
- Static pages: Dashboard, Settings, Logs (RSC)
- Dynamic pages: Chat Interface (CSR with streaming)
- Hybrid: Timeline (RSC with client-side filtering)

### Backend Architecture

**API Layer:**
- Next.js API Routes (App Router convention)
- Route handlers in TypeScript
- Middleware for authentication and rate limiting
- Error boundary handling with structured responses

**Agent Orchestration:**
- Planner Agent: Task decomposition using Gemini
- Worker Agents: Specialized executors (Gmail, Drive, Docs, Sheets, Calendar)
- Evaluator Agent: Result validation and retry logic
- Agent communication via internal message queue

**External Integrations:**
- Google OAuth 2.0 for authentication
- Google Workspace APIs (googleapis npm package)
- Gemini API for LLM reasoning
- Supabase for database and realtime subscriptions

## Components and Interfaces

### 1. Chat Interface Component

**Location:** `app/components/chat/ChatInterface.tsx`

**Component Structure:**

```tsx
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskDecomposition?: TaskStep[];
  executionFeed?: ExecutionUpdate[];
}

interface TaskStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent: string;
  startTime?: Date;
  endTime?: Date;
}

interface ExecutionUpdate {
  stepId: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error';
}
```

**Visual Design:**
- Floating input bar: Fixed bottom, 90% width, glassmorphism effect
- Message bubbles: Left (assistant) with task cards, Right (user) with simple text
- Task decomposition: Expandable accordion showing all steps
- Live feed: Animated dots, status icons, smooth transitions
- Scroll behavior: Auto-scroll to bottom on new messages

**Glassmorphism Styling:**
```css
.glass-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 2. Task Visualizer Component

**Location:** `app/components/task/TaskVisualizer.tsx`

**Component Structure:**
```tsx
interface ActiveTask {
  id: string;
  title: string;
  subtasks: Subtask[];
  overallStatus: TaskStatus;
}

interface Subtask {
  id: string;
  description: string;
  status: TaskStatus;
  agent: AgentType;
  googleService?: 'gmail' | 'drive' | 'docs' | 'sheets' | 'calendar';
  progress?: number;
}

type AgentType = 'planner' | 'worker' | 'evaluator';
type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
```

**Visual Design:**
- Right sidebar: 320px width on desktop, collapsible on mobile
- Task card: Glass panel with gradient border
- Subtask list: Vertical timeline with connecting lines
- App icons: 24x24px, colored based on service
- Agent badges: Small pills showing agent type
- Progress indicators: Circular loaders for running tasks

**Real-time Updates:**
- Supabase Realtime subscription to `execution_logs` table
- Optimistic UI updates before server confirmation
- Smooth animations on status changes (200ms ease-in-out)

### 3. Quick Actions Panel Component

**Location:** `app/components/actions/QuickActionsPanel.tsx`

**Component Structure:**
```tsx
interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  color: 'cyan' | 'purple' | 'pink' | 'blue';
}

const quickActions: QuickAction[] = [
  { id: 'gmail', label: 'Open Gmail', icon: <MailIcon />, prompt: 'Show my latest emails', color: 'cyan' },
  { id: 'drive', label: 'Find a file', icon: <FolderIcon />, prompt: 'Search my Drive', color: 'blue' },
  { id: 'calendar', label: 'Create event', icon: <CalendarIcon />, prompt: 'Add calendar event', color: 'purple' },
  { id: 'summarize', label: 'Summarize doc', icon: <FileTextIcon />, prompt: 'Summarize a document', color: 'pink' },
  { id: 'newdoc', label: 'New Google Doc', icon: <FileIcon />, prompt: 'Create a new Google Doc', color: 'cyan' },
  { id: 'email', label: 'Draft email', icon: <SendIcon />, prompt: 'Draft an email', color: 'purple' },
];
```

**Visual Design:**
- Horizontal layout at top (desktop) or vertical drawer (mobile)
- Glass buttons: 120x80px with icon + label
- Hover effect: Neon glow matching button color
- Click animation: Scale down to 0.95, then trigger chat
- Spacing: 16px gap between buttons

### 4. Page Layouts

#### 4.1 Home (Chat) Page

**Route:** `/`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Quick Actions Panel - Horizontal]                 │
├──────────────────────────────┬──────────────────────┤
│                              │                      │
│   Chat Messages Area         │  Task Visualizer     │
│   (Scrollable)               │  (Fixed Right)       │
│                              │                      │
│                              │                      │
│                              │                      │
└──────────────────────────────┴──────────────────────┘
│  [Floating Input Bar]                               │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<QuickActionsPanel />` - Top bar
- `<ChatInterface />` - Main area
- `<TaskVisualizer />` - Right sidebar
- `<FloatingInput />` - Bottom fixed


#### 4.2 Task Execution Timeline Page

**Route:** `/timeline`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Header: "Execution Timeline"]                     │
│  [Filters: Date | Status | Service]                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Task Card 1                                 │   │
│  │ • Title: "Summarize sales report"          │   │
│  │ • Status: ✓ Success                        │   │
│  │ • Outputs: [Doc Link] [Email Sent]         │   │
│  │ • Time: 2 mins ago                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Task Card 2                                 │   │
│  │ • Title: "Create calendar event"           │   │
│  │ • Status: ✗ Failed                         │   │
│  │ • Error: OAuth token expired               │   │
│  │ • [Retry Button]                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<TimelineHeader />` - Title and filters
- `<TaskCard />` - Individual task display
- `<FilterBar />` - Date, status, service filters
- `<PaginationControls />` - Load more

**Data Fetching:**
- Server Component for initial load
- Client-side filtering and pagination
- Query Supabase `execution_logs` and `task_history` tables

#### 4.3 Google OAuth Setup Page

**Route:** `/auth/setup`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [AURA Logo]                            │
│                                                     │
│         Connect Google Workspace                    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Requested Permissions:                     │   │
│  │  ✓ Gmail - Send and read emails            │   │
│  │  ✓ Drive - Access and manage files         │   │
│  │  ✓ Docs - Create and edit documents        │   │
│  │  ✓ Sheets - Read and write spreadsheets    │   │
│  │  ✓ Calendar - Manage events                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│       [Connect Google Workspace Button]             │
│                                                     │
│         Secure OAuth 2.0 Authentication             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<OAuthSetup />` - Main container
- `<ScopesList />` - Permission display
- `<ConnectButton />` - OAuth trigger

**Flow:**
1. User clicks "Connect Google Workspace"
2. Redirect to `/api/auth/google/redirect`
3. Google OAuth consent screen
4. Callback to `/api/auth/google/callback`
5. Store tokens in Supabase
6. Redirect to `/` (chat page)


#### 4.4 User Dashboard Page

**Route:** `/dashboard`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Header: "Dashboard"]                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Connected Apps                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Gmail │ │Drive │ │ Docs │ │Sheets│ │ Cal  │    │
│  │  ✓   │ │  ✓   │ │  ✓   │ │  ✓   │ │  ✓   │    │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
│                                                     │
│  Token Status                                       │
│  • Access Token: Valid (expires in 45 mins)        │
│  • Refresh Token: Active                           │
│  • [Reconnect Button]                              │
│                                                     │
│  Recent Activity                                    │
│  • Sent email to team@company.com (5 mins ago)     │
│  • Created "Q4 Report.docx" (1 hour ago)           │
│  • Searched Drive for "budget" (2 hours ago)       │
│                                                     │
│  Storage Usage (Supabase)                          │
│  • Logs: 2.3 MB / 100 MB                           │
│  • Task History: 156 entries                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<ConnectedApps />` - Service status grid
- `<TokenStatus />` - OAuth validity display
- `<RecentActivity />` - Last 10 actions
- `<StorageUsage />` - Supabase metrics

#### 4.5 Settings Page

**Route:** `/settings`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Header: "Settings"]                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Profile                                            │
│  • Email: user@example.com                         │
│  • Account Created: Jan 15, 2025                   │
│                                                     │
│  API Key                                            │
│  • Current Key: aura_sk_***************xyz         │
│  • [Regenerate API Key]                            │
│                                                     │
│  Preferences                                        │
│  • Theme: Dark Mode ▼                              │
│  • Notifications: Enabled ☑                        │
│                                                     │
│  Danger Zone                                        │
│  • [Disconnect Google Account]                     │
│  • [Delete All Execution Logs]                     │
│  • [Delete Account]                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<ProfileSection />` - User info
- `<ApiKeyManager />` - Key regeneration
- `<PreferencesForm />` - Settings controls
- `<DangerZone />` - Destructive actions with confirmations


#### 4.6 Logs Viewer Page

**Route:** `/logs`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Header: "Execution Logs"]                         │
│  [Filters: Task ID | Date Range | Agent Type]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Task ID: task_abc123                               │
│  ┌─────────────────────────────────────────────┐   │
│  │ [10:23:45] Planner: Decomposing task...    │   │
│  │ [10:23:46] Planner: Steps identified: 3    │   │
│  │ [10:23:47] Worker (Drive): Searching...    │   │
│  │ [10:23:49] Worker (Drive): Found file      │   │
│  │ [10:23:50] Worker (Docs): Creating doc...  │   │
│  │ [10:23:52] Worker (Docs): Doc created      │   │
│  │ [10:23:53] Evaluator: Validating results   │   │
│  │ [10:23:54] Evaluator: Task completed ✓     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Export JSON] [Clear Filters]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<LogsHeader />` - Title and filters
- `<LogViewer />` - Scrollable log display
- `<LogEntry />` - Individual log line with syntax highlighting
- `<ExportButton />` - JSON export functionality

**Data Fetching:**
- Query Supabase `execution_logs` table
- Filter by task_id, date_range, agent_type
- Paginate with 100 entries per page
- Real-time updates via Supabase Realtime

#### 4.7 Documents/Files Browser Page

**Route:** `/files`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [Header: "Google Drive Files"]                     │
│  [Search Bar] [Filter: All | Docs | Sheets | PDFs]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │              │
│  │File1 │ │File2 │ │File3 │ │File4 │              │
│  │.docx │ │.xlsx │ │.pdf  │ │.docx │              │
│  │2d ago│ │5d ago│ │1w ago│ │3w ago│              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │              │
│  │File5 │ │File6 │ │File7 │ │File8 │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  [Load More]                                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- `<FilesHeader />` - Search and filters
- `<FileGrid />` - Grid layout for files
- `<FileCard />` - Individual file with thumbnail
- `<FileActions />` - Context menu (summarize, share, download)

**Data Fetching:**
- Call `/api/drive/search` with filters
- Infinite scroll with intersection observer
- Cache results for 5 minutes

## Data Models

### Database Schema (Supabase)

#### Table: `user_tokens`

```sql
CREATE TABLE user_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT NOT NULL, -- Encrypted
  expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_expires_at ON user_tokens(expires_at);
```


#### Table: `execution_logs`

```sql
CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  step_id TEXT,
  agent_type TEXT NOT NULL, -- 'planner' | 'worker' | 'evaluator'
  message TEXT NOT NULL,
  log_level TEXT DEFAULT 'info', -- 'info' | 'success' | 'error'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_execution_logs_task_id ON execution_logs(task_id);
CREATE INDEX idx_execution_logs_user_id ON execution_logs(user_id);
CREATE INDEX idx_execution_logs_created_at ON execution_logs(created_at DESC);
```

#### Table: `task_history`

```sql
CREATE TABLE task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success' | 'failed' | 'rerun'
  input_prompt TEXT NOT NULL,
  output_summary TEXT,
  outputs JSONB, -- Links to created docs, emails, etc.
  google_services TEXT[], -- ['gmail', 'drive', 'docs']
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_task_history_user_id ON task_history(user_id);
CREATE INDEX idx_task_history_status ON task_history(status);
CREATE INDEX idx_task_history_created_at ON task_history(created_at DESC);
```

#### Table: `documents_generated`

```sql
CREATE TABLE documents_generated (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES task_history(task_id),
  document_type TEXT NOT NULL, -- 'doc' | 'sheet' | 'email' | 'calendar_event'
  google_id TEXT, -- Google resource ID
  title TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_generated_user_id ON documents_generated(user_id);
CREATE INDEX idx_documents_generated_task_id ON documents_generated(task_id);
```

### TypeScript Interfaces

#### Frontend Types

```typescript
// app/types/chat.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskDecomposition?: TaskDecomposition;
  executionFeed?: ExecutionUpdate[];
}

export interface TaskDecomposition {
  taskId: string;
  steps: TaskStep[];
}

export interface TaskStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent: 'planner' | 'worker' | 'evaluator';
  googleService?: GoogleService;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface ExecutionUpdate {
  stepId: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error';
}

export type GoogleService = 'gmail' | 'drive' | 'docs' | 'sheets' | 'calendar';
```


#### API Types

```typescript
// app/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AgentPlanRequest {
  prompt: string;
  userId: string;
}

export interface AgentPlanResponse {
  taskId: string;
  steps: TaskStep[];
}

export interface AgentExecuteRequest {
  taskId: string;
  userId: string;
}

export interface AgentExecuteResponse {
  taskId: string;
  status: 'completed' | 'failed';
  outputs: TaskOutput[];
  error?: string;
}

export interface TaskOutput {
  type: 'document' | 'email' | 'calendar_event' | 'file';
  title: string;
  url?: string;
  googleId?: string;
}

export interface GmailSendRequest {
  to: string[];
  subject: string;
  body: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  mimeType: string;
  data: string; // Base64 encoded
}

export interface DriveSearchRequest {
  query: string;
  fileType?: string;
  limit?: number;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
  thumbnailLink?: string;
}
```

## Error Handling

### Error Categories

1. **Authentication Errors**
   - OAuth token expired
   - Invalid credentials
   - Missing scopes

2. **API Errors**
   - Google API rate limits
   - Network failures
   - Invalid requests

3. **Agent Errors**
   - Task planning failures
   - Execution errors
   - Validation failures

4. **Database Errors**
   - Connection failures
   - Query errors
   - Data integrity issues

### Error Handling Strategy

**Frontend:**
```typescript
// app/lib/errorHandler.ts
export class AuraError extends Error {
  constructor(
    public code: string,
    message: string,
    public userMessage: string,
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

export function handleApiError(error: any): AuraError {
  if (error.code === 'TOKEN_EXPIRED') {
    return new AuraError(
      'TOKEN_EXPIRED',
      'OAuth token expired',
      'Your Google connection expired. Please reconnect.',
      true
    );
  }
  
  if (error.code === 'RATE_LIMIT') {
    return new AuraError(
      'RATE_LIMIT',
      'API rate limit exceeded',
      'Too many requests. Please wait a moment.',
      true
    );
  }
  
  return new AuraError(
    'UNKNOWN_ERROR',
    error.message || 'Unknown error',
    'Something went wrong. Please try again.',
    true
  );
}
```

**Backend:**
```typescript
// app/api/lib/errorHandler.ts
export function apiErrorResponse(error: any): Response {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.userMessage || 'An error occurred';
  
  // Log to Supabase
  logError(error);
  
  return Response.json(
    {
      success: false,
      error: { code, message }
    },
    { status: statusCode }
  );
}
```


### User-Facing Error Messages

| Error Code | User Message | Recovery Action |
|------------|--------------|-----------------|
| TOKEN_EXPIRED | Your Google connection expired. Please reconnect. | Show "Reconnect" button |
| RATE_LIMIT | Too many requests. Please wait a moment. | Disable input for 30s |
| NETWORK_ERROR | Connection lost. Retrying... | Auto-retry 3 times |
| TASK_FAILED | Task execution failed. Would you like to retry? | Show "Retry" button |
| INVALID_INPUT | Invalid request. Please check your input. | Highlight input field |
| PERMISSION_DENIED | Missing required permissions. | Redirect to OAuth setup |

## Testing Strategy

### Unit Testing

**Framework:** Vitest + React Testing Library

**Coverage Targets:**
- Components: 80%
- API routes: 90%
- Utility functions: 95%

**Key Test Suites:**
```typescript
// app/components/chat/__tests__/ChatInterface.test.tsx
describe('ChatInterface', () => {
  it('renders floating input bar', () => {});
  it('displays user messages right-aligned', () => {});
  it('displays assistant messages with task decomposition', () => {});
  it('updates execution feed in real-time', () => {});
  it('auto-scrolls to bottom on new messages', () => {});
});

// app/api/agent/plan/__tests__/route.test.ts
describe('POST /api/agent/plan', () => {
  it('returns task decomposition for valid prompt', async () => {});
  it('returns 401 for unauthenticated requests', async () => {});
  it('handles Gemini API errors gracefully', async () => {});
});
```

### Integration Testing

**Framework:** Playwright

**Test Scenarios:**
1. Complete OAuth flow
2. Send message and receive response
3. Execute multi-step task
4. View task timeline
5. Reconnect expired token

### E2E Testing

**Critical User Flows:**
1. New user onboarding → OAuth → First task
2. Existing user → Send complex task → View results
3. Token expiration → Reconnect → Resume task
4. Browse files → Summarize document → Create doc

### Performance Testing

**Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

**Tools:**
- Lighthouse CI
- WebPageTest
- Chrome DevTools Performance

## API Routes Design

### Authentication Routes

#### POST /api/auth/google/redirect

**Purpose:** Initiate Google OAuth flow

**Request:**
```typescript
// No body required
```

**Response:**
```typescript
{
  redirectUrl: string; // Google OAuth consent URL
}
```

**Implementation:**
```typescript
import { google } from 'googleapis';

export async function POST() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar',
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return Response.json({ redirectUrl: authUrl });
}
```


#### GET /api/auth/google/callback

**Purpose:** Handle OAuth callback and store tokens

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: CSRF token (optional)

**Response:**
```typescript
{
  success: boolean;
  redirectUrl: string; // Redirect to main app
}
```

**Implementation:**
```typescript
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return Response.json({ error: 'Missing code' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  
  // Get user info
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data: userInfo } = await oauth2.userinfo.get();

  // Store in Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from('user_tokens').upsert({
    user_id: userInfo.id,
    provider: 'google',
    access_token: encrypt(tokens.access_token!),
    refresh_token: encrypt(tokens.refresh_token!),
    expires_at: new Date(tokens.expiry_date!),
    scopes: tokens.scope?.split(' ') || [],
  });

  return Response.redirect(new URL('/', request.url));
}
```

#### POST /api/auth/logout

**Purpose:** Clear user session and tokens

**Response:**
```typescript
{
  success: boolean;
}
```

### Agent Routes

#### POST /api/agent/plan

**Purpose:** Decompose user prompt into executable steps

**Request:**
```typescript
{
  prompt: string;
  userId: string;
}
```

**Response:**
```typescript
{
  taskId: string;
  steps: Array<{
    id: string;
    description: string;
    agent: string;
    googleService?: string;
  }>;
}
```

**Implementation:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { prompt, userId } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const systemPrompt = `You are a task planning agent. Break down the user's request into executable steps.
Each step should specify:
1. Description of the action
2. Which Google service to use (gmail, drive, docs, sheets, calendar)
3. Expected output

Return JSON format:
{
  "steps": [
    { "id": "step_1", "description": "...", "service": "drive", "action": "search" },
    ...
  ]
}`;

  const result = await model.generateContent([systemPrompt, prompt]);
  const response = result.response.text();
  const plan = JSON.parse(response);

  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Save to Supabase
  await saveTaskPlan(taskId, userId, plan);

  return Response.json({ taskId, steps: plan.steps });
}
```


#### POST /api/agent/execute

**Purpose:** Execute planned task steps

**Request:**
```typescript
{
  taskId: string;
  userId: string;
}
```

**Response:**
```typescript
{
  taskId: string;
  status: 'completed' | 'failed';
  outputs: Array<{
    type: string;
    title: string;
    url?: string;
  }>;
}
```

**Implementation:**
```typescript
export async function POST(request: Request) {
  const { taskId, userId } = await request.json();

  // Retrieve task plan
  const plan = await getTaskPlan(taskId);

  const outputs = [];

  for (const step of plan.steps) {
    await logExecution(taskId, step.id, 'info', `Starting step: ${step.description}`);

    try {
      let result;
      
      switch (step.service) {
        case 'gmail':
          result = await executeGmailAction(step, userId);
          break;
        case 'drive':
          result = await executeDriveAction(step, userId);
          break;
        case 'docs':
          result = await executeDocsAction(step, userId);
          break;
        case 'sheets':
          result = await executeSheetsAction(step, userId);
          break;
        case 'calendar':
          result = await executeCalendarAction(step, userId);
          break;
      }

      outputs.push(result);
      await logExecution(taskId, step.id, 'success', `Completed: ${step.description}`);
    } catch (error) {
      await logExecution(taskId, step.id, 'error', error.message);
      throw error;
    }
  }

  // Save task history
  await saveTaskHistory(taskId, userId, 'success', outputs);

  return Response.json({ taskId, status: 'completed', outputs });
}
```

#### POST /api/agent/evaluate

**Purpose:** Validate task execution results

**Request:**
```typescript
{
  taskId: string;
  outputs: Array<any>;
}
```

**Response:**
```typescript
{
  valid: boolean;
  issues?: string[];
  suggestions?: string[];
}
```

#### GET /api/agent/logs

**Purpose:** Retrieve execution logs for a task

**Query Parameters:**
- `taskId`: Task identifier
- `userId`: User identifier

**Response:**
```typescript
{
  logs: Array<{
    timestamp: string;
    agent: string;
    message: string;
    level: string;
  }>;
}
```

### Gmail Routes

#### POST /api/gmail/send

**Request:**
```typescript
{
  userId: string;
  to: string[];
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    data: string; // Base64
  }>;
}
```

**Response:**
```typescript
{
  messageId: string;
  success: boolean;
}
```

**Implementation:**
```typescript
import { google } from 'googleapis';

export async function POST(request: Request) {
  const { userId, to, subject, body, attachments } = await request.json();

  const tokens = await getUserTokens(userId);
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: decrypt(tokens.access_token),
    refresh_token: decrypt(tokens.refresh_token),
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const message = createMimeMessage(to, subject, body, attachments);
  const encodedMessage = Buffer.from(message).toString('base64url');

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });

  return Response.json({ messageId: result.data.id, success: true });
}
```


#### GET /api/gmail/search

**Query Parameters:**
- `userId`: User identifier
- `query`: Gmail search query (e.g., "from:hr@company.com")
- `maxResults`: Number of results (default: 10)

**Response:**
```typescript
{
  messages: Array<{
    id: string;
    threadId: string;
    snippet: string;
    from: string;
    subject: string;
    date: string;
  }>;
}
```

#### GET /api/gmail/read

**Query Parameters:**
- `userId`: User identifier
- `messageId`: Gmail message ID

**Response:**
```typescript
{
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: string;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    size: number;
  }>;
}
```

### Google Drive Routes

#### GET /api/drive/search

**Query Parameters:**
- `userId`: User identifier
- `query`: Search query
- `fileType`: MIME type filter (optional)
- `limit`: Max results (default: 20)

**Response:**
```typescript
{
  files: Array<{
    id: string;
    name: string;
    mimeType: string;
    modifiedTime: string;
    webViewLink: string;
    thumbnailLink?: string;
  }>;
}
```

**Implementation:**
```typescript
import { google } from 'googleapis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId')!;
  const query = searchParams.get('query')!;
  const fileType = searchParams.get('fileType');
  const limit = parseInt(searchParams.get('limit') || '20');

  const tokens = await getUserTokens(userId);
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: decrypt(tokens.access_token),
    refresh_token: decrypt(tokens.refresh_token),
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  let q = `name contains '${query}' and trashed=false`;
  if (fileType) {
    q += ` and mimeType='${fileType}'`;
  }

  const result = await drive.files.list({
    q,
    pageSize: limit,
    fields: 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink)',
    orderBy: 'modifiedTime desc',
  });

  return Response.json({ files: result.data.files });
}
```

#### GET /api/drive/download

**Query Parameters:**
- `userId`: User identifier
- `fileId`: Google Drive file ID

**Response:**
- Binary file data or Base64 encoded content

#### POST /api/drive/upload

**Request:**
```typescript
{
  userId: string;
  filename: string;
  mimeType: string;
  content: string; // Base64
  folderId?: string;
}
```

**Response:**
```typescript
{
  fileId: string;
  webViewLink: string;
}
```

### Google Docs Routes

#### POST /api/docs/create

**Request:**
```typescript
{
  userId: string;
  title: string;
  content: Array<{
    type: 'heading' | 'paragraph' | 'list';
    text: string;
    level?: number; // For headings
  }>;
}
```

**Response:**
```typescript
{
  documentId: string;
  title: string;
  url: string;
}
```


**Implementation:**
```typescript
import { google } from 'googleapis';

export async function POST(request: Request) {
  const { userId, title, content } = await request.json();

  const tokens = await getUserTokens(userId);
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: decrypt(tokens.access_token),
    refresh_token: decrypt(tokens.refresh_token),
  });

  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  // Create document
  const createResult = await docs.documents.create({
    requestBody: { title },
  });

  const documentId = createResult.data.documentId!;

  // Build batch update requests
  const requests = [];
  let index = 1;

  for (const block of content) {
    if (block.type === 'heading') {
      requests.push({
        insertText: { location: { index }, text: block.text + '\n' },
      });
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: index, endIndex: index + block.text.length },
          paragraphStyle: { namedStyleType: `HEADING_${block.level || 1}` },
          fields: 'namedStyleType',
        },
      });
      index += block.text.length + 1;
    } else if (block.type === 'paragraph') {
      requests.push({
        insertText: { location: { index }, text: block.text + '\n' },
      });
      index += block.text.length + 1;
    }
  }

  // Apply updates
  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests },
  });

  const url = `https://docs.google.com/document/d/${documentId}/edit`;

  return Response.json({ documentId, title, url });
}
```

#### POST /api/docs/update

**Request:**
```typescript
{
  userId: string;
  documentId: string;
  operations: Array<{
    type: 'append' | 'replace' | 'insert';
    text: string;
    index?: number;
  }>;
}
```

**Response:**
```typescript
{
  success: boolean;
  documentId: string;
}
```

#### GET /api/docs/read

**Query Parameters:**
- `userId`: User identifier
- `documentId`: Google Docs document ID

**Response:**
```typescript
{
  documentId: string;
  title: string;
  content: string; // Plain text
}
```

### Google Sheets Routes

#### GET /api/sheets/read

**Query Parameters:**
- `userId`: User identifier
- `spreadsheetId`: Google Sheets ID
- `range`: A1 notation (e.g., "Sheet1!A1:D10")

**Response:**
```typescript
{
  spreadsheetId: string;
  range: string;
  values: string[][]; // 2D array
}
```

**Implementation:**
```typescript
import { google } from 'googleapis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId')!;
  const spreadsheetId = searchParams.get('spreadsheetId')!;
  const range = searchParams.get('range') || 'Sheet1';

  const tokens = await getUserTokens(userId);
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: decrypt(tokens.access_token),
    refresh_token: decrypt(tokens.refresh_token),
  });

  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return Response.json({
    spreadsheetId,
    range: result.data.range,
    values: result.data.values || [],
  });
}
```

#### POST /api/sheets/write

**Request:**
```typescript
{
  userId: string;
  spreadsheetId: string;
  range: string;
  values: string[][];
}
```

**Response:**
```typescript
{
  success: boolean;
  updatedCells: number;
}
```

#### POST /api/sheets/update

**Request:**
```typescript
{
  userId: string;
  spreadsheetId: string;
  updates: Array<{
    range: string;
    values: string[][];
  }>;
}
```

**Response:**
```typescript
{
  success: boolean;
  totalUpdatedCells: number;
}
```


### Google Calendar Routes

#### POST /api/calendar/create

**Request:**
```typescript
{
  userId: string;
  summary: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  attendees?: string[];
  location?: string;
}
```

**Response:**
```typescript
{
  eventId: string;
  htmlLink: string;
  summary: string;
}
```

**Implementation:**
```typescript
import { google } from 'googleapis';

export async function POST(request: Request) {
  const { userId, summary, description, startTime, endTime, attendees, location } = await request.json();

  const tokens = await getUserTokens(userId);
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: decrypt(tokens.access_token),
    refresh_token: decrypt(tokens.refresh_token),
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary,
    description,
    location,
    start: { dateTime: startTime, timeZone: 'UTC' },
    end: { dateTime: endTime, timeZone: 'UTC' },
    attendees: attendees?.map(email => ({ email })),
  };

  const result = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return Response.json({
    eventId: result.data.id,
    htmlLink: result.data.htmlLink,
    summary: result.data.summary,
  });
}
```

#### GET /api/calendar/list

**Query Parameters:**
- `userId`: User identifier
- `timeMin`: Start date (ISO 8601)
- `timeMax`: End date (ISO 8601)
- `maxResults`: Max events (default: 10)

**Response:**
```typescript
{
  events: Array<{
    id: string;
    summary: string;
    start: string;
    end: string;
    htmlLink: string;
  }>;
}
```

#### DELETE /api/calendar/delete

**Request:**
```typescript
{
  userId: string;
  eventId: string;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

### Supabase Routes

#### POST /api/db/save-token

**Request:**
```typescript
{
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  scopes: string[];
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

**Implementation:**
```typescript
import { createClient } from '@supabase/supabase-js';
import { encrypt } from '@/lib/crypto';

export async function POST(request: Request) {
  const { userId, accessToken, refreshToken, expiresAt, scopes } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from('user_tokens').upsert({
    user_id: userId,
    provider: 'google',
    access_token: encrypt(accessToken),
    refresh_token: encrypt(refreshToken),
    expires_at: expiresAt,
    scopes,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

#### GET /api/db/get-tokens

**Query Parameters:**
- `userId`: User identifier

**Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  scopes: string[];
}
```

#### POST /api/db/save-logs

**Request:**
```typescript
{
  userId: string;
  taskId: string;
  stepId?: string;
  agentType: string;
  message: string;
  logLevel: 'info' | 'success' | 'error';
  metadata?: any;
}
```

**Response:**
```typescript
{
  success: boolean;
  logId: string;
}
```

## Tailwind Glassmorphism Design Tokens

### Custom Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
        neon: {
          cyan: '#00f0ff',
          purple: '#a855f7',
          pink: '#ec4899',
          blue: '#3b82f6',
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '20px',
        'glass-strong': '40px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-strong': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```


### Glassmorphism Utility Classes

**File:** `app/styles/glassmorphism.css`

```css
/* Base Glass Effects */
.glass-panel {
  @apply bg-glass-light backdrop-blur-glass border border-white/20 shadow-glass;
}

.glass-panel-strong {
  @apply bg-glass-medium backdrop-blur-glass-strong border border-white/30 shadow-glass-strong;
}

.glass-input {
  @apply bg-glass-light backdrop-blur-glass border border-white/20 shadow-glass;
  @apply focus:border-neon-cyan focus:shadow-neon-cyan;
  @apply transition-all duration-300;
}

/* Neon Glow Effects */
.glow-cyan {
  @apply shadow-neon-cyan;
}

.glow-purple {
  @apply shadow-neon-purple;
}

.glow-pink {
  @apply shadow-neon-pink;
}

/* Interactive Elements */
.glass-button {
  @apply glass-panel px-6 py-3 rounded-lg;
  @apply hover:bg-glass-medium hover:scale-105;
  @apply active:scale-95;
  @apply transition-all duration-200;
}

.glass-button-cyan {
  @apply glass-button border-neon-cyan/50;
  @apply hover:shadow-neon-cyan;
}

.glass-button-purple {
  @apply glass-button border-neon-purple/50;
  @apply hover:shadow-neon-purple;
}

/* Message Bubbles */
.message-user {
  @apply glass-panel rounded-2xl rounded-tr-sm p-4;
  @apply ml-auto max-w-[70%];
  @apply animate-slide-up;
}

.message-assistant {
  @apply glass-panel-strong rounded-2xl rounded-tl-sm p-4;
  @apply mr-auto max-w-[85%];
  @apply animate-slide-up;
}

/* Task Cards */
.task-card {
  @apply glass-panel rounded-xl p-4;
  @apply border-l-4 border-neon-cyan;
  @apply hover:bg-glass-medium;
  @apply transition-all duration-300;
}

.task-card-running {
  @apply task-card animate-glow-pulse;
}

.task-card-completed {
  @apply task-card border-green-500;
}

.task-card-failed {
  @apply task-card border-red-500;
}

/* Status Indicators */
.status-pending {
  @apply inline-flex items-center gap-2 px-3 py-1 rounded-full;
  @apply bg-gray-500/20 text-gray-300 border border-gray-500/30;
}

.status-running {
  @apply inline-flex items-center gap-2 px-3 py-1 rounded-full;
  @apply bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30;
  @apply animate-glow-pulse;
}

.status-completed {
  @apply inline-flex items-center gap-2 px-3 py-1 rounded-full;
  @apply bg-green-500/20 text-green-400 border border-green-500/30;
}

.status-failed {
  @apply inline-flex items-center gap-2 px-3 py-1 rounded-full;
  @apply bg-red-500/20 text-red-400 border border-red-500/30;
}

/* Floating Input Bar */
.floating-input-bar {
  @apply fixed bottom-6 left-1/2 -translate-x-1/2;
  @apply w-[90%] max-w-4xl;
  @apply glass-panel-strong rounded-2xl p-4;
  @apply animate-slide-up;
}

/* Scrollbar Styling */
.glass-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.glass-scrollbar::-webkit-scrollbar-track {
  @apply bg-glass-dark rounded-full;
}

.glass-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-glass-medium rounded-full;
  @apply hover:bg-glass-light;
}
```

### Component Usage Examples

**Chat Message Component:**
```tsx
// app/components/chat/Message.tsx
export function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={isUser ? 'message-user' : 'message-assistant'}>
      <p className="text-white/90">{message.content}</p>
      
      {message.taskDecomposition && (
        <div className="mt-4 space-y-2">
          {message.taskDecomposition.steps.map(step => (
            <div key={step.id} className="task-card">
              <div className="flex items-center justify-between">
                <span className="text-sm">{step.description}</span>
                <StatusBadge status={step.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Quick Action Button:**
```tsx
// app/components/actions/QuickActionButton.tsx
export function QuickActionButton({ action }: { action: QuickAction }) {
  return (
    <button
      className={`glass-button-${action.color} flex flex-col items-center gap-2`}
      onClick={() => handleAction(action)}
    >
      <div className="text-2xl">{action.icon}</div>
      <span className="text-sm font-medium">{action.label}</span>
    </button>
  );
}
```

## Folder Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── setup/
│       └── page.tsx
├── (main)/
│   ├── layout.tsx
│   ├── page.tsx                    # Chat interface
│   ├── timeline/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── logs/
│   │   └── page.tsx
│   └── files/
│       └── page.tsx
├── api/
│   ├── auth/
│   │   ├── google/
│   │   │   ├── redirect/
│   │   │   │   └── route.ts
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   └── logout/
│   │       └── route.ts
│   ├── agent/
│   │   ├── plan/
│   │   │   └── route.ts
│   │   ├── execute/
│   │   │   └── route.ts
│   │   ├── evaluate/
│   │   │   └── route.ts
│   │   └── logs/
│   │       └── route.ts
│   ├── gmail/
│   │   ├── send/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   └── read/
│   │       └── route.ts
│   ├── drive/
│   │   ├── search/
│   │   │   └── route.ts
│   │   ├── download/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── docs/
│   │   ├── create/
│   │   │   └── route.ts
│   │   ├── update/
│   │   │   └── route.ts
│   │   └── read/
│   │       └── route.ts
│   ├── sheets/
│   │   ├── read/
│   │   │   └── route.ts
│   │   ├── write/
│   │   │   └── route.ts
│   │   └── update/
│   │       └── route.ts
│   ├── calendar/
│   │   ├── create/
│   │   │   └── route.ts
│   │   ├── list/
│   │   │   └── route.ts
│   │   └── delete/
│   │       └── route.ts
│   └── db/
│       ├── save-token/
│       │   └── route.ts
│       ├── get-tokens/
│       │   └── route.ts
│       └── save-logs/
│           └── route.ts
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── Message.tsx
│   │   ├── FloatingInput.tsx
│   │   └── ExecutionFeed.tsx
│   ├── task/
│   │   ├── TaskVisualizer.tsx
│   │   ├── TaskCard.tsx
│   │   └── StatusBadge.tsx
│   ├── actions/
│   │   ├── QuickActionsPanel.tsx
│   │   └── QuickActionButton.tsx
│   ├── timeline/
│   │   ├── TimelineHeader.tsx
│   │   ├── TaskCard.tsx
│   │   └── FilterBar.tsx
│   ├── dashboard/
│   │   ├── ConnectedApps.tsx
│   │   ├── TokenStatus.tsx
│   │   ├── RecentActivity.tsx
│   │   └── StorageUsage.tsx
│   ├── settings/
│   │   ├── ProfileSection.tsx
│   │   ├── ApiKeyManager.tsx
│   │   ├── PreferencesForm.tsx
│   │   └── DangerZone.tsx
│   ├── logs/
│   │   ├── LogsHeader.tsx
│   │   ├── LogViewer.tsx
│   │   └── LogEntry.tsx
│   ├── files/
│   │   ├── FilesHeader.tsx
│   │   ├── FileGrid.tsx
│   │   └── FileCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/
│   ├── agents/
│   │   ├── planner.ts
│   │   ├── workers/
│   │   │   ├── gmail.ts
│   │   │   ├── drive.ts
│   │   │   ├── docs.ts
│   │   │   ├── sheets.ts
│   │   │   └── calendar.ts
│   │   └── evaluator.ts
│   ├── google/
│   │   ├── auth.ts
│   │   ├── gmail.ts
│   │   ├── drive.ts
│   │   ├── docs.ts
│   │   ├── sheets.ts
│   │   └── calendar.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── realtime.ts
│   ├── crypto.ts
│   ├── errorHandler.ts
│   └── utils.ts
├── types/
│   ├── chat.ts
│   ├── api.ts
│   ├── agent.ts
│   └── google.ts
├── styles/
│   ├── globals.css
│   └── glassmorphism.css
└── middleware.ts
```

## Security Considerations

1. **Environment Variables**: All secrets in `.env.local`, never committed
2. **Token Encryption**: AES-256-GCM encryption for stored tokens
3. **HTTPS Only**: All external API calls over HTTPS
4. **Rate Limiting**: Implement rate limiting on all API routes
5. **CSRF Protection**: Use Next.js built-in CSRF protection
6. **Input Validation**: Validate all user inputs and API requests
7. **SQL Injection**: Use Supabase parameterized queries
8. **XSS Prevention**: Sanitize all user-generated content
9. **OAuth State Parameter**: Prevent CSRF in OAuth flow
10. **Audit Logging**: Log all sensitive operations to Supabase

## Performance Optimizations

1. **Code Splitting**: Route-based lazy loading
2. **Image Optimization**: Next.js Image component
3. **API Response Caching**: 5-minute cache for Google API responses
4. **Database Indexing**: Indexes on frequently queried columns
5. **Realtime Connection Pooling**: Reuse Supabase Realtime connections
6. **Optimistic UI Updates**: Update UI before server confirmation
7. **Debounced Search**: 300ms debounce on search inputs
8. **Virtual Scrolling**: For large lists (logs, files)
9. **Service Worker**: Cache static assets
10. **CDN**: Serve static assets from CDN

## Deployment Considerations

1. **Environment**: Vercel (recommended) or any Node.js host
2. **Database**: Supabase (managed PostgreSQL)
3. **Environment Variables**: Set in hosting platform
4. **Build Command**: `npm run build`
5. **Start Command**: `npm start`
6. **Node Version**: 18.x or higher
7. **Monitoring**: Vercel Analytics + Sentry for errors
8. **Logging**: Supabase + external logging service
9. **Backups**: Automated Supabase backups
10. **Scaling**: Horizontal scaling with load balancer
