import{NextRequest,NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";
import{getWorkflow,getGoogleOAuthTokens}from"@/lib/supabase/queries";
import{createAndPlanWorkflow,recordWorkflowHistory}from"@/lib/services/workflowService";

exportasyncfunctionPOST(request:NextRequest){
try{
constsupabase=awaitcreateClient();

//Verifyuserisauthenticated
const{data:{user},error:authError}=awaitsupabase.auth.getUser();

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

//Getoriginalworkflow
constoriginalWorkflow=awaitgetWorkflow(workflowId);

//Verifyworkflowbelongstouser
if(originalWorkflow.user_id!==user.id){
returnNextResponse.json(
{error:"Unauthorizedtorerunthisworkflow"},
{status:403}
);
}

//CheckifuserhasGoogleOAuthtokens
consttokens=awaitgetGoogleOAuthTokens(user.id);

if(!tokens){
returnNextResponse.json(
{error:"Googleaccountnotconnected.PleaseconnectyourGoogleaccountfirst."},
{status:403}
);
}

//Createnewworkflowwithsamecommand
const{workflowId:newWorkflowId,steps}=awaitcreateAndPlanWorkflow(
user.id,
originalWorkflow.command
);

//Recordinhistory
awaitrecordWorkflowHistory(user.id,newWorkflowId,originalWorkflow.command,"planning");

returnNextResponse.json({
success:true,
workflowId:newWorkflowId,
steps,
message:"Workflowreruninitiatedsuccessfully",
});
}catch(error){
console.error("Errorrerunningworkflow:",error);
returnNextResponse.json(
{
error:"Failedtorerunworkflow",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
