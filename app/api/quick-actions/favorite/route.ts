import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile, updateProfile } from "@/lib/supabase/queries";

export async function POST(request: NextRequest) {
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

//Parserequestbody
constbody=awaitrequest.json();
const{actionId,isFavorite}=body;

if(!actionId){
returnNextResponse.json(
{error:"ActionIDrequired"},
{status:400}
);
}

//Getcurrentprofile
constprofile=awaitgetProfile(user.id);
constpreferences=(profile.preferencesasany)||{};
letfavoriteActions=preferences.favoriteActions||[];

//Updatefavorites
if(isFavorite){
//Addtofavorites(max20)
if(!favoriteActions.includes(actionId)){
favoriteActions.push(actionId);
if(favoriteActions.length>20){
favoriteActions=favoriteActions.slice(-20);//Keeplast20
}
}
}else{
//Removefromfavorites
favoriteActions=favoriteActions.filter((id:string)=>id!==actionId);
}

//Updateprofile
awaitupdateProfile(user.id,{
preferences:{
...preferences,
favoriteActions,
},
});

returnNextResponse.json({
success:true,
favoriteActions,
});
}catch(error){
console.error("Errorupdatingfavorite:",error);
returnNextResponse.json(
{
error:"Failedtoupdatefavorite",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
