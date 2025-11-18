#***REMOVED***Design***REMOVED***Document:***REMOVED***Agent***REMOVED***Workflow***REMOVED***Integration

##***REMOVED***Overview

This***REMOVED***design***REMOVED***implements***REMOVED***a***REMOVED***complete***REMOVED***workflow***REMOVED***execution***REMOVED***system***REMOVED***that***REMOVED***orchestrates***REMOVED***specialized***REMOVED***agents***REMOVED***to***REMOVED***perform***REMOVED***tasks***REMOVED***using***REMOVED***Google***REMOVED***Workspace***REMOVED***APIs.***REMOVED***The***REMOVED***system***REMOVED***consists***REMOVED***of***REMOVED***three***REMOVED***main***REMOVED***components:

1.***REMOVED*****Workflow***REMOVED***Executor**:***REMOVED***Orchestrates***REMOVED***workflow***REMOVED***execution,***REMOVED***manages***REMOVED***step***REMOVED***sequencing,***REMOVED***and***REMOVED***handles***REMOVED***state***REMOVED***transitions
2.***REMOVED*****Agent***REMOVED***System**:***REMOVED***Specialized***REMOVED***agents***REMOVED***for***REMOVED***each***REMOVED***Google***REMOVED***service***REMOVED***(Gmail,***REMOVED***Drive,***REMOVED***Docs,***REMOVED***Sheets,***REMOVED***Calendar)
3.***REMOVED*****Execution***REMOVED***API**:***REMOVED***Background***REMOVED***execution***REMOVED***endpoint***REMOVED***that***REMOVED***processes***REMOVED***workflows***REMOVED***asynchronously

##***REMOVED***Architecture

###***REMOVED***High-Level***REMOVED***Flow

```
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Workflow***REMOVED***Creation***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***POST***REMOVED***/api/workflow/execute***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Creates***REMOVED***workflow***REMOVED***with***REMOVED***status***REMOVED***"planning"***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Generates***REMOVED***workflow***REMOVED***plan***REMOVED***with***REMOVED***LLM***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Returns***REMOVED***workflow***REMOVED***ID***REMOVED***to***REMOVED***client***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Automatic***REMOVED***Execution***REMOVED***Trigger***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Immediately***REMOVED***after***REMOVED***creation***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Transitions***REMOVED***status***REMOVED***to***REMOVED***"executing"***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Workflow***REMOVED***Executor***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Fetches***REMOVED***workflow***REMOVED***and***REMOVED***OAuth***REMOVED***tokens***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Validates***REMOVED***token***REMOVED***expiration***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Executes***REMOVED***steps***REMOVED***sequentially***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Updates***REMOVED***status***REMOVED***after***REMOVED***each***REMOVED***step***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Agent***REMOVED***Router***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Routes***REMOVED***step***REMOVED***to***REMOVED***appropriate***REMOVED***agent***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Passes***REMOVED***execution***REMOVED***context***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***▼
┌─────────────────────────────────────────────────────────────┐
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Specialized***REMOVED***Agents***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***EmailAgent***REMOVED***|***REMOVED***DriveAgent***REMOVED***|***REMOVED***DocsAgent***REMOVED***|***REMOVED***SheetsAgent***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Execute***REMOVED***actions***REMOVED***using***REMOVED***Google***REMOVED***APIs***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
│***REMOVED******REMOVED***-***REMOVED***Return***REMOVED***results***REMOVED***or***REMOVED***errors***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***│
└─────────────────────────────────────────────────────────────┘
```

##***REMOVED***Components***REMOVED***and***REMOVED***Interfaces

###***REMOVED***1.***REMOVED***Agent***REMOVED***Interface***REMOVED***(`lib/agents/base.ts`)

