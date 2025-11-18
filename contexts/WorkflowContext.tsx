"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***createContext,***REMOVED***useContext,***REMOVED***useEffect,***REMOVED***useState,***REMOVED***useCallback,***REMOVED***useRef***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***type***REMOVED***{***REMOVED***WorkflowState,***REMOVED***WorkflowStep,***REMOVED***WorkflowResult,***REMOVED***SSEEvent***REMOVED***}***REMOVED***from***REMOVED***"@/types";

interface***REMOVED***WorkflowContextType***REMOVED***{
***REMOVED******REMOVED***workflow:***REMOVED***WorkflowState***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***isExecuting:***REMOVED***boolean;
***REMOVED******REMOVED***error:***REMOVED***string***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***executeWorkflow:***REMOVED***(command:***REMOVED***string)***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***cancelWorkflow:***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***resetWorkflow:***REMOVED***()***REMOVED***=>***REMOVED***void;
}

const***REMOVED***WorkflowContext***REMOVED***=***REMOVED***createContext<WorkflowContextType***REMOVED***|***REMOVED***undefined>(undefined);

export***REMOVED***function***REMOVED***WorkflowProvider({***REMOVED***children***REMOVED***}:***REMOVED***{***REMOVED***children:***REMOVED***React.ReactNode***REMOVED***})***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[workflow,***REMOVED***setWorkflow]***REMOVED***=***REMOVED***useState<WorkflowState***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[isExecuting,***REMOVED***setIsExecuting]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***[error,***REMOVED***setError]***REMOVED***=***REMOVED***useState<string***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***eventSourceRef***REMOVED***=***REMOVED***useRef<EventSource***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***reconnectTimeoutRef***REMOVED***=***REMOVED***useRef<NodeJS.Timeout***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***reconnectAttemptsRef***REMOVED***=***REMOVED***useRef(0);
***REMOVED******REMOVED***const***REMOVED***maxReconnectAttempts***REMOVED***=***REMOVED***5;

