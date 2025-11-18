"use***REMOVED***client"

import***REMOVED*******REMOVED***as***REMOVED***React***REMOVED***from***REMOVED***"react"
import***REMOVED*******REMOVED***as***REMOVED***TooltipPrimitive***REMOVED***from***REMOVED***"@radix-ui/react-tooltip"

import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils"

function***REMOVED***TooltipProvider({
***REMOVED******REMOVED***delayDuration***REMOVED***=***REMOVED***0,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TooltipPrimitive.Provider>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TooltipPrimitive.Provider
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="tooltip-provider"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***delayDuration={delayDuration}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***Tooltip({
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TooltipPrimitive.Root>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TooltipProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<TooltipPrimitive.Root***REMOVED***data-slot="tooltip"***REMOVED***{...props}***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***</TooltipProvider>
***REMOVED******REMOVED***)
}

function***REMOVED***TooltipTrigger({
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TooltipPrimitive.Trigger>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***<TooltipPrimitive.Trigger***REMOVED***data-slot="tooltip-trigger"***REMOVED***{...props}***REMOVED***/>
}

function***REMOVED***TooltipContent({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***sideOffset***REMOVED***=***REMOVED***0,
***REMOVED******REMOVED***children,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TooltipPrimitive.Content>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TooltipPrimitive.Portal>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<TooltipPrimitive.Content
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="tooltip-content"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***sideOffset={sideOffset}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"bg-foreground***REMOVED***text-background***REMOVED***animate-in***REMOVED***fade-in-0***REMOVED***zoom-in-95***REMOVED***data-[state=closed]:animate-out***REMOVED***data-[state=closed]:fade-out-0***REMOVED***data-[state=closed]:zoom-out-95***REMOVED***data-[side=bottom]:slide-in-from-top-2***REMOVED***data-[side=left]:slide-in-from-right-2***REMOVED***data-[side=right]:slide-in-from-left-2***REMOVED***data-[side=top]:slide-in-from-bottom-2***REMOVED***z-50***REMOVED***w-fit***REMOVED***origin-(--radix-tooltip-content-transform-origin)***REMOVED***rounded-md***REMOVED***px-3***REMOVED***py-1.5***REMOVED***text-xs***REMOVED***text-balance",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<TooltipPrimitive.Arrow***REMOVED***className="bg-foreground***REMOVED***fill-foreground***REMOVED***z-50***REMOVED***size-2.5***REMOVED***translate-y-[calc(-50%_-_2px)]***REMOVED***rotate-45***REMOVED***rounded-[2px]"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</TooltipPrimitive.Content>
***REMOVED******REMOVED******REMOVED******REMOVED***</TooltipPrimitive.Portal>
***REMOVED******REMOVED***)
}

export***REMOVED***{***REMOVED***Tooltip,***REMOVED***TooltipTrigger,***REMOVED***TooltipContent,***REMOVED***TooltipProvider***REMOVED***}
