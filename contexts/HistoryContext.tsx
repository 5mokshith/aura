"useclient";

importReact,{createContext,useContext,useEffect,useState,useCallback}from"react";
importtype{TaskHistoryEntry,HistoryItem,HistoryStatus}from"@/types";

interfaceHistoryFilters{
dateFrom?:Date;
dateTo?:Date;
status?:HistoryStatus;
agentType?:string;
searchQuery?:string;
}

interfaceHistoryContextType{
items:HistoryItem[];
isLoading:boolean;
error:string|null;
hasMore:boolean;
filters:HistoryFilters;
setFilters:(filters:HistoryFilters)=>void;
loadMore:()=>Promise<void>;
refresh:()=>Promise<void>;
getTaskDetail:(taskId:string)=>Promise<TaskHistoryEntry|null>;
rerunTask:(taskId:string)=>Promise<void>;
}

constHistoryContext=createContext<HistoryContextType|undefined>(undefined);

constITEMS_PER_PAGE=20;

exportfunctionHistoryProvider({children}:{children:React.ReactNode}){
const[items,setItems]=useState<HistoryItem[]>([]);
const[isLoading,setIsLoading]=useState(false);
const[error,setError]=useState<string|null>(null);
const[hasMore,setHasMore]=useState(true);
const[page,setPage]=useState(1);
const[filters,setFiltersState]=useState<HistoryFilters>({});

constfetchHistory=useCallback(async(pageNum:number,currentFilters:HistoryFilters,append:boolean=false)=>{
try{
setIsLoading(true);
setError(null);

constparams=newURLSearchParams({
page:pageNum.toString(),
limit:ITEMS_PER_PAGE.toString(),
});

if(currentFilters.dateFrom){
params.append("dateFrom",currentFilters.dateFrom.toISOString());
}
if(currentFilters.dateTo){
params.append("dateTo",currentFilters.dateTo.toISOString());
}
if(currentFilters.status){
params.append("status",currentFilters.status);
}
if(currentFilters.agentType){
params.append("agentType",currentFilters.agentType);
}
if(currentFilters.searchQuery){
params.append("search",currentFilters.searchQuery);
}

constresponse=awaitfetch(`/api/history?${params.toString()}`);

if(!response.ok){
consterrorData=awaitresponse.json();
thrownewError(errorData.message||"Failedtofetchhistory");
}

constdata=awaitresponse.json();

//ConverttimestampstringstoDateobjects
consthistoryItems:HistoryItem[]=data.items.map((item:any)=>({
...item,
timestamp:newDate(item.timestamp),
}));

if(append){
setItems((prev)=>[...prev,...historyItems]);
}else{
setItems(historyItems);
}

setHasMore(data.hasMore);
}catch(err){
console.error("Errorfetchinghistory:",err);
setError(errinstanceofError?err.message:"Failedtofetchhistory");
}finally{
setIsLoading(false);
}
},[]);

constloadMore=useCallback(async()=>{
if(!hasMore||isLoading){
return;
}

constnextPage=page+1;
setPage(nextPage);
awaitfetchHistory(nextPage,filters,true);
},[hasMore,isLoading,page,filters,fetchHistory]);

constrefresh=useCallback(async()=>{
setPage(1);
setHasMore(true);
awaitfetchHistory(1,filters,false);
},[filters,fetchHistory]);

constsetFilters=useCallback((newFilters:HistoryFilters)=>{
setFiltersState(newFilters);
setPage(1);
setHasMore(true);
},[]);

constgetTaskDetail=useCallback(async(taskId:string):Promise<TaskHistoryEntry|null>=>{
try{
constresponse=awaitfetch(`/api/history/${taskId}`);

if(!response.ok){
consterrorData=awaitresponse.json();
thrownewError(errorData.message||"Failedtofetchtaskdetail");
}

constdata=awaitresponse.json();

//ConvertdatestringstoDateobjects
return{
...data,
createdAt:newDate(data.createdAt),
updatedAt:newDate(data.updatedAt),
workflowState:{
...data.workflowState,
startTime:data.workflowState.startTime?newDate(data.workflowState.startTime):undefined,
endTime:data.workflowState.endTime?newDate(data.workflowState.endTime):undefined,
steps:data.workflowState.steps.map((step:any)=>({
...step,
startTime:step.startTime?newDate(step.startTime):undefined,
endTime:step.endTime?newDate(step.endTime):undefined,
})),
},
};
}catch(err){
console.error("Errorfetchingtaskdetail:",err);
setError(errinstanceofError?err.message:"Failedtofetchtaskdetail");
returnnull;
}
},[]);

constrerunTask=useCallback(async(taskId:string)=>{
try{
constresponse=awaitfetch("/api/history/rerun",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({taskId}),
});

if(!response.ok){
consterrorData=awaitresponse.json();
thrownewError(errorData.message||"Failedtoreruntask");
}

//Optionallyrefreshhistoryafterrerun
awaitrefresh();
}catch(err){
console.error("Errorrerunningtask:",err);
setError(errinstanceofError?err.message:"Failedtoreruntask");
throwerr;
}
},[refresh]);

//Initialload
useEffect(()=>{
fetchHistory(1,filters,false);
},[filters,fetchHistory]);

constvalue:HistoryContextType={
items,
isLoading,
error,
hasMore,
filters,
setFilters,
loadMore,
refresh,
getTaskDetail,
rerunTask,
};

return<HistoryContext.Providervalue={value}>{children}</HistoryContext.Provider>;
}

exportfunctionuseHistory(){
constcontext=useContext(HistoryContext);
if(context===undefined){
thrownewError("useHistorymustbeusedwithinaHistoryProvider");
}
returncontext;
}
