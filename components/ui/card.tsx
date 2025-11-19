import*asReactfrom"react"

import{cn}from"@/lib/utils"

functionCard({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card"
className={cn(
"bg-cardtext-card-foregroundflexflex-colgap-6rounded-xlborderpy-6shadow-sm",
className
)}
{...props}
/>
)
}

functionCardHeader({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card-header"
className={cn(
"@container/card-headergridauto-rows-mingrid-rows-[auto_auto]items-startgap-2px-6has-data-[slot=card-action]:grid-cols-[1fr_auto][.border-b]:pb-6",
className
)}
{...props}
/>
)
}

functionCardTitle({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card-title"
className={cn("leading-nonefont-semibold",className)}
{...props}
/>
)
}

functionCardDescription({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card-description"
className={cn("text-muted-foregroundtext-sm",className)}
{...props}
/>
)
}

functionCardAction({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card-action"
className={cn(
"col-start-2row-span-2row-start-1self-startjustify-self-end",
className
)}
{...props}
/>
)
}

functionCardContent({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card-content"
className={cn("px-6",className)}
{...props}
/>
)
}

functionCardFooter({className,...props}:React.ComponentProps<"div">){
return(
<div
data-slot="card-footer"
className={cn("flexitems-centerpx-6[.border-t]:pt-6",className)}
{...props}
/>
)
}

export{
Card,
CardHeader,
CardFooter,
CardTitle,
CardAction,
CardDescription,
CardContent,
}
