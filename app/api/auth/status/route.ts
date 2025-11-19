import{NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";
import{getGoogleOAuthTokens,getProfile}from"@/lib/supabase/queries";

exportasyncfunctionGET(){
try{
constsupabase=awaitcreateClient();

//Getcurrentuser
const{data:{user},error:authError}=awaitsupabase.auth.getUser();

if(authError||!user){
returnNextResponse.json({
isAuthenticated:false,
session:null,
});
}

//Getuserprofile
letprofile=null;
try{
profile=awaitgetProfile(user.id);
}catch(err){
console.error("Errorfetchingprofile:",err);
}

//GetGoogleOAuthstatus
letgoogleOAuthStatus={
isConnected:false,
userEmail:user.email,
scopes:[]asstring[],
expiresAt:nullasstring|null,
};

try{
consttokens=awaitgetGoogleOAuthTokens(user.id);
if(tokens){
constexpiresAt=tokens.expires_at?newDate(tokens.expires_at):null;
constisExpired=expiresAt?expiresAt<newDate():true;

googleOAuthStatus={
isConnected:!isExpired,
userEmail:user.email||"",
scopes:tokens.scopes||[],
expiresAt:tokens.expires_at,
};
}
}catch(err){
console.error("ErrorfetchingGoogleOAuthtokens:",err);
}

returnNextResponse.json({
isAuthenticated:true,
session:{
userId:user.id,
email:user.email,
isAuthenticated:true,
oauthStatus:googleOAuthStatus,
preferences:profile?.preferences||{
theme:"system",
notificationsEnabled:true,
defaultView:"dashboard",
favoriteActions:[],
},
},
});
}catch(error){
console.error("Errorcheckingauthstatus:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}