```typescript
export***REMOVED***interface***REMOVED***ExecutionContext***REMOVED***{
***REMOVED******REMOVED***userId:***REMOVED***string;
***REMOVED******REMOVED***workflowId:***REMOVED***string;
***REMOVED******REMOVED***stepId:***REMOVED***string;
***REMOVED******REMOVED***accessToken:***REMOVED***string;
***REMOVED******REMOVED***action:***REMOVED***string;
***REMOVED******REMOVED***parameters:***REMOVED***Record<string,***REMOVED***any>;
}

export***REMOVED***interface***REMOVED***ExecutionResult***REMOVED***{
***REMOVED******REMOVED***success:***REMOVED***boolean;
***REMOVED******REMOVED***output?:***REMOVED***any;
***REMOVED******REMOVED***error?:***REMOVED***string;
}

export***REMOVED***interface***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name:***REMOVED***string;
***REMOVED******REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>;
}
```

###***REMOVED***2.***REMOVED***Email***REMOVED***Agent***REMOVED***(`lib/agents/EmailAgent.ts`)

```typescript
import***REMOVED***{***REMOVED***google***REMOVED***}***REMOVED***from***REMOVED***'googleapis';
import***REMOVED***type***REMOVED***{***REMOVED***Agent,***REMOVED***ExecutionContext,***REMOVED***ExecutionResult***REMOVED***}***REMOVED***from***REMOVED***'./base';

export***REMOVED***class***REMOVED***EmailAgent***REMOVED***implements***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name***REMOVED***=***REMOVED***'EmailAgent';

***REMOVED******REMOVED***async***REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***accessToken,***REMOVED***action,***REMOVED***parameters***REMOVED***}***REMOVED***=***REMOVED***context;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Initialize***REMOVED***Gmail***REMOVED***API***REMOVED***client
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***oauth2Client***REMOVED***=***REMOVED***new***REMOVED***google.auth.OAuth2();
***REMOVED******REMOVED******REMOVED******REMOVED***oauth2Client.setCredentials({***REMOVED***access_token:***REMOVED***accessToken***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***gmail***REMOVED***=***REMOVED***google.gmail({***REMOVED***version:***REMOVED***'v1',***REMOVED***auth:***REMOVED***oauth2Client***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(action)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'send_email':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.sendEmail(gmail,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'search_emails':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.searchEmails(gmail,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'read_email':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.readEmail(gmail,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'summarize_emails':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.summarizeEmails(gmail,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Unknown***REMOVED***action:***REMOVED***${action}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***private***REMOVED***async***REMOVED***sendEmail(gmail:***REMOVED***any,***REMOVED***params:***REMOVED***any):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Implementation
***REMOVED******REMOVED***}

***REMOVED******REMOVED***private***REMOVED***async***REMOVED***searchEmails(gmail:***REMOVED***any,***REMOVED***params:***REMOVED***any):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Implementation
***REMOVED******REMOVED***}

***REMOVED******REMOVED***private***REMOVED***async***REMOVED***readEmail(gmail:***REMOVED***any,***REMOVED***params:***REMOVED***any):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Implementation
***REMOVED******REMOVED***}

***REMOVED******REMOVED***private***REMOVED***async***REMOVED***summarizeEmails(gmail:***REMOVED***any,***REMOVED***params:***REMOVED***any):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Implementation***REMOVED***using***REMOVED***LLM
***REMOVED******REMOVED***}
}
```

###***REMOVED***3.***REMOVED***Drive***REMOVED***Agent***REMOVED***(`lib/agents/DriveAgent.ts`)

```typescript
export***REMOVED***class***REMOVED***DriveAgent***REMOVED***implements***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name***REMOVED***=***REMOVED***'DriveAgent';

***REMOVED******REMOVED***async***REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***accessToken,***REMOVED***action,***REMOVED***parameters***REMOVED***}***REMOVED***=***REMOVED***context;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***oauth2Client***REMOVED***=***REMOVED***new***REMOVED***google.auth.OAuth2();
***REMOVED******REMOVED******REMOVED******REMOVED***oauth2Client.setCredentials({***REMOVED***access_token:***REMOVED***accessToken***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***drive***REMOVED***=***REMOVED***google.drive({***REMOVED***version:***REMOVED***'v3',***REMOVED***auth:***REMOVED***oauth2Client***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(action)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'create_folder':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.createFolder(drive,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'upload_file':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.uploadFile(drive,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'list_files':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.listFiles(drive,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'share_file':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.shareFile(drive,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{***REMOVED***success:***REMOVED***false,***REMOVED***error:***REMOVED***`Unknown***REMOVED***action:***REMOVED***${action}`***REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Action***REMOVED***implementations...
}
```

