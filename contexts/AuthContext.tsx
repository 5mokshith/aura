"useclient";

importReact,{createContext,useContext,useEffect,useState,useCallback}from"react";
importtype{AuthStatus,UserSession}from"@/types";

interfaceAuthContextType{
session:UserSession|null;
isLoading:boolean;
error:string|null;
login:()=>void;
logout:()=>Promise<void>;
refreshAuth:()=>Promise<void>;
}

constAuthContext=createContext<AuthContextType|undefined>(undefined);

exportfunctionAuthProvider({children}:{children:React.ReactNode}){
const[session,setSession]=useState<UserSession|null>(null);
const[isLoading,setIsLoading]=useState(true);
const[error,setError]=useState<string|null>(null);

constfetchAuthStatus=useCallback(async()=>{
try{
constresponse=awaitfetch("/api/auth/status");

if(!response.ok){
thrownewError("Failedtofetchauthstatus");
}

constdata=awaitresponse.json();

if(data.isAuthenticated){
setSession(data.session);
setError(null);
}else{
setSession(null);
}
}catch(err){
console.error("Errorfetchingauthstatus:",err);
setError(errinstanceofError?err.message:"Authenticationerror");
setSession(null);
}finally{
setIsLoading(false);
}
},[]);

constrefreshAuth=useCallback(async()=>{
setIsLoading(true);
awaitfetchAuthStatus();
},[fetchAuthStatus]);

constlogin=useCallback(()=>{
//RedirecttoGoogleOAuth
constscopes=[
"https://www.googleapis.com/auth/gmail.modify",
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/documents",
"https://www.googleapis.com/auth/spreadsheets",
"https://www.googleapis.com/auth/calendar",
].join("");

constparams=newURLSearchParams({
client_id:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID||"",
redirect_uri:`${window.location.origin}/auth/callback`,
response_type:"code",
scope:scopes,
access_type:"offline",
prompt:"consent",
});

window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
},[]);

constlogout=useCallback(async()=>{
try{
constresponse=awaitfetch("/api/auth/disconnect",{
method:"POST",
});

if(!response.ok){
thrownewError("Failedtodisconnect");
}

setSession(null);
setError(null);
}catch(err){
console.error("Errordisconnecting:",err);
setError(errinstanceofError?err.message:"Disconnecterror");
throwerr;
}
},[]);

//Checkfortokenexpirationandpromptre-authentication
useEffect(()=>{
if(session?.oauthStatus.expiresAt){
constexpiresAt=newDate(session.oauthStatus.expiresAt);
constnow=newDate();
consttimeUntilExpiry=expiresAt.getTime()-now.getTime();

//Iftokenexpiresinlessthan5seconds,promptre-auth
if(timeUntilExpiry<5000&&timeUntilExpiry>0){
consttimer=setTimeout(()=>{
setError("Yoursessionhasexpired.PleasereconnectyourGoogleaccount.");
},timeUntilExpiry);

return()=>clearTimeout(timer);
}
}
},[session]);

//Initialauthcheck
useEffect(()=>{
fetchAuthStatus();
},[fetchAuthStatus]);

//Periodictokenrefreshcheck(every5minutes)
useEffect(()=>{
constinterval=setInterval(()=>{
if(session?.isAuthenticated){
refreshAuth();
}
},5*60*1000);

return()=>clearInterval(interval);
},[session,refreshAuth]);

constvalue:AuthContextType={
session,
isLoading,
error,
login,
logout,
refreshAuth,
};

return<AuthContext.Providervalue={value}>{children}</AuthContext.Provider>;
}

exportfunctionuseAuth(){
constcontext=useContext(AuthContext);
if(context===undefined){
thrownewError("useAuthmustbeusedwithinanAuthProvider");
}
returncontext;
}
