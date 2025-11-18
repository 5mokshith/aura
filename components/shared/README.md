#***REMOVED***Error***REMOVED***Handling***REMOVED***and***REMOVED***Loading***REMOVED***States***REMOVED***Components

This***REMOVED***directory***REMOVED***contains***REMOVED***all***REMOVED***the***REMOVED***error***REMOVED***handling***REMOVED***and***REMOVED***loading***REMOVED***state***REMOVED***components***REMOVED***for***REMOVED***the***REMOVED***AURA***REMOVED***UI***REMOVED***System.

##***REMOVED***Components***REMOVED***Overview

###***REMOVED***Error***REMOVED***Handling

####***REMOVED***ErrorBoundary
Global***REMOVED***error***REMOVED***boundary***REMOVED***component***REMOVED***that***REMOVED***catches***REMOVED***React***REMOVED***component***REMOVED***errors.

```tsx
import***REMOVED***{***REMOVED***ErrorBoundary***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<ErrorBoundary>
***REMOVED******REMOVED***<YourApp***REMOVED***/>
</ErrorBoundary>

//***REMOVED***With***REMOVED***custom***REMOVED***fallback
<ErrorBoundary
***REMOVED******REMOVED***fallback={(error,***REMOVED***errorInfo,***REMOVED***onReset)***REMOVED***=>***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h1>Custom***REMOVED***Error***REMOVED***UI</h1>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button***REMOVED***onClick={onReset}>Try***REMOVED***Again</button>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***)}
>
***REMOVED******REMOVED***<YourApp***REMOVED***/>
</ErrorBoundary>
```

####***REMOVED***Toast***REMOVED***Notifications
Toast***REMOVED***notification***REMOVED***system***REMOVED***with***REMOVED***auto-dismiss***REMOVED***and***REMOVED***variants.

```tsx
import***REMOVED***{***REMOVED***ToastProvider,***REMOVED***useToast***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

//***REMOVED***Wrap***REMOVED***your***REMOVED***app
<ToastProvider>
***REMOVED******REMOVED***<YourApp***REMOVED***/>
</ToastProvider>

//***REMOVED***Use***REMOVED***in***REMOVED***components
function***REMOVED***MyComponent()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***showToast***REMOVED***}***REMOVED***=***REMOVED***useToast();
***REMOVED******REMOVED***
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<button***REMOVED***onClick={()***REMOVED***=>***REMOVED***showToast("Success!",***REMOVED***"success")}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Show***REMOVED***Toast
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED***);
}
```

**Toast***REMOVED***Variants:**
-***REMOVED***`success`***REMOVED***-***REMOVED***Auto-dismiss***REMOVED***in***REMOVED***3s
-***REMOVED***`error`***REMOVED***-***REMOVED***Manual***REMOVED***dismiss
-***REMOVED***`warning`***REMOVED***-***REMOVED***Auto-dismiss***REMOVED***in***REMOVED***5s
-***REMOVED***`info`***REMOVED***-***REMOVED***Auto-dismiss***REMOVED***in***REMOVED***4s

###***REMOVED***Loading***REMOVED***States

####***REMOVED***LoadingSpinner
Simple***REMOVED***loading***REMOVED***spinner***REMOVED***with***REMOVED***size***REMOVED***variants.

```tsx
import***REMOVED***{***REMOVED***LoadingSpinner***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<LoadingSpinner***REMOVED***size="md"***REMOVED***label="Loading***REMOVED***data..."***REMOVED***/>
```

####***REMOVED***LoadingOverlay
Overlay***REMOVED***loading***REMOVED***state***REMOVED***for***REMOVED***containers.

```tsx
import***REMOVED***{***REMOVED***LoadingOverlay***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<LoadingOverlay***REMOVED***isLoading={isLoading}***REMOVED***label="Processing...">
***REMOVED******REMOVED***<YourContent***REMOVED***/>
</LoadingOverlay>
```

####***REMOVED***DelayedLoading
Shows***REMOVED***loading***REMOVED***indicator***REMOVED***only***REMOVED***after***REMOVED***a***REMOVED***delay***REMOVED***(default***REMOVED***300ms).

```tsx
import***REMOVED***{***REMOVED***DelayedLoading,***REMOVED***LoadingSpinner***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

{isLoading***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED***<DelayedLoading***REMOVED***delay={300}>
***REMOVED******REMOVED******REMOVED******REMOVED***<LoadingSpinner***REMOVED***/>
***REMOVED******REMOVED***</DelayedLoading>
)}
```

####***REMOVED***LoadingButton
Button***REMOVED***with***REMOVED***integrated***REMOVED***loading***REMOVED***state.

```tsx
import***REMOVED***{***REMOVED***LoadingButton***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<LoadingButton
***REMOVED******REMOVED***isLoading={isSubmitting}
***REMOVED******REMOVED***loadingText="Submitting..."
***REMOVED******REMOVED***onClick={handleSubmit}
>
***REMOVED******REMOVED***Submit
</LoadingButton>
```

####***REMOVED***Skeleton***REMOVED***Screens
Skeleton***REMOVED***loading***REMOVED***states***REMOVED***for***REMOVED***data***REMOVED***fetching.

```tsx
import***REMOVED***{***REMOVED***Skeleton,***REMOVED***SkeletonText,***REMOVED***SkeletonCard,***REMOVED***SkeletonList***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

//***REMOVED***Basic***REMOVED***skeleton
<Skeleton***REMOVED***className="h-4***REMOVED***w-full"***REMOVED***/>

//***REMOVED***Text***REMOVED***skeleton
<SkeletonText***REMOVED***lines={3}***REMOVED***/>

//***REMOVED***Card***REMOVED***skeleton
<SkeletonCard***REMOVED***/>

//***REMOVED***List***REMOVED***skeleton
<SkeletonList***REMOVED***count={5}***REMOVED***/>
```

