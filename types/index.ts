//Coreworkflowtypes
exporttypeWorkflowStatus=
|"idle"
|"planning"
|"executing"
|"completed"
|"failed"
|"cancelled";

exporttypeStepStatus="pending"|"running"|"completed"|"failed"|"cancelled";

exportinterfaceWorkflowStep{
id:string;
agentName:string;
action:string;
status:StepStatus;
startTime?:Date;
endTime?:Date;
input?:Record<string,unknown>;
output?:Record<string,unknown>;
error?:string;
}

exportinterfaceWorkflowState{
id:string;
status:WorkflowStatus;
command:string;
steps:WorkflowStep[];
results:WorkflowResult[];
error?:string;
startTime?:Date;
endTime?:Date;
}

//Resulttypes
exporttypeResultType="document"|"email"|"calendar"|"sheet"|"file";

exportinterfaceWorkflowResult{
id:string;
type:ResultType;
title:string;
preview?:string;
url?:string;
metadata:Record<string,unknown>;
}

//Quickactiontypes
exporttypeQuickActionCategory="email"|"docs"|"calendar"|"analysis";

exportinterfaceQuickActionParameter{
name:string;
label:string;
type:"text"|"number"|"date";
placeholder?:string;
required?:boolean;
defaultValue?:string;
}

exportinterfaceQuickAction{
id:string;
title:string;
description:string;
template:string;
icon:string;
category:QuickActionCategory;
isFavorite:boolean;
usageCount:number;
parameters?:QuickActionParameter[];
}

//Historytypes
exporttypeHistoryStatus="success"|"failed"|"cancelled";

exportinterfaceHistoryItem{
id:string;
command:string;
status:HistoryStatus;
timestamp:Date;
duration:number;
agentsUsed:string[];
resultCount:number;
}

exportinterfaceTaskHistoryEntry{
id:string;
userId:string;
command:string;
workflowState:WorkflowState;
createdAt:Date;
updatedAt:Date;
}

exportinterfaceHistoryFilters{
dateFrom?:Date;
dateTo?:Date;
status?:HistoryStatus;
agentType?:string;
searchQuery?:string;
}

//Authtypes
exportinterfaceAuthStatus{
isConnected:boolean;
userEmail?:string;
scopes:string[];
expiresAt?:Date;
}

exportinterfaceUserSession{
userId:string;
email:string;
isAuthenticated:boolean;
oauthStatus:AuthStatus;
preferences:UserPreferences;
}

exportinterfaceUserPreferences{
theme:"light"|"dark"|"system";
notificationsEnabled:boolean;
defaultView:"dashboard"|"history";
favoriteActions:string[];
}

//APItypes
exportinterfaceAPIError{
code:string;
message:string;
details?:Record<string,unknown>;
retryable:boolean;
}

//SSEeventtypes
exporttypeSSEEventType="step_start"|"step_complete"|"step_error"|"workflow_complete";

exportinterfaceSSEEvent{
type:SSEEventType;
stepId:string;
data:WorkflowStep;
}
