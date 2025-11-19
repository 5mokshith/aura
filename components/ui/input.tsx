import*asReactfrom"react";
import{cn}from"@/lib/utils";

exportinterfaceInputProps
extendsReact.InputHTMLAttributes<HTMLInputElement>{}

constInput=React.forwardRef<HTMLInputElement,InputProps>(
({className,type,...props},ref)=>{
return(
<input
type={type}
className={cn(
"flexh-10w-fullrounded-mdborderborder-inputbg-backgroundpx-3py-2text-smring-offset-backgroundfile:border-0file:bg-transparentfile:text-smfile:font-mediumplaceholder:text-muted-foregroundfocus-visible:outline-nonefocus-visible:ring-2focus-visible:ring-ringfocus-visible:ring-offset-2disabled:cursor-not-alloweddisabled:opacity-50",
className
)}
ref={ref}
{...props}
/>
);
}
);
Input.displayName="Input";

export{Input};
