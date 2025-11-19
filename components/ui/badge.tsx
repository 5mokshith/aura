import*asReactfrom"react"
import{Slot}from"@radix-ui/react-slot"
import{cva,typeVariantProps}from"class-variance-authority"

import{cn}from"@/lib/utils"

constbadgeVariants=cva(
"inline-flexitems-centerjustify-centerrounded-fullborderpx-2py-0.5text-xsfont-mediumw-fitwhitespace-nowrapshrink-0[&>svg]:size-3gap-1[&>svg]:pointer-events-nonefocus-visible:border-ringfocus-visible:ring-ring/50focus-visible:ring-[3px]aria-invalid:ring-destructive/20dark:aria-invalid:ring-destructive/40aria-invalid:border-destructivetransition-[color,box-shadow]overflow-hidden",
{
variants:{
variant:{
default:
"border-transparentbg-primarytext-primary-foreground[a&]:hover:bg-primary/90",
secondary:
"border-transparentbg-secondarytext-secondary-foreground[a&]:hover:bg-secondary/90",
destructive:
"border-transparentbg-destructivetext-white[a&]:hover:bg-destructive/90focus-visible:ring-destructive/20dark:focus-visible:ring-destructive/40dark:bg-destructive/60",
outline:
"text-foreground[a&]:hover:bg-accent[a&]:hover:text-accent-foreground",
},
},
defaultVariants:{
variant:"default",
},
}
)

functionBadge({
className,
variant,
asChild=false,
...props
}:React.ComponentProps<"span">&
VariantProps<typeofbadgeVariants>&{asChild?:boolean}){
constComp=asChild?Slot:"span"

return(
<Comp
data-slot="badge"
className={cn(badgeVariants({variant}),className)}
{...props}
/>
)
}

export{Badge,badgeVariants}
