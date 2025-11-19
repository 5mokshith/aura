"use client";

import React from "react";
import { ExecutionTracker } from "@/components/execution";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const { workflow, isExecuting, executeWorkflow, cancelWorkflow } = useWorkflow();

  const handleStartDemo = async () => {
    await executeWorkflow("Create a summary document of my recent emails and save it to Google Drive");
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Execution Tracker Demo</h1>
        <p className="mt-2 text-muted-foreground">
          Test the execution tracker component with a simulated workflow
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={handleStartDemo}
          disabled={isExecuting}
        >
          Start Demo Workflow
        </Button>
      </div>
      
      {workflow && (
        <ExecutionTracker
          workflow={workflow}
          onCancel={cancelWorkflow}
          onRetryStep={(stepId) => {
            console.log("Retry step:", stepId);
            // In production, this would trigger a step retry
          }}
        />
      )}
      
      {!workflow && !isExecuting && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Click "Start Demo Workflow" to see the execution tracker in action
          </p>
        </div>
      )}
    </div>
  );
}
