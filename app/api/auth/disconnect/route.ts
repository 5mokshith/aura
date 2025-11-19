import{NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";
import{deleteGoogleOAuthTokens,getGoogleOAuthTokens}from"@/lib/supabase/queries";

exportasyncfunctionPOST(){
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

//GetcurrenttokenstorevokethemwithGoogle
try{
consttokens=awaitgetGoogleOAuthTokens(user.id);

if(tokens?.access_token){
//RevokethetokenwithGoogle
awaitfetch(`https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`,{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded",
},
});
}
}catch(err){
console.error("ErrorrevokingGoogletoken:",err);
//Continueevenifrevocationfails
}

//Deletetokensfromdatabase
awaitdeleteGoogleOAuthTokens(user.id);

returnNextResponse.json({
success:true,
message:"SuccessfullydisconnectedGoogleaccount",
});
}catch(error){
console.error("ErrordisconnectingGoogleaccount:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}
