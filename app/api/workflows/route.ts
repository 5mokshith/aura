import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
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

//Getqueryparameters
const{searchParams}=newURL(request.url);
constlimit=parseInt(searchParams.get("limit")||"10");
conststatus=searchParams.get("status");

//Buildquery
letquery=supabase
.from("workflows")
.select("*")
.eq("user_id",user.id)
.order("created_at",{ascending:false})
.limit(limit);

//Addstatusfilterifprovided
if(status){
query=query.eq("status",status);
}

const{data:workflows,error:workflowsError}=awaitquery;

if(workflowsError){
returnNextResponse.json(
{error:"Failedtofetchworkflows"},
{status:500}
);
}

returnNextResponse.json({workflows});
}catch(error){
console.error("Errorfetchingworkflows:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}

export async function POST(request: NextRequest) {
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
const{command,steps=[]}=body;

if(!command){
returnNextResponse.json(
{error:"Commandisrequired"},
{status:400}
);
}

//Createworkflow
const{data:workflow,error:createError}=awaitsupabase
.from("workflows")
.insert({
user_id:user.id,
command,
status:"planning",
steps,
results:[],
})
.select()
.single();

if(createError){
returnNextResponse.json(
{error:"Failedtocreateworkflow"},
{status:500}
);
}

//Addtohistory
awaitsupabase.from("workflow_history").insert({
user_id:user.id,
workflow_id:workflow.id,
command,
status:"planning",
});

returnNextResponse.json({workflow},{status:201});
}catch(error){
console.error("Errorcreatingworkflow:",error);
returnNextResponse.json(
{error:"Internalservererror"},
{status:500}
);
}
}
