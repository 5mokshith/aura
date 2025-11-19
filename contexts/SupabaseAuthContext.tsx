"useclient";

importReact,{createContext,useContext,useEffect,useState,useCallback}from"react";
import{createClient}from"@/lib/supabase/client";
import{storeGoogleOAuthTokens,getGoogleOAuthTokens,deleteGoogleOAuthTokens}from"@/lib/supabase/queries";
importtype{User,Session}from"@supabase/supabase-js";

interfaceGoogleOAuthStatus{
isConnected:boolean;
accessToken:string|null;
refreshToken:string|null;
expiresAt:Date|null;
scopes:string[];
}

interfaceSupabaseAuthContextType{
user:User|null;
session:Session|null;
isLoading:boolean;
error:string|null;
googleOAuthStatus:GoogleOAuthStatus;
signInWithGoogle:()=>Promise<void>;
signOut:()=>Promise<void>;
refreshSession:()=>Promise<void>;
refreshGoogleToken:()=>Promise<void>;
getGoogleAccessToken:()=>Promise<string|null>;
}

constSupabaseAuthContext=createContext<SupabaseAuthContextType|undefined>(undefined);

exportfunctionSupabaseAuthProvider({children}:{children:React.ReactNode}){
const[user,setUser]=useState<User|null>(null);
const[session,setSession]=useState<Session|null>(null);
const[isLoading,setIsLoading]=useState(true);
const[error,setError]=useState<string|null>(null);
const[googleOAuthStatus,setGoogleOAuthStatus]=useState<GoogleOAuthStatus>({
isConnected:false,
accessToken:null,
refreshToken:null,
expiresAt:null,
scopes:[],
});
constsupabase=createClient();

//LoadGoogleOAuthstatus
constloadGoogleOAuthStatus=useCallback(async(userId:string)=>{
try{
consttokens=awaitgetGoogleOAuthTokens(userId);

if(tokens){
setGoogleOAuthStatus({
isConnected:true,
accessToken:tokens.access_token,
refreshToken:tokens.refresh_token,
expiresAt:tokens.expires_at?newDate(tokens.expires_at):null,
scopes:tokens.scopes||[],
});
}else{
setGoogleOAuthStatus({
isConnected:false,
accessToken:null,
refreshToken:null,
expiresAt:null,
scopes:[],
});
}
}catch(err){
console.error("ErrorloadingGoogleOAuthstatus:",err);
}
},[]);

constrefreshSession=useCallback(async()=>{
try{
const{data,error}=awaitsupabase.auth.refreshSession();
if(error)throwerror;

setSession(data.session);
setUser(data.user);
setError(null);

//ReloadGoogleOAuthstatus
if(data.user){
awaitloadGoogleOAuthStatus(data.user.id);
}
}catch(err){
console.error("Errorrefreshingsession:",err);
setError(errinstanceofError?err.message:"Failedtorefreshsession");
}
},[supabase.auth,loadGoogleOAuthStatus]);

constsignInWithGoogle=useCallback(async()=>{
try{
setError(null);
const{data,error}=awaitsupabase.auth.signInWithOAuth({
provider:"google",
options:{
redirectTo:`${window.location.origin}/auth/callback`,
queryParams:{
access_type:"offline",
prompt:"consent",
},
scopes:[
"https://www.googleapis.com/auth/gmail.modify",
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/documents",
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/calendar",
].join(""),
},
});

if(error)throwerror;
}catch(err){
console.error("ErrorsigninginwithGoogle:",err);
setError(errinstanceofError?err.message:"Failedtosignin");
throwerr;
}
},[supabase.auth]);

constsignOut=useCallback(async()=>{
try{
setError(null);

//DeleteGoogleOAuthtokensfirst
if(user){
awaitdeleteGoogleOAuthTokens(user.id);
}

const{error}=awaitsupabase.auth.signOut();
if(error)throwerror;

setUser(null);
setSession(null);
setGoogleOAuthStatus({
isConnected:false,
accessToken:null,
refreshToken:null,
expiresAt:null,
scopes:[],
});
}catch(err){
console.error("Errorsigningout:",err);
setError(errinstanceofError?err.message:"Failedtosignout");
throwerr;
}
},[supabase.auth,user]);

//RefreshGoogleOAuthtoken
constrefreshGoogleToken=useCallback(async()=>{
if(!user||!googleOAuthStatus.refreshToken){
thrownewError("Norefreshtokenavailable");
}

try{
//CallyourbackendAPItorefreshtheGoogletoken
constresponse=awaitfetch("/api/auth/refresh-google-token",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
refreshToken:googleOAuthStatus.refreshToken,
}),
});

if(!response.ok){
thrownewError("FailedtorefreshGoogletoken");
}

constdata=awaitresponse.json();

//Storethenewtokens
constexpiresAt=newDate(Date.now()+data.expires_in*1000);
awaitstoreGoogleOAuthTokens(
user.id,
data.access_token,
data.refresh_token||googleOAuthStatus.refreshToken,
expiresAt,
googleOAuthStatus.scopes
);

//Updatelocalstate
setGoogleOAuthStatus({
isConnected:true,
accessToken:data.access_token,
refreshToken:data.refresh_token||googleOAuthStatus.refreshToken,
expiresAt,
scopes:googleOAuthStatus.scopes,
});
}catch(err){
console.error("ErrorrefreshingGoogletoken:",err);
throwerr;
}
},[user,googleOAuthStatus]);

