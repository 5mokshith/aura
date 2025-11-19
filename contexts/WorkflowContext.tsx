"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type {
  WorkflowState,
  WorkflowStep,
  WorkflowResult,
  SSEEvent,
} from "@/types";

interface WorkflowContextType {
  workflow: WorkflowState | null;
  isExecuting: boolean;
  error: string | null;
  executeWorkflow: (command: string) => Promise<void>;
  cancelWorkflow: () => Promise<void>;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connectSSE = useCallback((workflowId: string) => {
    closeEventSource();

    const eventSource = new EventSource(
      `/api/workflow/stream?workflowId=${workflowId}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE connection established");
      reconnectAttemptsRef.current = 0;
    };

    eventSource.addEventListener("step_start", (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        setWorkflow((prev) => {
          if (!prev) return prev;

          const updatedSteps = prev.steps.map((step) =>
            step.id === data.stepId
              ? { ...step, ...data.data, status: "running" as const }
              : step
          );

          return {
            ...prev,
            steps: updatedSteps,
            status: "executing",
          };
        });
      } catch (err) {
        console.error("Error parsing step_start event:", err);
      }
    });

    eventSource.addEventListener("step_complete", (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        setWorkflow((prev) => {
          if (!prev) return prev;

          const updatedSteps = prev.steps.map((step) =>
            step.id === data.stepId
              ? { ...step, ...data.data, status: "completed" as const }
              : step
          );

          return {
            ...prev,
            steps: updatedSteps,
          };
        });
      } catch (err) {
        console.error("Error parsing step_complete event:", err);
      }
    });

    eventSource.addEventListener("step_error", (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        setWorkflow((prev) => {
          if (!prev) return prev;

          const updatedSteps = prev.steps.map((step) =>
            step.id === data.stepId
              ? { ...step, ...data.data, status: "failed" as const }
              : step
          );

          return {
            ...prev,
            steps: updatedSteps,
            status: "failed",
            error: data.data.error,
          };
        });
        setError(data.data.error || "Step execution failed");
      } catch (err) {
        console.error("Error parsing step_error event:", err);
      }
    });

    eventSource.addEventListener("workflow_complete", (event) => {
      try {
        const data = JSON.parse(event.data);
        setWorkflow((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            status: "completed",
            results: data.results || [],
            endTime: new Date(),
          };
        });
        setIsExecuting(false);
        closeEventSource();
      } catch (err) {
        console.error("Error parsing workflow_complete event:", err);
      }
    });

    eventSource.onerror = (event) => {
      console.error("SSE connection error:", event);

      // Auto-reconnect logic
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current - 1),
          10000
        );

        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          if (workflow?.id && isExecuting) {
            connectSSE(workflow.id);
          }
        }, delay);
      } else {
        console.error("Max reconnection attempts reached");
        setError("Connection lost. Please refresh the page.");
        setIsExecuting(false);
        closeEventSource();
      }
    };
  }, [closeEventSource, workflow?.id, isExecuting]);

  const executeWorkflow = useCallback(async (command: string) => {
    try {
      setError(null);
      setIsExecuting(true);

      const response = await fetch("/api/workflow/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to execute workflow");
      }

      const data = await response.json();

      const initialWorkflow: WorkflowState = {
        id: data.workflowId,
        status: "planning",
        command,
        steps: data.steps || [],
        results: [],
        startTime: new Date(),
      };

      setWorkflow(initialWorkflow);

      // Connect to SSE stream for real-time updates
      connectSSE(data.workflowId);
    } catch (err) {
      console.error("Error executing workflow:", err);
      setError(err instanceof Error ? err.message : "Failed to execute workflow");
      setIsExecuting(false);
      setWorkflow((prev) =>
        prev ? { ...prev, status: "failed", error: err instanceof Error ? err.message : "Unknown error" } : null
      );
    }
  }, [connectSSE]);

  const cancelWorkflow = useCallback(async () => {
    if (!workflow?.id) {
      return;
    }

    try {
      const startTime = Date.now();

      const response = await fetch("/api/workflow/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowId: workflow.id }),
      });

      const responseTime = Date.now() - startTime;

      if (responseTime > 200) {
        console.warn(`Cancel request took ${responseTime}ms (target: <200ms)`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel workflow");
      }

      // Update workflow state to cancelled
      setWorkflow((prev) =>
        prev
          ? {
              ...prev,
              status: "cancelled",
              endTime: new Date(),
            }
          : prev
      );
      setIsExecuting(false);
      setError(null);
      closeEventSource();
    } catch (err) {
      console.error("Error cancelling workflow:", err);
      setError(err instanceof Error ? err.message : "Failed to cancel workflow");
    }
  }, [workflow?.id, closeEventSource]);

  const resetWorkflow = useCallback(() => {
    setWorkflow(null);
    setIsExecuting(false);
    setError(null);
    reconnectAttemptsRef.current = 0;
    closeEventSource();
  }, [closeEventSource]);

  const value: WorkflowContextType = {
    workflow,
    isExecuting,
    error,
    executeWorkflow,
    cancelWorkflow,
    resetWorkflow,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}
