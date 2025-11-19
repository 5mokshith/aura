import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
try{
constbody=awaitrequest.json();
const{code}=body;

if(!code){
returnNextResponse.json(
{message:"Authorizationcodeisrequired"},
{status:400}
);
}

//Exchangeauthorizationcodefortokens
consttokenResponse=awaitfetch("https://oauth2.googleapis.com/token",{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded",
},
body:newURLSearchParams({
code,
client_id:env.googleClientId,
client_secret:env.googleClientSecret,
redirect_uri:`${env.nextAuthUrl}/auth/callback`,
grant_type:"authorization_code",
}),
});

if(!tokenResponse.ok){
consterror=awaittokenResponse.json();
console.error("Tokenexchangefailed:",error);
returnNextResponse.json(
{message:"Failedtoexchangeauthorizationcode"},
{status:400}
);
}

consttokens=awaittokenResponse.json();
const{access_token,refresh_token,expires_in}=tokens;

//GetuserinfofromGoogle
constuserInfoResponse=awaitfetch(
"https://www.googleapis.com/oauth2/v2/userinfo",
{
headers:{
Authorization:`Bearer${access_token}`,
},
}
);

if(!userInfoResponse.ok){
returnNextResponse.json(
{message:"Failedtofetchuserinformation"},
{status:400}
);
}

constuserInfo=awaituserInfoResponse.json();
const{email,id}=userInfo;

//Calculatetokenexpiration
constexpiresAt=newDate(Date.now()+expires_in*1000);

//Createresponsewithcookies
constresponse=NextResponse.json({
success:true,
message:"Authenticationsuccessful",
});

//SethttpOnlycookiesforsecurity
response.cookies.set("access_token",access_token,{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:expires_in,
});

if(refresh_token){
response.cookies.set("refresh_token",refresh_token,{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:60*60*24*30,//30days
});
}

response.cookies.set("user_email",email,{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:60*60*24*30,
});

response.cookies.set("user_id",id,{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:60*60*24*30,
});

response.cookies.set("token_expires_at",expiresAt.toISOString(),{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:expires_in,
});

returnresponse;
}catch(error){
console.error("OAuthcallbackerror:",error);
returnNextResponse.json(
{
message:"Authenticationfailed",
error:errorinstanceofError?error.message:"Unknownerror",
},
{status:500}
);
}
}
