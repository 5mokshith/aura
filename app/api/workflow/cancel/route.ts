import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";

//***REMOVED***Import***REMOVED***the***REMOVED***workflow***REMOVED***store
//***REMOVED***Note:***REMOVED***In***REMOVED***production,***REMOVED***this***REMOVED***would***REMOVED***interact***REMOVED***with***REMOVED***a***REMOVED***database
const***REMOVED***cancelledWorkflows***REMOVED***=***REMOVED***new***REMOVED***Set<string>();

export***REMOVED***async***REMOVED***function***REMOVED***POST(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***startTime***REMOVED***=***REMOVED***Date.now();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***body***REMOVED***=***REMOVED***await***REMOVED***request.json();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***workflowId***REMOVED***}***REMOVED***=***REMOVED***body;

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Validate***REMOVED***input
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!workflowId***REMOVED***||***REMOVED***typeof***REMOVED***workflowId***REMOVED***!==***REMOVED***"string")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***message:***REMOVED***"Workflow***REMOVED***ID***REMOVED***is***REMOVED***required***REMOVED***and***REMOVED***must***REMOVED***be***REMOVED***a***REMOVED***string"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Mark***REMOVED***workflow***REMOVED***as***REMOVED***cancelled
***REMOVED******REMOVED******REMOVED******REMOVED***cancelledWorkflows.add(workflowId);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***In***REMOVED***production,***REMOVED***this***REMOVED***would:
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***1.***REMOVED***Send***REMOVED***cancellation***REMOVED***signal***REMOVED***to***REMOVED***backend***REMOVED***orchestrator
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***2.***REMOVED***Update***REMOVED***database***REMOVED***with***REMOVED***cancelled***REMOVED***status
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***3.***REMOVED***Stop***REMOVED***any***REMOVED***running***REMOVED***agents
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***4.***REMOVED***Preserve***REMOVED***partial***REMOVED***results

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***responseTime***REMOVED***=***REMOVED***Date.now()***REMOVED***-***REMOVED***startTime;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Log***REMOVED***if***REMOVED***response***REMOVED***time***REMOVED***exceeds***REMOVED***target
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(responseTime***REMOVED***>***REMOVED***200)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.warn(`Cancel***REMOVED***request***REMOVED***processing***REMOVED***took***REMOVED***${responseTime}ms***REMOVED***(target:***REMOVED***<200ms)`);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***"Workflow***REMOVED***cancellation***REMOVED***initiated",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***responseTime,
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***cancelling***REMOVED***workflow:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***"Internal***REMOVED***server***REMOVED***error",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***details:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}

//***REMOVED***Export***REMOVED***for***REMOVED***use***REMOVED***in***REMOVED***SSE***REMOVED***stream
export***REMOVED***{***REMOVED***cancelledWorkflows***REMOVED***};
