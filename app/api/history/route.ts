import{NextRequest,NextResponse}from"next/server";
import{createClient}from"@/lib/supabase/server";
import{getUserWorkflowHistory}from"@/lib/supabase/queries";

exportasyncfunctionGET(request:NextRequest){
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

//Parsequeryparameters
constsearchParams=request.nextUrl.searchParams;
constlimit=parseInt(searchParams.get("limit")||"20");
constoffset=parseInt(searchParams.get("offset")||"0");
conststatus=searchParams.get("status");
constsearch=searchParams.get("search");
conststartDate=searchParams.get("startDate");
constendDate=searchParams.get("endDate");

//Getbasehistory
lethistory=awaitgetUserWorkflowHistory(user.id,limit+offset);

//Applyfilters
if(status){
history=history.filter((item)=>item.status===status);
}

if(search){
constsearchLower=search.toLowerCase();
history=history.filter((item)=>
item.command.toLowerCase().includes(searchLower)
);
}

if(startDate){
conststart=newDate(startDate);
history=history.filter((item)=>newDate(item.executed_at)>=start);
}

if(endDate){
constend=newDate(endDate);
history=history.filter((item)=>newDate(item.executed_at)<=end);
}

//Applypagination
constpaginatedHistory=history.slice(offset,offset+limit);
consthasMore=history.length>offset+limit;

returnNextResponse.json({
history:paginatedHistory,
pagination:{
limit,
offset,
total:history.length,
hasMore,
},
});
}catch(error){
console.error("Errorfetchinghistory:",error);
returnNextResponse.json(
{
error:"Failedtofetchhistory",
message:errorinstanceofError?error.message:"Unknownerror"
},
{status:500}
);
}
}
