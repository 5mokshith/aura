import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";
import***REMOVED***{***REMOVED***getUserWorkflowHistory***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/queries";

export***REMOVED***async***REMOVED***function***REMOVED***GET(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Verify***REMOVED***user***REMOVED***is***REMOVED***authenticated
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},***REMOVED***error:***REMOVED***authError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(authError***REMOVED***||***REMOVED***!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Unauthorized"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Parse***REMOVED***query***REMOVED***parameters
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***searchParams***REMOVED***=***REMOVED***request.nextUrl.searchParams;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***limit***REMOVED***=***REMOVED***parseInt(searchParams.get("limit")***REMOVED***||***REMOVED***"20");
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***offset***REMOVED***=***REMOVED***parseInt(searchParams.get("offset")***REMOVED***||***REMOVED***"0");
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***status***REMOVED***=***REMOVED***searchParams.get("status");
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***search***REMOVED***=***REMOVED***searchParams.get("search");
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***startDate***REMOVED***=***REMOVED***searchParams.get("startDate");
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***endDate***REMOVED***=***REMOVED***searchParams.get("endDate");

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Get***REMOVED***base***REMOVED***history
***REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***history***REMOVED***=***REMOVED***await***REMOVED***getUserWorkflowHistory(user.id,***REMOVED***limit***REMOVED***+***REMOVED***offset);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Apply***REMOVED***filters
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(status)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***history***REMOVED***=***REMOVED***history.filter((item)***REMOVED***=>***REMOVED***item.status***REMOVED***===***REMOVED***status);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(search)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***searchLower***REMOVED***=***REMOVED***search.toLowerCase();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***history***REMOVED***=***REMOVED***history.filter((item)***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***item.command.toLowerCase().includes(searchLower)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(startDate)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***start***REMOVED***=***REMOVED***new***REMOVED***Date(startDate);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***history***REMOVED***=***REMOVED***history.filter((item)***REMOVED***=>***REMOVED***new***REMOVED***Date(item.executed_at)***REMOVED***>=***REMOVED***start);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(endDate)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***end***REMOVED***=***REMOVED***new***REMOVED***Date(endDate);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***history***REMOVED***=***REMOVED***history.filter((item)***REMOVED***=>***REMOVED***new***REMOVED***Date(item.executed_at)***REMOVED***<=***REMOVED***end);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Apply***REMOVED***pagination
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***paginatedHistory***REMOVED***=***REMOVED***history.slice(offset,***REMOVED***offset***REMOVED***+***REMOVED***limit);
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***hasMore***REMOVED***=***REMOVED***history.length***REMOVED***>***REMOVED***offset***REMOVED***+***REMOVED***limit;

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***history:***REMOVED***paginatedHistory,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***pagination:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***limit,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***offset,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***total:***REMOVED***history.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***hasMore,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***fetching***REMOVED***history:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***fetch***REMOVED***history",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}
