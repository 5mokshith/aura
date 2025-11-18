import***REMOVED*******REMOVED***as***REMOVED***React***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";

export***REMOVED***interface***REMOVED***InputProps
***REMOVED******REMOVED***extends***REMOVED***React.InputHTMLAttributes<HTMLInputElement>***REMOVED***{}

const***REMOVED***Input***REMOVED***=***REMOVED***React.forwardRef<HTMLInputElement,***REMOVED***InputProps>(
***REMOVED******REMOVED***({***REMOVED***className,***REMOVED***type,***REMOVED***...props***REMOVED***},***REMOVED***ref)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type={type}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"flex***REMOVED***h-10***REMOVED***w-full***REMOVED***rounded-md***REMOVED***border***REMOVED***border-input***REMOVED***bg-background***REMOVED***px-3***REMOVED***py-2***REMOVED***text-sm***REMOVED***ring-offset-background***REMOVED***file:border-0***REMOVED***file:bg-transparent***REMOVED***file:text-sm***REMOVED***file:font-medium***REMOVED***placeholder:text-muted-foreground***REMOVED***focus-visible:outline-none***REMOVED***focus-visible:ring-2***REMOVED***focus-visible:ring-ring***REMOVED***focus-visible:ring-offset-2***REMOVED***disabled:cursor-not-allowed***REMOVED***disabled:opacity-50",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***ref={ref}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
);
Input.displayName***REMOVED***=***REMOVED***"Input";

export***REMOVED***{***REMOVED***Input***REMOVED***};