###***REMOVED***4.***REMOVED***Docs***REMOVED***Agent***REMOVED***(`lib/agents/DocsAgent.ts`)

```typescript
export***REMOVED***class***REMOVED***DocsAgent***REMOVED***implements***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name***REMOVED***=***REMOVED***'DocsAgent';

***REMOVED******REMOVED***async***REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***accessToken,***REMOVED***action,***REMOVED***parameters***REMOVED***}***REMOVED***=***REMOVED***context;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***oauth2Client***REMOVED***=***REMOVED***new***REMOVED***google.auth.OAuth2();
***REMOVED******REMOVED******REMOVED******REMOVED***oauth2Client.setCredentials({***REMOVED***access_token:***REMOVED***accessToken***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***docs***REMOVED***=***REMOVED***google.docs({***REMOVED***version:***REMOVED***'v1',***REMOVED***auth:***REMOVED***oauth2Client***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(action)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'create_document':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.createDocument(docs,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'update_document':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.updateDocument(docs,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'read_document':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.readDocument(docs,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{***REMOVED***success:***REMOVED***false,***REMOVED***error:***REMOVED***`Unknown***REMOVED***action:***REMOVED***${action}`***REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Action***REMOVED***implementations...
}
```

###***REMOVED***5.***REMOVED***Sheets***REMOVED***Agent***REMOVED***(`lib/agents/SheetsAgent.ts`)

```typescript
export***REMOVED***class***REMOVED***SheetsAgent***REMOVED***implements***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name***REMOVED***=***REMOVED***'SheetsAgent';

***REMOVED******REMOVED***async***REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***accessToken,***REMOVED***action,***REMOVED***parameters***REMOVED***}***REMOVED***=***REMOVED***context;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***oauth2Client***REMOVED***=***REMOVED***new***REMOVED***google.auth.OAuth2();
***REMOVED******REMOVED******REMOVED******REMOVED***oauth2Client.setCredentials({***REMOVED***access_token:***REMOVED***accessToken***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***sheets***REMOVED***=***REMOVED***google.sheets({***REMOVED***version:***REMOVED***'v4',***REMOVED***auth:***REMOVED***oauth2Client***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(action)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'create_spreadsheet':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.createSpreadsheet(sheets,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'read_data':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.readData(sheets,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'write_data':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.writeData(sheets,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'analyze_data':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.analyzeData(sheets,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{***REMOVED***success:***REMOVED***false,***REMOVED***error:***REMOVED***`Unknown***REMOVED***action:***REMOVED***${action}`***REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Action***REMOVED***implementations...
}
```

###***REMOVED***6.***REMOVED***Calendar***REMOVED***Agent***REMOVED***(`lib/agents/CalendarAgent.ts`)

```typescript
export***REMOVED***class***REMOVED***CalendarAgent***REMOVED***implements***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name***REMOVED***=***REMOVED***'CalendarAgent';

***REMOVED******REMOVED***async***REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***accessToken,***REMOVED***action,***REMOVED***parameters***REMOVED***}***REMOVED***=***REMOVED***context;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***oauth2Client***REMOVED***=***REMOVED***new***REMOVED***google.auth.OAuth2();
***REMOVED******REMOVED******REMOVED******REMOVED***oauth2Client.setCredentials({***REMOVED***access_token:***REMOVED***accessToken***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***calendar***REMOVED***=***REMOVED***google.calendar({***REMOVED***version:***REMOVED***'v3',***REMOVED***auth:***REMOVED***oauth2Client***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(action)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'create_event':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.createEvent(calendar,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'list_events':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.listEvents(calendar,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'update_event':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.updateEvent(calendar,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***'delete_event':
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.deleteEvent(calendar,***REMOVED***parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{***REMOVED***success:***REMOVED***false,***REMOVED***error:***REMOVED***`Unknown***REMOVED***action:***REMOVED***${action}`***REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Action***REMOVED***implementations...
}
```