//GetvalidGoogleaccesstoken(refreshifneeded)
constgetGoogleAccessToken=useCallback(async():Promise<string|null>=>{
if(!user)returnnull;

//Checkiftokenisexpiredorabouttoexpire(within5minutes)
constnow=newDate();
constexpiresAt=googleOAuthStatus.expiresAt;

if(!expiresAt||expiresAt.getTime()-now.getTime()<5*60*1000){
//Tokenexpiredorabouttoexpire,refreshit
try{
awaitrefreshGoogleToken();
returngoogleOAuthStatus.accessToken;
}catch(err){
console.error("Failedtorefreshtoken:",err);
returnnull;
}
}

returngoogleOAuthStatus.accessToken;
},[user,googleOAuthStatus,refreshGoogleToken]);

//Initializeauthstate
useEffect(()=>{
constinitializeAuth=async()=>{
try{
const{data:{session},error}=awaitsupabase.auth.getSession();

if(error)throwerror;

setSession(session);
setUser(session?.user??null);

//LoadGoogleOAuthstatusifuserisauthenticated
if(session?.user){
awaitloadGoogleOAuthStatus(session.user.id);
}
}catch(err){
console.error("Errorinitializingauth:",err);
setError(errinstanceofError?err.message:"Failedtoinitializeauth");
}finally{
setIsLoading(false);
}
};

initializeAuth();
},[supabase.auth,loadGoogleOAuthStatus]);

//Listenforauthchanges
useEffect(()=>{
const{
data:{subscription},
}=supabase.auth.onAuthStateChange(async(event,session)=>{
console.log("Authstatechanged:",event);

setSession(session);
setUser(session?.user??null);
setIsLoading(false);

//Handlespecificevents
if(event==="SIGNED_OUT"){
setUser(null);
setSession(null);
setGoogleOAuthStatus({
isConnected:false,
accessToken:null,
refreshToken:null,
expiresAt:null,
scopes:[],
});
}elseif(event==="SIGNED_IN"&&session?.user){
console.log("Usersignedin,loadingGoogleOAuthstatus");
awaitloadGoogleOAuthStatus(session.user.id);

//StoreGoogleOAuthtokensfromprovider_tokenifavailable
constproviderToken=session.provider_token;
constproviderRefreshToken=session.provider_refresh_token;

if(providerToken){
constexpiresAt=newDate(Date.now()+3600*1000);//Default1hour
constscopes=[
"https://www.googleapis.com/auth/gmail.modify",
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/documents",
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/calendar",
];

awaitstoreGoogleOAuthTokens(
session.user.id,
providerToken,
providerRefreshToken||null,
expiresAt,
scopes
);

setGoogleOAuthStatus({
isConnected:true,
accessToken:providerToken,
refreshToken:providerRefreshToken||null,
expiresAt,
scopes,
});
}
}elseif(event==="TOKEN_REFRESHED"){
console.log("Tokenrefreshedsuccessfully");
}elseif(event==="USER_UPDATED"){
console.log("Userupdated");
}
});

return()=>{
subscription.unsubscribe();
};
},[supabase.auth,loadGoogleOAuthStatus]);

//Auto-refreshsessionbeforeexpiry
useEffect(()=>{
if(!session)return;

constexpiresAt=session.expires_at;
if(!expiresAt)return;

constexpiresIn=expiresAt*1000-Date.now();
constrefreshTime=expiresIn-5*60*1000;//Refresh5minutesbeforeexpiry

if(refreshTime>0){
consttimer=setTimeout(()=>{
refreshSession();
},refreshTime);

return()=>clearTimeout(timer);
}
},[session,refreshSession]);

constvalue:SupabaseAuthContextType={
user,
session,
isLoading,
error,
googleOAuthStatus,
signInWithGoogle,
signOut,
refreshSession,
refreshGoogleToken,
getGoogleAccessToken,
};

return(
<SupabaseAuthContext.Providervalue={value}>
{children}
</SupabaseAuthContext.Provider>
);
}

exportfunctionuseSupabaseAuth(){
constcontext=useContext(SupabaseAuthContext);
if(context===undefined){
thrownewError("useSupabaseAuthmustbeusedwithinaSupabaseAuthProvider");
}
returncontext;
}
