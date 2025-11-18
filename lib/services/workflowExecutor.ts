/**
***REMOVED*******REMOVED***Workflow***REMOVED***Executor***REMOVED***Service
***REMOVED*******REMOVED***Orchestrates***REMOVED***workflow***REMOVED***execution***REMOVED***by***REMOVED***managing***REMOVED***step***REMOVED***sequencing,***REMOVED***agent***REMOVED***routing,***REMOVED***and***REMOVED***state***REMOVED***transitions
***REMOVED****/

import***REMOVED***{***REMOVED***createServiceClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";
import***REMOVED***{***REMOVED***getAgent***REMOVED***}***REMOVED***from***REMOVED***"@/lib/agents/registry";
import***REMOVED***{***REMOVED***updateWorkflowStatus***REMOVED***}***REMOVED***from***REMOVED***"./workflowService";
import***REMOVED***type***REMOVED***{***REMOVED***WorkflowStep***REMOVED***}***REMOVED***from***REMOVED***"@/types";
import***REMOVED***type***REMOVED***{***REMOVED***ExecutionContext***REMOVED***}***REMOVED***from***REMOVED***"@/lib/agents/base";

/**
***REMOVED*******REMOVED***Execute***REMOVED***a***REMOVED***complete***REMOVED***workflow
***REMOVED*******REMOVED***@param***REMOVED***workflowId***REMOVED***-***REMOVED***The***REMOVED***workflow***REMOVED***ID***REMOVED***to***REMOVED***execute
***REMOVED*******REMOVED***@param***REMOVED***userId***REMOVED***-***REMOVED***The***REMOVED***user***REMOVED***ID***REMOVED***who***REMOVED***owns***REMOVED***the***REMOVED***workflow
***REMOVED*******REMOVED***@param***REMOVED***accessToken***REMOVED***-***REMOVED***Google***REMOVED***OAuth***REMOVED***access***REMOVED***token***REMOVED***for***REMOVED***API***REMOVED***authentication
***REMOVED****/
export***REMOVED***async***REMOVED***function***REMOVED***executeWorkflow(
***REMOVED******REMOVED***workflowId:***REMOVED***string,
***REMOVED******REMOVED***userId:***REMOVED***string,
***REMOVED******REMOVED***accessToken:***REMOVED***string
):***REMOVED***Promise<void>***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***serviceClient***REMOVED***=***REMOVED***createServiceClient();

***REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Starting***REMOVED***workflow***REMOVED***execution`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED***});

***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***1:***REMOVED***Fetch***REMOVED***workflow***REMOVED***from***REMOVED***database
***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Fetching***REMOVED***workflow`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step:***REMOVED***"fetch",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***workflow,***REMOVED***error:***REMOVED***fetchError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***serviceClient
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***workflowId)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(fetchError***REMOVED***||***REMOVED***!workflow)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorMessage***REMOVED***=***REMOVED***fetchError?.message***REMOVED***||***REMOVED***"Workflow***REMOVED***not***REMOVED***found";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***Failed***REMOVED***to***REMOVED***fetch***REMOVED***workflow`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(errorMessage);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Workflow***REMOVED***fetched***REMOVED***successfully`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***workflow.status,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepCount:***REMOVED***(workflow.steps***REMOVED***as***REMOVED***WorkflowStep[])?.length***REMOVED***||***REMOVED***0,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***2:***REMOVED***Validate***REMOVED***workflow***REMOVED***status
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(workflow.status***REMOVED***!==***REMOVED***"planning")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.warn(`[Workflow***REMOVED***Executor]***REMOVED***Workflow***REMOVED***not***REMOVED***in***REMOVED***planning***REMOVED***state`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***currentStatus:***REMOVED***workflow.status,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expectedStatus:***REMOVED***"planning",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***3:***REMOVED***Check***REMOVED***OAuth***REMOVED***token***REMOVED***expiration
***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Validating***REMOVED***OAuth***REMOVED***token`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step:***REMOVED***"token_validation",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Fetch***REMOVED***token***REMOVED***expiration***REMOVED***from***REMOVED***database
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***tokenData,***REMOVED***error:***REMOVED***tokenError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***serviceClient
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from("oauth_tokens")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.select("expires_at")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.eq("provider",***REMOVED***"google")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(tokenError***REMOVED***||***REMOVED***!tokenData)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorMessage***REMOVED***=***REMOVED***"OAuth***REMOVED***token***REMOVED***not***REMOVED***found.***REMOVED***Please***REMOVED***reconnect***REMOVED***your***REMOVED***Google***REMOVED***account.";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***OAuth***REMOVED***token***REMOVED***not***REMOVED***found`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***tokenError?.message,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"failed",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Check***REMOVED***if***REMOVED***token***REMOVED***is***REMOVED***expired
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***expiresAt***REMOVED***=***REMOVED***new***REMOVED***Date(tokenData.expires_at);
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***now***REMOVED***=***REMOVED***new***REMOVED***Date();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***isExpired***REMOVED***=***REMOVED***expiresAt.getTime()***REMOVED***-***REMOVED***now.getTime()***REMOVED***<***REMOVED***5***REMOVED*******REMOVED***60***REMOVED*******REMOVED***1000;***REMOVED***//***REMOVED***5***REMOVED***minute***REMOVED***buffer

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(isExpired)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorMessage***REMOVED***=***REMOVED***"OAuth***REMOVED***token***REMOVED***has***REMOVED***expired.***REMOVED***Please***REMOVED***reconnect***REMOVED***your***REMOVED***Google***REMOVED***account***REMOVED***to***REMOVED***continue.";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***OAuth***REMOVED***token***REMOVED***expired`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expiresAt:***REMOVED***expiresAt.toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***now:***REMOVED***now.toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"failed",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***OAuth***REMOVED***token***REMOVED***validated***REMOVED***successfully`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expiresAt:***REMOVED***expiresAt.toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timeRemaining:***REMOVED***Math.floor((expiresAt.getTime()***REMOVED***-***REMOVED***now.getTime())***REMOVED***/***REMOVED***1000***REMOVED***/***REMOVED***60)***REMOVED***+***REMOVED***"***REMOVED***minutes",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***4:***REMOVED***Transition***REMOVED***workflow***REMOVED***status***REMOVED***to***REMOVED***executing
***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Transitioning***REMOVED***workflow***REMOVED***to***REMOVED***executing`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step:***REMOVED***"status_transition",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***fromStatus:***REMOVED***workflow.status,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***toStatus:***REMOVED***"executing",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"executing",***REMOVED***serviceClient);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***5:***REMOVED***Execute***REMOVED***steps***REMOVED***sequentially
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***steps***REMOVED***=***REMOVED***workflow.steps***REMOVED***as***REMOVED***WorkflowStep[];
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***results:***REMOVED***any[]***REMOVED***=***REMOVED***[];

***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Beginning***REMOVED***step***REMOVED***execution`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***totalSteps:***REMOVED***steps.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***for***REMOVED***(const***REMOVED***step***REMOVED***of***REMOVED***steps)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Executing***REMOVED***step`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepOrder:***REMOVED***step.order,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***step.agentName,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***step.action,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***description:***REMOVED***step.description,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Update***REMOVED***step***REMOVED***status***REMOVED***to***REMOVED***executing
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***"executing"***REMOVED***as***REMOVED***any;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"executing",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Step***REMOVED***status***REMOVED***updated***REMOVED***to***REMOVED***executing`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Get***REMOVED***agent***REMOVED***for***REMOVED***this***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***agent***REMOVED***=***REMOVED***getAgent(step.agentName);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!agent)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorMessage***REMOVED***=***REMOVED***`Agent***REMOVED***not***REMOVED***found:***REMOVED***${step.agentName}`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***Agent***REMOVED***not***REMOVED***found`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***step.agentName,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***availableAgents:***REMOVED***[],***REMOVED***//***REMOVED***Could***REMOVED***call***REMOVED***listAgents()***REMOVED***here
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***"failed"***REMOVED***as***REMOVED***any;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"failed",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Agent***REMOVED***found,***REMOVED***preparing***REMOVED***execution***REMOVED***context`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***agent.name,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Prepare***REMOVED***execution***REMOVED***context
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***context:***REMOVED***ExecutionContext***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***accessToken,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***step.action,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***parameters:***REMOVED***(step***REMOVED***as***REMOVED***any).parameters***REMOVED***||***REMOVED***{},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Execute***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Calling***REMOVED***agent***REMOVED***execute***REMOVED***method`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***agent.name,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***step.action,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasParameters:***REMOVED***Object.keys(context.parameters).length***REMOVED***>***REMOVED***0,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***agent.execute(context);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Agent***REMOVED***execution***REMOVED***completed`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***agent.name,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***result.success,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasOutput:***REMOVED***!!result.output,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasError:***REMOVED***!!result.error,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!result.success)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***failed
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorMessage***REMOVED***=***REMOVED***`Step***REMOVED***${step.id}***REMOVED***failed:***REMOVED***${result.error}`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***Step***REMOVED***execution***REMOVED***failed`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***agent.name,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***step.action,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***result.error,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***"failed"***REMOVED***as***REMOVED***any;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"failed",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***succeeded
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Step***REMOVED***completed***REMOVED***successfully`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***agent.name,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***"completed"***REMOVED***as***REMOVED***any;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results.push({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***result.output,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Update***REMOVED***workflow***REMOVED***with***REMOVED***step***REMOVED***completion***REMOVED***and***REMOVED***results
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"executing",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Step***REMOVED***status***REMOVED***and***REMOVED***results***REMOVED***saved`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***completedSteps:***REMOVED***results.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***totalSteps:***REMOVED***steps.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***6:***REMOVED***All***REMOVED***steps***REMOVED***completed***REMOVED***successfully
***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***All***REMOVED***steps***REMOVED***completed,***REMOVED***finalizing***REMOVED***workflow`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***totalSteps:***REMOVED***steps.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***completedSteps:***REMOVED***results.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"completed",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results,
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Workflow***REMOVED***completed***REMOVED***successfully`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepCount:***REMOVED***steps.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***resultCount:***REMOVED***results.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Catch-all***REMOVED***error***REMOVED***handler
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorMessage***REMOVED***=***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error";
***REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***Workflow***REMOVED***execution***REMOVED***failed***REMOVED***with***REMOVED***unexpected***REMOVED***error`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***operation:***REMOVED***"executeWorkflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***errorStack:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.stack***REMOVED***:***REMOVED***undefined,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***"failed",***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}
}
