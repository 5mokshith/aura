//***REMOVED***Core***REMOVED***workflow***REMOVED***types
export***REMOVED***type***REMOVED***WorkflowStatus***REMOVED***=
***REMOVED******REMOVED***|***REMOVED***"idle"
***REMOVED******REMOVED***|***REMOVED***"planning"
***REMOVED******REMOVED***|***REMOVED***"executing"
***REMOVED******REMOVED***|***REMOVED***"completed"
***REMOVED******REMOVED***|***REMOVED***"failed"
***REMOVED******REMOVED***|***REMOVED***"cancelled";

export***REMOVED***type***REMOVED***StepStatus***REMOVED***=***REMOVED***"pending"***REMOVED***|***REMOVED***"running"***REMOVED***|***REMOVED***"completed"***REMOVED***|***REMOVED***"failed"***REMOVED***|***REMOVED***"cancelled";

export***REMOVED***interface***REMOVED***WorkflowStep***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***agentName:***REMOVED***string;
***REMOVED******REMOVED***action:***REMOVED***string;
***REMOVED******REMOVED***status:***REMOVED***StepStatus;
***REMOVED******REMOVED***startTime?:***REMOVED***Date;
***REMOVED******REMOVED***endTime?:***REMOVED***Date;
***REMOVED******REMOVED***input?:***REMOVED***Record<string,***REMOVED***unknown>;
***REMOVED******REMOVED***output?:***REMOVED***Record<string,***REMOVED***unknown>;
***REMOVED******REMOVED***error?:***REMOVED***string;
}

export***REMOVED***interface***REMOVED***WorkflowState***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***status:***REMOVED***WorkflowStatus;
***REMOVED******REMOVED***command:***REMOVED***string;
***REMOVED******REMOVED***steps:***REMOVED***WorkflowStep[];
***REMOVED******REMOVED***results:***REMOVED***WorkflowResult[];
***REMOVED******REMOVED***error?:***REMOVED***string;
***REMOVED******REMOVED***startTime?:***REMOVED***Date;
***REMOVED******REMOVED***endTime?:***REMOVED***Date;
}

//***REMOVED***Result***REMOVED***types
export***REMOVED***type***REMOVED***ResultType***REMOVED***=***REMOVED***"document"***REMOVED***|***REMOVED***"email"***REMOVED***|***REMOVED***"calendar"***REMOVED***|***REMOVED***"sheet"***REMOVED***|***REMOVED***"file";

export***REMOVED***interface***REMOVED***WorkflowResult***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***type:***REMOVED***ResultType;
***REMOVED******REMOVED***title:***REMOVED***string;
***REMOVED******REMOVED***preview?:***REMOVED***string;
***REMOVED******REMOVED***url?:***REMOVED***string;
***REMOVED******REMOVED***metadata:***REMOVED***Record<string,***REMOVED***unknown>;
}

//***REMOVED***Quick***REMOVED***action***REMOVED***types
export***REMOVED***type***REMOVED***QuickActionCategory***REMOVED***=***REMOVED***"email"***REMOVED***|***REMOVED***"docs"***REMOVED***|***REMOVED***"calendar"***REMOVED***|***REMOVED***"analysis";

export***REMOVED***interface***REMOVED***QuickActionParameter***REMOVED***{
***REMOVED******REMOVED***name:***REMOVED***string;
***REMOVED******REMOVED***label:***REMOVED***string;
***REMOVED******REMOVED***type:***REMOVED***"text"***REMOVED***|***REMOVED***"number"***REMOVED***|***REMOVED***"date";
***REMOVED******REMOVED***placeholder?:***REMOVED***string;
***REMOVED******REMOVED***required?:***REMOVED***boolean;
***REMOVED******REMOVED***defaultValue?:***REMOVED***string;
}

export***REMOVED***interface***REMOVED***QuickAction***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***title:***REMOVED***string;
***REMOVED******REMOVED***description:***REMOVED***string;
***REMOVED******REMOVED***template:***REMOVED***string;
***REMOVED******REMOVED***icon:***REMOVED***string;
***REMOVED******REMOVED***category:***REMOVED***QuickActionCategory;
***REMOVED******REMOVED***isFavorite:***REMOVED***boolean;
***REMOVED******REMOVED***usageCount:***REMOVED***number;
***REMOVED******REMOVED***parameters?:***REMOVED***QuickActionParameter[];
}

