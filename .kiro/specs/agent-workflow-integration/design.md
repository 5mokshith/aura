# Design Document: Agent Workflow Integration

## Overview

This design implements a complete workflow execution system that orchestrates specialized agents to perform tasks using Google Workspace APIs. The system consists of three main components:

1. **Workflow Executor**: Orchestrates workflow execution, manages step sequencing, and handles state transitions
2. **Agent System**: Specialized agents for each Google service (Gmail, Drive, Docs, Sheets, Calendar)
3. **Execution API**: Background execution endpoint that processes workflows asynchronously

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Workflow Creation                           │
│  POST /api/workflow/execute                                  │
│  - Creates workflow with status "planning"                   │
│  - Generates workflow plan with LLM                          │
│  - Returns workflow ID to client                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Automatic Execution Trigger                     │
│  - Immediately after creation                                │
│  - Transitions status to "executing"                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Workflow Executor                           │
│  - Fetches workflow and OAuth tokens                         │
│  - Validates token expiration                                │
│  - Executes steps sequentially                               │
│  - Updates status after each step                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent Router                              │
│  - Routes step to appropriate agent                          │
│  - Passes execution context                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Specialized Agents                              │
│  EmailAgent | DriveAgent | DocsAgent | SheetsAgent          │
│  - Execute actions using Google APIs                         │
│  - Return results or errors                                  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Agent Interface (`lib/agents/base.ts`)

```typescript
export interface ExecutionContext {
  userId: string;
  workflowId: string;
  stepId: string;
  accessToken: string;
  action: string;
  parameters: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
}

export interface Agent {
  name: string;
  execute(context: ExecutionContext): Promise<ExecutionResult>;
}
```

### 2. Email Agent (`lib/agents/EmailAgent.ts`)

```typescript
import { google } from 'googleapis';
import type { Agent, ExecutionContext, ExecutionResult } from './base';

export class EmailAgent implements Agent {
  name = 'EmailAgent';

  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const { accessToken, action, parameters } = context;
    
    // Initialize Gmail API client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    try {
      switch (action) {
        case 'send_email':
          return await this.sendEmail(gmail, parameters);
        case 'search_emails':
          return await this.searchEmails(gmail, parameters);
        case 'read_email':
          return await this.readEmail(gmail, parameters);
        case 'summarize_emails':
          return await this.summarizeEmails(gmail, parameters);
        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async sendEmail(gmail: any, params: any): Promise<ExecutionResult> {
    // Implementation
  }

  private async searchEmails(gmail: any, params: any): Promise<ExecutionResult> {
    // Implementation
  }

  private async readEmail(gmail: any, params: any): Promise<ExecutionResult> {
    // Implementation
  }

  private async summarizeEmails(gmail: any, params: any): Promise<ExecutionResult> {
    // Implementation using LLM
  }
}
```

### 3. Drive Agent (`lib/agents/DriveAgent.ts`)

```typescript
export class DriveAgent implements Agent {
  name = 'DriveAgent';

  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const { accessToken, action, parameters } = context;
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
      switch (action) {
        case 'create_folder':
          return await this.createFolder(drive, parameters);
        case 'upload_file':
          return await this.uploadFile(drive, parameters);
        case 'list_files':
          return await this.listFiles(drive, parameters);
        case 'share_file':
          return await this.shareFile(drive, parameters);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Action implementations...
}
```

### 4. Docs Agent (`lib/agents/DocsAgent.ts`)

```typescript
export class DocsAgent implements Agent {
  name = 'DocsAgent';

  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const { accessToken, action, parameters } = context;
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    try {
      switch (action) {
        case 'create_document':
          return await this.createDocument(docs, parameters);
        case 'update_document':
          return await this.updateDocument(docs, parameters);
        case 'read_document':
          return await this.readDocument(docs, parameters);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Action implementations...
}
```

### 5. Sheets Agent (`lib/agents/SheetsAgent.ts`)

