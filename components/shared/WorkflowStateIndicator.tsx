"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowState } from "@/types";

interface WorkflowStateIndicatorProps {
  status: WorkflowState["status"];
  error?: string | null;
  className?: string;
}

export function WorkflowStateIndicator({
  status,
  error,
  className,
}: WorkflowStateIndicatorProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  // Show success state for 2 seconds
  useEffect(() => {
    if (status === "completed") {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === "idle" || (!showSuccess && status === "completed")) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-lg border",
        "transition-all duration-300",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {status === "planning" && (
        <>
          <Loader2
            className="size-5 animate-spin text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Planning workflow...
          </span>
        </>
      )}

      {status === "executing" && (
        <>
          <Loader2
            className="size-5 animate-spin text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Executing workflow...
          </span>
        </>
      )}

      {showSuccess && status === "completed" && (
        <>
          <CheckCircle2
            className="size-5 text-green-600 dark:text-green-400"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-green-900 dark:text-green-100">
            Workflow completed successfully!
          </span>
        </>
      )}

      {status === "failed" && (
        <>
          <XCircle
            className="size-5 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-red-900 dark:text-red-100 block">
              Workflow failed
            </span>
            {error && (
              <span className="text-xs text-red-700 dark:text-red-300">
                {error}
              </span>
            )}
          </div>
        </>
      )}

      {status === "cancelled" && (
        <>
          <AlertCircle
            className="size-5 text-yellow-600 dark:text-yellow-400"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            Workflow cancelled
          </span>
        </>
      )}
    </div>
  );
}

interface IdleStateProps {
  onFocus?: () => void;
  className?: string;
}

export function IdleState({ onFocus, className }: IdleStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="max-w-md space-y-4">
        <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="size-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Ready to assist
          </h2>
          <p className="text-sm text-muted-foreground">
            Entera command to get started. I can help you with emails, documents,
            calendar events, and more.
          </p>
        </div>
        {onFocus && (
          <button
            onClick={onFocus}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            Click here to start typing
          </button>
        )}
      </div>
    </div>
  );
}

interface ExecutingStateProps {
  command: string;
  onCancel?: () => void;
  className?: string;
}

export function ExecutingState({
  command,
  onCancel,
  className,
}: ExecutingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-2xl w-full space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Loader2
              className="size-8 animate-spin text-primary"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Processing your request
            </h3>
            <p className="text-sm text-muted-foreground">{command}</p>
          </div>
        </div>

        {onCancel && (
          <div className="flex justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-destructive/90 border border-destructive/20 rounded-md hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Cancel workflow execution"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SuccessStateProps {
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export function SuccessState({
  message = "Operation completed successfully!",
  onDismiss,
  className,
}: SuccessStateProps) {
  useEffect(() => {
    if (onDismiss) {
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    }
  }, [onDismiss]);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-6 px-4",
        "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg",
