"use***REMOVED***client"

import***REMOVED*******REMOVED***as***REMOVED***React***REMOVED***from***REMOVED***"react"
import***REMOVED*******REMOVED***as***REMOVED***AvatarPrimitive***REMOVED***from***REMOVED***"@radix-ui/react-avatar"

import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils"

function***REMOVED***Avatar({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***AvatarPrimitive.Root>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<AvatarPrimitive.Root
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="avatar"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"relative***REMOVED***flex***REMOVED***size-8***REMOVED***shrink-0***REMOVED***overflow-hidden***REMOVED***rounded-full",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***AvatarImage({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***AvatarPrimitive.Image>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<AvatarPrimitive.Image
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="avatar-image"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("aspect-square***REMOVED***size-full",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

function***REMOVED***AvatarFallback({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<typeof***REMOVED***AvatarPrimitive.Fallback>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<AvatarPrimitive.Fallback
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="avatar-fallback"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"bg-muted***REMOVED***flex***REMOVED***size-full***REMOVED***items-center***REMOVED***justify-center***REMOVED***rounded-full",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

export***REMOVED***{***REMOVED***Avatar,***REMOVED***AvatarImage,***REMOVED***AvatarFallback***REMOVED***}
