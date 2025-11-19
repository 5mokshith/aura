"useclient"

import*asReactfrom"react"
import*asProgressPrimitivefrom"@radix-ui/react-progress"

import{cn}from"@/lib/utils"

functionProgress({
className,
value,
...props
}:React.ComponentProps<typeofProgressPrimitive.Root>){
return(
<ProgressPrimitive.Root
className={cn(
"relativeh-2w-fulloverflow-hiddenrounded-fullbg-primary/20",
className
)}
{...props}
>
<ProgressPrimitive.Indicator
className="h-fullw-fullflex-1bg-primarytransition-all"
style={{transform:`translateX(-${100-(value||0)}%)`}}
/>
</ProgressPrimitive.Root>
)
}

export{Progress}
