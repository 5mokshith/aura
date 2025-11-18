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
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.exchangeCodeForSession(code);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***exchanging***REMOVED***code***REMOVED***for***REMOVED***session:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.redirect(`${origin}/login?error=auth_failed`);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Store***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***if***REMOVED***available
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(data.session***REMOVED***&&***REMOVED***data.session.provider_token)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***expiresAt***REMOVED***=***REMOVED***new***REMOVED***Date(Date.now()***REMOVED***+***REMOVED***3600***REMOVED*******REMOVED***1000);***REMOVED***//***REMOVED***Default***REMOVED***1***REMOVED***hour
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***scopes***REMOVED***=***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/gmail.modify",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/drive.file",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/documents",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/spreadsheets",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/calendar",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***];

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Use***REMOVED***server-side***REMOVED***client***REMOVED***to***REMOVED***bypass***REMOVED***RLS
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***error:***REMOVED***tokenError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from("oauth_tokens")
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.upsert({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***user_id:***REMOVED***data.session.user.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***provider:***REMOVED***"google",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***access_token:***REMOVED***data.session.provider_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***refresh_token:***REMOVED***data.session.provider_refresh_token***REMOVED***||***REMOVED***null,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expires_at:***REMOVED***expiresAt.toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***scopes,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(tokenError)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***storing***REMOVED***OAuth***REMOVED***tokens:",***REMOVED***tokenError);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log("Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***stored***REMOVED***successfully");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(tokenError)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***storing***REMOVED***OAuth***REMOVED***tokens:",***REMOVED***tokenError);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Don't***REMOVED***fail***REMOVED***the***REMOVED***login,***REMOVED***just***REMOVED***log***REMOVED***the***REMOVED***error
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Redirect***REMOVED***to***REMOVED***dashboard***REMOVED***after***REMOVED***successful***REMOVED***authentication
***REMOVED******REMOVED***return***REMOVED***NextResponse.redirect(`${origin}/dashboard`);
}
