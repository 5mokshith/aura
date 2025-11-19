/**
*WorkflowExecutorService
*Orchestratesworkflowexecutionbymanagingstepsequencing,agentrouting,andstatetransitions
*/

import{createServiceClient}from"@/lib/supabase/server";
import{getAgent}from"@/lib/agents/registry";
import{updateWorkflowStatus}from"./workflowService";
importtype{WorkflowStep}from"@/types";
importtype{ExecutionContext}from"@/lib/agents/base";

/**
*Executeacompleteworkflow
*@paramworkflowId-TheworkflowIDtoexecute
*@paramuserId-TheuserIDwhoownstheworkflow
*@paramaccessToken-GoogleOAuthaccesstokenforAPIauthentication
*/
exportasyncfunctionexecuteWorkflow(
workflowId:string,
userId:string,
accessToken:string
):Promise<void>{
constserviceClient=createServiceClient();

console.log(`[WorkflowExecutor]Startingworkflowexecution`,{
operation:"executeWorkflow",
workflowId,
userId,
timestamp:newDate().toISOString(),
});

try{
//Step1:Fetchworkflowfromdatabase
console.log(`[WorkflowExecutor]Fetchingworkflow`,{
operation:"executeWorkflow",
workflowId,
step:"fetch",
timestamp:newDate().toISOString(),
});

const{data:workflow,error:fetchError}=awaitserviceClient
.from("workflows")
.select("*")
.eq("id",workflowId)
.single();

if(fetchError||!workflow){
consterrorMessage=fetchError?.message||"Workflownotfound";
console.error(`[WorkflowExecutor]Failedtofetchworkflow`,{
operation:"executeWorkflow",
workflowId,
error:errorMessage,
timestamp:newDate().toISOString(),
});
thrownewError(errorMessage);
}

console.log(`[WorkflowExecutor]Workflowfetchedsuccessfully`,{
operation:"executeWorkflow",
workflowId,
status:workflow.status,
stepCount:(workflow.stepsasWorkflowStep[])?.length||0,
timestamp:newDate().toISOString(),
});

//Step2:Validateworkflowstatus
if(workflow.status!=="planning"){
console.warn(`[WorkflowExecutor]Workflownotinplanningstate`,{
operation:"executeWorkflow",
workflowId,
currentStatus:workflow.status,
expectedStatus:"planning",
timestamp:newDate().toISOString(),
});
}

//Step3:CheckOAuthtokenexpiration
console.log(`[WorkflowExecutor]ValidatingOAuthtoken`,{
operation:"executeWorkflow",
workflowId,
step:"token_validation",
timestamp:newDate().toISOString(),
});

//Fetchtokenexpirationfromdatabase
const{data:tokenData,error:tokenError}=awaitserviceClient
.from("oauth_tokens")
.select("expires_at")
.eq("user_id",userId)
.eq("provider","google")
.single();

if(tokenError||!tokenData){
consterrorMessage="OAuthtokennotfound.PleasereconnectyourGoogleaccount.";
console.error(`[WorkflowExecutor]OAuthtokennotfound`,{
operation:"executeWorkflow",
workflowId,
userId,
error:tokenError?.message,
timestamp:newDate().toISOString(),
});

awaitupdateWorkflowStatus(workflowId,"failed",serviceClient,{
error:errorMessage,
});
return;
}

//Checkiftokenisexpired
constexpiresAt=newDate(tokenData.expires_at);
constnow=newDate();
constisExpired=expiresAt.getTime()-now.getTime()<5*60*1000;//5minutebuffer

if(isExpired){
consterrorMessage="OAuthtokenhasexpired.PleasereconnectyourGoogleaccounttocontinue.";
console.error(`[WorkflowExecutor]OAuthtokenexpired`,{
operation:"executeWorkflow",
workflowId,
userId,
expiresAt:expiresAt.toISOString(),
now:now.toISOString(),
timestamp:newDate().toISOString(),
});

awaitupdateWorkflowStatus(workflowId,"failed",serviceClient,{
error:errorMessage,
});
return;
}

console.log(`[WorkflowExecutor]OAuthtokenvalidatedsuccessfully`,{
operation:"executeWorkflow",
workflowId,
expiresAt:expiresAt.toISOString(),
timeRemaining:Math.floor((expiresAt.getTime()-now.getTime())/1000/60)+"minutes",
timestamp:newDate().toISOString(),
});

//Step4:Transitionworkflowstatustoexecuting
console.log(`[WorkflowExecutor]Transitioningworkflowtoexecuting`,{
operation:"executeWorkflow",
workflowId,
step:"status_transition",
fromStatus:workflow.status,
toStatus:"executing",
timestamp:newDate().toISOString(),
});

awaitupdateWorkflowStatus(workflowId,"executing",serviceClient);

//Step5:Executestepssequentially
conststeps=workflow.stepsasWorkflowStep[];
constresults:any[]=[];

console.log(`[WorkflowExecutor]Beginningstepexecution`,{
operation:"executeWorkflow",
workflowId,
totalSteps:steps.length,
timestamp:newDate().toISOString(),
});

for(conststepofsteps){
console.log(`[WorkflowExecutor]Executingstep`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
stepOrder:step.order,
agentName:step.agentName,
action:step.action,
description:step.description,
timestamp:newDate().toISOString(),
});

//Updatestepstatustoexecuting
step.status="executing"asany;
awaitupdateWorkflowStatus(workflowId,"executing",serviceClient,{
steps,
});

console.log(`[WorkflowExecutor]Stepstatusupdatedtoexecuting`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
timestamp:newDate().toISOString(),
});

//Getagentforthisstep
constagent=getAgent(step.agentName);
if(!agent){
consterrorMessage=`Agentnotfound:${step.agentName}`;
console.error(`[WorkflowExecutor]Agentnotfound`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
agentName:step.agentName,
availableAgents:[],//CouldcalllistAgents()here
timestamp:newDate().toISOString(),
});

step.status="failed"asany;
awaitupdateWorkflowStatus(workflowId,"failed",serviceClient,{
steps,
error:errorMessage,
});
return;
}

