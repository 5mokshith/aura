"use client";

import React, { useMemo } from "react";
import { WorkflowState } from "@/types";
import { Progress } from "@/components/ui/progress";
import { AgentIndicator } from "./AgentIndicator";
import { StepProgress } from "./StepProgress";
import { CancelButton } from "./CancelButton";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2, Ban } from "lucide-react";

interface ExecutionTrackerProps {
  workflow: WorkflowState;
  onCancel?: () => void;
  onRetryStep?: (stepId: string) => void;
  className?: string;
}

export function ExecutionTracker({
  workflow,
  onCancel,
  onRetryStep,
  className,
}: ExecutionTrackerProps) {
  // Memoize calculations to avoid unnecessary re-renders
  // This ensures updates occur within 500ms of state change (Requirement2.2)
  const { completedSteps, totalSteps, progressPercentage, estimatedTimeRemaining } =
    useMemo(() => {
      const total = workflow.steps.length;
      const completed = workflow.steps.filter((step) => step.status === "completed")
        .length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;

      // Calculate estimated time remaining based on average step duration
      let estimated = 0;
      if (workflow.startTime && completed > 0) {
        const elapsedMs = Date.now() - workflow.startTime.getTime();
        const avgStepTime = elapsedMs / completed;
        const remainingSteps = total - completed;
        estimated = Math.ceil((avgStepTime * remainingSteps) / 1000); // Convert to seconds
      }

      return {
        completedSteps: completed,
        totalSteps: total,
        progressPercentage: percentage,
        estimatedTimeRemaining: estimated,
      };
    }, [workflow.steps, workflow.startTime]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  };

  const currentStep = workflow.steps.find((step) => step.status === "running");
  const isExecuting = workflow.status === "executing" || workflow.status === "planning";
  const canCancel = isExecuting && onCancel;

  // Calculate which steps were completed/cancelled
  const completedBeforeCancellation = workflow.steps.filter(
    (step) => step.status === "completed"
  );
  const cancelledSteps = workflow.steps.filter((step) => step.status === "cancelled");

  return (
    <div
      className={cn(
        "rounded-lg border-b bg-card p-4 sm:p-6 shadow-sm",
        className
      )}
      role="region"
      aria-label="Workflow execution tracker"
    >
      {/* Header - Responsive layout */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold">Execution Progress</h2>
          <span className="text-xs sm:text-sm text-muted-foreground" aria-live="polite">
            {completedSteps}/{totalSteps} steps
          </span>
        </div>
        {canCancel && (
          <CancelButton
            onCancel={async () => {
              if (onCancel) {
                await onCancel();
              }
            }}
          />
        )}
      </div>

      {/* Progress Bar - Responsive sizing */}
      <div className="mb-4 sm:mb-6">
        <Progress
          value={progressPercentage}
          className="h-2 sm:h-3"
          aria-label={`Progress:${Math.round(progressPercentage)}%`}
        />
        <div className="mt-1.5 sm:mt-2 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2 text-2xs sm:text-xs sm:text-muted-foreground">
          <span>{Math.round(progressPercentage)}% complete</span>
          {estimatedTimeRemaining > 0 &&
            workflow.status === "executing" && (
              <span aria-live="polite">
                Est. {formatTime(estimatedTimeRemaining)} remaining
              </span>
            )}
        </div>
      </div>

      {/* Current Step Indicator - Responsive padding and text */}
      {currentStep && (
        <div className="mb-3 sm:mb-4 rounded-md bg-blue-50 p-2.5 sm:p-3 dark:bg-blue-950/20">
          <div className="flex items-start gap-2 sm:gap-3">
            <Loader2
              className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-500 shrink-0 mt-0 sm:mt-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <AgentIndicator agentName={currentStep.agentName} />
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground break-words">
                {currentStep.action}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-2" role="list" aria-label="Workflow steps">
        {workflow.steps.map((step, index) => (
          <StepProgress
            key={step.id}
            step={step}
            stepNumber={index + 1}
            onRetry={onRetryStep}
          />
        ))}
      </div>

      {/* Status Message - Responsive padding and text */}
      {workflow.status === "completed" && (
        <div
          className="mt-3 sm:mt-4 rounded-md bg-green-50 p-2.5 sm:p-3 text-xs sm:text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="mr-1.5 sm:mr-2 inline h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          Workflow completed successfully
        </div>
      )}

      {workflow.status === "failed" && (
        <div
          className="mt-3 sm:mt-4 rounded-md bg-red-50 p-2.5 sm:p-3 text-xs sm:text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400"
          role="alert"
          aria-live="assertive"
        >
          <XCircle className="mr-1.5 sm:mr-2 inline h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="break-words">
            Workflow failed: {workflow.error || "Unknown error"}
          </span>
        </div>
      )}

      {workflow.status === "cancelled" && (
        <div
          className="mt-3 sm:mt-4 rounded-md bg-orange-50 p-2.5 sm:p-3 dark:bg-orange-950/20"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-orange-700 dark:text-orange-400">
            <Ban className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Workflow cancelled</p>
              {completedBeforeCancellation.length > 0 && (
                <p className="mt-0.5 sm:mt-1 text-2xs sm:text-xs break-words">
                  {completedBeforeCancellation.length} step(s) completed before cancellation.
                  {cancelledSteps.length > 0 && `${cancelledSteps.length} step(s) cancelled.`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
