# Timeline Components

This directory contains the components for the Task Execution Timeline page, which displays a chronological history of all executed tasks with filtering and retry capabilities.

## Components

### TimelineHeader
- **Purpose**: Page header with title and filter toggle
- **Features**: 
  - Glassmorphism design with neon cyan accents
  - Filter toggle button with glow effect
  - Responsive layout
- **Props**: `filters`, `onFiltersChange`

### FilterBar
- **Purpose**: Advanced filtering controls for task history
- **Features**:
  - Date range picker (start/end dates)
  - Status filter (success, failed, rerun, cancelled)
  - Google service filter (Gmail, Drive, Docs, Sheets, Calendar)
  - Quick filter buttons (Today, Last 7 days, Last 30 days)
  - Clear all filters functionality
- **Props**: `filters`, `onFiltersChange`

### TaskCard
- **Purpose**: Individual task display with detailed information
- **Features**:
  - Status indicators with color coding
  - Google service icons
  - Output links (documents, emails, etc.)
  - Expandable details view
  - Retry button for failed tasks
  - Execution time and metadata
- **Props**: `task`, `onRetry`

### TimelineContent
- **Purpose**: Main content area with data fetching and task list
- **Features**:
  - Infinite scroll pagination
  - Real-time data fetching from Supabase
  - Loading states and error handling
  - Empty state messages
  - Retry functionality integration
- **Props**: `filters`

## API Integration

### GET /api/timeline/tasks
- Fetches paginated task history from Supabase
- Supports filtering by status, service, date range
- Returns structured task data with outputs

### POST /api/agent/retry
- Retries failed tasks by creating new task plans
- Updates original task status to 'rerun'
- Executes new task automatically

## Database Schema

Uses the `task_history` table with the following key fields:
- `task_id`: Unique task identifier
- `title`: Human-readable task title
- `status`: success | failed | rerun | cancelled
- `input_prompt`: Original user request
- `output_summary`: Brief result description
- `outputs`: JSON array of created resources
- `google_services`: Array of services used
- `duration_ms`: Execution time
- `created_at`, `completed_at`: Timestamps

## Styling

- Uses glassmorphism design system
- Neon accent colors for interactive elements
- Smooth animations and transitions
- Responsive design for mobile/desktop
- Dark theme optimized

## Usage

```tsx
import TimelinePage from '@/app/timeline/page';

// The page is accessible at /timeline
// Automatically handles authentication via Supabase
// Filters are managed in component state
```

## Requirements Satisfied

- **5.1**: Chronological task history display ✓
- **5.2**: Task outputs with clickable links ✓
- **5.3**: Status badges and metadata ✓
- **5.4**: Retry functionality for failed tasks ✓
- **5.5**: Advanced filtering capabilities ✓
- **18.4**: Retry mechanisms with error handling ✓
- **19.5**: Caching and pagination ✓