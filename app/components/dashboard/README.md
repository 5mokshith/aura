# Dashboard Components

This directory contains all components for the User Dashboard page (`/dashboard`).

## Components

### ConnectedApps
Displays Google Workspace service status in a grid layout.
- Shows Gmail, Drive, Docs, Sheets, and Calendar
- Active/Inactive status indicators
- Checks token validity to determine connection status

### TokenStatus
Displays OAuth token information and validity.
- Access token expiration with countdown
- Refresh token status
- Granted permissions/scopes
- Reconnect button for expired tokens
- Auto-refreshes every 30 seconds

### RecentActivity
Shows the last 10 executed tasks.
- Task title and status badges
- Google services used (with icons)
- Timestamps (relative time)
- Task duration
- Link to full timeline

### StorageUsage
Displays Supabase storage metrics.
- Total storage usage with progress bar
- Execution logs count and size
- Task history count
- Documents generated count
- Warning when storage exceeds 80%

## API Routes

### `/api/db/storage-metrics`
Returns storage metrics for a user:
- `logsCount`: Number of execution log entries
- `logsSize`: Estimated size of logs in bytes
- `taskHistoryCount`: Number of task history entries
- `documentsCount`: Number of documents generated
- `totalSize`: Total estimated storage usage

### `/api/timeline/history`
Returns recent task history:
- Simplified version of main timeline API
- Supports `limit` parameter (default: 10, max: 50)
- Returns task history items with all metadata

## Usage

```tsx
import { ConnectedApps, TokenStatus, RecentActivity, StorageUsage } from '@/app/components/dashboard';

export default function DashboardPage() {
  return (
    <div>
      <ConnectedApps />
      <TokenStatus />
      <RecentActivity />
      <StorageUsage />
    </div>
  );
}
```

## Requirements Fulfilled

- **7.1**: Display connected apps status ✅
- **7.2**: Show token validity ✅
- **7.3**: Display recent activity ✅
- **7.4**: Show storage usage ✅
- **7.5**: Reconnect button for expired tokens ✅

## Notes

- All components use glassmorphism styling from `app/styles/glassmorphism.css`
- Components fetch data independently and handle their own loading/error states
- User ID is currently hardcoded as `'current-user-id'` - needs to be replaced with actual auth context
- Storage size calculations are estimates (500 bytes per log, 1KB per task, 200 bytes per document)
