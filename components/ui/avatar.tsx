"useclient"

import*asReactfrom"react"
import*asAvatarPrimitivefrom"@radix-ui/react-avatar"

import{cn}from"@/lib/utils"

functionAvatar({
className,
...props
}:React.ComponentProps<typeofAvatarPrimitive.Root>){
return(
<AvatarPrimitive.Root
data-slot="avatar"
className={cn(
"relativeflexsize-8shrink-0overflow-hiddenrounded-full",
className
)}
{...props}
/>
)
}

functionAvatarImage({
className,
...props
}:React.ComponentProps<typeofAvatarPrimitive.Image>){
return(
<AvatarPrimitive.Image
data-slot="avatar-image"
className={cn("aspect-squaresize-full",className)}
{...props}
/>
)
}

functionAvatarFallback({
className,
...props
}:React.ComponentProps<typeofAvatarPrimitive.Fallback>){
return(
<AvatarPrimitive.Fallback
data-slot="avatar-fallback"
className={cn(
"bg-mutedflexsize-fullitems-centerjustify-centerrounded-full",
className
)}
{...props}
/>
)
}

export{Avatar,AvatarImage,AvatarFallback}
