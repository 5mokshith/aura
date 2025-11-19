import{NextRequest,NextResponse}from"next/server";
import{createClient,createServiceClient}from"@/lib/supabase/server";
import{getWorkflow}from"@/lib/supabase/queries";
import{cancelWorkflow}from"@/lib/services/workflowService";
import{sendWorkflowEvent}from"../stream/route";

exportasyncfunctionPOST(request:NextRequest){
conststartTime=Date.now();

try{
//Useanonclientforauthenticationcheck
constanonClient=awaitcreateClient();

//Verifyuserisauthenticated
const{data:{user},error:authError}=awaitanonClient.auth.getUser();

if(authError||!user){
returnNextResponse.json(
{error:"Unauthorized"},
{status:401}
);
}

//Parserequestbody
constbody=awaitrequest.json();
const{workflowId}=body;

if(!workflowId){
returnNextResponse.json(
{error:"WorkflowIDrequired"},
{status:400}
);
}

//Verifyworkflowbelongstouser(usesanonclientwithRLS)
constworkflow=awaitgetWorkflow(workflowId);

if(workflow.user_id!==user.id){
returnNextResponse.json(
{error:"Unauthorizedtocancelthisworkflow"},
{status:403}
);
}

//Createserviceroleclientfordatabasemutations
constserviceClient=createServiceClient();

//Canceltheworkflowusingserviceclient
awaitcancelWorkflow(workflowId,serviceClient);

//SendSSEevent
sendWorkflowEvent(workflowId,{
type:"workflow_complete",
data:{
status:"cancelled",
message:"Workflowcancelledbyuser",
},
});

constresponseTime=Date.now()-startTime;

//Logwarningifresponsetooktoolong(target:<200ms)
if(responseTime>200){
console.warn(`Cancelrequesttook${responseTime}ms(target:<200ms)`);
}

returnNextResponse.json({
success:true,
message:"Workflowcancelledsuccessfully",
responseTime,
});
}catch(error){
console.error("Errorcancellingworkflow:",error);
returnNextResponse.json(
{
error:"Failedtocancelworkflow",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
