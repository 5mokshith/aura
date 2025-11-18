import***REMOVED*******REMOVED***as***REMOVED***React***REMOVED***from***REMOVED***"react"
import***REMOVED***{***REMOVED***Slot***REMOVED***}***REMOVED***from***REMOVED***"@radix-ui/react-slot"
import***REMOVED***{***REMOVED***cva,***REMOVED***type***REMOVED***VariantProps***REMOVED***}***REMOVED***from***REMOVED***"class-variance-authority"

import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils"

const***REMOVED***badgeVariants***REMOVED***=***REMOVED***cva(
***REMOVED******REMOVED***"inline-flex***REMOVED***items-center***REMOVED***justify-center***REMOVED***rounded-full***REMOVED***border***REMOVED***px-2***REMOVED***py-0.5***REMOVED***text-xs***REMOVED***font-medium***REMOVED***w-fit***REMOVED***whitespace-nowrap***REMOVED***shrink-0***REMOVED***[&>svg]:size-3***REMOVED***gap-1***REMOVED***[&>svg]:pointer-events-none***REMOVED***focus-visible:border-ring***REMOVED***focus-visible:ring-ring/50***REMOVED***focus-visible:ring-[3px]***REMOVED***aria-invalid:ring-destructive/20***REMOVED***dark:aria-invalid:ring-destructive/40***REMOVED***aria-invalid:border-destructive***REMOVED***transition-[color,box-shadow]***REMOVED***overflow-hidden",
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***variants:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"border-transparent***REMOVED***bg-primary***REMOVED***text-primary-foreground***REMOVED***[a&]:hover:bg-primary/90",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***secondary:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"border-transparent***REMOVED***bg-secondary***REMOVED***text-secondary-foreground***REMOVED***[a&]:hover:bg-secondary/90",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***destructive:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"border-transparent***REMOVED***bg-destructive***REMOVED***text-white***REMOVED***[a&]:hover:bg-destructive/90***REMOVED***focus-visible:ring-destructive/20***REMOVED***dark:focus-visible:ring-destructive/40***REMOVED***dark:bg-destructive/60",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***outline:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"text-foreground***REMOVED***[a&]:hover:bg-accent***REMOVED***[a&]:hover:text-accent-foreground",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***defaultVariants:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant:***REMOVED***"default",
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED***}
)

function***REMOVED***Badge({
***REMOVED******REMOVED***className,
***REMOVED******REMOVED***variant,
***REMOVED******REMOVED***asChild***REMOVED***=***REMOVED***false,
***REMOVED******REMOVED***...props
}:***REMOVED***React.ComponentProps<"span">***REMOVED***&
***REMOVED******REMOVED***VariantProps<typeof***REMOVED***badgeVariants>***REMOVED***&***REMOVED***{***REMOVED***asChild?:***REMOVED***boolean***REMOVED***})***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***Comp***REMOVED***=***REMOVED***asChild***REMOVED***?***REMOVED***Slot***REMOVED***:***REMOVED***"span"

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<Comp
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data-slot="badge"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(badgeVariants({***REMOVED***variant***REMOVED***}),***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{...props}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***)
}

export***REMOVED***{***REMOVED***Badge,***REMOVED***badgeVariants***REMOVED***}
