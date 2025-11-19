# Results Display Components

This directory contains components for displaying workflow results in the AURA UI.

## Components

### ResultsPanel
Main container component that displays a grid of result cards.

**Props:**
- `results: WorkflowResult[]` - Array of workflow results to display
- `onFeedback: (resultId: string, rating: "positive" | "negative") => void` - Callback for feedback submission

**Features:**
- Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
- Empty state when no results
- Result count display

### ResultCard
Individual result card with type-specific rendering.

**Props:**
- `result: WorkflowResult` - The result to display
- `onFeedback: (resultId: string, rating: "positive" | "negative") => void` - Callback for feedback

**Features:**
- Type-specific icons and colors (document, email, calendar, sheet, file)
- Preview display (truncated to 500 characters)
- Integrated action buttons
- Feedback widget

### ActionButtons
Action buttons for interacting with results.

**Props:**
- `result: WorkflowResult` - The result to create actions for

**Features:**
- Type-specific primary actions:
  - Document: "Open in Drive"
  - Email: "View Email"
  - Calendar: "Open Event"
  - Sheet: "Open Sheet"
  - File: "Download"
- Copy to clipboard functionality
- Opens links in new tab with security attributes

### FeedbackWidget
Thumbs up/down feedback widget.

**Props:**
- `resultId: string` - ID of the result
- `onFeedback: (resultId: string, rating: "positive" | "negative") => void` - Callback for feedback

**Features:**
- Visual feedback on selection
- Submits to `/api/feedback` endpoint
- Confirmation message after submission
- Prevents duplicate submissions

## Usage Example

```tsx
import { ResultsPanel } from "@/components/results";
import { useWorkflow } from "@/contexts/WorkflowContext";

export function MyComponent() {
  const { workflow } = useWorkflow();

  const handleFeedback = (resultId: string, rating: "positive" | "negative") => {
    console.log(`Feedback: ${resultId} - ${rating}`);
  };

  return (
    <ResultsPanel 
      results={workflow?.results || []} 
      onFeedback={handleFeedback}
    />
  );
}
```

## API Endpoint

### POST /api/feedback
Submits user feedback for a result.

**Request Body:**
```json
{
  "resultId": "string",
  "rating": "positive" | "negative",
  "timestamp": "ISO 8601 string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "resultId": "string",
  "rating": "positive" | "negative"
}
```

## Demo

Visit `/results-demo` to see all components in action with sample data.

## Requirements Met

- ✅ 3.1: Display results within 1 second of completion
- ✅ 3.2: Type-specific action buttons and icons
- ✅ 3.3: Preview display for documents (500 chars)
- ✅ 3.4: Feedback mechanism (thumbs up/down)
- ✅ 3.5: Links open in new browser tab

