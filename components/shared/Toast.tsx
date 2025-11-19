"useclient";

import{createContext,useContext,useState,useCallback,ReactNode}from"react";
import{X,CheckCircle2,AlertCircle,AlertTriangle,Info}from"lucide-react";
import{cn}from"@/lib/utils";

typeToastVariant="success"|"error"|"warning"|"info";

interfaceToast{
id:string;
message:string;
variant:ToastVariant;
duration?:number;
}

interfaceToastContextValue{
toasts:Toast[];
showToast:(message:string,variant?:ToastVariant,duration?:number)=>void;
dismissToast:(id:string)=>void;
}

constToastContext=createContext<ToastContextValue|undefined>(undefined);

exportfunctionuseToast(){
constcontext=useContext(ToastContext);
if(!context){
thrownewError("useToastmustbeusedwithinaToastProvider");
}
returncontext;
}

interfaceToastProviderProps{
children:ReactNode;
}

exportfunctionToastProvider({children}:ToastProviderProps){
const[toasts,setToasts]=useState<Toast[]>([]);

constshowToast=useCallback(
(message:string,variant:ToastVariant="info",duration?:number)=>{
constid=`toast-${Date.now()}-${Math.random()}`;

//Determineauto-dismissdurationbasedonvariant
letautoDismissDuration=duration;
if(autoDismissDuration===undefined){
switch(variant){
case"success":
autoDismissDuration=3000;//3sforsuccess
break;
case"warning":
autoDismissDuration=5000;//5sforwarning
break;
case"error":
autoDismissDuration=0;//Manualdismissforerrors
break;
case"info":
autoDismissDuration=4000;//4sforinfo
break;
}
}

constnewToast:Toast={
id,
message,
variant,
duration:autoDismissDuration,
};

setToasts((prev)=>[...prev,newToast]);

//Auto-dismissifdurationisset
if(autoDismissDuration&&autoDismissDuration>0){
setTimeout(()=>{
dismissToast(id);
},autoDismissDuration);
}
},
[]
);

constdismissToast=useCallback((id:string)=>{
setToasts((prev)=>prev.filter((toast)=>toast.id!==id));
},[]);

return(
<ToastContext.Providervalue={{toasts,showToast,dismissToast}}>
{children}
<ToastContainertoasts={toasts}onDismiss={dismissToast}/>
</ToastContext.Provider>
);
}

interfaceToastContainerProps{
toasts:Toast[];
onDismiss:(id:string)=>void;
}

functionToastContainer({toasts,onDismiss}:ToastContainerProps){
if(toasts.length===0)returnnull;

return(
<div
className="fixedz-50flexflex-colgap-2pointer-events-none"
style={{
top:"1rem",
right:"1rem",
//Onmobile,positionatbottomforbetterreachability
}}
aria-live="polite"
aria-atomic="true"
>
<stylejsx>{`
@media(max-width:768px){
div{
top:auto;
bottom:1rem;
left:1rem;
right:1rem;
}
}
`}</style>
{toasts.map((toast)=>(
<ToastItemkey={toast.id}toast={toast}onDismiss={onDismiss}/>
))}
</div>
);
}

interfaceToastItemProps{
toast:Toast;
onDismiss:(id:string)=>void;
}

functionToastItem({toast,onDismiss}:ToastItemProps){
constvariantStyles={
success:{
container:"bg-green-50border-green-200dark:bg-green-950dark:border-green-800",
icon:"text-green-600dark:text-green-400",
text:"text-green-900dark:text-green-100",
IconComponent:CheckCircle2,
},
error:{
container:"bg-red-50border-red-200dark:bg-red-950dark:border-red-800",
icon:"text-red-600dark:text-red-400",
text:"text-red-900dark:text-red-100",
IconComponent:AlertCircle,
},
warning:{
container:"bg-yellow-50border-yellow-200dark:bg-yellow-950dark:border-yellow-800",
icon:"text-yellow-600dark:text-yellow-400",
text:"text-yellow-900dark:text-yellow-100",
IconComponent:AlertTriangle,
},
info:{
container:"bg-blue-50border-blue-200dark:bg-blue-950dark:border-blue-800",
icon:"text-blue-600dark:text-blue-400",
text:"text-blue-900dark:text-blue-100",
IconComponent:Info,
},
};

conststyle=variantStyles[toast.variant];
constIcon=style.IconComponent;

return(
<div
role="alert"
className={cn(
"pointer-events-autoflexitems-startgap-3p-4rounded-lgbordershadow-lg",
"animate-inslide-in-from-top-5fade-induration-300",
"max-w-mdw-full",
style.container
)}
>
<IconclassName={cn("size-5flex-shrink-0mt-0.5",style.icon)}aria-hidden="true"/>

<pclassName={cn("flex-1text-smfont-medium",style.text)}>
{toast.message}
</p>

<button
onClick={()=>onDismiss(toast.id)}
className={cn(
"flex-shrink-0rounded-mdp-1hover:bg-black/5dark:hover:bg-white/10",
"focus:outline-nonefocus:ring-2focus:ring-offset-2focus:ring-current",
"transition-colors",
style.icon
)}
aria-label="Dismissnotification"
>
<XclassName="size-4"aria-hidden="true"/>
</button>
</div>
);
}
