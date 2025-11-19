"useclient";

import{Button}from"@/components/ui/button";
import{Loader2}from"lucide-react";
import{cn}from"@/lib/utils";
import{ComponentProps}from"react";

interfaceLoadingButtonPropsextendsComponentProps<typeofButton>{
isLoading?:boolean;
loadingText?:string;
}

exportfunctionLoadingButton({
isLoading=false,
loadingText,
children,
disabled,
className,
...props
}:LoadingButtonProps){
return(
<Button
disabled={disabled||isLoading}
className={cn(className)}
{...props}
>
{isLoading&&(
<Loader2className="size-4animate-spin"aria-hidden="true"/>
)}
{isLoading?loadingText||children:children}
</Button>
);
}
