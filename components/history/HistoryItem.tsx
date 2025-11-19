"useclient";

importReact,{useState,TouchEvent}from"react";
importtype{HistoryItem}from"@/types";
import{CheckCircle2,XCircle,Ban,Clock,Users,ChevronRight}from"lucide-react";
import{cn}from"@/lib/utils";

interfaceHistoryItemProps{
item:HistoryItem;
onClick:()=>void;
}

exportfunctionHistoryItem({item,onClick}:HistoryItemProps){
const[touchStart,setTouchStart]=useState<number|null>(null);
const[touchEnd,setTouchEnd]=useState<number|null>(null);
const[swipeOffset,setSwipeOffset]=useState(0);

//Minimumswipedistance(inpx)totriggeraction
constminSwipeDistance=100;

consthandleTouchStart=(e:TouchEvent)=>{
setTouchEnd(null);
setTouchStart(e.targetTouches[0].clientX);
};

consthandleTouchMove=(e:TouchEvent)=>{
constcurrentTouch=e.targetTouches[0].clientX;
setTouchEnd(currentTouch);

//Calculateoffsetforvisualfeedback
if(touchStart!==null){
constoffset=currentTouch-touchStart;
//Limitoffsettopreventexcessiveswiping
setSwipeOffset(Math.max(-150,Math.min(150,offset)));
}
};

consthandleTouchEnd=()=>{
if(!touchStart||!touchEnd){
setSwipeOffset(0);
return;
}

constdistance=touchStart-touchEnd;
constisLeftSwipe=distance>minSwipeDistance;
constisRightSwipe=distance<-minSwipeDistance;

//Resetoffset
setSwipeOffset(0);

if(isLeftSwipe||isRightSwipe){
//Triggerhapticfeedbackifsupported
if(typeofnavigator!=="undefined"&&"vibrate"innavigator){
navigator.vibrate(10);
}

//Opentheitemonswipe
onClick();
}

setTouchStart(null);
setTouchEnd(null);
};

constgetStatusIcon=()=>{
switch(item.status){
case"success":
return<CheckCircle2className="h-5w-5text-green-600"/>;
case"failed":
return<XCircleclassName="h-5w-5text-red-600"/>;
case"cancelled":
return<BanclassName="h-5w-5text-gray-500"/>;
}
};

constgetStatusColor=()=>{
switch(item.status){
case"success":
return"bg-green-50text-green-700border-green-200";
case"failed":
return"bg-red-50text-red-700border-red-200";
case"cancelled":
return"bg-gray-50text-gray-700border-gray-200";
}
};

constformatDuration=(ms:number)=>{
constseconds=Math.floor(ms/1000);
if(seconds<60){
return`${seconds}s`;
}
constminutes=Math.floor(seconds/60);
constremainingSeconds=seconds%60;
return`${minutes}m${remainingSeconds}s`;
};

constformatTimestamp=(date:Date)=>{
constnow=newDate();
constdiffMs=now.getTime()-date.getTime();
constdiffMins=Math.floor(diffMs/60000);
constdiffHours=Math.floor(diffMs/3600000);
constdiffDays=Math.floor(diffMs/86400000);

if(diffMins<1){
return"Justnow";
}elseif(diffMins<60){
return`${diffMins}minute${diffMins>1?"s":""}ago`;
}elseif(diffHours<24){
return`${diffHours}hour${diffHours>1?"s":""}ago`;
}elseif(diffDays<7){
return`${diffDays}day${diffDays>1?"s":""}ago`;
}else{
returndate.toLocaleDateString();
}
};

return(
<button
onClick={onClick}
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
className="groupcursor-pointerrounded-lgborderbg-cardp-4transition-allhover:shadow-mdhover:border-primary/50touch-nonew-fulltext-leftfocus:outline-nonefocus:ring-2focus:ring-ringfocus:ring-offset-2"
style={{
transform:`translateX(${swipeOffset}px)`,
transition:swipeOffset===0?"transform0.2sease-out":"none",
}}
aria-label={`Viewworkflow:${item.command}.Status:${item.status}.${formatTimestamp(item.timestamp)}`}
>
<divclassName="flexitems-startgap-3sm:gap-4">
{/*StatusIcon*/}
<divclassName="flex-shrink-0mt-0.5sm:mt-1"aria-hidden="true">{getStatusIcon()}</div>

{/*Content*/}
<divclassName="flex-1min-w-0">
{/*Command*/}
<pclassName="text-xssm:text-smfont-mediumtext-foregroundline-clamp-2group-hover:text-primarytransition-colors">
{item.command}
</p>

{/*Metadata*/}
<divclassName="mt-1.5sm:mt-2flexflex-wrapitems-centergap-2sm:gap-3text-2xssm:text-xstext-muted-foreground">
{/*Timestamp*/}
<divclassName="flexitems-centergap-1">
<ClockclassName="h-3w-3"/>
<span>{formatTimestamp(item.timestamp)}</span>
</div>

{/*Duration*/}
<divclassName="flexitems-centergap-1">
<span>Duration:{formatDuration(item.duration)}</span>
</div>

{/*AgentsUsed*/}
{item.agentsUsed.length>0&&(
<divclassName="flexitems-centergap-1">
<UsersclassName="h-3w-3"/>
<span>{item.agentsUsed.length}agent{item.agentsUsed.length>1?"s":""}</span>
</div>
)}

{/*ResultCount*/}
{item.resultCount>0&&(
<divclassName="flexitems-centergap-1">
<span>{item.resultCount}result{item.resultCount>1?"s":""}</span>
</div>
)}
</div>

{/*AgentsList*/}
{item.agentsUsed.length>0&&(
<divclassName="mt-1.5sm:mt-2flexflex-wrapgap-1">
{item.agentsUsed.map((agent,index)=>(
<span
key={index}
className="inline-flexitems-centerrounded-fullbg-primary/10px-1.5sm:px-2py-0.5text-2xssm:text-xsfont-mediumtext-primary"
>
{agent}
</span>
))}
</div>
)}
</div>

{/*StatusBadgeandSwipeIndicator*/}
<divclassName="flex-shrink-0flexitems-centergap-2">
<span
className={cn(
"inline-flexitems-centerrounded-fullborderpx-2sm:px-2.5py-0.5text-2xssm:text-xsfont-semiboldcapitalize",
getStatusColor()
)}
aria-label={`Status:${item.status}`}
>
{item.status}
</span>
{/*Swipeindicator-onlyvisibleonmobile*/}
<ChevronRightclassName="h-4w-4text-muted-foregroundlg:hidden"aria-hidden="true"/>
</div>
</div>
</button>
);
}
