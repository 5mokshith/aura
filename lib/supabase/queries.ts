import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"./client";
import***REMOVED***type***REMOVED***{***REMOVED***Database***REMOVED***}***REMOVED***from***REMOVED***"./database.types";

type***REMOVED***Profile***REMOVED***=***REMOVED***Database["public"]["Tables"]["profiles"]["Row"];
type***REMOVED***Workflow***REMOVED***=***REMOVED***Database["public"]["Tables"]["workflows"]["Row"];
type***REMOVED***WorkflowHistory***REMOVED***=***REMOVED***Database["public"]["Tables"]["workflow_history"]["Row"];
type***REMOVED***OAuthToken***REMOVED***=***REMOVED***Database["public"]["Tables"]["oauth_tokens"]["Row"];

//***REMOVED***Profile***REMOVED***queries
export***REMOVED***async***REMOVED***function***REMOVED***getProfile(userId:***REMOVED***string)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("profiles")
***REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Profile;
}

export***REMOVED***async***REMOVED***function***REMOVED***updateProfile(
***REMOVED******REMOVED***userId:***REMOVED***string,
***REMOVED******REMOVED***updates:***REMOVED***Database["public"]["Tables"]["profiles"]["Update"]
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("profiles")
***REMOVED******REMOVED******REMOVED******REMOVED***.update(updates)
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Profile;
}

export***REMOVED***async***REMOVED***function***REMOVED***upsertProfile(
***REMOVED******REMOVED***profile:***REMOVED***Database["public"]["Tables"]["profiles"]["Insert"]
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("profiles")
***REMOVED******REMOVED******REMOVED******REMOVED***.upsert(profile)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Profile;
}

//***REMOVED***Workflow***REMOVED***queries
export***REMOVED***async***REMOVED***function***REMOVED***createWorkflow(
***REMOVED******REMOVED***workflow:***REMOVED***Database["public"]["Tables"]["workflows"]["Insert"]
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED***.insert(workflow)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Workflow;
}

export***REMOVED***async***REMOVED***function***REMOVED***getWorkflow(workflowId:***REMOVED***string)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***workflowId)
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Workflow;
}

export***REMOVED***async***REMOVED***function***REMOVED***updateWorkflow(
***REMOVED******REMOVED***workflowId:***REMOVED***string,
***REMOVED******REMOVED***updates:***REMOVED***Database["public"]["Tables"]["workflows"]["Update"]
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED***.update(updates)
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***workflowId)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Workflow;
}

export***REMOVED***async***REMOVED***function***REMOVED***getUserWorkflows(userId:***REMOVED***string,***REMOVED***limit***REMOVED***=***REMOVED***10)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflows")
***REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED***.order("created_at",***REMOVED***{***REMOVED***ascending:***REMOVED***false***REMOVED***})
***REMOVED******REMOVED******REMOVED******REMOVED***.limit(limit);

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***Workflow[];
}

//***REMOVED***Workflow***REMOVED***history***REMOVED***queries
export***REMOVED***async***REMOVED***function***REMOVED***addWorkflowHistory(
***REMOVED******REMOVED***history:***REMOVED***Database["public"]["Tables"]["workflow_history"]["Insert"]
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflow_history")
***REMOVED******REMOVED******REMOVED******REMOVED***.insert(history)
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***WorkflowHistory;
}

export***REMOVED***async***REMOVED***function***REMOVED***getUserWorkflowHistory(userId:***REMOVED***string,***REMOVED***limit***REMOVED***=***REMOVED***20)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflow_history")
***REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED***.order("executed_at",***REMOVED***{***REMOVED***ascending:***REMOVED***false***REMOVED***})
***REMOVED******REMOVED******REMOVED******REMOVED***.limit(limit);

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***WorkflowHistory[];
}

export***REMOVED***async***REMOVED***function***REMOVED***deleteWorkflowHistory(historyId:***REMOVED***string)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflow_history")
***REMOVED******REMOVED******REMOVED******REMOVED***.delete()
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("id",***REMOVED***historyId);

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
}

export***REMOVED***async***REMOVED***function***REMOVED***clearUserWorkflowHistory(userId:***REMOVED***string)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("workflow_history")
***REMOVED******REMOVED******REMOVED******REMOVED***.delete()
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***userId);

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
}

//***REMOVED***OAuth***REMOVED***token***REMOVED***queries
export***REMOVED***async***REMOVED***function***REMOVED***storeGoogleOAuthTokens(
***REMOVED******REMOVED***userId:***REMOVED***string,
***REMOVED******REMOVED***accessToken:***REMOVED***string,
***REMOVED******REMOVED***refreshToken:***REMOVED***string***REMOVED***|***REMOVED***null,
***REMOVED******REMOVED***expiresAt:***REMOVED***Date,
***REMOVED******REMOVED***scopes:***REMOVED***string[]
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("oauth_tokens")
***REMOVED******REMOVED******REMOVED******REMOVED***.upsert({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***user_id:***REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***provider:***REMOVED***"google",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***access_token:***REMOVED***accessToken,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***refresh_token:***REMOVED***refreshToken,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expires_at:***REMOVED***expiresAt.toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***scopes,
***REMOVED******REMOVED******REMOVED******REMOVED***})
***REMOVED******REMOVED******REMOVED******REMOVED***.select()
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***OAuthToken;
}

export***REMOVED***async***REMOVED***function***REMOVED***getGoogleOAuthTokens(userId:***REMOVED***string)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***data,***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("oauth_tokens")
***REMOVED******REMOVED******REMOVED******REMOVED***.select("*")
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("provider",***REMOVED***"google")
***REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(error.code***REMOVED***===***REMOVED***"PGRST116")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***No***REMOVED***tokens***REMOVED***found
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***null;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***
***REMOVED******REMOVED***return***REMOVED***data***REMOVED***as***REMOVED***OAuthToken;
}

export***REMOVED***async***REMOVED***function***REMOVED***deleteGoogleOAuthTokens(userId:***REMOVED***string)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***createClient();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***error***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase
***REMOVED******REMOVED******REMOVED******REMOVED***.from("oauth_tokens")
***REMOVED******REMOVED******REMOVED******REMOVED***.delete()
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("user_id",***REMOVED***userId)
***REMOVED******REMOVED******REMOVED******REMOVED***.eq("provider",***REMOVED***"google");

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***throw***REMOVED***error;
}

export***REMOVED***async***REMOVED***function***REMOVED***isGoogleTokenExpired(userId:***REMOVED***string):***REMOVED***Promise<boolean>***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***tokens***REMOVED***=***REMOVED***await***REMOVED***getGoogleOAuthTokens(userId);
***REMOVED******REMOVED***
***REMOVED******REMOVED***if***REMOVED***(!tokens***REMOVED***||***REMOVED***!tokens.expires_at)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***true;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***expiresAt***REMOVED***=***REMOVED***new***REMOVED***Date(tokens.expires_at);
***REMOVED******REMOVED***const***REMOVED***now***REMOVED***=***REMOVED***new***REMOVED***Date();
***REMOVED******REMOVED***
***REMOVED******REMOVED***//***REMOVED***Consider***REMOVED***expired***REMOVED***if***REMOVED***less***REMOVED***than***REMOVED***5***REMOVED***minutes***REMOVED***remaining
***REMOVED******REMOVED***return***REMOVED***expiresAt.getTime()***REMOVED***-***REMOVED***now.getTime()***REMOVED***<***REMOVED***5***REMOVED*******REMOVED***60***REMOVED*******REMOVED***1000;
}