###***REMOVED***Workflow***REMOVED***State***REMOVED***Indicators

####***REMOVED***WorkflowStateIndicator
Shows***REMOVED***current***REMOVED***workflow***REMOVED***execution***REMOVED***state.

```tsx
import***REMOVED***{***REMOVED***WorkflowStateIndicator***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<WorkflowStateIndicator
***REMOVED******REMOVED***status={workflow.status}
***REMOVED******REMOVED***error={workflow.error}
/>
```

####***REMOVED***IdleState
Prominent***REMOVED***idle***REMOVED***state***REMOVED***with***REMOVED***call-to-action.

```tsx
import***REMOVED***{***REMOVED***IdleState***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<IdleState***REMOVED***onFocus={()***REMOVED***=>***REMOVED***inputRef.current?.focus()}***REMOVED***/>
```

####***REMOVED***ExecutingState
Shows***REMOVED***workflow***REMOVED***execution***REMOVED***in***REMOVED***progress.

```tsx
import***REMOVED***{***REMOVED***ExecutingState***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<ExecutingState
***REMOVED******REMOVED***command="Create***REMOVED***a***REMOVED***summary***REMOVED***of***REMOVED***my***REMOVED***emails"
***REMOVED******REMOVED***onCancel={handleCancel}
/>
```

####***REMOVED***SuccessState
Success***REMOVED***state***REMOVED***with***REMOVED***auto-dismiss***REMOVED***(2s).

```tsx
import***REMOVED***{***REMOVED***SuccessState***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<SuccessState
***REMOVED******REMOVED***message="Workflow***REMOVED***completed!"
***REMOVED******REMOVED***onDismiss={()***REMOVED***=>***REMOVED***setShowSuccess(false)}
/>
```

####***REMOVED***ErrorState
Error***REMOVED***state***REMOVED***with***REMOVED***retry***REMOVED***and***REMOVED***dismiss***REMOVED***actions.

```tsx
import***REMOVED***{***REMOVED***ErrorState***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

<ErrorState
***REMOVED******REMOVED***error="Failed***REMOVED***to***REMOVED***execute***REMOVED***workflow"
***REMOVED******REMOVED***onRetry={handleRetry}
***REMOVED******REMOVED***onDismiss={handleDismiss}
/>
```

##***REMOVED***Hooks

###***REMOVED***useAsyncAction
Hook***REMOVED***for***REMOVED***managing***REMOVED***async***REMOVED***operations***REMOVED***with***REMOVED***loading***REMOVED***states***REMOVED***and***REMOVED***toast***REMOVED***notifications.

```tsx
import***REMOVED***{***REMOVED***useAsyncAction***REMOVED***}***REMOVED***from***REMOVED***"@/hooks/useAsyncAction";

function***REMOVED***MyComponent()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***execute,***REMOVED***isLoading,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***useAsyncAction(
***REMOVED******REMOVED******REMOVED******REMOVED***async***REMOVED***(data)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***api.submitData(data);
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***successMessage:***REMOVED***"Data***REMOVED***submitted***REMOVED***successfully!",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***errorMessage:***REMOVED***"Failed***REMOVED***to***REMOVED***submit***REMOVED***data",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onSuccess:***REMOVED***(result)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log("Success:",***REMOVED***result);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***);

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<LoadingButton
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isLoading={isLoading}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={()***REMOVED***=>***REMOVED***execute(formData)}
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Submit
***REMOVED******REMOVED******REMOVED******REMOVED***</LoadingButton>
***REMOVED******REMOVED***);
}
```

##***REMOVED***Usage***REMOVED***in***REMOVED***App***REMOVED***Layout

Wrap***REMOVED***your***REMOVED***app***REMOVED***with***REMOVED***the***REMOVED***necessary***REMOVED***providers:

```tsx
import***REMOVED***{***REMOVED***ErrorBoundary,***REMOVED***ToastProvider***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

export***REMOVED***default***REMOVED***function***REMOVED***RootLayout({***REMOVED***children***REMOVED***})***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<html>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<body>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ErrorBoundary>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ToastProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</ToastProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</ErrorBoundary>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</body>
***REMOVED******REMOVED******REMOVED******REMOVED***</html>
***REMOVED******REMOVED***);
}
```

##***REMOVED***Requirements***REMOVED***Fulfilled

-***REMOVED*****8.1*****REMOVED***-***REMOVED***Idle***REMOVED***state***REMOVED***with***REMOVED***prominent***REMOVED***command***REMOVED***input
-***REMOVED*****8.2*****REMOVED***-***REMOVED***Executing***REMOVED***state***REMOVED***with***REMOVED***disabled***REMOVED***input***REMOVED***and***REMOVED***cancel***REMOVED***button
-***REMOVED*****8.3*****REMOVED***-***REMOVED***Success***REMOVED***state***REMOVED***with***REMOVED***green***REMOVED***checkmark***REMOVED***(2s***REMOVED***display)
-***REMOVED*****8.4*****REMOVED***-***REMOVED***Error***REMOVED***state***REMOVED***with***REMOVED***clear***REMOVED***message***REMOVED***and***REMOVED***actions
-***REMOVED*****8.5*****REMOVED***-***REMOVED***Loading***REMOVED***animations***REMOVED***for***REMOVED***operations***REMOVED***>***REMOVED***300ms
