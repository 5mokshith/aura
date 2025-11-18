import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***createClient,***REMOVED***createServiceClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";
import***REMOVED***{***REMOVED***getWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";
import***REMOVED***{***REMOVED***cancelWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/lib/services/workflowService";
import***REMOVED***{***REMOVED***sendWorkflowEvent***REMOVED***}***REMOVED***from***REMOVED***"../stream/route";

export***REMOVED***async***REMOVED***function***REMOVED***POST(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***startTime***REMOVED***=***REMOVED***Date.now();
***REMOVED******REMOVED***
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Use***REMOVED***anon***REMOVED***client***REMOVED***for***REMOVED***authentication***REMOVED***check
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***anonClient***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Verify***REMOVED***user***REMOVED***is***REMOVED***authenticated
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},***REMOVED***error:***REMOVED***authError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***anonClient.auth.getUser();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(authError***REMOVED***||***REMOVED***!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Parse***REMOVED***request***REMOVED***body
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***body***REMOVED***=***REMOVED***await***REMOVED***request.json();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***workflowId***REMOVED***}***REMOVED***=***REMOVED***body;

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!workflowId)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Workflow***REMOVED***ID***REMOVED***required"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Verify***REMOVED***workflow***REMOVED***belongs***REMOVED***to***REMOVED***user***REMOVED***(uses***REMOVED***anon***REMOVED***client***REMOVED***with***REMOVED***RLS)
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***workflow***REMOVED***=***REMOVED***await***REMOVED***getWorkflow(workflowId);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(workflow.user_id***REMOVED***!==***REMOVED***user.id)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Unauthorized***REMOVED***to***REMOVED***cancel***REMOVED***this***REMOVED***workflow"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***403***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***service***REMOVED***role***REMOVED***client***REMOVED***for***REMOVED***database***REMOVED***mutations
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***serviceClient***REMOVED***=***REMOVED***createServiceClient();

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Cancel***REMOVED***the***REMOVED***workflow***REMOVED***using***REMOVED***service***REMOVED***client
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***cancelWorkflow(workflowId,***REMOVED***serviceClient);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Send***REMOVED***SSE***REMOVED***event
***REMOVED******REMOVED******REMOVED******REMOVED***sendWorkflowEvent(workflowId,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"workflow_complete",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"cancelled",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***"Workflow***REMOVED***cancelled***REMOVED***by***REMOVED***user",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***responseTime***REMOVED***=***REMOVED***Date.now()***REMOVED***-***REMOVED***startTime;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Log***REMOVED***warning***REMOVED***if***REMOVED***response***REMOVED***took***REMOVED***too***REMOVED***long***REMOVED***(target:***REMOVED***<200ms)
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(responseTime***REMOVED***>***REMOVED***200)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.warn(`Cancel***REMOVED***request***REMOVED***took***REMOVED***${responseTime}ms***REMOVED***(target:***REMOVED***<200ms)`);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***"Workflow***REMOVED***cancelled***REMOVED***successfully",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***responseTime,
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***cancelling***REMOVED***workflow:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***cancel***REMOVED***workflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}
