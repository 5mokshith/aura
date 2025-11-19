importuseSWRfrom"swr";
importuseSWRInfinitefrom"swr/infinite";
import{cacheConfig}from"@/lib/swr-config";
importtype{HistoryItem,QuickAction,AuthStatus}from"@/types";

/**
*Hookforfetchinghistorywithpaginationandcaching
*/
exportfunctionuseHistoryData(filters?:{
dateFrom?:Date;
dateTo?:Date;
status?:string;
agentType?:string;
searchQuery?:string;
}){
constgetKey=(pageIndex:number,previousPageData:any)=>{
//Reachedtheend
if(previousPageData&&!previousPageData.hasMore)returnnull;

constparams=newURLSearchParams({
page:(pageIndex+1).toString(),
limit:"20",
});

if(filters?.dateFrom)params.append("dateFrom",filters.dateFrom.toISOString());
if(filters?.dateTo)params.append("dateTo",filters.dateTo.toISOString());
if(filters?.status)params.append("status",filters.status);
if(filters?.agentType)params.append("agentType",filters.agentType);
if(filters?.searchQuery)params.append("search",filters.searchQuery);

return`/api/history?${params.toString()}`;
};

const{data,error,size,setSize,isLoading,isValidating,mutate}=useSWRInfinite(
getKey,
{
...cacheConfig.history,
revalidateFirstPage:false,
}
);

constitems:HistoryItem[]=data
?data.flatMap((page)=>
page.items.map((item:any)=>({
...item,
timestamp:newDate(item.timestamp),
}))
)
:[];

consthasMore=data?data[data.length-1]?.hasMore:false;

return{
items,
error,
isLoading,
isValidating,
hasMore,
loadMore:()=>setSize(size+1),
refresh:()=>mutate(),
};
}

/**
*Hookforfetchingquickactionswithcaching
*/
exportfunctionuseQuickActions(){
const{data,error,isLoading,mutate}=useSWR<QuickAction[]>(
"/api/quick-actions",
cacheConfig.quickActions
);

return{
actions:data||[],
error,
isLoading,
refresh:()=>mutate(),
};
}

/**
*Hookforfetchingauthstatuswithfrequentrevalidation
*/
exportfunctionuseAuthStatus(){
const{data,error,isLoading,mutate}=useSWR<AuthStatus>(
"/api/auth/status",
cacheConfig.authStatus
);

return{
authStatus:data,
error,
isLoading,
refresh:()=>mutate(),
};
}

/**
*Hookforfetchinguserprofilewithcaching
*/
exportfunctionuseProfile(){
const{data,error,isLoading,mutate}=useSWR(
"/api/profile",
cacheConfig.profile
);

return{
profile:data,
error,
isLoading,
refresh:()=>mutate(),
};
}

/**
*Hookforfetchingtaskdetailwithcaching
*/
exportfunctionuseTaskDetail(taskId:string|null){
const{data,error,isLoading,mutate}=useSWR(
taskId?`/api/history/${taskId}`:null,
{
dedupingInterval:10000,
revalidateOnFocus:false,
}
);

//ConvertdatestringstoDateobjects
consttaskDetail=data
?{
...data,
createdAt:newDate(data.createdAt),
updatedAt:newDate(data.updatedAt),
workflowState:{
...data.workflowState,
startTime:data.workflowState.startTime
?newDate(data.workflowState.startTime)
:undefined,
endTime:data.workflowState.endTime
?newDate(data.workflowState.endTime)
:undefined,
steps:data.workflowState.steps.map((step:any)=>({
...step,
startTime:step.startTime?newDate(step.startTime):undefined,
endTime:step.endTime?newDate(step.endTime):undefined,
})),
},
}
:null;

return{
taskDetail,
error,
isLoading,
refresh:()=>mutate(),
};
}
