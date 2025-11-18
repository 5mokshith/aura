"use***REMOVED***client";

import***REMOVED***React***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";
import***REMOVED***{***REMOVED***Loader2***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";

interface***REMOVED***LoadingSpinnerProps***REMOVED***{
***REMOVED******REMOVED***size?:***REMOVED***"sm"***REMOVED***|***REMOVED***"md"***REMOVED***|***REMOVED***"lg"***REMOVED***|***REMOVED***"xl";
***REMOVED******REMOVED***className?:***REMOVED***string;
***REMOVED******REMOVED***label?:***REMOVED***string;
}

const***REMOVED***sizeClasses***REMOVED***=***REMOVED***{
***REMOVED******REMOVED***sm:***REMOVED***"size-4",
***REMOVED******REMOVED***md:***REMOVED***"size-6",
***REMOVED******REMOVED***lg:***REMOVED***"size-8",
***REMOVED******REMOVED***xl:***REMOVED***"size-12",
};

export***REMOVED***function***REMOVED***LoadingSpinner({***REMOVED***size***REMOVED***=***REMOVED***"md",***REMOVED***className,***REMOVED***label***REMOVED***}:***REMOVED***LoadingSpinnerProps)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***justify-center"***REMOVED***role="status"***REMOVED***aria-live="polite">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Loader2
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("animate-spin***REMOVED***text-primary",***REMOVED***sizeClasses[size],***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-hidden="true"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{label***REMOVED***&&***REMOVED***<span***REMOVED***className="sr-only">{label}</span>}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{!label***REMOVED***&&***REMOVED***<span***REMOVED***className="sr-only">Loading...</span>}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}

interface***REMOVED***LoadingOverlayProps***REMOVED***{
***REMOVED******REMOVED***isLoading:***REMOVED***boolean;
***REMOVED******REMOVED***children:***REMOVED***React.ReactNode;
***REMOVED******REMOVED***label?:***REMOVED***string;
***REMOVED******REMOVED***className?:***REMOVED***string;
}

export***REMOVED***function***REMOVED***LoadingOverlay({
***REMOVED******REMOVED***isLoading,
***REMOVED******REMOVED***children,
***REMOVED******REMOVED***label***REMOVED***=***REMOVED***"Loading...",
***REMOVED******REMOVED***className,
}:***REMOVED***LoadingOverlayProps)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className={cn("relative",***REMOVED***className)}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isLoading***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="absolute***REMOVED***inset-0***REMOVED***bg-background/80***REMOVED***backdrop-blur-sm***REMOVED***flex***REMOVED***items-center***REMOVED***justify-center***REMOVED***z-10"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***role="status"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-live="polite"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***flex-col***REMOVED***items-center***REMOVED***gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<LoadingSpinner***REMOVED***size="lg"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-sm***REMOVED***text-muted-foreground">{label}</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}

interface***REMOVED***DelayedLoadingProps***REMOVED***{
***REMOVED******REMOVED***delay?:***REMOVED***number;
***REMOVED******REMOVED***children:***REMOVED***React.ReactNode;
}

export***REMOVED***function***REMOVED***DelayedLoading({***REMOVED***delay***REMOVED***=***REMOVED***300,***REMOVED***children***REMOVED***}:***REMOVED***DelayedLoadingProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[show,***REMOVED***setShow]***REMOVED***=***REMOVED***React.useState(false);

***REMOVED******REMOVED***React.useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***timer***REMOVED***=***REMOVED***setTimeout(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setShow(true);
***REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***delay);

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***clearTimeout(timer);
***REMOVED******REMOVED***},***REMOVED***[delay]);

***REMOVED******REMOVED***if***REMOVED***(!show)***REMOVED***return***REMOVED***null;

***REMOVED******REMOVED***return***REMOVED***<>{children}</>;
}
