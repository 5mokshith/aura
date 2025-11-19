"useclient"

import*asReactfrom"react"
import*asTabsPrimitivefrom"@radix-ui/react-tabs"

import{cn}from"@/lib/utils"

functionTabs({
className,
...props
}:React.ComponentProps<typeofTabsPrimitive.Root>){
return(
<TabsPrimitive.Root
data-slot="tabs"
className={cn("flexflex-colgap-2",className)}
{...props}
/>
)
}

functionTabsList({
className,
...props
}:React.ComponentProps<typeofTabsPrimitive.List>){
return(
<TabsPrimitive.List
data-slot="tabs-list"
className={cn(
"bg-mutedtext-muted-foregroundinline-flexh-9w-fititems-centerjustify-centerrounded-lgp-[3px]",
className
)}
{...props}
/>
)
}

functionTabsTrigger({
className,
...props
}:React.ComponentProps<typeofTabsPrimitive.Trigger>){
return(
<TabsPrimitive.Trigger
data-slot="tabs-trigger"
className={cn(
"data-[state=active]:bg-backgrounddark:data-[state=active]:text-foregroundfocus-visible:border-ringfocus-visible:ring-ring/50focus-visible:outline-ringdark:data-[state=active]:border-inputdark:data-[state=active]:bg-input/30text-foregrounddark:text-muted-foregroundinline-flexh-[calc(100%-1px)]flex-1items-centerjustify-centergap-1.5rounded-mdborderborder-transparentpx-2py-1text-smfont-mediumwhitespace-nowraptransition-[color,box-shadow]focus-visible:ring-[3px]focus-visible:outline-1disabled:pointer-events-nonedisabled:opacity-50data-[state=active]:shadow-sm[&_svg]:pointer-events-none[&_svg]:shrink-0[&_svg:not([class*='size-'])]:size-4",
className
)}
{...props}
/>
)
}

functionTabsContent({
className,
...props
}:React.ComponentProps<typeofTabsPrimitive.Content>){
return(
<TabsPrimitive.Content
data-slot="tabs-content"
className={cn("flex-1outline-none",className)}
{...props}
/>
)
}

export{Tabs,TabsList,TabsTrigger,TabsContent}
