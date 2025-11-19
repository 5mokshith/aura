import{google}from"googleapis";
import{Agent,ExecutionContext,ExecutionResult}from"./base";

/**
*DocsAgenthandlesGoogleDocsoperationsincludingdocumentcreation,updates,andreading
*/
exportclassDocsAgentimplementsAgent{
name="DocsAgent";

asyncexecute(context:ExecutionContext):Promise<ExecutionResult>{
try{
//InitializeDocsAPIclientwithOAuthtoken
constauth=newgoogle.auth.OAuth2();
auth.setCredentials({access_token:context.accessToken});
constdocs=google.docs({version:"v1",auth});

//Routetoappropriateactionhandler
switch(context.action){
case"create_document":
returnawaitthis.createDocument(docs,context.parameters);
case"update_document":
returnawaitthis.updateDocument(docs,context.parameters);
case"read_document":
returnawaitthis.readDocument(docs,context.parameters);
default:
return{
success:false,
error:`Unknownaction:${context.action}`,
};
}
}catch(error){
return{
success:false,
error:`DocsAgentexecutionfailed:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*CreateanewGoogleDoc
*/
privateasynccreateDocument(
docs:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{title,content}=parameters;

if(!title){
return{
success:false,
error:"Missingrequiredparameter:title",
};
}

//Createthedocument
constresponse=awaitdocs.documents.create({
requestBody:{
title,
},
});

constdocumentId=response.data.documentId;

//Ifcontentisprovided,addittothedocument
if(content){
awaitdocs.documents.batchUpdate({
documentId,
requestBody:{
requests:[
{
insertText:{
location:{
index:1,
},
text:content,
},
},
],
},
});
}

return{
success:true,
output:{
documentId,
title:response.data.title,
documentUrl:`https://docs.google.com/document/d/${documentId}/edit`,
},
};
}catch(error){
return{
success:false,
error:`Failedtocreatedocument:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*UpdateanexistingGoogleDoc
*/
privateasyncupdateDocument(
docs:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{documentId,content,appendMode=false}=parameters;

if(!documentId||!content){
return{
success:false,
error:"Missingrequiredparameters:documentId,content",
};
}

//Getcurrentdocumenttodetermineinsertionpoint
constdoc=awaitdocs.documents.get({
documentId,
});

letinsertIndex=1;//Defaulttobeginning

if(appendMode){
//Calculatetheendindex(totalcontentlength)
constbody=doc.data.body;
if(body&&body.content){
//Findthelastcontentelement'sendIndex
constlastElement=body.content[body.content.length-1];
insertIndex=lastElement.endIndex?lastElement.endIndex-1:1;
}
}

//Updatethedocument
constresponse=awaitdocs.documents.batchUpdate({
documentId,
requestBody:{
requests:[
{
insertText:{
location:{
index:insertIndex,
},
text:content,
},
},
],
},
});

return{
success:true,
output:{
documentId,
title:doc.data.title,
documentUrl:`https://docs.google.com/document/d/${documentId}/edit`,
updatedAt:newDate().toISOString(),
},
};
}catch(error){
return{
success:false,
error:`Failedtoupdatedocument:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*ReadcontentfromaGoogleDoc
*/
privateasyncreadDocument(
docs:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{documentId}=parameters;

if(!documentId){
return{
success:false,
error:"Missingrequiredparameter:documentId",
};
}

//Getthedocument
constresponse=awaitdocs.documents.get({
documentId,
});

constdoc=response.data;

//Extracttextcontentfromthedocument
lettextContent="";
if(doc.body&&doc.body.content){
for(constelementofdoc.body.content){
if(element.paragraph){
for(constparagraphElementofelement.paragraph.elements||[]){
if(paragraphElement.textRun){
textContent+=paragraphElement.textRun.content||"";
}
}
}
}
}

return{
success:true,
output:{
documentId:doc.documentId,
title:doc.title,
content:textContent,
documentUrl:`https://docs.google.com/document/d/${doc.documentId}/edit`,
revisionId:doc.revisionId,
},
};
}catch(error){
return{
success:false,
error:`Failedtoreaddocument:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}
}
