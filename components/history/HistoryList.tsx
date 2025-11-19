"useclient";

importReact,{useEffect,useRef,useCallback}from"react";
import{useHistory}from"@/contexts/HistoryContext";
import{HistoryItem}from"./HistoryItem";
import{Loader2,Inbox,XCircle}from"lucide-react";

interfaceHistoryListProps{
onItemSelect:(taskId:string)=>void;
}

exportfunctionHistoryList({onItemSelect}:HistoryListProps){
const{items,isLoading,error,hasMore,loadMore}=useHistory();
constobserverTarget=useRef<HTMLDivElement>(null);

//Infinitescrollimplementation
consthandleObserver=useCallback(
(entries:IntersectionObserverEntry[])=>{
const[target]=entries;
if(target.isIntersecting&&hasMore&&!isLoading){
loadMore();
}
},
[hasMore,isLoading,loadMore]
);

useEffect(()=>{
constelement=observerTarget.current;
if(!element)return;

constobserver=newIntersectionObserver(handleObserver,{
root:null,
rootMargin:"100px",
threshold:0.1,
});

observer.observe(element);

return()=>{
if(element){
observer.unobserve(element);
}
};
},[handleObserver]);

if(error){
return(
<divclassName="flexflex-colitems-centerjustify-centerpy-12text-center"role="alert">
<XCircleclassName="h-12w-12text-red-500mb-4"aria-hidden="true"/>
<h3className="text-lgfont-semiboldtext-foregroundmb-2">
Failedtoloadhistory
</h3>
<pclassName="text-smtext-muted-foreground">{error}</p>
</div>
);
}

if(!isLoading&&items.length===0){
return(
<divclassName="flexflex-colitems-centerjustify-centerpy-12text-center"role="status">
<InboxclassName="h-12w-12text-muted-foregroundmb-4"aria-hidden="true"/>
<h3className="text-lgfont-semiboldtext-foregroundmb-2">
Nohistoryyet
</h3>
<pclassName="text-smtext-muted-foreground">
YourworkflowhistorywillappearhereonceyoustartusingAURA
</p>
</div>
);
}

return(
<navclassName="space-y-3"aria-label="Workflowhistory">
<ulclassName="space-y-3"role="list">
{items.map((item)=>(
<likey={item.id}>
<HistoryItem
item={item}
onClick={()=>onItemSelect(item.id)}
/>
</li>
))}
</ul>

{/*Loadingindicatorforinitialload*/}
{isLoading&&items.length===0&&(
<divclassName="flexitems-centerjustify-centerpy-8"role="status"aria-live="polite">
<Loader2className="h-8w-8animate-spintext-primary"aria-hidden="true"/>
<spanclassName="sr-only">Loadinghistory</span>
</div>
)}

{/*Infinitescrolltriggerandloadingindicator*/}
<divref={observerTarget}className="py-4">
{isLoading&&items.length>0&&(
<divclassName="flexitems-centerjustify-center"role="status"aria-live="polite">
<Loader2className="h-6w-6animate-spintext-primary"aria-hidden="true"/>
<spanclassName="ml-2text-smtext-muted-foreground">
Loadingmore...
</span>
</div>
)}
{!hasMore&&items.length>0&&(
<pclassName="text-centertext-smtext-muted-foreground"role="status">
Nomoreitemstoload
</p>
)}
</div>
</nav>
);
}
