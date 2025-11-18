"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***createContext,***REMOVED***useContext,***REMOVED***useEffect,***REMOVED***useState,***REMOVED***useCallback***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***type***REMOVED***{***REMOVED***TaskHistoryEntry,***REMOVED***HistoryItem,***REMOVED***HistoryStatus***REMOVED***}***REMOVED***from***REMOVED***"@/types";

interface***REMOVED***HistoryFilters***REMOVED***{
***REMOVED******REMOVED***dateFrom?:***REMOVED***Date;
***REMOVED******REMOVED***dateTo?:***REMOVED***Date;
***REMOVED******REMOVED***status?:***REMOVED***HistoryStatus;
***REMOVED******REMOVED***agentType?:***REMOVED***string;
***REMOVED******REMOVED***searchQuery?:***REMOVED***string;
}

interface***REMOVED***HistoryContextType***REMOVED***{
***REMOVED******REMOVED***items:***REMOVED***HistoryItem[];
***REMOVED******REMOVED***isLoading:***REMOVED***boolean;
***REMOVED******REMOVED***error:***REMOVED***string***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***hasMore:***REMOVED***boolean;
***REMOVED******REMOVED***filters:***REMOVED***HistoryFilters;
***REMOVED******REMOVED***setFilters:***REMOVED***(filters:***REMOVED***HistoryFilters)***REMOVED***=>***REMOVED***void;
***REMOVED******REMOVED***loadMore:***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***refresh:***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***getTaskDetail:***REMOVED***(taskId:***REMOVED***string)***REMOVED***=>***REMOVED***Promise<TaskHistoryEntry***REMOVED***|***REMOVED***null>;
***REMOVED******REMOVED***rerunTask:***REMOVED***(taskId:***REMOVED***string)***REMOVED***=>***REMOVED***Promise<void>;
}

const***REMOVED***HistoryContext***REMOVED***=***REMOVED***createContext<HistoryContextType***REMOVED***|***REMOVED***undefined>(undefined);

const***REMOVED***ITEMS_PER_PAGE***REMOVED***=***REMOVED***20;

export***REMOVED***function***REMOVED***HistoryProvider({***REMOVED***children***REMOVED***}:***REMOVED***{***REMOVED***children:***REMOVED***React.ReactNode***REMOVED***})***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[items,***REMOVED***setItems]***REMOVED***=***REMOVED***useState<HistoryItem[]>([]);
***REMOVED******REMOVED***const***REMOVED***[isLoading,***REMOVED***setIsLoading]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***[error,***REMOVED***setError]***REMOVED***=***REMOVED***useState<string***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[hasMore,***REMOVED***setHasMore]***REMOVED***=***REMOVED***useState(true);
***REMOVED******REMOVED***const***REMOVED***[page,***REMOVED***setPage]***REMOVED***=***REMOVED***useState(1);
***REMOVED******REMOVED***const***REMOVED***[filters,***REMOVED***setFiltersState]***REMOVED***=***REMOVED***useState<HistoryFilters>({});

***REMOVED******REMOVED***const***REMOVED***fetchHistory***REMOVED***=***REMOVED***useCallback(async***REMOVED***(pageNum:***REMOVED***number,***REMOVED***currentFilters:***REMOVED***HistoryFilters,***REMOVED***append:***REMOVED***boolean***REMOVED***=***REMOVED***false)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(true);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(null);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***params***REMOVED***=***REMOVED***new***REMOVED***URLSearchParams({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***page:***REMOVED***pageNum.toString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***limit:***REMOVED***ITEMS_PER_PAGE.toString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(currentFilters.dateFrom)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***params.append("dateFrom",***REMOVED***currentFilters.dateFrom.toISOString());
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(currentFilters.dateTo)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***params.append("dateTo",***REMOVED***currentFilters.dateTo.toISOString());
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(currentFilters.status)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***params.append("status",***REMOVED***currentFilters.status);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(currentFilters.agentType)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***params.append("agentType",***REMOVED***currentFilters.agentType);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(currentFilters.searchQuery)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***params.append("search",***REMOVED***currentFilters.searchQuery);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch(`/api/history?${params.toString()}`);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorData***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(errorData.message***REMOVED***||***REMOVED***"Failed***REMOVED***to***REMOVED***fetch***REMOVED***history");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data***REMOVED***=***REMOVED***await***REMOVED***response.json();

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Convert***REMOVED***timestamp***REMOVED***strings***REMOVED***to***REMOVED***Date***REMOVED***objects
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***historyItems:***REMOVED***HistoryItem[]***REMOVED***=***REMOVED***data.items.map((item:***REMOVED***any)***REMOVED***=>***REMOVED***({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...item,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date(item.timestamp),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}));

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(append)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setItems((prev)***REMOVED***=>***REMOVED***[...prev,***REMOVED***...historyItems]);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setItems(historyItems);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setHasMore(data.hasMore);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***fetching***REMOVED***history:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Failed***REMOVED***to***REMOVED***fetch***REMOVED***history");
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***finally***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(false);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***const***REMOVED***loadMore***REMOVED***=***REMOVED***useCallback(async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!hasMore***REMOVED***||***REMOVED***isLoading)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***nextPage***REMOVED***=***REMOVED***page***REMOVED***+***REMOVED***1;
***REMOVED******REMOVED******REMOVED******REMOVED***setPage(nextPage);
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***fetchHistory(nextPage,***REMOVED***filters,***REMOVED***true);
***REMOVED******REMOVED***},***REMOVED***[hasMore,***REMOVED***isLoading,***REMOVED***page,***REMOVED***filters,***REMOVED***fetchHistory]);

***REMOVED******REMOVED***const***REMOVED***refresh***REMOVED***=***REMOVED***useCallback(async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setPage(1);
***REMOVED******REMOVED******REMOVED******REMOVED***setHasMore(true);
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***fetchHistory(1,***REMOVED***filters,***REMOVED***false);
***REMOVED******REMOVED***},***REMOVED***[filters,***REMOVED***fetchHistory]);