console.log(`[WorkflowExecutor]Agentfound,preparingexecutioncontext`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
agentName:agent.name,
timestamp:newDate().toISOString(),
});

//Prepareexecutioncontext
constcontext:ExecutionContext={
userId,
workflowId,
stepId:step.id,
accessToken,
action:step.action,
parameters:(stepasany).parameters||{},
};

//Executestep
console.log(`[WorkflowExecutor]Callingagentexecutemethod`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
agentName:agent.name,
action:step.action,
hasParameters:Object.keys(context.parameters).length>0,
timestamp:newDate().toISOString(),
});

constresult=awaitagent.execute(context);

console.log(`[WorkflowExecutor]Agentexecutioncompleted`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
agentName:agent.name,
success:result.success,
hasOutput:!!result.output,
hasError:!!result.error,
timestamp:newDate().toISOString(),
});

if(!result.success){
//Stepfailed
consterrorMessage=`Step${step.id}failed:${result.error}`;
console.error(`[WorkflowExecutor]Stepexecutionfailed`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
agentName:agent.name,
action:step.action,
error:result.error,
timestamp:newDate().toISOString(),
});

step.status="failed"asany;
awaitupdateWorkflowStatus(workflowId,"failed",serviceClient,{
steps,
error:errorMessage,
});
return;
}

//Stepsucceeded
console.log(`[WorkflowExecutor]Stepcompletedsuccessfully`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
agentName:agent.name,
timestamp:newDate().toISOString(),
});

step.status="completed"asany;
results.push({
stepId:step.id,
output:result.output,
timestamp:newDate().toISOString(),
});

//Updateworkflowwithstepcompletionandresults
awaitupdateWorkflowStatus(workflowId,"executing",serviceClient,{
steps,
results,
});

console.log(`[WorkflowExecutor]Stepstatusandresultssaved`,{
operation:"executeWorkflow",
workflowId,
stepId:step.id,
completedSteps:results.length,
totalSteps:steps.length,
timestamp:newDate().toISOString(),
});
}

//Step6:Allstepscompletedsuccessfully
console.log(`[WorkflowExecutor]Allstepscompleted,finalizingworkflow`,{
operation:"executeWorkflow",
workflowId,
totalSteps:steps.length,
completedSteps:results.length,
timestamp:newDate().toISOString(),
});

awaitupdateWorkflowStatus(workflowId,"completed",serviceClient,{
steps,
results,
});

console.log(`[WorkflowExecutor]Workflowcompletedsuccessfully`,{
operation:"executeWorkflow",
workflowId,
stepCount:steps.length,
resultCount:results.length,
timestamp:newDate().toISOString(),
});
}catch(error){
//Catch-allerrorhandler
consterrorMessage=errorinstanceofError?error.message:"Unknownerror";
console.error(`[WorkflowExecutor]Workflowexecutionfailedwithunexpectederror`,{
operation:"executeWorkflow",
workflowId,
error:errorMessage,
errorStack:errorinstanceofError?error.stack:undefined,
timestamp:newDate().toISOString(),
});

awaitupdateWorkflowStatus(workflowId,"failed",serviceClient,{
error:errorMessage,
});
}
}
