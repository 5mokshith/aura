"use client";

import React, { useState } from "react";
import { WorkflowStep } from "@/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  XCircle,
  Loader2,
  Ban,
  ChevronDown,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepProgressProps {
  step: WorkflowStep;
  stepNumber: number;
  onRetry?: (stepId: string) => void;
  className?: string;
}

const statusIcons = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  cancelled: Ban,
};

const statusColors = {
  pending: "text-muted-foreground",
  running: "text-blue-500 animate-spin",
  completed: "text-green-500",
  failed: "text-red-500",
  cancelled: "text-orange-500",
};

export function StepProgress({
  step,
  stepNumber,
  onRetry,
  className,
}: StepProgressProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const StatusIcon = statusIcons[step.status];
  const statusColor = statusColors[step.status];

  const hasDetails = step.input || step.output || step.error;
  const canExpand =
    hasDetails && (step.status === "completed" || step.status === "failed");

  const handleToggle = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRetry) {
      onRetry(step.id);
    }
  };

  return (
    <div
      className={cn(
        "rounded-md border-transparent transition-colors",
        step.status === "running" && "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20",
        step.status === "completed" && "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/10",
        step.status === "failed" && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20",
        step.status === "cancelled" && "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20",
        step.status === "pending" && "border-border bg-card"
      )}
      role="article"
      aria-label={`Step${stepNumber}:${step.agentName}`}
    >
      <div
        className={cn(
          "flex items-start gap-3 p-4",
          canExpand && "cursor-pointer hover:bg-accent/50"
        )}
        onClick={handleToggle}
        role={canExpand ? "button" : undefined}
        aria-expanded={canExpand ? isExpanded : undefined}
        tabIndex={canExpand ? 0 : undefined}
        onKeyDown={(e) => {
          if (canExpand && (e.key === "Enter" || e.key === "")) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <StatusIcon
          className={cn("mt-0.5 h-5 w-5 shrink-0", statusColor)}
          aria-label={`Status:${step.status}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">
              Step{stepNumber}
            </span>
            <span className="text-sm font-medium">{step.agentName}</span>
            {step.status === "running" && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                In progress...
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">{step.action}</p>

          {step.error && (
            <div className="mt-2 flex items-start gap-2">
              <p className="flex-1 text-sm text-red-600 dark:text-red-400" role="alert">
                <strong>Error:</strong> {step.error}
              </p>
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetry}
                  className="shrink-0"
                  aria-label="Retry this step"
                >
                  <RotateCw className="h-3 w-3" />
                  Retry
                </Button>
              )}
            </div>
          )}

          {step.startTime && step.endTime && (
            <p className="mt-1 text-xs text-muted-foreground">
              Duration: {Math.round((step.endTime.getTime() - step.startTime.getTime()) / 1000)}s
            </p>
          )}
        </div>

        {canExpand && (
          <div className="shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && canExpand && (
        <div className="border-t border-t-px px-4 py-3 space-y-3">
          {step.input && Object.keys(step.input).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Input
              </h4>
              <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                {JSON.stringify(step.input, null, 2)}
              </pre>
            </div>
          )}

          {step.output && Object.keys(step.output).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Output
              </h4>
              <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                {JSON.stringify(step.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
