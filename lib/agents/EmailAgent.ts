import{google}from"googleapis";
import{Agent,ExecutionContext,ExecutionResult}from"./base";
import{chatCompletion}from"../llm/client";

/**
*EmailAgenthandlesGmailoperationsincludingsending,searching,reading,andsummarizingemails
*/
exportclassEmailAgentimplementsAgent{
name="EmailAgent";

asyncexecute(context:ExecutionContext):Promise<ExecutionResult>{
try{
//InitializeGmailAPIclientwithOAuthtoken
constauth=newgoogle.auth.OAuth2();
auth.setCredentials({access_token:context.accessToken});
constgmail=google.gmail({version:"v1",auth});

//Routetoappropriateactionhandler
switch(context.action){
case"send_email":
returnawaitthis.sendEmail(gmail,context.parameters);
case"search_emails":
returnawaitthis.searchEmails(gmail,context.parameters);
case"read_email":
returnawaitthis.readEmail(gmail,context.parameters);
case"summarize_emails":
returnawaitthis.summarizeEmails(gmail,context.parameters);
default:
return{
success:false,
error:`Unknownaction:${context.action}`,
};
}
}catch(error){
return{
success:false,
error:`EmailAgentexecutionfailed:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*SendanemailviaGmailAPI
*/
privateasyncsendEmail(
gmail:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{to,subject,body,cc,bcc}=parameters;

if(!to||!subject||!body){
return{
success:false,
error:"Missingrequiredparameters:to,subject,body",
};
}

//ConstructemailinRFC2822format
constemailLines=[
`To:${to}`,
cc?`Cc:${cc}`:null,
bcc?`Bcc:${bcc}`:null,
`Subject:${subject}`,
"",
body,
].filter(Boolean);

constemail=emailLines.join("\r\n");
constencodedEmail=Buffer.from(email)
.toString("base64")
.replace(/\+/g,"-")
.replace(/\//g,"_")
.replace(/=+$/,"");

constresponse=awaitgmail.users.messages.send({
userId:"me",
requestBody:{
raw:encodedEmail,
},
});

return{
success:true,
output:{
messageId:response.data.id,
threadId:response.data.threadId,
},
};
}catch(error){
return{
success:false,
error:`Failedtosendemail:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*SearchemailsusingGmailquerysyntax
*/
privateasyncsearchEmails(
gmail:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{query,maxResults=10}=parameters;

if(!query){
return{
success:false,
error:"Missingrequiredparameter:query",
};
}

constresponse=awaitgmail.users.messages.list({
userId:"me",
q:query,
maxResults,
});

constmessages=response.data.messages||[];

//Fetchfullmessagedetailsforeachresult
constdetailedMessages=awaitPromise.all(
messages.map(async(msg:any)=>{
constdetails=awaitgmail.users.messages.get({
userId:"me",
id:msg.id,
format:"metadata",
metadataHeaders:["From","To","Subject","Date"],
});

constheaders=details.data.payload.headers;
return{
id:msg.id,
threadId:msg.threadId,
from:headers.find((h:any)=>h.name==="From")?.value,
to:headers.find((h:any)=>h.name==="To")?.value,
subject:headers.find((h:any)=>h.name==="Subject")?.value,
date:headers.find((h:any)=>h.name==="Date")?.value,
};
})
);

return{
success:true,
output:{
messages:detailedMessages,
resultCount:detailedMessages.length,
},
};
}catch(error){
return{
success:false,
error:`Failedtosearchemails:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*ReadaspecificemailbyID
*/
privateasyncreadEmail(
gmail:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{messageId}=parameters;

if(!messageId){
return{
success:false,
error:"Missingrequiredparameter:messageId",
};
}

constresponse=awaitgmail.users.messages.get({
userId:"me",
id:messageId,
format:"full",
});

constmessage=response.data;
constheaders=message.payload.headers;

//Extractemailbody
letbody="";
if(message.payload.body.data){
body=Buffer.from(message.payload.body.data,"base64").toString();
}elseif(message.payload.parts){
//Handlemultipartmessages
for(constpartofmessage.payload.parts){
if(part.mimeType==="text/plain"&&part.body.data){
body=Buffer.from(part.body.data,"base64").toString();
break;
}
}
//FallbacktoHTMLifnoplaintext
if(!body){
for(constpartofmessage.payload.parts){
if(part.mimeType==="text/html"&&part.body.data){
body=Buffer.from(part.body.data,"base64").toString();
break;
}
}
}
}

return{
success:true,
output:{
id:message.id,
threadId:message.threadId,
from:headers.find((h:any)=>h.name==="From")?.value,
to:headers.find((h:any)=>h.name==="To")?.value,
subject:headers.find((h:any)=>h.name==="Subject")?.value,
date:headers.find((h:any)=>h.name==="Date")?.value,
body,
snippet:message.snippet,
},
};
}catch(error){
return{
success:false,
error:`Failedtoreademail:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*SummarizeemailsusingLLM
*/
privateasyncsummarizeEmails(
gmail:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{query,maxResults=10,summaryType="brief"}=parameters;

if(!query){
return{
success:false,
error:"Missingrequiredparameter:query",
};
}

//First,searchforemails
constsearchResult=awaitthis.searchEmails(gmail,{query,maxResults});

if(!searchResult.success||!searchResult.output?.messages?.length){
return{
success:true,
output:{
summary:"Noemailsfoundmatchingthequery.",
emailCount:0,
},
};
}

constmessages=searchResult.output.messages;

//Fetchfullcontentforeachemail
constemailContents=awaitPromise.all(
messages.map(async(msg:any)=>{
constreadResult=awaitthis.readEmail(gmail,{messageId:msg.id});
returnreadResult.success?readResult.output:null;
})
);

constvalidEmails=emailContents.filter(Boolean);

//PrepareemaildataforLLM
constemailsText=validEmails
.map(
(email:any,index:number)=>
`Email${index+1}:
From:${email.from}
Subject:${email.subject}
Date:${email.date}
Body:${email.body.substring(0,1000)}...
`
)
.join("\n\n");

//GeneratesummaryusingLLM
constsummaryPrompt=
summaryType==="detailed"
?"Provideadetailedsummaryoftheseemails,includingkeypoints,actionitems,andimportantdetailsfromeachemail."
:"Provideabriefsummaryoftheseemails,highlightingthemaintopicsandanyurgentmatters.";

constllmResponse=awaitchatCompletion([
{
role:"system",
content:
"YouareanAIassistantthatsummarizesemails.Provideclear,concisesummariesthatcapturetheessentialinformation.",
},
{
role:"user",
content:`${summaryPrompt}\n\n${emailsText}`,
},
]);

return{
success:true,
output:{
summary:llmResponse.content,
emailCount:validEmails.length,
emails:messages.map((msg:any)=>({
id:msg.id,
subject:msg.subject,
from:msg.from,
})),
},
};
}catch(error){
return{
success:false,
error:`Failedtosummarizeemails:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}
}
