"useclient";

import{useState,useRef,TouchEvent,ReactNode}from"react";
import{RefreshCw}from"lucide-react";
import{cn}from"@/lib/utils";

interfacePullToRefreshProps{
onRefresh:()=>Promise<void>;
children:ReactNode;
className?:string;
}

exportfunctionPullToRefresh({onRefresh,children,className}:PullToRefreshProps){
const[pullDistance,setPullDistance]=useState(0);
const[isRefreshing,setIsRefreshing]=useState(false);
const[touchStart,setTouchStart]=useState<number|null>(null);
constcontainerRef=useRef<HTMLDivElement>(null);

constmaxPullDistance=100;
consttriggerDistance=70;

consthandleTouchStart=(e:TouchEvent)=>{
//Onlyallowpull-to-refreshwhenscrolledtotop
if(containerRef.current&&containerRef.current.scrollTop===0){
setTouchStart(e.touches[0].clientY);
}
};

consthandleTouchMove=(e:TouchEvent)=>{
if(touchStart===null||isRefreshing)return;

constcurrentTouch=e.touches[0].clientY;
constdistance=currentTouch-touchStart;

//Onlypulldown,notup
if(distance>0&&containerRef.current&&containerRef.current.scrollTop===0){
//Applyresistancetopulldistance
constresistedDistance=Math.min(
distance*0.5,
maxPullDistance
);
setPullDistance(resistedDistance);

//Preventdefaultscrollbehaviorwhenpulling
if(distance>10){
e.preventDefault();
}
}
};

consthandleTouchEnd=async()=>{
if(touchStart===null||isRefreshing)return;

if(pullDistance>=triggerDistance){
setIsRefreshing(true);

//Triggerhapticfeedbackifsupported
if(typeofnavigator!=="undefined"&&"vibrate"innavigator){
navigator.vibrate(20);
}

try{
awaitonRefresh();
}catch(error){
console.error("Refreshfailed:",error);
}finally{
setIsRefreshing(false);
setPullDistance(0);
}
}else{
setPullDistance(0);
}

setTouchStart(null);
};

constgetRotation=()=>{
if(isRefreshing)return360;
return(pullDistance/triggerDistance)*360;
};

constgetOpacity=()=>{
returnMath.min(pullDistance/triggerDistance,1);
};

return(
<div
ref={containerRef}
className={cn("relativeoverflow-auto",className)}
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
>
{/*Pullindicator*/}
<div
className="absolutetop-0left-0right-0flexitems-centerjustify-centertransition-allduration-200pointer-events-none"
style={{
height:`${pullDistance}px`,
opacity:getOpacity(),
}}
>
<divclassName="flexflex-colitems-centergap-1">
<RefreshCw
className={cn(
"h-6w-6text-primarytransition-transform",
isRefreshing&&"animate-spin"
)}
style={{
transform:`rotate(${getRotation()}deg)`,
}}
/>
<spanclassName="text-xstext-muted-foreground">
{isRefreshing
?"Refreshing..."
:pullDistance>=triggerDistance
?"Releasetorefresh"
:"Pulltorefresh"}
</span>
</div>
</div>

{/*Contentwithoffsetwhenpulling*/}
<div
style={{
transform:`translateY(${pullDistance}px)`,
transition:isRefreshing||pullDistance===0?"transform0.2sease-out":"none",
}}
>
{children}
</div>
</div>
);
}
