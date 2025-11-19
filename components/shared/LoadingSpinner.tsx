"useclient";

importReactfrom"react";
import{cn}from"@/lib/utils";
import{Loader2}from"lucide-react";

interfaceLoadingSpinnerProps{
size?:"sm"|"md"|"lg"|"xl";
className?:string;
label?:string;
}

constsizeClasses={
sm:"size-4",
md:"size-6",
lg:"size-8",
xl:"size-12",
};

exportfunctionLoadingSpinner({size="md",className,label}:LoadingSpinnerProps){
return(
<divclassName="flexitems-centerjustify-center"role="status"aria-live="polite">
<Loader2
className={cn("animate-spintext-primary",sizeClasses[size],className)}
aria-hidden="true"
/>
{label&&<spanclassName="sr-only">{label}</span>}
{!label&&<spanclassName="sr-only">Loading...</span>}
</div>
);
}

interfaceLoadingOverlayProps{
isLoading:boolean;
children:React.ReactNode;
label?:string;
className?:string;
}

exportfunctionLoadingOverlay({
isLoading,
children,
label="Loading...",
className,
}:LoadingOverlayProps){
return(
<divclassName={cn("relative",className)}>
{children}
{isLoading&&(
<div
className="absoluteinset-0bg-background/80backdrop-blur-smflexitems-centerjustify-centerz-10"
role="status"
aria-live="polite"
>
<divclassName="flexflex-colitems-centergap-2">
<LoadingSpinnersize="lg"/>
<pclassName="text-smtext-muted-foreground">{label}</p>
</div>
</div>
)}
</div>
);
}

interfaceDelayedLoadingProps{
delay?:number;
children:React.ReactNode;
}

exportfunctionDelayedLoading({delay=300,children}:DelayedLoadingProps){
const[show,setShow]=React.useState(false);

React.useEffect(()=>{
consttimer=setTimeout(()=>{
setShow(true);
},delay);

return()=>clearTimeout(timer);
},[delay]);

if(!show)returnnull;

return<>{children}</>;
}
