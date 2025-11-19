import{GoogleGenerativeAI}from"@google/generative-ai";
importOpenAIfrom"openai";

//LLMProvidertype
typeLLMProvider="gemini"|"openai"|"anthropic";

//ValidGeminimodelidentifiers
constVALID_GEMINI_MODELS=[
"gemini-2.0-flash-exp",
"gemini-1.5-flash",
"gemini-1.5-pro",
"gemini-1.0-pro",
]asconst;

//Defaultfallbackmodel
constDEFAULT_GEMINI_MODEL="gemini-1.5-flash";

//Retryconfigurationinterface
interfaceRetryConfig{
maxAttempts:number;
baseDelay:number;
maxDelay:number;
}

//Getretryconfigurationfromenvironmentwithsensibledefaults
constRETRY_CONFIG:RetryConfig={
maxAttempts:parseInt(process.env.LLM_MAX_RETRIES||"3"),
baseDelay:parseInt(process.env.LLM_RETRY_BASE_DELAY||"1000"),
maxDelay:parseInt(process.env.LLM_RETRY_MAX_DELAY||"8000"),
};

//Modelconfigurationinterface
interfaceModelConfig{
name:string;
isValid:boolean;
fallback?:string;
}

/**
*ValidateGeminimodelnameandreturnfallbackifinvalid
*Logsawarningwhenusingfallbackmodel
*/
functionvalidateAndGetModel(configuredModel:string):ModelConfig{
constisValid=VALID_GEMINI_MODELS.includes(configuredModelasany);

if(!isValid){
console.warn(`[ModelValidation]Invalidmodelnamedetected,usingfallbackmodel`,{
operation:"validateAndGetModel",
configuredModel,
validModels:VALID_GEMINI_MODELS,
fallbackModel:DEFAULT_GEMINI_MODEL,
message:`Model"${configuredModel}"isnotinthelistofvalidGeminimodels.Fallingbackto"${DEFAULT_GEMINI_MODEL}".`,
timestamp:newDate().toISOString(),
});

return{
name:DEFAULT_GEMINI_MODEL,
isValid:false,
fallback:DEFAULT_GEMINI_MODEL,
};
}

return{
name:configuredModel,
isValid:true,
};
}

/**
*Checkifanerrorisretryable(503ServiceUnavailableorratelimiterrors)
*/
functionisRetryableError(error:any):boolean{
//Checkfor503statuscode
if(error?.status===503||error?.statusCode===503){
returntrue;
}

//Checkforratelimiterrors
if(error?.message?.includes("503")||error?.message?.includes("overloaded")){
returntrue;
}

//CheckforRESOURCE_EXHAUSTEDerrorsfromGemini
if(error?.message?.includes("RESOURCE_EXHAUSTED")){
returntrue;
}

returnfalse;
}

/**
*Retryanasyncoperationwithexponentialbackoff
*Retriesonlyon503errorsandratelimiterrors
*/
asyncfunctionwithRetry<T>(
operation:()=>Promise<T>,
config:RetryConfig=RETRY_CONFIG,
context:string="operation"
):Promise<T>{
letlastError:Error|null=null;

for(letattempt=1;attempt<=config.maxAttempts;attempt++){
try{
returnawaitoperation();
}catch(error){
lastError=errorinstanceofError?error:newError(String(error));

//Onlyretryonretryableerrors
if(!isRetryableError(error)){
console.error(`[RetryLogic]Non-retryableerrorencountered`,{
operation:context,
attempt,
maxAttempts:config.maxAttempts,
error:lastError.message,
errorStack:lastError.stack,
timestamp:newDate().toISOString(),
});
throwlastError;
}

//Don'tretryifwe'veexhaustedattempts
if(attempt>=config.maxAttempts){
console.error(`[RetryLogic]Allretryattemptsexhausted`,{
operation:context,
attempt,
maxAttempts:config.maxAttempts,
error:lastError.message,
errorStack:lastError.stack,
message:`Failedafter${config.maxAttempts}retryattempts`,
timestamp:newDate().toISOString(),
});
throwlastError;
}

//Calculatedelaywithexponentialbackoff:baseDelay*2^(attempt-1)
constdelay=Math.min(
config.baseDelay*Math.pow(2,attempt-1),
config.maxDelay
);

console.warn(`[RetryLogic]Retryingafterretryableerror`,{
operation:context,
attempt,
maxAttempts:config.maxAttempts,
nextAttempt:attempt+1,
delayMs:delay,
error:lastError.message,
message:`Attempt${attempt}/${config.maxAttempts}failedwithretryableerror.Retryingin${delay}ms...`,
timestamp:newDate().toISOString(),
});

//Waitbeforeretrying
awaitnewPromise(resolve=>setTimeout(resolve,delay));
}
}

//Thisshouldneverbereached,butTypeScriptneedsit
throwlastError||newError(`${context}failedafter${config.maxAttempts}attempts`);
}