```typescript
export class SheetsAgent implements Agent {
  name = 'SheetsAgent';

  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const { accessToken, action, parameters } = context;
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    try {
      switch (action) {
        case 'create_spreadsheet':
          return await this.createSpreadsheet(sheets, parameters);
        case 'read_data':
          return await this.readData(sheets, parameters);
        case 'write_data':
          return await this.writeData(sheets, parameters);
        case 'analyze_data':
          return await this.analyzeData(sheets, parameters);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Action implementations...
}
```

### 6. Calendar Agent (`lib/agents/CalendarAgent.ts`)

```typescript
export class CalendarAgent implements Agent {
  name = 'CalendarAgent';

  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const { accessToken, action, parameters } = context;
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
      switch (action) {
        case 'create_event':
          return await this.createEvent(calendar, parameters);
        case 'list_events':
          return await this.listEvents(calendar, parameters);
        case 'update_event':
          return await this.updateEvent(calendar, parameters);
        case 'delete_event':
          return await this.deleteEvent(calendar, parameters);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Action implementations...
}
```

### 7. Agent Registry (`lib/agents/registry.ts`)

```typescript
import { EmailAgent } from './EmailAgent';
import { DriveAgent } from './DriveAgent';
import { DocsAgent } from './DocsAgent';
import { SheetsAgent } from './SheetsAgent';
import { CalendarAgent } from './CalendarAgent';
import type { Agent } from './base';

const agents: Map<string, Agent> = new Map([
  ['EmailAgent', new EmailAgent()],
  ['DriveAgent', new DriveAgent()],
  ['DocsAgent', new DocsAgent()],
  ['SheetsAgent', new SheetsAgent()],
  ['CalendarAgent', new CalendarAgent()],
]);

export function getAgent(agentName: string): Agent | undefined {
  return agents.get(agentName);
}

export function listAgents(): string[] {
  return Array.from(agents.keys());
}
```

### 8. Workflow Executor (`lib/services/workflowExecutor.ts`)

```typescript
import { createServiceClient } from '@/lib/supabase/server';
import { getAgent } from '@/lib/agents/registry';
import { updateWorkflowStatus } from './workflowService';
import type { WorkflowStep } from '@/types';
import type { ExecutionContext } from '@/lib/agents/base';

export async function executeWorkflow(
  workflowId: string,
  userId: string,
  accessToken: string
): Promise<void> {
  const serviceClient = createServiceClient();

  try {
    // Fetch workflow
    const { data: workflow, error: fetchError } = await serviceClient
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (fetchError || !workflow) {
      throw new Error('Workflow not found');
    }

    // Update status to executing
    await updateWorkflowStatus(workflowId, 'executing', serviceClient);

    const steps = workflow.steps as WorkflowStep[];
    const results: any[] = [];

    // Execute steps sequentially
    for (const step of steps) {
      console.log(`[Workflow Executor] Executing step ${step.id}`, {
        workflowId,
        stepId: step.id,
        agentName: step.agentName,
        action: step.action,
      });

      // Update step status to executing
      step.status = 'executing';
      await updateWorkflowStatus(workflowId, 'executing', serviceClient, {
        steps,
      });

      // Get agent
      const agent = getAgent(step.agentName);
      if (!agent) {
        throw new Error(`Agent not found: ${step.agentName}`);
      }

      // Execute step
      const context: ExecutionContext = {
        userId,
        workflowId,
        stepId: step.id,
        accessToken,
        action: step.action,
        parameters: (step as any).parameters || {},
      };

      const result = await agent.execute(context);

      if (!result.success) {
        // Step failed
        step.status = 'failed';
        await updateWorkflowStatus(workflowId, 'failed', serviceClient, {
          steps,
          error: `Step ${step.id} failed: ${result.error}`,
        });
        return;
      }

      // Step succeeded
      step.status = 'completed';
      results.push({
        stepId: step.id,
        output: result.output,
      });

      await updateWorkflowStatus(workflowId, 'executing', serviceClient, {
        steps,
        results,
      });
    }

    // All steps completed
    await updateWorkflowStatus(workflowId, 'completed', serviceClient, {
      steps,
      results,
    });

    console.log(`[Workflow Executor] Workflow completed successfully`, {
      workflowId,
      stepCount: steps.length,
    });
  } catch (error) {
    console.error(`[Workflow Executor] Workflow execution failed`, {
      workflowId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    await updateWorkflowStatus(workflowId, 'failed', serviceClient, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
```

