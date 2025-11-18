import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

export***REMOVED***async***REMOVED***function***REMOVED***GET(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Get***REMOVED***authenticated***REMOVED***user
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***authError,
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(authError***REMOVED***||***REMOVED***!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Get***REMOVED***query***REMOVED***parameters
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***searchParams***REMOVED***}***REMOVED***=***REMOVED***new***REMOVED***URL(request.url);
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***limit***REMOVED***=***REMOVED***parseInt(searchParams.get("limit")***REMOVED***||***REMOVED***"10");
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***status***REMOVED***=***REMOVED***searchParams.get("status");

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Build***REMOVED***query
***REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***query***REMOVED***=***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***user.id)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.order("created_at",***REMOVED***{***REMOVED***ascending:***REMOVED***false***REMOVED***})
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.limit(limit);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Add***REMOVED***status***REMOVED***filter***REMOVED***if***REMOVED***provided
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(status)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***query***REMOVED***=***REMOVED***query.eq("status",***REMOVED***status);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***workflows,***REMOVED***error:***REMOVED***workflowsError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***query;

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(workflowsError)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***fetch***REMOVED***workflows"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***workflows***REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***fetching***REMOVED***workflows:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Internal***REMOVED***server***REMOVED***error"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}

export***REMOVED***async***REMOVED***function***REMOVED***POST(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Get***REMOVED***authenticated***REMOVED***user
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***authError,
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(authError***REMOVED***||***REMOVED***!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Parse***REMOVED***request***REMOVED***body
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***body***REMOVED***=***REMOVED***await***REMOVED***request.json();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***command,***REMOVED***steps***REMOVED***=***REMOVED***[]***REMOVED***}***REMOVED***=***REMOVED***body;

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!command)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Command***REMOVED***is***REMOVED***required"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***workflow
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***workflow,***REMOVED***error:***REMOVED***createError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.insert({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***user_id:***REMOVED***user.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***command,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"planning",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results:***REMOVED***[],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***})
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(createError)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***create***REMOVED***workflow"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Add***REMOVED***to***REMOVED***history
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***supabase.from("workflow_history").insert({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***user_id:***REMOVED***user.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflow_id:***REMOVED***workflow.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***command,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"planning",
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***workflow***REMOVED***},***REMOVED***{***REMOVED***status:***REMOVED***201***REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***creating***REMOVED***workflow:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Internal***REMOVED***server***REMOVED***error"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}
