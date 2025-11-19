import{NextRequest,NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";

exportasyncfunctionGET(request:NextRequest){
constrequestUrl=newURL(request.url);
constcode=requestUrl.searchParams.get("code");
constorigin=requestUrl.origin;

if(code){
constsupabase=awaitcreateClient();

//Exchangecodeforsession
const{data,error}=awaitsupabase.auth.exchangeCodeForSession(code);

if(error){
console.error("Errorexchangingcodeforsession:",error);
returnNextResponse.redirect(`${origin}/login?error=auth_failed`);
}

//StoreGoogleOAuthtokensifavailable
if(data.session&&data.session.provider_token){
try{
constexpiresAt=newDate(Date.now()+3600*1000);//Default1hour
constscopes=[
"https://www.googleapis.com/auth/gmail.modify",
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/documents",
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/calendar",
];

//Useserver-sideclienttobypassRLS
const{error:tokenError}=awaitsupabase
.from("oauth_tokens")
.upsert({
user_id:data.session.user.id,
provider:"google",
access_token:data.session.provider_token,
refresh_token:data.session.provider_refresh_token||null,
expires_at:expiresAt.toISOString(),
scopes,
});

if(tokenError){
console.error("ErrorstoringOAuthtokens:",tokenError);
}else{
console.log("GoogleOAuthtokensstoredsuccessfully");
}
}catch(tokenError){
console.error("ErrorstoringOAuthtokens:",tokenError);
//Don'tfailthelogin,justlogtheerror
}
}
}

//Redirecttodashboardaftersuccessfulauthentication
returnNextResponse.redirect(`${origin}/dashboard`);
}