***REMOVED******REMOVED***const***REMOVED***closeEventSource***REMOVED***=***REMOVED***useCallback(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(eventSourceRef.current)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***eventSourceRef.current.close();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***eventSourceRef.current***REMOVED***=***REMOVED***null;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(reconnectTimeoutRef.current)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***clearTimeout(reconnectTimeoutRef.current);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***reconnectTimeoutRef.current***REMOVED***=***REMOVED***null;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***const***REMOVED***connectSSE***REMOVED***=***REMOVED***useCallback((workflowId:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***closeEventSource();

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***eventSource***REMOVED***=***REMOVED***new***REMOVED***EventSource(`/api/workflow/stream?workflowId=${workflowId}`);
***REMOVED******REMOVED******REMOVED******REMOVED***eventSourceRef.current***REMOVED***=***REMOVED***eventSource;

***REMOVED******REMOVED******REMOVED******REMOVED***eventSource.onopen***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log("SSE***REMOVED***connection***REMOVED***established");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***reconnectAttemptsRef.current***REMOVED***=***REMOVED***0;
***REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED***eventSource.addEventListener("step_start",***REMOVED***(event)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data:***REMOVED***SSEEvent***REMOVED***=***REMOVED***JSON.parse(event.data);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow((prev)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!prev)***REMOVED***return***REMOVED***prev;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***updatedSteps***REMOVED***=***REMOVED***prev.steps.map((step)***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.id***REMOVED***===***REMOVED***data.stepId
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***?***REMOVED***{***REMOVED***...step,***REMOVED***...data.data,***REMOVED***status:***REMOVED***"running"***REMOVED***as***REMOVED***const***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***:***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...prev,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***updatedSteps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"executing",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***parsing***REMOVED***step_start***REMOVED***event:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***eventSource.addEventListener("step_complete",***REMOVED***(event)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data:***REMOVED***SSEEvent***REMOVED***=***REMOVED***JSON.parse(event.data);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow((prev)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!prev)***REMOVED***return***REMOVED***prev;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***updatedSteps***REMOVED***=***REMOVED***prev.steps.map((step)***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.id***REMOVED***===***REMOVED***data.stepId
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***?***REMOVED***{***REMOVED***...step,***REMOVED***...data.data,***REMOVED***status:***REMOVED***"completed"***REMOVED***as***REMOVED***const***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***:***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...prev,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***updatedSteps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***parsing***REMOVED***step_complete***REMOVED***event:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***eventSource.addEventListener("step_error",***REMOVED***(event)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data:***REMOVED***SSEEvent***REMOVED***=***REMOVED***JSON.parse(event.data);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow((prev)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!prev)***REMOVED***return***REMOVED***prev;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***updatedSteps***REMOVED***=***REMOVED***prev.steps.map((step)***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.id***REMOVED***===***REMOVED***data.stepId
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***?***REMOVED***{***REMOVED***...step,***REMOVED***...data.data,***REMOVED***status:***REMOVED***"failed"***REMOVED***as***REMOVED***const***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***:***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...prev,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***updatedSteps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"failed",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***data.data.error,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(data.data.error***REMOVED***||***REMOVED***"Step***REMOVED***execution***REMOVED***failed");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***parsing***REMOVED***step_error***REMOVED***event:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***eventSource.addEventListener("workflow_complete",***REMOVED***(event)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data***REMOVED***=***REMOVED***JSON.parse(event.data);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow((prev)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!prev)***REMOVED***return***REMOVED***prev;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...prev,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"completed",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results:***REMOVED***data.results***REMOVED***||***REMOVED***[],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***endTime:***REMOVED***new***REMOVED***Date(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsExecuting(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***closeEventSource();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***parsing***REMOVED***workflow_complete***REMOVED***event:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***eventSource.onerror***REMOVED***=***REMOVED***(event)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("SSE***REMOVED***connection***REMOVED***error:",***REMOVED***event);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Auto-reconnect***REMOVED***logic
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(reconnectAttemptsRef.current***REMOVED***<***REMOVED***maxReconnectAttempts)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***reconnectAttemptsRef.current***REMOVED***+=***REMOVED***1;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***delay***REMOVED***=***REMOVED***Math.min(1000***REMOVED*******REMOVED***Math.pow(2,***REMOVED***reconnectAttemptsRef.current***REMOVED***-***REMOVED***1),***REMOVED***10000);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`Attempting***REMOVED***to***REMOVED***reconnect***REMOVED***in***REMOVED***${delay}ms***REMOVED***(attempt***REMOVED***${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***reconnectTimeoutRef.current***REMOVED***=***REMOVED***setTimeout(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(workflow?.id***REMOVED***&&***REMOVED***isExecuting)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***connectSSE(workflow.id);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***delay);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Max***REMOVED***reconnection***REMOVED***attempts***REMOVED***reached");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError("Connection***REMOVED***lost.***REMOVED***Please***REMOVED***refresh***REMOVED***the***REMOVED***page.");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsExecuting(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***closeEventSource();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***},***REMOVED***[closeEventSource,***REMOVED***workflow?.id,***REMOVED***isExecuting]);

***REMOVED******REMOVED***const***REMOVED***executeWorkflow***REMOVED***=***REMOVED***useCallback(async***REMOVED***(command:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(null);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsExecuting(true);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/workflow/execute",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***method:***REMOVED***"POST",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Content-Type":***REMOVED***"application/json",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***body:***REMOVED***JSON.stringify({***REMOVED***command***REMOVED***}),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorData***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(errorData.message***REMOVED***||***REMOVED***"Failed***REMOVED***to***REMOVED***execute***REMOVED***workflow");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***initialWorkflow:***REMOVED***WorkflowState***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id:***REMOVED***data.workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"planning",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***command,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***data.steps***REMOVED***||***REMOVED***[],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results:***REMOVED***[],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***startTime:***REMOVED***new***REMOVED***Date(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow(initialWorkflow);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Connect***REMOVED***to***REMOVED***SSE***REMOVED***stream***REMOVED***for***REMOVED***real-time***REMOVED***updates
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***connectSSE(data.workflowId);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***executing***REMOVED***workflow:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Failed***REMOVED***to***REMOVED***execute***REMOVED***workflow");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsExecuting(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow((prev)***REMOVED***=>***REMOVED***prev***REMOVED***?***REMOVED***{***REMOVED***...prev,***REMOVED***status:***REMOVED***"failed",***REMOVED***error:***REMOVED***err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"***REMOVED***}***REMOVED***:***REMOVED***null);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[connectSSE]);

***REMOVED******REMOVED***const***REMOVED***cancelWorkflow***REMOVED***=***REMOVED***useCallback(async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!workflow?.id)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***startTime***REMOVED***=***REMOVED***Date.now();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/workflow/cancel",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***method:***REMOVED***"POST",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Content-Type":***REMOVED***"application/json",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***body:***REMOVED***JSON.stringify({***REMOVED***workflowId:***REMOVED***workflow.id***REMOVED***}),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***responseTime***REMOVED***=***REMOVED***Date.now()***REMOVED***-***REMOVED***startTime;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(responseTime***REMOVED***>***REMOVED***200)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.warn(`Cancel***REMOVED***request***REMOVED***took***REMOVED***${responseTime}ms***REMOVED***(target:***REMOVED***<200ms)`);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***errorData***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(errorData.message***REMOVED***||***REMOVED***"Failed***REMOVED***to***REMOVED***cancel***REMOVED***workflow");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Update***REMOVED***workflow***REMOVED***state***REMOVED***to***REMOVED***cancelled
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow((prev)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!prev)***REMOVED***return***REMOVED***prev;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***updatedSteps***REMOVED***=***REMOVED***prev.steps.map((step)***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***===***REMOVED***"running"***REMOVED***||***REMOVED***step.status***REMOVED***===***REMOVED***"pending"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***?***REMOVED***{***REMOVED***...step,***REMOVED***status:***REMOVED***"cancelled"***REMOVED***as***REMOVED***const***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***:***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...prev,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***status:***REMOVED***"cancelled",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps:***REMOVED***updatedSteps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***endTime:***REMOVED***new***REMOVED***Date(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsExecuting(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***closeEventSource();

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Ensure***REMOVED***UI***REMOVED***updates***REMOVED***within***REMOVED***1***REMOVED***second
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setTimeout(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(workflow?.status***REMOVED***!==***REMOVED***"cancelled")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.warn("UI***REMOVED***did***REMOVED***not***REMOVED***update***REMOVED***to***REMOVED***cancelled***REMOVED***state***REMOVED***within***REMOVED***1***REMOVED***second");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***1000);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***cancelling***REMOVED***workflow:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err.message***REMOVED***:***REMOVED***"Failed***REMOVED***to***REMOVED***cancel***REMOVED***workflow");
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[workflow?.id,***REMOVED***closeEventSource]);

***REMOVED******REMOVED***const***REMOVED***resetWorkflow***REMOVED***=***REMOVED***useCallback(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***closeEventSource();
***REMOVED******REMOVED******REMOVED******REMOVED***setWorkflow(null);
***REMOVED******REMOVED******REMOVED******REMOVED***setIsExecuting(false);
***REMOVED******REMOVED******REMOVED******REMOVED***setError(null);
***REMOVED******REMOVED******REMOVED******REMOVED***reconnectAttemptsRef.current***REMOVED***=***REMOVED***0;
***REMOVED******REMOVED***},***REMOVED***[closeEventSource]);

***REMOVED******REMOVED***//***REMOVED***Cleanup***REMOVED***on***REMOVED***unmount
***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***closeEventSource();
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***},***REMOVED***[closeEventSource]);

***REMOVED******REMOVED***const***REMOVED***value:***REMOVED***WorkflowContextType***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***workflow,
***REMOVED******REMOVED******REMOVED******REMOVED***isExecuting,
***REMOVED******REMOVED******REMOVED******REMOVED***error,
***REMOVED******REMOVED******REMOVED******REMOVED***executeWorkflow,
***REMOVED******REMOVED******REMOVED******REMOVED***cancelWorkflow,
***REMOVED******REMOVED******REMOVED******REMOVED***resetWorkflow,
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***<WorkflowContext.Provider***REMOVED***value={value}>{children}</WorkflowContext.Provider>;
}

export***REMOVED***function***REMOVED***useWorkflow()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***context***REMOVED***=***REMOVED***useContext(WorkflowContext);
***REMOVED******REMOVED***if***REMOVED***(context***REMOVED***===***REMOVED***undefined)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("useWorkflow***REMOVED***must***REMOVED***be***REMOVED***used***REMOVED***within***REMOVED***a***REMOVED***WorkflowProvider");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***return***REMOVED***context;
}
