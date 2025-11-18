import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

export***REMOVED***async***REMOVED***function***REMOVED***GET(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***requestUrl***REMOVED***=***REMOVED***new***REMOVED***URL(request.url);
***REMOVED******REMOVED***const***REMOVED***code***REMOVED***=***REMOVED***requestUrl.searchParams.get("code");
***REMOVED******REMOVED***const***REMOVED***origin***REMOVED***=***REMOVED***requestUrl.origin;

***REMOVED******REMOVED***if***REMOVED***(code)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Exchange***REMOVED***code***REMOVED***for***REMOVED***session
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.exchangeCodeForSession(code);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***exchanging***REMOVED***code***REMOVED***for***REMOVED***session:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.redirect(`${origin}/login?error=auth_failed`);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Redirect***REMOVED***to***REMOVED***dashboard***REMOVED***after***REMOVED***successful***REMOVED***authentication
***REMOVED******REMOVED***return***REMOVED***NextResponse.redirect(`${origin}/dashboard`);
}