//***REMOVED***History***REMOVED***types
export***REMOVED***type***REMOVED***HistoryStatus***REMOVED***=***REMOVED***"success"***REMOVED***|***REMOVED***"failed"***REMOVED***|***REMOVED***"cancelled";

export***REMOVED***interface***REMOVED***HistoryItem***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***command:***REMOVED***string;
***REMOVED******REMOVED***status:***REMOVED***HistoryStatus;
***REMOVED******REMOVED***timestamp:***REMOVED***Date;
***REMOVED******REMOVED***duration:***REMOVED***number;
***REMOVED******REMOVED***agentsUsed:***REMOVED***string[];
***REMOVED******REMOVED***resultCount:***REMOVED***number;
}

export***REMOVED***interface***REMOVED***TaskHistoryEntry***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***userId:***REMOVED***string;
***REMOVED******REMOVED***command:***REMOVED***string;
***REMOVED******REMOVED***workflowState:***REMOVED***WorkflowState;
***REMOVED******REMOVED***createdAt:***REMOVED***Date;
***REMOVED******REMOVED***updatedAt:***REMOVED***Date;
}

export***REMOVED***interface***REMOVED***HistoryFilters***REMOVED***{
***REMOVED******REMOVED***dateFrom?:***REMOVED***Date;
***REMOVED******REMOVED***dateTo?:***REMOVED***Date;
***REMOVED******REMOVED***status?:***REMOVED***HistoryStatus;
***REMOVED******REMOVED***agentType?:***REMOVED***string;
***REMOVED******REMOVED***searchQuery?:***REMOVED***string;
}

//***REMOVED***Auth***REMOVED***types
export***REMOVED***interface***REMOVED***AuthStatus***REMOVED***{
***REMOVED******REMOVED***isConnected:***REMOVED***boolean;
***REMOVED******REMOVED***userEmail?:***REMOVED***string;
***REMOVED******REMOVED***scopes:***REMOVED***string[];
***REMOVED******REMOVED***expiresAt?:***REMOVED***Date;
}

export***REMOVED***interface***REMOVED***UserSession***REMOVED***{
***REMOVED******REMOVED***userId:***REMOVED***string;
***REMOVED******REMOVED***email:***REMOVED***string;
***REMOVED******REMOVED***isAuthenticated:***REMOVED***boolean;
***REMOVED******REMOVED***oauthStatus:***REMOVED***AuthStatus;
***REMOVED******REMOVED***preferences:***REMOVED***UserPreferences;
}

export***REMOVED***interface***REMOVED***UserPreferences***REMOVED***{
***REMOVED******REMOVED***theme:***REMOVED***"light"***REMOVED***|***REMOVED***"dark"***REMOVED***|***REMOVED***"system";
***REMOVED******REMOVED***notificationsEnabled:***REMOVED***boolean;
***REMOVED******REMOVED***defaultView:***REMOVED***"dashboard"***REMOVED***|***REMOVED***"history";
***REMOVED******REMOVED***favoriteActions:***REMOVED***string[];
}

//***REMOVED***API***REMOVED***types
export***REMOVED***interface***REMOVED***APIError***REMOVED***{
***REMOVED******REMOVED***code:***REMOVED***string;
***REMOVED******REMOVED***message:***REMOVED***string;
***REMOVED******REMOVED***details?:***REMOVED***Record<string,***REMOVED***unknown>;
***REMOVED******REMOVED***retryable:***REMOVED***boolean;
}

//***REMOVED***SSE***REMOVED***event***REMOVED***types
export***REMOVED***type***REMOVED***SSEEventType***REMOVED***=***REMOVED***"step_start"***REMOVED***|***REMOVED***"step_complete"***REMOVED***|***REMOVED***"step_error"***REMOVED***|***REMOVED***"workflow_complete";

export***REMOVED***interface***REMOVED***SSEEvent***REMOVED***{
***REMOVED******REMOVED***type:***REMOVED***SSEEventType;
***REMOVED******REMOVED***stepId:***REMOVED***string;
***REMOVED******REMOVED***data:***REMOVED***WorkflowStep;
}
