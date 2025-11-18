import***REMOVED***type***REMOVED***{***REMOVED***Metadata***REMOVED***}***REMOVED***from***REMOVED***"next";
import***REMOVED***{***REMOVED***Geist,***REMOVED***Geist_Mono***REMOVED***}***REMOVED***from***REMOVED***"next/font/google";
import***REMOVED***"./globals.css";
import***REMOVED***{***REMOVED***SupabaseAuthProvider***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";
import***REMOVED***{***REMOVED***WorkflowProvider***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/WorkflowContext";
import***REMOVED***{***REMOVED***ErrorBoundary,***REMOVED***ToastProvider***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared";

const***REMOVED***geistSans***REMOVED***=***REMOVED***Geist({
***REMOVED******REMOVED***variable:***REMOVED***"--font-geist-sans",
***REMOVED******REMOVED***subsets:***REMOVED***["latin"],
});

const***REMOVED***geistMono***REMOVED***=***REMOVED***Geist_Mono({
***REMOVED******REMOVED***variable:***REMOVED***"--font-geist-mono",
***REMOVED******REMOVED***subsets:***REMOVED***["latin"],
});

export***REMOVED***const***REMOVED***metadata:***REMOVED***Metadata***REMOVED***=***REMOVED***{
***REMOVED******REMOVED***title:***REMOVED***"AURA***REMOVED***-***REMOVED***Agentic***REMOVED***Unified***REMOVED***Reasoning***REMOVED***Assistant",
***REMOVED******REMOVED***description:***REMOVED***"AI-powered***REMOVED***workflow***REMOVED***automation***REMOVED***for***REMOVED***Google***REMOVED***Workspace",
};

export***REMOVED***default***REMOVED***function***REMOVED***RootLayout({
***REMOVED******REMOVED***children,
}:***REMOVED***Readonly<{
***REMOVED******REMOVED***children:***REMOVED***React.ReactNode;
}>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<html***REMOVED***lang="en">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<body***REMOVED***className={`${geistSans.variable}***REMOVED***${geistMono.variable}***REMOVED***antialiased`}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ErrorBoundary>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<SupabaseAuthProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ToastProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<WorkflowProvider>{children}</WorkflowProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</ToastProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</SupabaseAuthProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</ErrorBoundary>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</body>
***REMOVED******REMOVED******REMOVED******REMOVED***</html>
***REMOVED******REMOVED***);
}
