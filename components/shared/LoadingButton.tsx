"use***REMOVED***client";

import***REMOVED***{***REMOVED***Button***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/button";
import***REMOVED***{***REMOVED***Loader2***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";
import***REMOVED***{***REMOVED***ComponentProps***REMOVED***}***REMOVED***from***REMOVED***"react";

interface***REMOVED***LoadingButtonProps***REMOVED***extends***REMOVED***ComponentProps<typeof***REMOVED***Button>***REMOVED***{
***REMOVED******REMOVED***isLoading?:***REMOVED***boolean;
***REMOVED******REMOVED***loadingText?:***REMOVED***string;
}

export***REMOVED***function***REMOVED***LoadingButton({
***REMOVED******REMOVED***isLoading***REMOVED***=***REMOVED***false,
***REMOVED******REMOVED***loadingText,
***REMOVED******REMOVED***children,
***REMOVED******REMOVED***disabled,
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***LoadingButtonProps)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***disabled={disabled***REMOVED***||***REMOVED***isLoading}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isLoading***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Loader2***REMOVED***className="size-4***REMOVED***animate-spin"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isLoading***REMOVED***?***REMOVED***loadingText***REMOVED***||***REMOVED***children***REMOVED***:***REMOVED***children}
***REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED***);
}
