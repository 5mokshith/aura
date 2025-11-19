import{NextRequest,NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";
import{getWorkflow,updateWorkflow}from"@/lib/supabase/queries";

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
const{workflowId,resultId,rating,comment}=body;

if(!workflowId||!resultId||!rating){
returnNextResponse.json(
{error:"WorkflowID,resultID,andratingarerequired"},
{status:400}
);
}

if(!["positive","negative"].includes(rating)){
returnNextResponse.json(
{error:"Ratingmustbe'positive'or'negative'"},
{status:400}
);
}

//Getworkflow
constworkflow=awaitgetWorkflow(workflowId);

//Verifyworkflowbelongstouser
if(workflow.user_id!==user.id){
returnNextResponse.json(
{error:"Unauthorizedtoprovidefeedbackforthisworkflow"},
{status:403}
);
}

//Updateresultswithfeedback
constresults=workflow.resultsasany[]||[];
constupdatedResults=results.map((result:any)=>{
if(result.id===resultId){
return{
...result,
feedback:{
rating,
comment:comment||null,
timestamp:newDate().toISOString(),
},
};
}
returnresult;
});

//Updateworkflow
awaitupdateWorkflow(workflowId,{
results:updatedResults,
});

returnNextResponse.json({
success:true,
message:"Feedbackrecordedsuccessfully",
});
}catch(error){
console.error("Errorrecordingfeedback:",error);
returnNextResponse.json(
{
error:"Failedtorecordfeedback",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