//Getconfiguredprovider
constprovider=(process.env.LLM_PROVIDER||"gemini")asLLMProvider;

//Initializeclientsbasedonprovider
letgeminiClient:GoogleGenerativeAI|null=null;
letopenaiClient:OpenAI|null=null;

if(provider==="gemini"&&process.env.GOOGLE_GEMINI_API_KEY){
geminiClient=newGoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
}elseif(provider==="openai"&&process.env.OPENAI_API_KEY){
openaiClient=newOpenAI({
apiKey:process.env.OPENAI_API_KEY,
});
}

exportinterfaceLLMMessage{
role:"system"|"user"|"assistant";
content:string;
}

exportinterfaceLLMResponse{
content:string;
usage?:{
promptTokens:number;
completionTokens:number;
totalTokens:number;
};
}

exportinterfaceLLMOptions{
model?:string;
temperature?:number;
maxTokens?:number;
stream?:boolean;
}

/**
*ExtractJSONcontentfrommarkdowncodefences
*Handlesboth```jsonand```fenceformats
*/
exportfunctionextractJSON(response:string):string{
//Trimwhitespace
letcleaned=response.trim();

//Removemarkdowncodefenceswithjsonlanguageidentifier
if(cleaned.startsWith("```json")){
cleaned=cleaned.replace(/^```json\s*\n?/,"");
}

//Removegenericmarkdowncodefences
if(cleaned.startsWith("```")){
cleaned=cleaned.replace(/^```\s*\n?/,"");
}

//Removeclosingfence
if(cleaned.endsWith("```")){
cleaned=cleaned.replace(/\n?```\s*$/,"");
}

returncleaned.trim();
}

/**
*SafelyparseJSONwithdetailederrorlogging
*Automaticallystripsmarkdowncodefencesbeforeparsing
*/
exportfunctionsafeJSONParse<T>(response:string,context:string):T{
try{
constcleaned=extractJSON(response);
returnJSON.parse(cleaned)asT;
}catch(error){
//Lograwresponsefordebugging
console.error(`[JSONParsing]FailedtoparseLLMresponse`,{
operation:context,
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
rawResponse:response.substring(0,500),//Logfirst500chars
cleanedResponse:extractJSON(response).substring(0,500),
responseLength:response.length,
message:`JSONparsingfailedin${context}.ThismayindicatetheLLMreturnedinvalidJSONorunexpectedformatting.`,
timestamp:newDate().toISOString(),
});

thrownewError(
`FailedtoparseJSONin${context}:${errorinstanceofError?error.message:"Unknownerror"}`
);
}
}

/**
*ConvertmessagestoGeminiformat
*/
functionconvertToGeminiMessages(messages:LLMMessage[]):{
systemInstruction?:string;
contents:Array<{role:string;parts:Array<{text:string}>}>;
}{
constsystemMessages=messages.filter((m)=>m.role==="system");
constchatMessages=messages.filter((m)=>m.role!=="system");

constsystemInstruction=systemMessages.map((m)=>m.content).join("\n\n");

constcontents=chatMessages.map((msg)=>({
role:msg.role==="assistant"?"model":"user",
parts:[{text:msg.content}],
}));

return{
systemInstruction:systemInstruction||undefined,
contents,
};
}

/**
*SendachatcompletionrequestusingGemini
*/
asyncfunctiongeminiChatCompletion(
messages:LLMMessage[],
options:LLMOptions={}
):Promise<LLMResponse>{
if(!geminiClient){
thrownewError("Geminiclientnotinitialized.CheckGOOGLE_GEMINI_API_KEY.");
}

const{
model=process.env.GOOGLE_GEMINI_MODEL||"gemini-2.0-flash-exp",
temperature=parseFloat(process.env.LLM_TEMPERATURE||"0.7"),
maxTokens=parseInt(process.env.GEMINI_MAX_TOKENS||"8192"),
}=options;

//Validatemodelnameandusefallbackifinvalid
constmodelConfig=validateAndGetModel(model);
constvalidatedModel=modelConfig.name;

//WraptheAPIcallwithretrylogic
returnwithRetry(
async()=>{
try{
const{systemInstruction,contents}=convertToGeminiMessages(messages);

constgeminiModel=geminiClient!.getGenerativeModel({
model:validatedModel,
systemInstruction,
generationConfig:{
temperature,
maxOutputTokens:maxTokens,
},
});

constresult=awaitgeminiModel.generateContent({
contents,
});

constresponse=result.response;
consttext=response.text();

return{
content:text,
usage:response.usageMetadata
?{
promptTokens:response.usageMetadata.promptTokenCount||0,
completionTokens:response.usageMetadata.candidatesTokenCount||0,
totalTokens:response.usageMetadata.totalTokenCount||0,
}
:undefined,
};
}catch(error){
console.error(`[LLMClient]GeminiAPIrequestfailed`,{
operation:"geminiChatCompletion",
model:validatedModel,
provider:"gemini",
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
temperature,
maxTokens,
messageCount:messages.length,
timestamp:newDate().toISOString(),
});
throwerror;
}
},
RETRY_CONFIG,
`GeminiChatCompletion(model:${validatedModel})`
);
}

/**
*SendachatcompletionrequestusingOpenAI
*/
asyncfunctionopenaiChatCompletion(
messages:LLMMessage[],
options:LLMOptions={}
):Promise<LLMResponse>{
if(!openaiClient){
thrownewError("OpenAIclientnotinitialized.CheckOPENAI_API_KEY.");
}

const{
model=process.env.OPENAI_MODEL||"gpt-4-turbo-preview",
temperature=parseFloat(process.env.LLM_TEMPERATURE||"0.7"),
maxTokens=parseInt(process.env.OPENAI_MAX_TOKENS||"4096"),
}=options;

try{
constresponse=awaitopenaiClient.chat.completions.create({
model,
messages,
temperature,
max_tokens:maxTokens,
});

constchoice=response.choices[0];

return{
content:choice.message.content||"",
usage:response.usage
?{
promptTokens:response.usage.prompt_tokens,
completionTokens:response.usage.completion_tokens,
totalTokens:response.usage.total_tokens,
}
:undefined,
};
}catch(error){
console.error(`[LLMClient]OpenAIAPIrequestfailed`,{
operation:"openaiChatCompletion",
model,
provider:"openai",
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
temperature,
maxTokens,
messageCount:messages.length,
timestamp:newDate().toISOString(),
});
thrownewError(
`OpenAIrequestfailed:${errorinstanceofError?error.message:"Unknownerror"}`
);
}
}

/**
*SendachatcompletionrequesttotheconfiguredLLM
*/
exportasyncfunctionchatCompletion(
messages:LLMMessage[],
options:LLMOptions={}
):Promise<LLMResponse>{
switch(provider){
case"gemini":
returngeminiChatCompletion(messages,options);
case"openai":
returnopenaiChatCompletion(messages,options);
default:
thrownewError(`UnsupportedLLMprovider:${provider}`);
}
}

/**
*StreamachatcompletionresponseusingGemini
*/
asyncfunction*geminiStreamChatCompletion(
messages:LLMMessage[],
options:LLMOptions={}
):AsyncGenerator<string,void,unknown>{
if(!geminiClient){
thrownewError("Geminiclientnotinitialized.CheckGOOGLE_GEMINI_API_KEY.");
}

const{
model=process.env.GOOGLE_GEMINI_MODEL||"gemini-2.0-flash-exp",
temperature=parseFloat(process.env.LLM_TEMPERATURE||"0.7"),
maxTokens=parseInt(process.env.GEMINI_MAX_TOKENS||"8192"),
}=options;

//Validatemodelnameandusefallbackifinvalid
constmodelConfig=validateAndGetModel(model);
constvalidatedModel=modelConfig.name;

//WrapthestreamingAPIcallwithretrylogic
conststreamGenerator=awaitwithRetry(
async()=>{
try{
const{systemInstruction,contents}=convertToGeminiMessages(messages);

constgeminiModel=geminiClient!.getGenerativeModel({
model:validatedModel,
systemInstruction,
generationConfig:{
temperature,
maxOutputTokens:maxTokens,
},
});

returnawaitgeminiModel.generateContentStream({
contents,
});
}catch(error){
console.error(`[LLMClient]Geministreamingrequestfailed`,{
operation:"geminiStreamChatCompletion",
model:validatedModel,
provider:"gemini",
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
temperature,
maxTokens,
messageCount:messages.length,
timestamp:newDate().toISOString(),
});
throwerror;
}
},
RETRY_CONFIG,
`GeminiStreaming(model:${validatedModel})`
);

forawait(constchunkofstreamGenerator.stream){
consttext=chunk.text();
if(text){
yieldtext;
}
}
}

/**
*StreamachatcompletionresponseusingOpenAI
*/
asyncfunction*openaiStreamChatCompletion(
messages:LLMMessage[],
options:LLMOptions={}
):AsyncGenerator<string,void,unknown>{
if(!openaiClient){
thrownewError("OpenAIclientnotinitialized.CheckOPENAI_API_KEY.");
}

const{
model=process.env.OPENAI_MODEL||"gpt-4-turbo-preview",
temperature=parseFloat(process.env.LLM_TEMPERATURE||"0.7"),
maxTokens=parseInt(process.env.OPENAI_MAX_TOKENS||"4096"),
}=options;

try{
conststream=awaitopenaiClient.chat.completions.create({
model,
messages,
temperature,
max_tokens:maxTokens,
stream:true,
});

forawait(constchunkofstream){
constcontent=chunk.choices[0]?.delta?.content;
if(content){
yieldcontent;
}
}
}catch(error){
console.error(`[LLMClient]OpenAIstreamingrequestfailed`,{
operation:"openaiStreamChatCompletion",
model,
provider:"openai",
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
temperature,
maxTokens,
messageCount:messages.length,
timestamp:newDate().toISOString(),
});
thrownewError(
`OpenAIstreamingfailed:${errorinstanceofError?error.message:"Unknownerror"}`
);
}
}

/**
*StreamachatcompletionresponsefromtheconfiguredLLM
*/
exportasyncfunction*streamChatCompletion(
messages:LLMMessage[],
options:LLMOptions={}
):AsyncGenerator<string,void,unknown>{
switch(provider){
case"gemini":
yield*geminiStreamChatCompletion(messages,options);
break;
case"openai":
yield*openaiStreamChatCompletion(messages,options);
break;
default:
thrownewError(`UnsupportedLLMprovider:${provider}`);
}
}

/**
*Parseanaturallanguagecommandandextractintentandparameters
*/
exportasyncfunctionparseCommand(command:string):Promise<{
intent:string;
parameters:Record<string,any>;
confidence:number;
}>{
constsystemPrompt=`YouareanAIassistantthatparsesnaturallanguagecommandsforaworkflowautomationsystem.
Extracttheuser'sintentandanyrelevantparametersfromtheircommand.

RespondinJSONformat:
{
"intent":"action_type",
"parameters":{"key":"value"},
"confidence":0.0-1.0
}

Commonintents:
-"send_email":Sendanemail
-"create_document":CreateaGoogleDoc
-"create_spreadsheet":CreateaGoogleSheet
-"schedule_meeting":Createacalendarevent
-"search_emails":SearchGmail
-"summarize_emails":Summarizeemails
-"analyze_data":Analyzedatafromsheets
-"generate_report":Generateareport`;

constmodel=process.env.GOOGLE_GEMINI_MODEL||"gemini-2.0-flash-exp";
constmodelConfig=validateAndGetModel(model);
constvalidatedModel=modelConfig.name;

try{
constresponse=awaitchatCompletion([
{role:"system",content:systemPrompt},
{role:"user",content:command},
]);

returnsafeJSONParse<{
intent:string;
parameters:Record<string,any>;
confidence:number;
}>(response.content,"parseCommand");
}catch(error){
console.error(`[LLMClient]Commandparsingfailed`,{
operation:"parseCommand",
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
model:validatedModel,
provider,
command:command.substring(0,100),//Logfirst100charsofcommand
commandLength:command.length,
message:"Failedtoparseusercommandintostructuredintentandparameters",
timestamp:newDate().toISOString(),
});
return{
intent:"unknown",
parameters:{},
confidence:0,
};
}
}

/**
*Generateaworkflowplanfromacommand
*/
exportasyncfunctiongenerateWorkflowPlan(command:string):Promise<{
steps:Array<{
id:string;
agentName:string;
action:string;
description:string;
dependencies:string[];
}>;
estimatedDuration:number;
}>{
constsystemPrompt=`YouareanAIworkflowplanner.Givenausercommand,breakitdownintoasequenceofstepsthatcanbeexecutedbyspecializedagents.

Availableagents:
-EmailAgent:Send,read,search,andmanageemails
-DriveAgent:Create,read,updatefilesinGoogleDrive
-DocsAgent:CreateandeditGoogleDocs
-SheetsAgent:CreateandeditGoogleSheets
-CalendarAgent:Createandmanagecalendarevents
-AnalysisAgent:Analyzedataandgenerateinsights

RespondinJSONformat:
{
"steps":[
{
"id":"step_1",
"agentName":"AgentName",
"action":"action_name",
"description":"Whatthisstepdoes",
"dependencies":["step_id"]
}
],
"estimatedDuration":30
}`;

constmodel=process.env.GOOGLE_GEMINI_MODEL||"gemini-2.0-flash-exp";
constmodelConfig=validateAndGetModel(model);
constvalidatedModel=modelConfig.name;

try{
constresponse=awaitchatCompletion([
{role:"system",content:systemPrompt},
{role:"user",content:`Planworkflowfor:${command}`},
]);

returnsafeJSONParse<{
steps:Array<{
id:string;
agentName:string;
action:string;
description:string;
dependencies:string[];
}>;
estimatedDuration:number;
}>(response.content,"generateWorkflowPlan");
}catch(error){
console.error(`[LLMClient]Workflowplangenerationfailed`,{
operation:"generateWorkflowPlan",
error:errorinstanceofError?error.message:"Unknownerror",
errorStack:errorinstanceofError?error.stack:undefined,
model:validatedModel,
provider,
command:command.substring(0,100),//Logfirst100charsofcommand
commandLength:command.length,
message:"Failedtogenerateworkflowplanfromusercommand",
timestamp:newDate().toISOString(),
});
return{
steps:[],
estimatedDuration:0,
};
}
}

//Exporttheactiveclientfordirectaccessifneeded
exportconstllmClient=provider==="gemini"?geminiClient:openaiClient;
exportconstllmProvider=provider;
