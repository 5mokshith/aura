import{NextRequest,NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";

exportasyncfunctionPOST(request:NextRequest){
try{
constsupabase=awaitcreateClient();

//Verifyuserisauthenticated
const{data:{user},error:authError}=awaitsupabase.auth.getUser();

if(authError||!user){
returnNextResponse.json(
{error:"Unauthorized"},
{status:401}
);
}

constbody=awaitrequest.json();
const{refreshToken}=body;

if(!refreshToken){
returnNextResponse.json(
{error:"Refreshtokenisrequired"},
{status:400}
);
}

//Exchangerefreshtokenfornewaccesstoken
constresponse=awaitfetch("https://oauth2.googleapis.com/token",{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded",
},
body:newURLSearchParams({
client_id:process.env.GOOGLE_CLIENT_ID!,
client_secret:process.env.GOOGLE_CLIENT_SECRET!,
refresh_token:refreshToken,
grant_type:"refresh_token",
}),
});

if(!response.ok){
consterrorData=awaitresponse.json();
console.error("Googletokenrefreshfailed:",errorData);
returnNextResponse.json(
{error:"Failedtorefreshtoken",details:errorData},
{status:response.status}
);
}

constdata=awaitresponse.json();

returnNextResponse.json({
access_token:data.access_token,
expires_in:data.expires_in,
token_type:data.token_type,
//Googlemayreturnanewrefreshtoken
refresh_token:data.refresh_token,
});
}catch(error){
console.error("ErrorrefreshingGoogletoken:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}