***REMOVED******REMOVED***const***REMOVED***setFilters***REMOVED***=***REMOVED***useCallback((newFilters:***REMOVED***HistoryFilters)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setFiltersState(newFilters);
***REMOVED******REMOVED******REMOVED******REMOVED***setPage(1);
***REMOVED******REMOVED******REMOVED******REMOVED***setHasMore(true);
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***const***REMOVED***getTaskDetail***REMOVED***=***REMOVED***useCallback(async***REMOVED***(taskId:***REMOVED***string):***REMOVED***Promise<TaskHistoryEntry***REMOVED***|***REMOVED***null>***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch(`/api/history/${taskId}`);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorData***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(errorData.message***REMOVED***||***REMOVED***"Failed***REMOVED***to***REMOVED***fetch***REMOVED***task***REMOVED***detail");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data***REMOVED***=***REMOVED***await***REMOVED***response.json();

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Convert***REMOVED***date***REMOVED***strings***REMOVED***to***REMOVED***Date***REMOVED***objects
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...data,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***createdAt:***REMOVED***new***REMOVED***Date(data.createdAt),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***updatedAt:***REMOVED***new***REMOVED***Date(data.updatedAt),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowState:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...data.workflowState,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***startTime:***REMOVED***data.workflowState.startTime***REMOVED***?***REMOVED***new***REMOVED***Date(data.workflowState.startTime)***REMOVED***:***REMOVED***undefined,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***endTime:***REMOVED***data.workflowState.endTime***REMOVED***?***REMOVED***new***REMOVED***Date(data.workflowState.endTime)***REMOVED***:***REMOVED***undefined,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***data.workflowState.steps.map((step:***REMOVED***any)***REMOVED***=>***REMOVED***({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...step,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***startTime:***REMOVED***step.startTime***REMOVED***?***REMOVED***new***REMOVED***Date(step.startTime)***REMOVED***:***REMOVED***undefined,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***endTime:***REMOVED***step.endTime***REMOVED***?***REMOVED***new***REMOVED***Date(step.endTime)***REMOVED***:***REMOVED***undefined,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***})),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***fetching***REMOVED***task***REMOVED***detail:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Failed***REMOVED***to***REMOVED***fetch***REMOVED***task***REMOVED***detail");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***null;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***const***REMOVED***rerunTask***REMOVED***=***REMOVED***useCallback(async***REMOVED***(taskId:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/history/rerun",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***method:***REMOVED***"POST",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Content-Type":***REMOVED***"application/json",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***body:***REMOVED***JSON.stringify({***REMOVED***taskId***REMOVED***}),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorData***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(errorData.message***REMOVED***||***REMOVED***"Failed***REMOVED***to***REMOVED***rerun***REMOVED***task");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Optionally***REMOVED***refresh***REMOVED***history***REMOVED***after***REMOVED***rerun
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***refresh();
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***rerunning***REMOVED***task:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Failed***REMOVED***to***REMOVED***rerun***REMOVED***task");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***err;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[refresh]);

***REMOVED******REMOVED***//***REMOVED***Initial***REMOVED***load
***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***fetchHistory(1,***REMOVED***filters,***REMOVED***false);
***REMOVED******REMOVED***},***REMOVED***[filters,***REMOVED***fetchHistory]);

***REMOVED******REMOVED***const***REMOVED***value:***REMOVED***HistoryContextType***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***items,
***REMOVED******REMOVED******REMOVED******REMOVED***isLoading,
***REMOVED******REMOVED******REMOVED******REMOVED***error,
***REMOVED******REMOVED******REMOVED******REMOVED***hasMore,
***REMOVED******REMOVED******REMOVED******REMOVED***filters,
***REMOVED******REMOVED******REMOVED******REMOVED***setFilters,
***REMOVED******REMOVED******REMOVED******REMOVED***loadMore,
***REMOVED******REMOVED******REMOVED******REMOVED***refresh,
***REMOVED******REMOVED******REMOVED******REMOVED***getTaskDetail,
***REMOVED******REMOVED******REMOVED******REMOVED***rerunTask,
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***<HistoryContext.Provider***REMOVED***value={value}>{children}</HistoryContext.Provider>;
}

export***REMOVED***function***REMOVED***useHistory()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***context***REMOVED***=***REMOVED***useContext(HistoryContext);
***REMOVED******REMOVED***if***REMOVED***(context***REMOVED***===***REMOVED***undefined)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("useHistory***REMOVED***must***REMOVED***be***REMOVED***used***REMOVED***within***REMOVED***a***REMOVED***HistoryProvider");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***return***REMOVED***context;
}