###***REMOVED***7.***REMOVED***Agent***REMOVED***Registry***REMOVED***(`lib/agents/registry.ts`)

```typescript
import***REMOVED***{***REMOVED***EmailAgent***REMOVED***}***REMOVED***from***REMOVED***'./EmailAgent';
import***REMOVED***{***REMOVED***DriveAgent***REMOVED***}***REMOVED***from***REMOVED***'./DriveAgent';
import***REMOVED***{***REMOVED***DocsAgent***REMOVED***}***REMOVED***from***REMOVED***'./DocsAgent';
import***REMOVED***{***REMOVED***SheetsAgent***REMOVED***}***REMOVED***from***REMOVED***'./SheetsAgent';
import***REMOVED***{***REMOVED***CalendarAgent***REMOVED***}***REMOVED***from***REMOVED***'./CalendarAgent';
import***REMOVED***type***REMOVED***{***REMOVED***Agent***REMOVED***}***REMOVED***from***REMOVED***'./base';

const***REMOVED***agents:***REMOVED***Map<string,***REMOVED***Agent>***REMOVED***=***REMOVED***new***REMOVED***Map([
***REMOVED******REMOVED***['EmailAgent',***REMOVED***new***REMOVED***EmailAgent()],
***REMOVED******REMOVED***['DriveAgent',***REMOVED***new***REMOVED***DriveAgent()],
***REMOVED******REMOVED***['DocsAgent',***REMOVED***new***REMOVED***DocsAgent()],
***REMOVED******REMOVED***['SheetsAgent',***REMOVED***new***REMOVED***SheetsAgent()],
***REMOVED******REMOVED***['CalendarAgent',***REMOVED***new***REMOVED***CalendarAgent()],
]);

export***REMOVED***function***REMOVED***getAgent(agentName:***REMOVED***string):***REMOVED***Agent***REMOVED***|***REMOVED***undefined***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***agents.get(agentName);
}

export***REMOVED***function***REMOVED***listAgents():***REMOVED***string[]***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***Array.from(agents.keys());
}
```

###***REMOVED***8.***REMOVED***Workflow***REMOVED***Executor***REMOVED***(`lib/services/workflowExecutor.ts`)

