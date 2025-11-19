import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

if(error){
console.error("Errorexchangingcodeforsession:",error);
return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

//StoreGoogleOAuthtokensifavailable
if(data.session&&data.session.provider_token){
try{
const expiresAt=new Date(Date.now()+3600*1000);//Default1hour
const scopes=[
"https://www.googleapis.com/auth/gmail.modify",
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/documents",
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/calendar",
];

//Useserver-sideclienttobypassRLS
const{error:tokenError}=await supabase
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
return NextResponse.redirect(`${origin}/dashboard`);
}
