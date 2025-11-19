# Error Handling and Loading States Components

This directory contains all the error handling and loading state components for the AURA UI System.

## Components Overview

### Error Handling

#### ErrorBoundary
Global error boundary component that catches React component errors.

```tsx
import { ErrorBoundary } from "@/components/shared";

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={(error, errorInfo, onReset) => (
    <div>
      <h1>Custom Error UI</h1>
      <button onClick={onReset}>Try Again</button>
    </div>
  )}
>
  <YourApp />
</ErrorBoundary>
```

#### Toast Notifications
Toast notification system with auto-dismiss and variants.

```tsx
import { ToastProvider, useToast } from "@/components/shared";

// Wrap your app
<ToastProvider>
  <YourApp />
</ToastProvider>

// Use in components
function MyComponent() {
  const { showToast } = useToast();
  
  return (
    <button onClick={() => showToast("Success!", "success")}>
      Show Toast
    </button>
  );
}
```

**Toast Variants:**
- `success` - Auto-dismiss in 3s
- `error` - Manual dismiss
- `warning` - Auto-dismiss in 5s
- `info` - Auto-dismiss in 4s

### Loading States

#### LoadingSpinner
Simple loading spinner with size variants.

```tsx
import { LoadingSpinner } from "@/components/shared";

<LoadingSpinner size="md" label="Loading data..." />
```

#### LoadingOverlay
Overlay loading state for containers.

```tsx
import { LoadingOverlay } from "@/components/shared";

<LoadingOverlay isLoading={isLoading} label="Processing...">
  <YourContent />
</LoadingOverlay>
```

#### DelayedLoading
Shows loading indicator only after a delay (default 300ms).

```tsx
import { DelayedLoading, LoadingSpinner } from "@/components/shared";

{isLoading && (
  <DelayedLoading delay={300}>
    <LoadingSpinner />
  </DelayedLoading>
)}
```

#### LoadingButton
Button with integrated loading state.

```tsx
import { LoadingButton } from "@/components/shared";

<LoadingButton
  isLoading={isSubmitting}
  loadingText="Submitting..."
  onClick={handleSubmit}
>
  Submit
</LoadingButton>
```

#### Skeleton Screens
Skeleton loading states for data fetching.

```tsx
import { Skeleton, SkeletonText, SkeletonCard, SkeletonList } from "@/components/shared";

// Basic skeleton
<Skeleton className="h-4 w-full" />

// Text skeleton
<SkeletonText lines={3} />

// Card skeleton
<SkeletonCard />

// List skeleton
<SkeletonList count={5} />
```

### Workflow State Indicators

#### WorkflowStateIndicator
Shows current workflow execution state.

```tsx
import { WorkflowStateIndicator } from "@/components/shared";

<WorkflowStateIndicator
  status={workflow.status}
  error={workflow.error}
/>
```

#### IdleState
Prominent idle state with call-to-action.

```tsx
import { IdleState } from "@/components/shared";

<IdleState onFocus={() => inputRef.current?.focus()} />
```

#### ExecutingState
Shows workflow execution in progress.

```tsx
import { ExecutingState } from "@/components/shared";

<ExecutingState
  command="Create a summary of my emails"
  onCancel={handleCancel}
/>
```

#### SuccessState
Success state with auto-dismiss (2s).

```tsx
import { SuccessState } from "@/components/shared";

<SuccessState
  message="Workflow completed!"
  onDismiss={() => setShowSuccess(false)}
/>
```

#### ErrorState
Error state with retry and dismiss actions.

```tsx
import { ErrorState } from "@/components/shared";

<ErrorState
  error="Failed to execute workflow"
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>
```

## Hooks

### useAsyncAction
Hook for managing async operations with loading states and toast notifications.

```tsx
import { useAsyncAction } from "@/hooks/useAsyncAction";

function MyComponent() {
  const { execute, isLoading, error } = useAsyncAction(
    async (data) => {
      return await api.submitData(data);
    },
    {
      successMessage: "Data submitted successfully!",
      errorMessage: "Failed to submit data",
      onSuccess: (result) => {
        console.log("Success:", result);
      },
    }
  );

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={() => execute(formData)}
    >
      Submit
    </LoadingButton>
  );
}
```

## Usage in App Layout

Wrap your app with the necessary providers:

```tsx
import { ErrorBoundary, ToastProvider } from "@/components/shared";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## Requirements Fulfilled

- **8.1** - Idle state with prominent command input
- **8.2** - Executing state with disabled input and cancel button
- **8.3** - Success state with green checkmark (2s display)
- **8.4** - Error state with clear message and actions
- **8.5** - Loading animations for operations > 300ms

