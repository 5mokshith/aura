"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***createContext,***REMOVED***useContext,***REMOVED***useEffect,***REMOVED***useState,***REMOVED***useCallback***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***type***REMOVED***{***REMOVED***AuthStatus,***REMOVED***UserSession***REMOVED***}***REMOVED***from***REMOVED***"@/types";

interface***REMOVED***AuthContextType***REMOVED***{
***REMOVED******REMOVED***session:***REMOVED***UserSession***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***isLoading:***REMOVED***boolean;
***REMOVED******REMOVED***error:***REMOVED***string***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***login:***REMOVED***()***REMOVED***=>***REMOVED***void;
***REMOVED******REMOVED***logout:***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***refreshAuth:***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>;
}

const***REMOVED***AuthContext***REMOVED***=***REMOVED***createContext<AuthContextType***REMOVED***|***REMOVED***undefined>(undefined);

export***REMOVED***function***REMOVED***AuthProvider({***REMOVED***children***REMOVED***}:***REMOVED***{***REMOVED***children:***REMOVED***React.ReactNode***REMOVED***})***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[session,***REMOVED***setSession]***REMOVED***=***REMOVED***useState<UserSession***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[isLoading,***REMOVED***setIsLoading]***REMOVED***=***REMOVED***useState(true);
***REMOVED******REMOVED***const***REMOVED***[error,***REMOVED***setError]***REMOVED***=***REMOVED***useState<string***REMOVED***|***REMOVED***null>(null);

***REMOVED******REMOVED***const***REMOVED***fetchAuthStatus***REMOVED***=***REMOVED***useCallback(async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/auth/status");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("Failed***REMOVED***to***REMOVED***fetch***REMOVED***auth***REMOVED***status");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(data.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSession(data.session);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(null);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSession(null);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***fetching***REMOVED***auth***REMOVED***status:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Authentication***REMOVED***error");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSession(null);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***finally***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(false);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***const***REMOVED***refreshAuth***REMOVED***=***REMOVED***useCallback(async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(true);
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***fetchAuthStatus();
***REMOVED******REMOVED***},***REMOVED***[fetchAuthStatus]);

***REMOVED******REMOVED***const***REMOVED***login***REMOVED***=***REMOVED***useCallback(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Redirect***REMOVED***to***REMOVED***Google***REMOVED***OAuth
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***scopes***REMOVED***=***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/gmail.modify",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/drive.file",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/documents",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/spreadsheets",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"https://www.googleapis.com/auth/calendar",
***REMOVED******REMOVED******REMOVED******REMOVED***].join("***REMOVED***");

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***params***REMOVED***=***REMOVED***new***REMOVED***URLSearchParams({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***client_id:***REMOVED***process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID***REMOVED***||***REMOVED***"",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***redirect_uri:***REMOVED***`${window.location.origin}/auth/callback`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***response_type:***REMOVED***"code",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***scope:***REMOVED***scopes,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***access_type:***REMOVED***"offline",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***prompt:***REMOVED***"consent",
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***window.location.href***REMOVED***=***REMOVED***`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***const***REMOVED***logout***REMOVED***=***REMOVED***useCallback(async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/auth/disconnect",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***method:***REMOVED***"POST",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("Failed***REMOVED***to***REMOVED***disconnect");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSession(null);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(null);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***disconnecting:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Disconnect***REMOVED***error");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***err;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***//***REMOVED***Check***REMOVED***for***REMOVED***token***REMOVED***expiration***REMOVED***and***REMOVED***prompt***REMOVED***re-authentication
***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(session?.oauthStatus.expiresAt)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***expiresAt***REMOVED***=***REMOVED***new***REMOVED***Date(session.oauthStatus.expiresAt);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***now***REMOVED***=***REMOVED***new***REMOVED***Date();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***timeUntilExpiry***REMOVED***=***REMOVED***expiresAt.getTime()***REMOVED***-***REMOVED***now.getTime();

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***If***REMOVED***token***REMOVED***expires***REMOVED***in***REMOVED***less***REMOVED***than***REMOVED***5***REMOVED***seconds,***REMOVED***prompt***REMOVED***re-auth
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(timeUntilExpiry***REMOVED***<***REMOVED***5000***REMOVED***&&***REMOVED***timeUntilExpiry***REMOVED***>***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***timer***REMOVED***=***REMOVED***setTimeout(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError("Your***REMOVED***session***REMOVED***has***REMOVED***expired.***REMOVED***Please***REMOVED***reconnect***REMOVED***your***REMOVED***Google***REMOVED***account.");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***timeUntilExpiry);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***clearTimeout(timer);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[session]);

***REMOVED******REMOVED***//***REMOVED***Initial***REMOVED***auth***REMOVED***check
***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***fetchAuthStatus();
***REMOVED******REMOVED***},***REMOVED***[fetchAuthStatus]);

***REMOVED******REMOVED***//***REMOVED***Periodic***REMOVED***token***REMOVED***refresh***REMOVED***check***REMOVED***(every***REMOVED***5***REMOVED***minutes)
***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***interval***REMOVED***=***REMOVED***setInterval(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***refreshAuth();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***5***REMOVED*******REMOVED***60***REMOVED*******REMOVED***1000);

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***clearInterval(interval);
***REMOVED******REMOVED***},***REMOVED***[session,***REMOVED***refreshAuth]);

***REMOVED******REMOVED***const***REMOVED***value:***REMOVED***AuthContextType***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***session,
***REMOVED******REMOVED******REMOVED******REMOVED***isLoading,
***REMOVED******REMOVED******REMOVED******REMOVED***error,
***REMOVED******REMOVED******REMOVED******REMOVED***login,
***REMOVED******REMOVED******REMOVED******REMOVED***logout,
***REMOVED******REMOVED******REMOVED******REMOVED***refreshAuth,
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***<AuthContext.Provider***REMOVED***value={value}>{children}</AuthContext.Provider>;
}

export***REMOVED***function***REMOVED***useAuth()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***context***REMOVED***=***REMOVED***useContext(AuthContext);
***REMOVED******REMOVED***if***REMOVED***(context***REMOVED***===***REMOVED***undefined)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("useAuth***REMOVED***must***REMOVED***be***REMOVED***used***REMOVED***within***REMOVED***an***REMOVED***AuthProvider");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***return***REMOVED***context;
}
