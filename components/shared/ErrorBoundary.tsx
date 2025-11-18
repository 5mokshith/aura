"use***REMOVED***client";

import***REMOVED***{***REMOVED***Component,***REMOVED***ReactNode***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***Button***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/button";
import***REMOVED***{***REMOVED***Card***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/card";
import***REMOVED***{***REMOVED***AlertCircle,***REMOVED***RefreshCw,***REMOVED***Send***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";

interface***REMOVED***ErrorBoundaryProps***REMOVED***{
***REMOVED******REMOVED***children:***REMOVED***ReactNode;
***REMOVED******REMOVED***fallback?:***REMOVED***(error:***REMOVED***Error,***REMOVED***errorInfo:***REMOVED***string,***REMOVED***onReset:***REMOVED***()***REMOVED***=>***REMOVED***void)***REMOVED***=>***REMOVED***ReactNode;
}

interface***REMOVED***ErrorBoundaryState***REMOVED***{
***REMOVED******REMOVED***hasError:***REMOVED***boolean;
***REMOVED******REMOVED***error:***REMOVED***Error***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***errorInfo:***REMOVED***string***REMOVED***|***REMOVED***null;
}

export***REMOVED***class***REMOVED***ErrorBoundary***REMOVED***extends***REMOVED***Component<ErrorBoundaryProps,***REMOVED***ErrorBoundaryState>***REMOVED***{
***REMOVED******REMOVED***constructor(props:***REMOVED***ErrorBoundaryProps)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***super(props);
***REMOVED******REMOVED******REMOVED******REMOVED***this.state***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasError:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***null,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***errorInfo:***REMOVED***null,
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***}

***REMOVED******REMOVED***static***REMOVED***getDerivedStateFromError(error:***REMOVED***Error):***REMOVED***Partial<ErrorBoundaryState>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasError:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error,
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***}

***REMOVED******REMOVED***componentDidCatch(error:***REMOVED***Error,***REMOVED***errorInfo:***REMOVED***React.ErrorInfo)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Log***REMOVED***error***REMOVED***to***REMOVED***console***REMOVED***for***REMOVED***debugging
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("ErrorBoundary***REMOVED***caught***REMOVED***an***REMOVED***error:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***info:",***REMOVED***errorInfo);
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Component***REMOVED***stack:",***REMOVED***errorInfo.componentStack);

***REMOVED******REMOVED******REMOVED******REMOVED***this.setState({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***errorInfo:***REMOVED***errorInfo.componentStack***REMOVED***||***REMOVED***"No***REMOVED***stack***REMOVED***trace***REMOVED***available",
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***In***REMOVED***production,***REMOVED***you***REMOVED***would***REMOVED***send***REMOVED***this***REMOVED***to***REMOVED***an***REMOVED***error***REMOVED***reporting***REMOVED***service
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Example:***REMOVED***logErrorToService(error,***REMOVED***errorInfo);
***REMOVED******REMOVED***}

***REMOVED******REMOVED***handleReset***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***this.setState({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasError:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***null,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***errorInfo:***REMOVED***null,
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***};

***REMOVED******REMOVED***handleReport***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***error,***REMOVED***errorInfo***REMOVED***}***REMOVED***=***REMOVED***this.state;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***error***REMOVED***report
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***report***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***error?.message***REMOVED***||***REMOVED***"Unknown***REMOVED***error",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stack:***REMOVED***error?.stack***REMOVED***||***REMOVED***"No***REMOVED***stack***REMOVED***trace",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***componentStack:***REMOVED***errorInfo***REMOVED***||***REMOVED***"No***REMOVED***component***REMOVED***stack",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***userAgent:***REMOVED***navigator.userAgent,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***url:***REMOVED***window.location.href,
***REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Log***REMOVED***to***REMOVED***console***REMOVED***for***REMOVED***debugging
***REMOVED******REMOVED******REMOVED******REMOVED***console.log("Error***REMOVED***Report:",***REMOVED***report);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***In***REMOVED***production,***REMOVED***send***REMOVED***to***REMOVED***error***REMOVED***reporting***REMOVED***service
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Example:***REMOVED***sendErrorReport(report);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Show***REMOVED***user***REMOVED***feedback
***REMOVED******REMOVED******REMOVED******REMOVED***alert("Error***REMOVED***report***REMOVED***has***REMOVED***been***REMOVED***logged.***REMOVED***Thank***REMOVED***you***REMOVED***for***REMOVED***helping***REMOVED***us***REMOVED***improve!");
***REMOVED******REMOVED***};

***REMOVED******REMOVED***render()***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(this.state.hasError)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Use***REMOVED***custom***REMOVED***fallback***REMOVED***if***REMOVED***provided
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(this.props.fallback)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***this.props.fallback(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***this.state.error!,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***this.state.errorInfo***REMOVED***||***REMOVED***"",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***this.handleReset
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Default***REMOVED***error***REMOVED***UI
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="min-h-screen***REMOVED***flex***REMOVED***items-center***REMOVED***justify-center***REMOVED***p-4***REMOVED***bg-background">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Card***REMOVED***className="max-w-2xl***REMOVED***w-full***REMOVED***p-6***REMOVED***space-y-6">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-start***REMOVED***gap-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex-shrink-0">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<AlertCircle***REMOVED***className="size-8***REMOVED***text-destructive"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex-1***REMOVED***space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h1***REMOVED***className="text-2xl***REMOVED***font-semibold***REMOVED***text-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Something***REMOVED***went***REMOVED***wrong
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</h1>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***We***REMOVED***encountered***REMOVED***an***REMOVED***unexpected***REMOVED***error.***REMOVED***This***REMOVED***has***REMOVED***been***REMOVED***logged***REMOVED***and***REMOVED***we'll***REMOVED***look***REMOVED***into***REMOVED***it.
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Error***REMOVED***details***REMOVED***(collapsed***REMOVED***by***REMOVED***default***REMOVED***in***REMOVED***production)***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{process.env.NODE_ENV***REMOVED***===***REMOVED***"development"***REMOVED***&&***REMOVED***this.state.error***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<details***REMOVED***className="space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<summary***REMOVED***className="cursor-pointer***REMOVED***text-sm***REMOVED***font-medium***REMOVED***text-muted-foreground***REMOVED***hover:text-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Error***REMOVED***Details***REMOVED***(Development***REMOVED***Only)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</summary>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mt-2***REMOVED***p-4***REMOVED***bg-muted***REMOVED***rounded-md">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-sm***REMOVED***font-mono***REMOVED***text-destructive***REMOVED***break-all">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{this.state.error.message}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{this.state.error.stack***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<pre***REMOVED***className="mt-2***REMOVED***text-xs***REMOVED***font-mono***REMOVED***text-muted-foreground***REMOVED***overflow-auto***REMOVED***max-h-40">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{this.state.error.stack}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</pre>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</details>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Action***REMOVED***buttons***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***flex-col***REMOVED***sm:flex-row***REMOVED***gap-3">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={this.handleReset}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="flex-1"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label="Retry***REMOVED***loading***REMOVED***the***REMOVED***application"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<RefreshCw***REMOVED***className="size-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Retry
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={this.handleReport}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant="outline"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="flex-1"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label="Report***REMOVED***this***REMOVED***error"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Send***REMOVED***className="size-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Report***REMOVED***Error
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Additional***REMOVED***help***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="pt-4***REMOVED***border-t">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-sm***REMOVED***text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***If***REMOVED***this***REMOVED***problem***REMOVED***persists,***REMOVED***try***REMOVED***refreshing***REMOVED***the***REMOVED***page***REMOVED***or{"***REMOVED***"}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<a
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***href="/"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="text-primary***REMOVED***hover:underline***REMOVED***focus:outline-none***REMOVED***focus:ring-2***REMOVED***focus:ring-ring***REMOVED***focus:ring-offset-2***REMOVED***rounded"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***to***REMOVED***the***REMOVED***home***REMOVED***page
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</a>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Card>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***this.props.children;
***REMOVED******REMOVED***}
}
