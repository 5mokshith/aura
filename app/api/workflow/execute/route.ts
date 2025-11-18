import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***createClient,***REMOVED***createServiceClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";
import***REMOVED***{***REMOVED***createAndPlanWorkflow,***REMOVED***recordWorkflowHistory***REMOVED***}***REMOVED***from***REMOVED***"@/lib/services/workflowService";
import***REMOVED***{***REMOVED***executeWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/lib/services/workflowExecutor";

export***REMOVED***async***REMOVED***function***REMOVED***POST(request:***REMOVED***NextRequest)***REMOVED***{
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
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***command***REMOVED***}***REMOVED***=***REMOVED***body;

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!command***REMOVED***||***REMOVED***typeof***REMOVED***command***REMOVED***!==***REMOVED***"string"***REMOVED***||***REMOVED***command.trim().length***REMOVED***<***REMOVED***10)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Command***REMOVED***must***REMOVED***be***REMOVED***at***REMOVED***least***REMOVED***10***REMOVED***characters"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Check***REMOVED***if***REMOVED***user***REMOVED***has***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***using***REMOVED***the***REMOVED***SECURITY***REMOVED***DEFINER***REMOVED***function
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***tokenData,***REMOVED***error:***REMOVED***tokenError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***anonClient
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.rpc("get_google_oauth_token",***REMOVED***{***REMOVED***p_user_id:***REMOVED***user.id***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(tokenError)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***fetching***REMOVED***OAuth***REMOVED***tokens:",***REMOVED***tokenError);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***verify***REMOVED***Google***REMOVED***account***REMOVED***connection."***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!tokenData***REMOVED***||***REMOVED***tokenData.length***REMOVED***===***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Google***REMOVED***account***REMOVED***not***REMOVED***connected.***REMOVED***Please***REMOVED***connect***REMOVED***your***REMOVED***Google***REMOVED***account***REMOVED***first."***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***403***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***tokens***REMOVED***=***REMOVED***tokenData[0];

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Check***REMOVED***if***REMOVED***token***REMOVED***is***REMOVED***expired
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(tokens.is_expired)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Google***REMOVED***OAuth***REMOVED***token***REMOVED***expired.***REMOVED***Please***REMOVED***reconnect***REMOVED***your***REMOVED***account."***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***403***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***service***REMOVED***role***REMOVED***client***REMOVED***for***REMOVED***database***REMOVED***mutations
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***serviceClient***REMOVED***=***REMOVED***createServiceClient();

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***and***REMOVED***plan***REMOVED***workflow***REMOVED***using***REMOVED***service***REMOVED***client
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***workflowId,***REMOVED***steps***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***createAndPlanWorkflow(user.id,***REMOVED***command,***REMOVED***serviceClient);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Record***REMOVED***in***REMOVED***history***REMOVED***using***REMOVED***service***REMOVED***client
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***recordWorkflowHistory(user.id,***REMOVED***workflowId,***REMOVED***command,***REMOVED***"planning",***REMOVED***serviceClient);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Trigger***REMOVED***workflow***REMOVED***execution***REMOVED***asynchronously***REMOVED***(don't***REMOVED***await)
***REMOVED******REMOVED******REMOVED******REMOVED***executeWorkflow(workflowId,***REMOVED***user.id,***REMOVED***tokens.access_token).catch((error)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("[Workflow***REMOVED***API]***REMOVED***Background***REMOVED***workflow***REMOVED***execution***REMOVED***failed",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***userId:***REMOVED***user.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***errorStack:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.stack***REMOVED***:***REMOVED***undefined,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***"Workflow***REMOVED***created***REMOVED***and***REMOVED***execution***REMOVED***started",
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***executing***REMOVED***workflow:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***execute***REMOVED***workflow",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}
