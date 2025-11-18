"use***REMOVED***client"

import***REMOVED*******REMOVED***as***REMOVED***React***REMOVED***from***REMOVED***"react"
import***REMOVED*******REMOVED***as***REMOVED***TabsPrimitive***REMOVED***from***REMOVED***"@radix-ui/react-tabs"

import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils"

function***REMOVED***Tabs({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TabsPrimitive.Root>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TabsPrimitive.Root
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="tabs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("flex***REMOVED***flex-col***REMOVED***gap-2",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***TabsList({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TabsPrimitive.List>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TabsPrimitive.List
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="tabs-list"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"bg-muted***REMOVED***text-muted-foreground***REMOVED***inline-flex***REMOVED***h-9***REMOVED***w-fit***REMOVED***items-center***REMOVED***justify-center***REMOVED***rounded-lg***REMOVED***p-[3px]",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***TabsTrigger({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TabsPrimitive.Trigger>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TabsPrimitive.Trigger
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="tabs-trigger"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"data-[state=active]:bg-background***REMOVED***dark:data-[state=active]:text-foreground***REMOVED***focus-visible:border-ring***REMOVED***focus-visible:ring-ring/50***REMOVED***focus-visible:outline-ring***REMOVED***dark:data-[state=active]:border-input***REMOVED***dark:data-[state=active]:bg-input/30***REMOVED***text-foreground***REMOVED***dark:text-muted-foreground***REMOVED***inline-flex***REMOVED***h-[calc(100%-1px)]***REMOVED***flex-1***REMOVED***items-center***REMOVED***justify-center***REMOVED***gap-1.5***REMOVED***rounded-md***REMOVED***border***REMOVED***border-transparent***REMOVED***px-2***REMOVED***py-1***REMOVED***text-sm***REMOVED***font-medium***REMOVED***whitespace-nowrap***REMOVED***transition-[color,box-shadow]***REMOVED***focus-visible:ring-[3px]***REMOVED***focus-visible:outline-1***REMOVED***disabled:pointer-events-none***REMOVED***disabled:opacity-50***REMOVED***data-[state=active]:shadow-sm***REMOVED***[&_svg]:pointer-events-none***REMOVED***[&_svg]:shrink-0***REMOVED***[&_svg:not([class*='size-'])]:size-4",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***TabsContent({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***TabsPrimitive.Content>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<TabsPrimitive.Content
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="tabs-content"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("flex-1***REMOVED***outline-none",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

export***REMOVED***{***REMOVED***Tabs,***REMOVED***TabsList,***REMOVED***TabsTrigger,***REMOVED***TabsContent***REMOVED***}