### 9. Updated Workflow API Route (`app/api/workflow/execute/route.ts`)

```typescript
// After creating workflow, trigger execution asynchronously
const { workflowId, steps } = await createAndPlanWorkflow(
  user.id,
  command,
  serviceClient
);

// Record in history
await recordWorkflowHistory(user.id, workflowId, command, "planning", serviceClient);

// Trigger execution asynchronously (don't await)
executeWorkflow(workflowId, user.id, tokens.access_token).catch((error) => {
  console.error('Background workflow execution failed:', error);
});

return NextResponse.json({
  success: true,
  workflowId,
  steps,
  message: "Workflow created and execution started",
});
```

## Data Models

### Workflow Step (Extended)

```typescript
interface WorkflowStep {
  id: string;
  agentName: string;
  action: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  order: number;
  parameters?: Record<string, any>; // Action-specific parameters
}
```

### Execution Result Storage

```typescript
interface StepResult {
  stepId: string;
  output: any;
  executedAt?: string;
}

// Stored in workflow.results array
```

## Error Handling

### Error Categories

1. **Agent Not Found**
   - Log error with agent name
   - Fail workflow immediately
   - Store error in workflow.error field

2. **OAuth Token Expired**
   - Check before execution starts
   - Return clear error message to user
   - Suggest reconnecting Google account

3. **API Request Failures**
   - Catch Google API errors
   - Log with full context
   - Store error in step result
   - Fail workflow

4. **Step Execution Failures**
   - Mark step as failed
   - Store error message
   - Halt workflow execution
   - Update workflow status to failed

### Logging Strategy

```typescript
// Success logging
console.log(`[Agent] Action completed`, {
  agent: agentName,
  action,
  workflowId,
  stepId,
  timestamp: new Date().toISOString(),
});

// Error logging
console.error(`[Agent] Action failed`, {
  agent: agentName,
  action,
  workflowId,
  stepId,
  error: error.message,
  errorStack: error.stack,
  timestamp: new Date().toISOString(),
});
```

## Testing Strategy

### Unit Tests

1. **Agent Tests**
   - Test each action in isolation
   - Mock Google API responses
   - Test error handling

2. **Executor Tests**
   - Test step sequencing
   - Test status transitions
   - Test error propagation

3. **Registry Tests**
   - Test agent lookup
   - Test unknown agent handling

### Integration Tests

1. **End-to-End Workflow**
   - Create workflow
   - Verify execution starts
   - Verify steps execute in order
   - Verify final status

2. **Error Scenarios**
   - Test with expired token
   - Test with invalid agent
   - Test with API failures

## Dependencies

### New Dependencies

```json
{
  "googleapis": "^140.0.0"
}
```

### Environment Variables

No new environment variables required. Uses existing:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- OAuth tokens from database

## Security Considerations

- **Access Token Protection**: Never log access tokens
- **User Authorization**: Always verify user owns the workflow
- **Token Validation**: Check expiration before execution
- **Service Role Usage**: Use service client for all DB operations

## Performance Considerations

- **Async Execution**: Workflows execute in background, don't block API response
- **Sequential Steps**: Steps execute one at a time (can be parallelized later)
- **Database Updates**: Update after each step for real-time progress
- **Error Fast-Fail**: Stop execution immediately on first failure

## Success Metrics

- ✅ Workflows automatically execute after creation
- ✅ All agents successfully call Google APIs
- ✅ Step status updates in real-time
- ✅ Errors are captured and reported
- ✅ OAuth tokens are validated before execution
- ✅ Workflow results are stored correctly

