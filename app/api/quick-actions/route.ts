import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { DEFAULT_QUICK_ACTIONS } from "@/lib/quickActions";

export async function GET(request: NextRequest) {
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

//Getuserprofiletoaccessfavorites
constprofile=awaitgetProfile(user.id);
constpreferences=profile.preferencesasany||{};
constfavoriteActions=preferences.favoriteActions||[];

//Getdefaultquickactionsandmarkfavorites
constactions=DEFAULT_QUICK_ACTIONS.map((action)=>({
...action,
isFavorite:favoriteActions.includes(action.id),
}));

returnNextResponse.json({
actions,
});
}catch(error){
console.error("Errorfetchingquickactions:",error);
returnNextResponse.json(
{
error:"Failedtofetchquickactions",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
