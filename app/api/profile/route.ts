import{NextRequest,NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";

exportasyncfunctionGET(request:NextRequest){
try{
constsupabase=awaitcreateClient();

//Getauthenticateduser
const{
data:{user},
error:authError,
}=awaitsupabase.auth.getUser();

if(authError||!user){
returnNextResponse.json(
{error:"Unauthorized"},
{status:401}
);
}

//Getuserprofile
const{data:profile,error:profileError}=awaitsupabase
.from("profiles")
.select("*")
.eq("id",user.id)
.single();

if(profileError){
returnNextResponse.json(
{error:"Failedtofetchprofile"},
{status:500}
);
}

returnNextResponse.json({profile});
}catch(error){
console.error("Errorfetchingprofile:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}

exportasyncfunctionPATCH(request:NextRequest){
try{
constsupabase=awaitcreateClient();

//Getauthenticateduser
const{
data:{user},
error:authError,
}=awaitsupabase.auth.getUser();

if(authError||!user){
returnNextResponse.json(
{error:"Unauthorized"},
{status:401}
);
}

//Parserequestbody
constbody=awaitrequest.json();
const{full_name,avatar_url,preferences}=body;

//Updateprofile
const{data:profile,error:updateError}=awaitsupabase
.from("profiles")
.update({
full_name,
avatar_url,
preferences,
})
.eq("id",user.id)
.select()
.single();

if(updateError){
returnNextResponse.json(
{error:"Failedtoupdateprofile"},
{status:500}
);
}

returnNextResponse.json({profile});
}catch(error){
console.error("Errorupdatingprofile:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}
