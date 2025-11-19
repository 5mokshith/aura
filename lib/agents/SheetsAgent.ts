import{google}from"googleapis";
import{Agent,ExecutionContext,ExecutionResult}from"./base";
import{chatCompletion}from"../llm/client";

/**
*SheetsAgenthandlesGoogleSheetsoperationsincludingcreatingspreadsheets,
*reading/writingdata,andanalyzingdatawithLLM
*/
exportclassSheetsAgentimplementsAgent{
name="SheetsAgent";

asyncexecute(context:ExecutionContext):Promise<ExecutionResult>{
try{
//InitializeSheetsAPIclientwithOAuthtoken
constauth=newgoogle.auth.OAuth2();
auth.setCredentials({access_token:context.accessToken});
constsheets=google.sheets({version:"v4",auth});

//Routetoappropriateactionhandler
switch(context.action){
case"create_spreadsheet":
returnawaitthis.createSpreadsheet(sheets,context.parameters);
case"read_data":
returnawaitthis.readData(sheets,context.parameters);
case"write_data":
returnawaitthis.writeData(sheets,context.parameters);
case"analyze_data":
returnawaitthis.analyzeData(sheets,context.parameters);
default:
return{
success:false,
error:`Unknownaction:${context.action}`,
};
}
}catch(error){
return{
success:false,
error:`SheetsAgentexecutionfailed:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*Createanewspreadsheet
*/
privateasynccreateSpreadsheet(
sheets:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{title,sheetTitles=["Sheet1"]}=parameters;

if(!title){
return{
success:false,
error:"Missingrequiredparameter:title",
};
}

//Createspreadsheetwithspecifiedsheets
constrequestBody={
properties:{
title,
},
sheets:sheetTitles.map((sheetTitle:string)=>({
properties:{
title:sheetTitle,
},
})),
};

constresponse=awaitsheets.spreadsheets.create({
requestBody,
});

return{
success:true,
output:{
spreadsheetId:response.data.spreadsheetId,
spreadsheetUrl:response.data.spreadsheetUrl,
title:response.data.properties.title,
sheets:response.data.sheets.map((sheet:any)=>({
sheetId:sheet.properties.sheetId,
title:sheet.properties.title,
})),
},
};
}catch(error){
return{
success:false,
error:`Failedtocreatespreadsheet:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*Readdatafromaspreadsheetrange
*/
privateasyncreadData(
sheets:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{spreadsheetId,range}=parameters;

if(!spreadsheetId||!range){
return{
success:false,
error:"Missingrequiredparameters:spreadsheetId,range",
};
}

constresponse=awaitsheets.spreadsheets.values.get({
spreadsheetId,
range,
});

constvalues=response.data.values||[];

return{
success:true,
output:{
range:response.data.range,
values,
rowCount:values.length,
columnCount:values.length>0?values[0].length:0,
},
};
}catch(error){
return{
success:false,
error:`Failedtoreaddata:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*Writedatatoaspreadsheetrange
*/
privateasyncwriteData(
sheets:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{
spreadsheetId,
range,
values,
valueInputOption="USER_ENTERED",
}=parameters;

if(!spreadsheetId||!range||!values){
return{
success:false,
error:"Missingrequiredparameters:spreadsheetId,range,values",
};
}

//Ensurevaluesisa2Darray
if(!Array.isArray(values)){
return{
success:false,
error:"Parameter'values'mustbea2Darray",
};
}

constresponse=awaitsheets.spreadsheets.values.update({
spreadsheetId,
range,
valueInputOption,
requestBody:{
values,
},
});

return{
success:true,
output:{
updatedRange:response.data.updatedRange,
updatedRows:response.data.updatedRows,
updatedColumns:response.data.updatedColumns,
updatedCells:response.data.updatedCells,
},
};
}catch(error){
return{
success:false,
error:`Failedtowritedata:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*AnalyzespreadsheetdatausingLLM
*/
privateasyncanalyzeData(
sheets:any,
parameters:Record<string,any>
):Promise<ExecutionResult>{
try{
const{spreadsheetId,range,analysisType="summary"}=parameters;

if(!spreadsheetId||!range){
return{
success:false,
error:"Missingrequiredparameters:spreadsheetId,range",
};
}

//First,readthedata
constreadResult=awaitthis.readData(sheets,{spreadsheetId,range});

if(!readResult.success||!readResult.output?.values?.length){
return{
success:true,
output:{
analysis:"Nodatafoundinthespecifiedrange.",
dataFound:false,
},
};
}

constvalues=readResult.output.values;

//PreparedataforLLManalysis
constdataText=this.formatDataForAnalysis(values);

//Generateanalysispromptbasedontype
letanalysisPrompt="";
switch(analysisType){
case"summary":
analysisPrompt=
"Provideasummaryofthisspreadsheetdata,includingkeystatistics,patterns,andnotableobservations.";
break;
case"insights":
analysisPrompt=
"Analyzethisspreadsheetdataandprovideactionableinsights,trends,andrecommendations.";
break;
case"trends":
analysisPrompt=
"Identifytrendsandpatternsinthisspreadsheetdata.Highlightanysignificantchangesoranomalies.";
break;
case"statistics":
analysisPrompt=
"Calculateandexplainkeystatisticsfromthisspreadsheetdata,includingaverages,totals,anddistributions.";
break;
default:
analysisPrompt=`Analyzethisspreadsheetdatawithfocuson:${analysisType}`;
}

//GenerateanalysisusingLLM
constllmResponse=awaitchatCompletion([
{
role:"system",
content:
"YouareanAIassistantthatanalyzesspreadsheetdata.Provideclear,actionableinsightsbasedonthedataprovided.Formatyourresponseinastructuredwaywithbulletpointsorsectionsasappropriate.",
},
{
role:"user",
content:`${analysisPrompt}\n\nSpreadsheetData:\n${dataText}`,
},
]);

return{
success:true,
output:{
analysis:llmResponse.content,
dataRange:readResult.output.range,
rowCount:readResult.output.rowCount,
columnCount:readResult.output.columnCount,
analysisType,
},
};
}catch(error){
return{
success:false,
error:`Failedtoanalyzedata:${errorinstanceofError?error.message:"Unknownerror"}`,
};
}
}

/**
*FormatspreadsheetdataforLLManalysis
*/
privateformatDataForAnalysis(values:any[][]):string{
if(values.length===0){
return"Nodataavailable";
}

//LimitdatasizeforLLMcontext
constmaxRows=100;
constlimitedValues=values.slice(0,maxRows);

//Checkiffirstrowlookslikeheaders
consthasHeaders=values[0].every(
(cell:any)=>typeofcell==="string"&&cell.trim().length>0
);

if(hasHeaders){
constheaders=values[0];
constdataRows=limitedValues.slice(1);

letformatted=`Headers:${headers.join("|")}\n\n`;
formatted+="Data:\n";
dataRows.forEach((row:any[],index:number)=>{
formatted+=`Row${index+1}:${row.join("|")}\n`;
});

if(values.length>maxRows){
formatted+=`\n...(${values.length-maxRows}morerowsnotshown)`;
}

returnformatted;
}else{
//Noheaders,justformatasrows
letformatted="Data:\n";
limitedValues.forEach((row:any[],index:number)=>{
formatted+=`Row${index+1}:${row.join("|")}\n`;
});

if(values.length>maxRows){
formatted+=`\n...(${values.length-maxRows}morerowsnotshown)`;
}

returnformatted;
}
}
}
