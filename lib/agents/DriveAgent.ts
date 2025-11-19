import{google}from"googleapis";
import{Agent,ExecutionContext,ExecutionResult}from"./base";

/**
*DriveAgenthandlesGoogleDriveoperationsincludingfoldercreation,fileuploads,listing,andsharing
*/
exportclassDriveAgentimplementsAgent{
name="DriveAgent";

asyncexecute(context:ExecutionContext):Promise<ExecutionResult>{
try{
//InitializeDriveAPIclientwithOAuthtoken
constauth=newgoogle.auth.OAuth2();
auth.setCredentials({access_token:context.accessToken});
constdrive=google.drive({version:"v3",auth});

//Routetoappropriateactionhandler
switch(context.action){
case"create_folder":
returnawaitthis.createFolder(drive,context.parameters);
case"upload_file":
returnawaitthis.uploadFile(drive,context.parameters);
case"list_files":
returnawaitthis.listFiles(drive,context.parameters);
case"share_file":
returnawaitthis.shareFile(drive,context.parameters);
default:
return{
success:false,
error:`Unknownaction:${context.action}`,
};
}
}catch(error){
return{
success:false,
error:`DriveAgentexecutionfailed:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*CreateafolderinGoogleDrive
*/
privateasynccreateFolder(
drive:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{name,parentId}=parameters;

if(!name){
return{
success:false,
error:"Missingrequiredparameter:name",
};
}

constfileMetadata:any={
name,
mimeType:"application/vnd.google-apps.folder",
};

//IfparentIdisprovided,createfolderinsidethatparent
if(parentId){
fileMetadata.parents=[parentId];
}

constresponse=awaitdrive.files.create({
requestBody:fileMetadata,
fields:"id,name,webViewLink,createdTime",
});

return{
success:true,
output:{
folderId:response.data.id,
name:response.data.name,
webViewLink:response.data.webViewLink,
createdTime:response.data.createdTime,
},
};
}catch(error){
return{
success:false,
error:`Failedtocreatefolder:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*UploadafiletoGoogleDrive
*/
privateasyncuploadFile(
drive:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{name,content,mimeType="text/plain",parentId}=parameters;

if(!name||!content){
return{
success:false,
error:"Missingrequiredparameters:name,content",
};
}

constfileMetadata:any={
name,
};

//IfparentIdisprovided,uploadfiletothatfolder
if(parentId){
fileMetadata.parents=[parentId];
}

constmedia={
mimeType,
body:content,
};

constresponse=awaitdrive.files.create({
requestBody:fileMetadata,
media,
fields:"id,name,webViewLink,mimeType,size,createdTime",
});

return{
success:true,
output:{
fileId:response.data.id,
name:response.data.name,
webViewLink:response.data.webViewLink,
mimeType:response.data.mimeType,
size:response.data.size,
createdTime:response.data.createdTime,
},
};
}catch(error){
return{
success:false,
error:`Failedtouploadfile:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*ListfilesinGoogleDrive
*/
privateasynclistFiles(
drive:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{
query,
folderId,
maxResults=10,
orderBy="modifiedTimedesc",
}=parameters;

//Buildquerystring
letq="";
if(query){
q=query;
}elseif(folderId){
q=`'${folderId}'inparentsandtrashed=false`;
}else{
q="trashed=false";
}

constresponse=awaitdrive.files.list({
q,
pageSize:maxResults,
orderBy,
fields:
"files(id,name,mimeType,webViewLink,size,createdTime,modifiedTime,owners)",
});

constfiles=response.data.files||[];

return{
success:true,
output:{
files:files.map((file:any)=>({
id:file.id,
name:file.name,
mimeType:file.mimeType,
webViewLink:file.webViewLink,
size:file.size,
createdTime:file.createdTime,
modifiedTime:file.modifiedTime,
owners:file.owners?.map((owner:any)=>owner.emailAddress),
})),
fileCount:files.length,
},
};
}catch(error){
return{
success:false,
error:`Failedtolistfiles:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*Shareafileorfolderwithspecifiedusers
*/
privateasyncshareFile(
drive:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{fileId,email,role="reader",type="user"}=parameters;

if(!fileId||!email){
return{
success:false,
error:"Missingrequiredparameters:fileId,email",
};
}

//Validaterole
constvalidRoles=["reader","writer","commenter","owner"];
if(!validRoles.includes(role)){
return{
success:false,
error:`Invalidrole:${role}.Mustbeoneof:${validRoles.join(",")}`,
};
}

//Createpermission
constresponse=awaitdrive.permissions.create({
fileId,
requestBody:{
type,
role,
emailAddress:email,
},
fields:"id,type,role,emailAddress",
});

//Getfiledetails
constfileResponse=awaitdrive.files.get({
fileId,
fields:"id,name,webViewLink",
});

return{
success:true,
output:{
permissionId:response.data.id,
fileId,
fileName:fileResponse.data.name,
webViewLink:fileResponse.data.webViewLink,
sharedWith:response.data.emailAddress,
role:response.data.role,
},
};
}catch(error){
return{
success:false,
error:`Failedtosharefile:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}
}
