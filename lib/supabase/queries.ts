import{createClient}from"./client";
importtype{Database}from"./database.types";
importtype{SupabaseClient}from"@supabase/supabase-js";

typeProfile=Database["public"]["Tables"]["profiles"]["Row"];
typeWorkflow=Database["public"]["Tables"]["workflows"]["Row"];
typeWorkflowHistory=Database["public"]["Tables"]["workflow_history"]["Row"];
typeOAuthToken=Database["public"]["Tables"]["oauth_tokens"]["Row"];

//Profilequeries
exportasyncfunctiongetProfile(userId:string){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("profiles")
.select("*")
.eq("id",userId)
.single();

if(error)throwerror;
returndataasProfile;
}

exportasyncfunctionupdateProfile(
userId:string,
updates:Database["public"]["Tables"]["profiles"]["Update"]
){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("profiles")
.update(updates)
.eq("id",userId)
.select()
.single();

if(error)throwerror;
returndataasProfile;
}

exportasyncfunctionupsertProfile(
profile:Database["public"]["Tables"]["profiles"]["Insert"]
){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("profiles")
.upsert(profile)
.select()
.single();

if(error)throwerror;
returndataasProfile;
}

//Workflowqueries
exportasyncfunctioncreateWorkflow(
workflow:Database["public"]["Tables"]["workflows"]["Insert"],
client?:SupabaseClient<Database>
){
constsupabase=client||createClient();

const{data,error}=awaitsupabase
.from("workflows")
.insert(workflow)
.select()
.single();

if(error)throwerror;
returndataasWorkflow;
}

exportasyncfunctiongetWorkflow(workflowId:string){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("workflows")
.select("*")
.eq("id",workflowId)
.single();

if(error)throwerror;
returndataasWorkflow;
}

exportasyncfunctionupdateWorkflow(
workflowId:string,
updates:Database["public"]["Tables"]["workflows"]["Update"],
client?:SupabaseClient<Database>
){
constsupabase=client||createClient();

const{data,error}=awaitsupabase
.from("workflows")
.update(updates)
.eq("id",workflowId)
.select()
.single();

if(error)throwerror;
returndataasWorkflow;
}

exportasyncfunctiongetUserWorkflows(userId:string,limit=10){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("workflows")
.select("*")
.eq("user_id",userId)
.order("created_at",{ascending:false})
.limit(limit);

if(error)throwerror;
returndataasWorkflow[];
}

//Workflowhistoryqueries
exportasyncfunctionaddWorkflowHistory(
history:Database["public"]["Tables"]["workflow_history"]["Insert"],
client?:SupabaseClient<Database>
){
constsupabase=client||createClient();

const{data,error}=awaitsupabase
.from("workflow_history")
.insert(history)
.select()
.single();

if(error)throwerror;
returndataasWorkflowHistory;
}

exportasyncfunctiongetUserWorkflowHistory(userId:string,limit=20){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("workflow_history")
.select("*")
.eq("user_id",userId)
.order("executed_at",{ascending:false})
.limit(limit);

if(error)throwerror;
returndataasWorkflowHistory[];
}

exportasyncfunctiondeleteWorkflowHistory(historyId:string){
constsupabase=createClient();

const{error}=awaitsupabase
.from("workflow_history")
.delete()
.eq("id",historyId);

if(error)throwerror;
}

exportasyncfunctionclearUserWorkflowHistory(userId:string){
constsupabase=createClient();

const{error}=awaitsupabase
.from("workflow_history")
.delete()
.eq("user_id",userId);

if(error)throwerror;
}

//OAuthtokenqueries
exportasyncfunctionstoreGoogleOAuthTokens(
userId:string,
accessToken:string,
refreshToken:string|null,
expiresAt:Date,
scopes:string[]
){
constsupabase=createClient();

const{data,error}=awaitsupabase
.from("oauth_tokens")
.upsert({
user_id:userId,
provider:"google",
access_token:accessToken,
refresh_token:refreshToken,
expires_at:expiresAt.toISOString(),
scopes,
})
.select()
.single();

if(error)throwerror;
returndataasOAuthToken;
}

exportasyncfunctiongetGoogleOAuthTokens(userId:string){
constsupabase=createClient();

//UsetheSECURITYDEFINERfunctiontobypassRLS
const{data,error}=awaitsupabase
.rpc("get_google_oauth_token",{p_user_id:userId});

if(error){
console.error("ErrorfetchingOAuthtokens:",error);
throwerror;
}

//Thefunctionreturnsanarraywithoneroworemptyarray
if(!data||data.length===0){
returnnull;
}

consttoken=data[0];
return{
access_token:token.access_token,
refresh_token:token.refresh_token,
expires_at:token.expires_at,
is_expired:token.is_expired,
}asany;
}

exportasyncfunctiondeleteGoogleOAuthTokens(userId:string){
constsupabase=createClient();

const{error}=awaitsupabase
.from("oauth_tokens")
.delete()
.eq("user_id",userId)
.eq("provider","google");

if(error)throwerror;
}

exportasyncfunctionisGoogleTokenExpired(userId:string):Promise<boolean>{
consttokens=awaitgetGoogleOAuthTokens(userId);

if(!tokens||!tokens.expires_at){
returntrue;
}

constexpiresAt=newDate(tokens.expires_at);
constnow=newDate();

//Considerexpirediflessthan5minutesremaining
returnexpiresAt.getTime()-now.getTime()<5*60*1000;
}
