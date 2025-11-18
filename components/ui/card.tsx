import***REMOVED*******REMOVED***as***REMOVED***React***REMOVED***from***REMOVED***"react"

import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils"

function***REMOVED***Card({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"bg-card***REMOVED***text-card-foreground***REMOVED***flex***REMOVED***flex-col***REMOVED***gap-6***REMOVED***rounded-xl***REMOVED***border***REMOVED***py-6***REMOVED***shadow-sm",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***CardHeader({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card-header"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"@container/card-header***REMOVED***grid***REMOVED***auto-rows-min***REMOVED***grid-rows-[auto_auto]***REMOVED***items-start***REMOVED***gap-2***REMOVED***px-6***REMOVED***has-data-[slot=card-action]:grid-cols-[1fr_auto]***REMOVED***[.border-b]:pb-6",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***CardTitle({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card-title"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("leading-none***REMOVED***font-semibold",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***CardDescription({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card-description"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("text-muted-foreground***REMOVED***text-sm",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***CardAction({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card-action"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"col-start-2***REMOVED***row-span-2***REMOVED***row-start-1***REMOVED***self-start***REMOVED***justify-self-end",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***CardContent({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card-content"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("px-6",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***CardFooter({***REMOVED***className,***REMOVED***...props***REMOVED***}:***REMOVED***React.ComponentProps<"div">)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="card-footer"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("flex***REMOVED***items-center***REMOVED***px-6***REMOVED***[.border-t]:pt-6",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

export***REMOVED***{
***REMOVED******REMOVED***Card,
***REMOVED******REMOVED***CardHeader,
***REMOVED******REMOVED***CardFooter,
***REMOVED******REMOVED***CardTitle,
***REMOVED******REMOVED***CardAction,
***REMOVED******REMOVED***CardDescription,
***REMOVED******REMOVED***CardContent,
}
