import{NextRequest}from"next/server";
import{createClient}from"@/lib/supabase/server";

//Storeactiveworkflowstreams
constactiveStreams=newMap<string,ReadableStreamDefaultController>();

exportasyncfunctionGET(request:NextRequest){
try{
constsupabase=awaitcreateClient();

//Verifyuserisauthenticated
const{data:{user},error:authError}=awaitsupabase.auth.getUser();

if(authError||!user){
returnnewResponse("Unauthorized",{status:401});
}

constsearchParams=request.nextUrl.searchParams;
constworkflowId=searchParams.get("workflowId");

if(!workflowId){
returnnewResponse("WorkflowIDrequired",{status:400});
}

//CreateSSEstream
conststream=newReadableStream({
start(controller){
//Storecontrollerforthisworkflow
activeStreams.set(workflowId,controller);

//Sendinitialconnectionmessage
constencoder=newTextEncoder();
controller.enqueue(
encoder.encode(`data:${JSON.stringify({type:"connected",workflowId})}\n\n`)
);

//Setupheartbeattokeepconnectionalive
constheartbeat=setInterval(()=>{
try{
controller.enqueue(encoder.encode(`:heartbeat\n\n`));
}catch(error){
clearInterval(heartbeat);
}
},30000);//Every30seconds

//Cleanuponclose
request.signal.addEventListener("abort",()=>{
clearInterval(heartbeat);
activeStreams.delete(workflowId);
try{
controller.close();
}catch(error){
//Controlleralreadyclosed
}
});
},
cancel(){
activeStreams.delete(workflowId);
},
});

returnnewResponse(stream,{
headers:{
"Content-Type":"text/event-stream",
"Cache-Control":"no-cache",
"Connection":"keep-alive",
},
});
}catch(error){
console.error("ErrorcreatingSSEstream:",error);
returnnewResponse("Internalservererror",{status:500});
}
}

/**
*Sendaneventtoaspecificworkflowstream
*/
exportfunctionsendWorkflowEvent(
workflowId:string,
event:{
type:"step_start"|"step_complete"|"step_error"|"workflow_complete";
stepId?:string;
data:any;
}
){
constcontroller=activeStreams.get(workflowId);

if(controller){
try{
constencoder=newTextEncoder();
consteventData=JSON.stringify(event);
controller.enqueue(encoder.encode(`event:${event.type}\ndata:${eventData}\n\n`));
}catch(error){
console.error("Errorsendingworkflowevent:",error);
activeStreams.delete(workflowId);
}
}
}

//Exportforuseinothermodules
export{activeStreams};
