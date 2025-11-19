"useclient";

import{useState,useEffect,useRef,TouchEvent}from"react";
import{cn}from"@/lib/utils";
import{useReducedMotion}from"@/hooks/useReducedMotion";
import{ChevronUp,ChevronDown}from"lucide-react";

interfaceMobileBottomSheetProps{
children:React.ReactNode;
isOpen?:boolean;
onOpenChange?:(open:boolean)=>void;
title?:string;
className?:string;
}

typeSheetState="collapsed"|"peek"|"expanded";

exportfunctionMobileBottomSheet({
children,
isOpen=false,
onOpenChange,
title="ExecutionProgress",
className,
}:MobileBottomSheetProps){
const[sheetState,setSheetState]=useState<SheetState>(
isOpen?"peek":"collapsed"
);
const[touchStart,setTouchStart]=useState<number|null>(null);
const[touchEnd,setTouchEnd]=useState<number|null>(null);
constsheetRef=useRef<HTMLDivElement>(null);
constprefersReducedMotion=useReducedMotion();

//Minimumswipedistance(inpx)totriggerstatechange
constminSwipeDistance=50;

//Animationdurationbasedonmotionpreference
consttransitionDuration=prefersReducedMotion?"0.01ms":"300ms";

useEffect(()=>{
if(isOpen&&sheetState==="collapsed"){
setSheetState("peek");
}elseif(!isOpen&&sheetState!=="collapsed"){
setSheetState("collapsed");
}
},[isOpen,sheetState]);

consthandleTouchStart=(e:TouchEvent)=>{
setTouchEnd(null);
setTouchStart(e.targetTouches[0].clientY);
};

consthandleTouchMove=(e:TouchEvent)=>{
setTouchEnd(e.targetTouches[0].clientY);
};

consthandleTouchEnd=()=>{
if(!touchStart||!touchEnd)return;

constdistance=touchStart-touchEnd;
constisSwipeUp=distance>minSwipeDistance;
constisSwipeDown=distance<-minSwipeDistance;

if(isSwipeUp){
//Swipeup
if(sheetState==="collapsed"){
setSheetState("peek");
onOpenChange?.(true);
}elseif(sheetState==="peek"){
setSheetState("expanded");
}
}elseif(isSwipeDown){
//Swipedown
if(sheetState==="expanded"){
setSheetState("peek");
}elseif(sheetState==="peek"){
setSheetState("collapsed");
onOpenChange?.(false);
}
}

setTouchStart(null);
setTouchEnd(null);
};

consthandleToggle=()=>{
if(sheetState==="collapsed"){
setSheetState("peek");
onOpenChange?.(true);
}elseif(sheetState==="peek"){
setSheetState("expanded");
}else{
setSheetState("peek");
}
};

consthandleCollapse=()=>{
setSheetState("collapsed");
onOpenChange?.(false);
};

//Calculateheightbasedonstate
constgetHeight=()=>{
switch(sheetState){
case"collapsed":
return"0px";
case"peek":
return"30vh";//Showpartialcontent
case"expanded":
return"85vh";//Almostfullscreen
default:
return"0px";
}
};

//Onlyshowonmobile(<768px)
return(
<div
ref={sheetRef}
className={cn(
"fixedbottom-0left-0right-0z-50lg:hidden",
"bg-backgroundborder-tshadow-2xlrounded-t-2xl",
"ease-out",
className
)}
style={{
height:getHeight(),
transform:sheetState==="collapsed"?"translateY(100%)":"translateY(0)",
transition:`all${transitionDuration}`,
}}
role="dialog"
aria-label={title}
aria-hidden={sheetState==="collapsed"}
>
{/*DragHandle*/}
<div
className="flexflex-colitems-centerpt-3pb-2cursor-pointertouch-none"
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
onClick={handleToggle}
role="button"
aria-label={
sheetState==="expanded"
?"Collapsesheet"
:sheetState==="peek"
?"Expandsheet"
:"Opensheet"
}
>
{/*Visualdragindicator*/}
<divclassName="w-12h-1.5bg-muted-foreground/30rounded-fullmb-2"/>

{/*Titleandtogglebutton*/}
<divclassName="flexitems-centerjustify-betweenw-fullpx-4pb-2">
<h3className="text-smfont-semibold">{title}</h3>
<button
onClick={(e)=>{
e.stopPropagation();
if(sheetState==="collapsed"){
setSheetState("peek");
onOpenChange?.(true);
}else{
handleCollapse();
}
}}
className="p-1rounded-mdhover:bg-accenttransition-colors"
aria-label={sheetState==="collapsed"?"Opensheet":"Closesheet"}
>
{sheetState==="collapsed"?(
<ChevronUpclassName="h-5w-5"/>
):(
<ChevronDownclassName="h-5w-5"/>
)}
</button>
</div>
</div>

{/*Content*/}
<div
className={cn(
"overflow-y-autopx-4pb-4",
sheetState==="peek"?"h-[calc(30vh-60px)]":"h-[calc(85vh-60px)]"
)}
style={{
transition:`height${transitionDuration}`,
}}
>
{children}
</div>

{/*Backdropforexpandedstate*/}
{sheetState==="expanded"&&(
<div
className="fixedinset-0bg-black/20-z-10"
onClick={()=>setSheetState("peek")}
aria-hidden="true"
/>
)}
</div>
);
}
