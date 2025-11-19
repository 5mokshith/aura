"useclient";

importReact,{createContext,useContext,useEffect,useState,useCallback,useRef}from"react";
importtype{WorkflowState,WorkflowStep,WorkflowResult,SSEEvent}from"@/types";

interfaceWorkflowContextType{
workflow:WorkflowState|null;
isExecuting:boolean;
error:string|null;
executeWorkflow:(command:string)=>Promise<void>;
cancelWorkflow:()=>Promise<void>;
resetWorkflow:()=>void;
}

constWorkflowContext=createContext<WorkflowContextType|undefined>(undefined);

exportfunctionWorkflowProvider({children}:{children:React.ReactNode}){
const[workflow,setWorkflow]=useState<WorkflowState|null>(null);
const[isExecuting,setIsExecuting]=useState(false);
const[error,setError]=useState<string|null>(null);
consteventSourceRef=useRef<EventSource|null>(null);
constreconnectTimeoutRef=useRef<NodeJS.Timeout|null>(null);
constreconnectAttemptsRef=useRef(0);
constmaxReconnectAttempts=5;

constcloseEventSource=useCallback(()=>{
if(eventSourceRef.current){
eventSourceRef.current.close();
eventSourceRef.current=null;
}
if(reconnectTimeoutRef.current){
clearTimeout(reconnectTimeoutRef.current);
reconnectTimeoutRef.current=null;
}
},[]);

constconnectSSE=useCallback((workflowId:string)=>{
closeEventSource();

consteventSource=newEventSource(`/api/workflow/stream?workflowId=${workflowId}`);
eventSourceRef.current=eventSource;

eventSource.onopen=()=>{
console.log("SSEconnectionestablished");
reconnectAttemptsRef.current=0;
};

eventSource.addEventListener("step_start",(event)=>{
try{
constdata:SSEEvent=JSON.parse(event.data);
setWorkflow((prev)=>{
if(!prev)returnprev;

constupdatedSteps=prev.steps.map((step)=>
step.id===data.stepId
?{...step,...data.data,status:"running"asconst}
:step
);

return{
...prev,
steps:updatedSteps,
status:"executing",
};
});
}catch(err){
console.error("Errorparsingstep_startevent:",err);
}
});

eventSource.addEventListener("step_complete",(event)=>{
try{
constdata:SSEEvent=JSON.parse(event.data);
setWorkflow((prev)=>{
if(!prev)returnprev;

constupdatedSteps=prev.steps.map((step)=>
step.id===data.stepId
?{...step,...data.data,status:"completed"asconst}
:step
);

return{
...prev,
steps:updatedSteps,
};
});
}catch(err){
console.error("Errorparsingstep_completeevent:",err);
}
});

eventSource.addEventListener("step_error",(event)=>{
try{
constdata:SSEEvent=JSON.parse(event.data);
setWorkflow((prev)=>{
if(!prev)returnprev;

constupdatedSteps=prev.steps.map((step)=>
step.id===data.stepId
?{...step,...data.data,status:"failed"asconst}
:step
);

return{
...prev,
steps:updatedSteps,
status:"failed",
error:data.data.error,
};
});
setError(data.data.error||"Stepexecutionfailed");
}catch(err){
console.error("Errorparsingstep_errorevent:",err);
}
});

eventSource.addEventListener("workflow_complete",(event)=>{
try{
constdata=JSON.parse(event.data);
setWorkflow((prev)=>{
if(!prev)returnprev;

return{
...prev,
status:"completed",
results:data.results||[],
endTime:newDate(),
};
});
setIsExecuting(false);
closeEventSource();
}catch(err){
console.error("Errorparsingworkflow_completeevent:",err);
}
});

eventSource.onerror=(event)=>{
console.error("SSEconnectionerror:",event);

//Auto-reconnectlogic
if(reconnectAttemptsRef.current<maxReconnectAttempts){
reconnectAttemptsRef.current+=1;
constdelay=Math.min(1000*Math.pow(2,reconnectAttemptsRef.current-1),10000);

console.log(`Attemptingtoreconnectin${delay}ms(attempt${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

reconnectTimeoutRef.current=setTimeout(()=>{
if(workflow?.id&&isExecuting){
connectSSE(workflow.id);
}
},delay);
}else{
console.error("Maxreconnectionattemptsreached");
setError("Connectionlost.Pleaserefreshthepage.");
setIsExecuting(false);
closeEventSource();
}
};
},[closeEventSource,workflow?.id,isExecuting]);

constexecuteWorkflow=useCallback(async(command:string)=>{
try{
setError(null);
setIsExecuting(true);

constresponse=awaitfetch("/api/workflow/execute",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({command}),
});

if(!response.ok){
consterrorData=awaitresponse.json();
thrownewError(errorData.message||"Failedtoexecuteworkflow");
}

constdata=awaitresponse.json();

constinitialWorkflow:WorkflowState={
id:data.workflowId,
status:"planning",
command,
steps:data.steps||[],
results:[],
startTime:newDate(),
};

setWorkflow(initialWorkflow);

//ConnecttoSSEstreamforreal-timeupdates
connectSSE(data.workflowId);
}catch(err){
console.error("Errorexecutingworkflow:",err);
setError(errinstanceofError?err.message:"Failedtoexecuteworkflow");
setIsExecuting(false);
setWorkflow((prev)=>prev?{...prev,status:"failed",error:errinstanceofError?err.message:"Unknownerror"}:null);
}
},[connectSSE]);

constcancelWorkflow=useCallback(async()=>{
if(!workflow?.id){
return;
}

try{
conststartTime=Date.now();

constresponse=awaitfetch("/api/workflow/cancel",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({workflowId:workflow.id}),
});

constresponseTime=Date.now()-startTime;

if(responseTime>200){
console.warn(`Cancelrequesttook${responseTime}ms(target:<200ms)`);
}

if(!response.ok){
consterrorData=awaitresponse.json();
thrownewError(errorData.message||"Failedtocancelworkflow");
}

//Updateworkflowstatetocancelled
setWorkflow((prev)=>{
if(!prev)returnprev;

constupdatedSteps=prev.steps.map((step)=>
step.status==="running"||step.status==="pending"
?{...step,status:"cancelled"asconst}
:step
);

return{
...prev,
status:"cancelled",
steps:updatedSteps,
endTime:newDate(),
};
});

setIsExecuting(false);
closeEventSource();

//EnsureUIupdateswithin1second
setTimeout(()=>{
if(workflow?.status!=="cancelled"){
console.warn("UIdidnotupdatetocancelledstatewithin1second");
}
},1000);
}catch(err){
console.error("Errorcancellingworkflow:",err);
setError(errinstanceofError?err.message:"Failedtocancelworkflow");
}
},[workflow?.id,closeEventSource]);

constresetWorkflow=useCallback(()=>{
closeEventSource();
setWorkflow(null);
setIsExecuting(false);
setError(null);
reconnectAttemptsRef.current=0;
},[closeEventSource]);

//Cleanuponunmount
useEffect(()=>{
return()=>{
closeEventSource();
};
},[closeEventSource]);

constvalue:WorkflowContextType={
workflow,
isExecuting,
error,
executeWorkflow,
cancelWorkflow,
resetWorkflow,
};

return<WorkflowContext.Providervalue={value}>{children}</WorkflowContext.Provider>;
}

exportfunctionuseWorkflow(){
constcontext=useContext(WorkflowContext);
if(context===undefined){
thrownewError("useWorkflowmustbeusedwithinaWorkflowProvider");
}
returncontext;
}
