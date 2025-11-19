/**
 * WorkflowExecutorService
 * Orchestrates workflow execution by managing step sequencing, agent routing, and state transitions
 */

import { createServiceClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/agents/registry";
import { updateWorkflowStatus } from "./workflowService";
import type { WorkflowStep } from "@/types";
import type { ExecutionContext } from "@/lib/agents/base";

/**
 * Execute a complete workflow
 * @param workflowId - The workflow ID to execute
 * @param userId - The user ID who owns the workflow
 * @param accessToken - Google OAuth access token for API authentication
 */
export async function executeWorkflow(
  workflowId: string,
  userId: string,
  accessToken: string
): Promise<void> {
  const serviceClient = createServiceClient();

  console.log(`[WorkflowExecutor] Starting workflow execution`, {
    operation: "executeWorkflow",
    workflowId,
    userId,
    timestamp: new Date().toISOString(),
  });

  try {
    // Step 1: Fetch workflow from database
    console.log(`[WorkflowExecutor] Fetching workflow`, {
      operation: "executeWorkflow",
      workflowId,
      step: "fetch",
      timestamp: new Date().toISOString(),
    });

    const { data: workflow, error: fetchError } = await serviceClient
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (fetchError || !workflow) {
      const errorMessage = fetchError?.message || "Workflow not found";
      console.error(`[WorkflowExecutor] Failed to fetch workflow`, {
        operation: "executeWorkflow",
        workflowId,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
      throw new Error(errorMessage);
    }

    console.log(`[WorkflowExecutor] Workflow fetched successfully`, {
      operation: "executeWorkflow",
      workflowId,
      status: workflow.status,
      stepCount: (workflow.steps as WorkflowStep[]).length || 0,
      timestamp: new Date().toISOString(),
    });

    // Step 2: Validate workflow status
    if (workflow.status !== "planning") {
      console.warn(`[WorkflowExecutor] Workflow not in planning state`, {
        operation: "executeWorkflow",
        workflowId,
        currentStatus: workflow.status,
        expectedStatus: "planning",
        timestamp: new Date().toISOString(),
      });
    }

    // Step 3: Check OAuth token expiration
    console.log(`[WorkflowExecutor] Validating OAuth token`, {
      operation: "executeWorkflow",
      workflowId,
      step: "token_validation",
      timestamp: new Date().toISOString(),
    });

    // Fetch token expiration from database
    const { data: tokenData, error: tokenError } = await serviceClient
      .from("oauth_tokens")
      .select("expires_at")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (tokenError || !tokenData) {
      const errorMessage =
        "OAuth token not found. Please reconnect your Google account.";
      console.error(`[WorkflowExecutor] OAuth token not found`, {
        operation: "executeWorkflow",
        workflowId,
        userId,
        error: tokenError?.message,
        timestamp: new Date().toISOString(),
      });

      await updateWorkflowStatus(workflowId, "failed", serviceClient, {
        error: errorMessage,
      });
      return;
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    const now = new Date();
    const isExpired =
      expiresAt.getTime() - now.getTime() < 5 * 60 * 1000; // 5 minute buffer

    if (isExpired) {
      const errorMessage =
        "OAuth token has expired. Please reconnect your Google account to continue.";
      console.error(`[WorkflowExecutor] OAuth token expired`, {
        operation: "executeWorkflow",
        workflowId,
        userId,
        expiresAt: expiresAt.toISOString(),
        now: now.toISOString(),
        timestamp: new Date().toISOString(),
      });

      await updateWorkflowStatus(workflowId, "failed", serviceClient, {
        error: errorMessage,
      });
      return;
    }

    console.log(`[WorkflowExecutor] OAuth token validated successfully`, {
      operation: "executeWorkflow",
      workflowId,
      expiresAt: expiresAt.toISOString(),
      timeRemaining: Math.floor(
        (expiresAt.getTime() - now.getTime()) / 1000 / 60
      ) + "minutes",
      timestamp: new Date().toISOString(),
    });

    // Step 4: Transition workflow status to executing
    console.log(`[WorkflowExecutor] Transitioning workflow to executing`, {
      operation: "executeWorkflow",
      workflowId,
      step: "status_transition",
      fromStatus: workflow.status,
      toStatus: "executing",
      timestamp: new Date().toISOString(),
    });

    await updateWorkflowStatus(workflowId, "executing", serviceClient);

    // Step 5: Execute steps sequentially
    const steps = workflow.steps as WorkflowStep[];
    const results: any[] = [];

    console.log(`[WorkflowExecutor] Beginning step execution`, {
      operation: "executeWorkflow",
      workflowId,
      totalSteps: steps.length,
      timestamp: new Date().toISOString(),
    });

    for (const step of steps) {
      console.log(`[WorkflowExecutor] Executing step`, {
        operation: "executeWorkflow",
        workflowId,
        stepId: step.id,
        stepOrder: step.order,
        agentName: step.agentName,
        action: step.action,
        description: step.description,
        timestamp: new Date().toISOString(),
      });

      // Update step status to executing
      step.status = "executing" as any;
      await updateWorkflowStatus(workflowId, "executing", serviceClient, {
        steps,
      });

      console.log(`[WorkflowExecutor] Step status updated to executing`, {
        operation: "executeWorkflow",
        workflowId,
        stepId: step.id,
        timestamp: new Date().toISOString(),
      });

      // Get agent for this step
      const agent = getAgent(step.agentName);
      if (!agent) {
        const errorMessage = `Agent not found: ${step.agentName}`;
        console.error(`[WorkflowExecutor] Agent not found`, {
          operation: "executeWorkflow",
          workflowId,
          stepId: step.id,
          agentName: step.agentName,
          availableAgents: [], // Could call listAgents() here
          timestamp: new Date().toISOString(),
        });

        step.status = "failed" as any;
        await updateWorkflowStatus(workflowId, "failed", serviceClient, {
          steps,
          error: errorMessage,
        });
        return;
      }

      console.log(
        `[WorkflowExecutor] Agent found, preparing execution context`,
        {
          operation: "executeWorkflow",
          workflowId,
          stepId: step.id,
          agentName: agent.name,
          timestamp: new Date().toISOString(),
        }
      );

      // Prepare execution context
      const context: ExecutionContext = {
        userId,
        workflowId,
        stepId: step.id,
        accessToken,
        action: step.action,
        parameters: (step as any).parameters || {},
      };

      // Execute step
      console.log(
        `[WorkflowExecutor] Calling agent execute method`,
        {
          operation: "executeWorkflow",
          workflowId,
          stepId: step.id,
          agentName: agent.name,
          action: step.action,
