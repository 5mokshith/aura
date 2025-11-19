"useclient"

import*asReactfrom"react"
import*asTooltipPrimitivefrom"@radix-ui/react-tooltip"

import{cn}from"@/lib/utils"

functionTooltipProvider({
delayDuration=0,
...props
}:React.ComponentProps<typeofTooltipPrimitive.Provider>){
return(
<TooltipPrimitive.Provider
data-slot="tooltip-provider"
delayDuration={delayDuration}
{...props}
/>
)
}

functionTooltip({
...props
}:React.ComponentProps<typeofTooltipPrimitive.Root>){
return(
<TooltipProvider>
<TooltipPrimitive.Rootdata-slot="tooltip"{...props}/>
</TooltipProvider>
)
}

functionTooltipTrigger({
...props
}:React.ComponentProps<typeofTooltipPrimitive.Trigger>){
return<TooltipPrimitive.Triggerdata-slot="tooltip-trigger"{...props}/>
}

functionTooltipContent({
className,
sideOffset=0,
children,
...props
}:React.ComponentProps<typeofTooltipPrimitive.Content>){
return(
<TooltipPrimitive.Portal>
<TooltipPrimitive.Content
data-slot="tooltip-content"
sideOffset={sideOffset}
className={cn(
"bg-foregroundtext-backgroundanimate-infade-in-0zoom-in-95data-[state=closed]:animate-outdata-[state=closed]:fade-out-0data-[state=closed]:zoom-out-95data-[side=bottom]:slide-in-from-top-2data-[side=left]:slide-in-from-right-2data-[side=right]:slide-in-from-left-2data-[side=top]:slide-in-from-bottom-2z-50w-fitorigin-(--radix-tooltip-content-transform-origin)rounded-mdpx-3py-1.5text-xstext-balance",
className
)}
{...props}
>
{children}
<TooltipPrimitive.ArrowclassName="bg-foregroundfill-foregroundz-50size-2.5translate-y-[calc(-50%_-_2px)]rotate-45rounded-[2px]"/>
</TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
)
}

export{Tooltip,TooltipTrigger,TooltipContent,TooltipProvider}
