import{NextRequest,NextResponse}from"next/server";
import{createClient,createServiceClient}from"@/lib/supabase/server";
import{createAndPlanWorkflow,recordWorkflowHistory}from"@/lib/services/workflowService";
import{executeWorkflow}from"@/lib/services/workflowExecutor";

exportasyncfunctionPOST(request:NextRequest){
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
const{command}=body;

if(!command||typeofcommand!=="string"||command.trim().length<10){
returnNextResponse.json(
{error:"Commandmustbeatleast10characters"},
{status:400}
);
}

//CheckifuserhasGoogleOAuthtokensusingtheSECURITYDEFINERfunction
const{data:tokenData,error:tokenError}=awaitanonClient
.rpc("get_google_oauth_token",{p_user_id:user.id});

if(tokenError){
console.error("ErrorfetchingOAuthtokens:",tokenError);
returnNextResponse.json(
{error:"FailedtoverifyGoogleaccountconnection."},
{status:500}
);
}

if(!tokenData||tokenData.length===0){
returnNextResponse.json(
{error:"Googleaccountnotconnected.PleaseconnectyourGoogleaccountfirst."},
{status:403}
);
}

consttokens=tokenData[0];

//Checkiftokenisexpired
if(tokens.is_expired){
returnNextResponse.json(
{error:"GoogleOAuthtokenexpired.Pleasereconnectyouraccount."},
{status:403}
);
}

//Createserviceroleclientfordatabasemutations
constserviceClient=createServiceClient();

//Createandplanworkflowusingserviceclient
const{workflowId,steps}=awaitcreateAndPlanWorkflow(user.id,command,serviceClient);

//Recordinhistoryusingserviceclient
awaitrecordWorkflowHistory(user.id,workflowId,command,"planning",serviceClient);

//Triggerworkflowexecutionasynchronously(don'tawait)
executeWorkflow(workflowId,user.id,tokens.access_token).catch((error)=>{
console.error("[WorkflowAPI]Backgroundworkflowexecutionfailed",{
workflowId,
userId:user.id,
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
timestamp:newDate().toISOString(),
});
});

returnNextResponse.json({
success:true,
workflowId,
steps,
message:"Workflowcreatedandexecutionstarted",
});
}catch(error){
console.error("Errorexecutingworkflow:",error);
returnNextResponse.json(
{
error:"Failedtoexecuteworkflow",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