```typescript
import***REMOVED***{***REMOVED***createServiceClient***REMOVED***}***REMOVED***from***REMOVED***'@/lib/supabase/server';
import***REMOVED***{***REMOVED***getAgent***REMOVED***}***REMOVED***from***REMOVED***'@/lib/agents/registry';
import***REMOVED***{***REMOVED***updateWorkflowStatus***REMOVED***}***REMOVED***from***REMOVED***'./workflowService';
import***REMOVED***type***REMOVED***{***REMOVED***WorkflowStep***REMOVED***}***REMOVED***from***REMOVED***'@/types';
import***REMOVED***type***REMOVED***{***REMOVED***ExecutionContext***REMOVED***}***REMOVED***from***REMOVED***'@/lib/agents/base';

export***REMOVED***async***REMOVED***function***REMOVED***executeWorkflow(
***REMOVED******REMOVED***workflowId:***REMOVED***string,
***REMOVED******REMOVED***userId:***REMOVED***string,
***REMOVED******REMOVED***accessToken:***REMOVED***string
):***REMOVED***Promise<void>***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***serviceClient***REMOVED***=***REMOVED***createServiceClient();

***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Fetch***REMOVED***workflow
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***workflow,***REMOVED***error:***REMOVED***fetchError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***serviceClient
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.from('workflows')
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.select('*')
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.eq('id',***REMOVED***workflowId)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***.single();

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(fetchError***REMOVED***||***REMOVED***!workflow)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error('Workflow***REMOVED***not***REMOVED***found');
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Update***REMOVED***status***REMOVED***to***REMOVED***executing
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***'executing',***REMOVED***serviceClient);

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***steps***REMOVED***=***REMOVED***workflow.steps***REMOVED***as***REMOVED***WorkflowStep[];
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***results:***REMOVED***any[]***REMOVED***=***REMOVED***[];

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Execute***REMOVED***steps***REMOVED***sequentially
***REMOVED******REMOVED******REMOVED******REMOVED***for***REMOVED***(const***REMOVED***step***REMOVED***of***REMOVED***steps)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Executing***REMOVED***step***REMOVED***${step.id}`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***agentName:***REMOVED***step.agentName,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***step.action,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Update***REMOVED***step***REMOVED***status***REMOVED***to***REMOVED***executing
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***'executing';
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***'executing',***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Get***REMOVED***agent
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***agent***REMOVED***=***REMOVED***getAgent(step.agentName);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!agent)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error(`Agent***REMOVED***not***REMOVED***found:***REMOVED***${step.agentName}`);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Execute***REMOVED***step
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***context:***REMOVED***ExecutionContext***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***userId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***accessToken,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***step.action,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***parameters:***REMOVED***(step***REMOVED***as***REMOVED***any).parameters***REMOVED***||***REMOVED***{},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***agent.execute(context);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!result.success)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***failed
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***'failed';
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***'failed',***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Step***REMOVED***${step.id}***REMOVED***failed:***REMOVED***${result.error}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Step***REMOVED***succeeded
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step.status***REMOVED***=***REMOVED***'completed';
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results.push({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepId:***REMOVED***step.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***result.output,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***'executing',***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***All***REMOVED***steps***REMOVED***completed
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***'completed',***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***steps,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***results,
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`[Workflow***REMOVED***Executor]***REMOVED***Workflow***REMOVED***completed***REMOVED***successfully`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***stepCount:***REMOVED***steps.length,
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error(`[Workflow***REMOVED***Executor]***REMOVED***Workflow***REMOVED***execution***REMOVED***failed`,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***updateWorkflowStatus(workflowId,***REMOVED***'failed',***REMOVED***serviceClient,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***'Unknown***REMOVED***error',
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}
}
```

###***REMOVED***9.***REMOVED***Updated***REMOVED***Workflow***REMOVED***API***REMOVED***Route***REMOVED***(`app/api/workflow/execute/route.ts`)

```typescript
//***REMOVED***After***REMOVED***creating***REMOVED***workflow,***REMOVED***trigger***REMOVED***execution***REMOVED***asynchronously
const***REMOVED***{***REMOVED***workflowId,***REMOVED***steps***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***createAndPlanWorkflow(
***REMOVED******REMOVED***user.id,
***REMOVED******REMOVED***command,
***REMOVED******REMOVED***serviceClient
);

//***REMOVED***Record***REMOVED***in***REMOVED***history
await***REMOVED***recordWorkflowHistory(user.id,***REMOVED***workflowId,***REMOVED***command,***REMOVED***"planning",***REMOVED***serviceClient);

//***REMOVED***Trigger***REMOVED***execution***REMOVED***asynchronously***REMOVED***(don't***REMOVED***await)
executeWorkflow(workflowId,***REMOVED***user.id,***REMOVED***tokens.access_token).catch((error)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED***console.error('Background***REMOVED***workflow***REMOVED***execution***REMOVED***failed:',***REMOVED***error);
});

return***REMOVED***NextResponse.json({
***REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED***steps,
***REMOVED******REMOVED***message:***REMOVED***"Workflow***REMOVED***created***REMOVED***and***REMOVED***execution***REMOVED***started",
});
```

##***REMOVED***Data***REMOVED***Models

###***REMOVED***Workflow***REMOVED***Step***REMOVED***(Extended)

```typescript
interface***REMOVED***WorkflowStep***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***agentName:***REMOVED***string;
***REMOVED******REMOVED***action:***REMOVED***string;
***REMOVED******REMOVED***description:***REMOVED***string;
***REMOVED******REMOVED***status:***REMOVED***'pending'***REMOVED***|***REMOVED***'executing'***REMOVED***|***REMOVED***'completed'***REMOVED***|***REMOVED***'failed';
***REMOVED******REMOVED***order:***REMOVED***number;
***REMOVED******REMOVED***parameters?:***REMOVED***Record<string,***REMOVED***any>;***REMOVED***//***REMOVED***Action-specific***REMOVED***parameters
}
```

###***REMOVED***Execution***REMOVED***Result***REMOVED***Storage

```typescript
interface***REMOVED***StepResult***REMOVED***{
***REMOVED******REMOVED***stepId:***REMOVED***string;
***REMOVED******REMOVED***output:***REMOVED***any;
***REMOVED******REMOVED***executedAt?:***REMOVED***string;
}

//***REMOVED***Stored***REMOVED***in***REMOVED***workflow.results***REMOVED***array
```

##***REMOVED***Error***REMOVED***Handling

###***REMOVED***Error***REMOVED***Categories

1.***REMOVED*****Agent***REMOVED***Not***REMOVED***Found**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Log***REMOVED***error***REMOVED***with***REMOVED***agent***REMOVED***name
***REMOVED******REMOVED******REMOVED***-***REMOVED***Fail***REMOVED***workflow***REMOVED***immediately
***REMOVED******REMOVED******REMOVED***-***REMOVED***Store***REMOVED***error***REMOVED***in***REMOVED***workflow.error***REMOVED***field

2.***REMOVED*****OAuth***REMOVED***Token***REMOVED***Expired**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Check***REMOVED***before***REMOVED***execution***REMOVED***starts
***REMOVED******REMOVED******REMOVED***-***REMOVED***Return***REMOVED***clear***REMOVED***error***REMOVED***message***REMOVED***to***REMOVED***user
***REMOVED******REMOVED******REMOVED***-***REMOVED***Suggest***REMOVED***reconnecting***REMOVED***Google***REMOVED***account

3.***REMOVED*****API***REMOVED***Request***REMOVED***Failures**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Catch***REMOVED***Google***REMOVED***API***REMOVED***errors
***REMOVED******REMOVED******REMOVED***-***REMOVED***Log***REMOVED***with***REMOVED***full***REMOVED***context
***REMOVED******REMOVED******REMOVED***-***REMOVED***Store***REMOVED***error***REMOVED***in***REMOVED***step***REMOVED***result
***REMOVED******REMOVED******REMOVED***-***REMOVED***Fail***REMOVED***workflow

4.***REMOVED*****Step***REMOVED***Execution***REMOVED***Failures**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Mark***REMOVED***step***REMOVED***as***REMOVED***failed
***REMOVED******REMOVED******REMOVED***-***REMOVED***Store***REMOVED***error***REMOVED***message
***REMOVED******REMOVED******REMOVED***-***REMOVED***Halt***REMOVED***workflow***REMOVED***execution
***REMOVED******REMOVED******REMOVED***-***REMOVED***Update***REMOVED***workflow***REMOVED***status***REMOVED***to***REMOVED***failed

###***REMOVED***Logging***REMOVED***Strategy

```typescript
//***REMOVED***Success***REMOVED***logging
console.log(`[Agent]***REMOVED***Action***REMOVED***completed`,***REMOVED***{
***REMOVED******REMOVED***agent:***REMOVED***agentName,
***REMOVED******REMOVED***action,
***REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED***stepId,
***REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
});

//***REMOVED***Error***REMOVED***logging
console.error(`[Agent]***REMOVED***Action***REMOVED***failed`,***REMOVED***{
***REMOVED******REMOVED***agent:***REMOVED***agentName,
***REMOVED******REMOVED***action,
***REMOVED******REMOVED***workflowId,
***REMOVED******REMOVED***stepId,
***REMOVED******REMOVED***error:***REMOVED***error.message,
***REMOVED******REMOVED***errorStack:***REMOVED***error.stack,
***REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
});
```

##***REMOVED***Testing***REMOVED***Strategy

###***REMOVED***Unit***REMOVED***Tests

1.***REMOVED*****Agent***REMOVED***Tests**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***each***REMOVED***action***REMOVED***in***REMOVED***isolation
***REMOVED******REMOVED******REMOVED***-***REMOVED***Mock***REMOVED***Google***REMOVED***API***REMOVED***responses
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***error***REMOVED***handling

2.***REMOVED*****Executor***REMOVED***Tests**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***step***REMOVED***sequencing
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***status***REMOVED***transitions
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***error***REMOVED***propagation

3.***REMOVED*****Registry***REMOVED***Tests**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***agent***REMOVED***lookup
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***unknown***REMOVED***agent***REMOVED***handling

###***REMOVED***Integration***REMOVED***Tests

1.***REMOVED*****End-to-End***REMOVED***Workflow**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Create***REMOVED***workflow
***REMOVED******REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***execution***REMOVED***starts
***REMOVED******REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***steps***REMOVED***execute***REMOVED***in***REMOVED***order
***REMOVED******REMOVED******REMOVED***-***REMOVED***Verify***REMOVED***final***REMOVED***status

2.***REMOVED*****Error***REMOVED***Scenarios**
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***with***REMOVED***expired***REMOVED***token
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***with***REMOVED***invalid***REMOVED***agent
***REMOVED******REMOVED******REMOVED***-***REMOVED***Test***REMOVED***with***REMOVED***API***REMOVED***failures

##***REMOVED***Dependencies

###***REMOVED***New***REMOVED***Dependencies

```json
{
***REMOVED******REMOVED***"googleapis":***REMOVED***"^140.0.0"
}
```

###***REMOVED***Environment***REMOVED***Variables

No***REMOVED***new***REMOVED***environment***REMOVED***variables***REMOVED***required.***REMOVED***Uses***REMOVED***existing:
-***REMOVED***`GOOGLE_CLIENT_ID`
-***REMOVED***`GOOGLE_CLIENT_SECRET`
-***REMOVED***OAuth***REMOVED***tokens***REMOVED***from***REMOVED***database

##***REMOVED***Security***REMOVED***Considerations

-***REMOVED*****Access***REMOVED***Token***REMOVED***Protection**:***REMOVED***Never***REMOVED***log***REMOVED***access***REMOVED***tokens
-***REMOVED*****User***REMOVED***Authorization**:***REMOVED***Always***REMOVED***verify***REMOVED***user***REMOVED***owns***REMOVED***the***REMOVED***workflow
-***REMOVED*****Token***REMOVED***Validation**:***REMOVED***Check***REMOVED***expiration***REMOVED***before***REMOVED***execution
-***REMOVED*****Service***REMOVED***Role***REMOVED***Usage**:***REMOVED***Use***REMOVED***service***REMOVED***client***REMOVED***for***REMOVED***all***REMOVED***DB***REMOVED***operations

##***REMOVED***Performance***REMOVED***Considerations

-***REMOVED*****Async***REMOVED***Execution**:***REMOVED***Workflows***REMOVED***execute***REMOVED***in***REMOVED***background,***REMOVED***don't***REMOVED***block***REMOVED***API***REMOVED***response
-***REMOVED*****Sequential***REMOVED***Steps**:***REMOVED***Steps***REMOVED***execute***REMOVED***one***REMOVED***at***REMOVED***a***REMOVED***time***REMOVED***(can***REMOVED***be***REMOVED***parallelized***REMOVED***later)
-***REMOVED*****Database***REMOVED***Updates**:***REMOVED***Update***REMOVED***after***REMOVED***each***REMOVED***step***REMOVED***for***REMOVED***real-time***REMOVED***progress
-***REMOVED*****Error***REMOVED***Fast-Fail**:***REMOVED***Stop***REMOVED***execution***REMOVED***immediately***REMOVED***on***REMOVED***first***REMOVED***failure

##***REMOVED***Success***REMOVED***Metrics

-***REMOVED***✅***REMOVED***Workflows***REMOVED***automatically***REMOVED***execute***REMOVED***after***REMOVED***creation
-***REMOVED***✅***REMOVED***All***REMOVED***agents***REMOVED***successfully***REMOVED***call***REMOVED***Google***REMOVED***APIs
-***REMOVED***✅***REMOVED***Step***REMOVED***status***REMOVED***updates***REMOVED***in***REMOVED***real-time
-***REMOVED***✅***REMOVED***Errors***REMOVED***are***REMOVED***captured***REMOVED***and***REMOVED***reported
-***REMOVED***✅***REMOVED***OAuth***REMOVED***tokens***REMOVED***are***REMOVED***validated***REMOVED***before***REMOVED***execution
-***REMOVED***✅***REMOVED***Workflow***REMOVED***results***REMOVED***are***REMOVED***stored***REMOVED***correctly
