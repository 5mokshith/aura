"use***REMOVED***client";

import***REMOVED***React***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***ExecutionTracker***REMOVED***}***REMOVED***from***REMOVED***"@/components/execution";
import***REMOVED***{***REMOVED***useWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/WorkflowContext";
import***REMOVED***{***REMOVED***Button***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/button";

export***REMOVED***default***REMOVED***function***REMOVED***DemoPage()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***workflow,***REMOVED***isExecuting,***REMOVED***executeWorkflow,***REMOVED***cancelWorkflow***REMOVED***}***REMOVED***=***REMOVED***useWorkflow();

***REMOVED******REMOVED***const***REMOVED***handleStartDemo***REMOVED***=***REMOVED***async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***executeWorkflow("Create***REMOVED***a***REMOVED***summary***REMOVED***document***REMOVED***of***REMOVED***my***REMOVED***recent***REMOVED***emails***REMOVED***and***REMOVED***save***REMOVED***it***REMOVED***to***REMOVED***Google***REMOVED***Drive");
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="container***REMOVED***mx-auto***REMOVED***max-w-4xl***REMOVED***py-8***REMOVED***space-y-6">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h1***REMOVED***className="text-3xl***REMOVED***font-bold">Execution***REMOVED***Tracker***REMOVED***Demo</h1>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="mt-2***REMOVED***text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Test***REMOVED***the***REMOVED***execution***REMOVED***tracker***REMOVED***component***REMOVED***with***REMOVED***a***REMOVED***simulated***REMOVED***workflow
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***gap-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={handleStartDemo}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***disabled={isExecuting}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Start***REMOVED***Demo***REMOVED***Workflow
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{workflow***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ExecutionTracker
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflow={workflow}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onCancel={cancelWorkflow}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onRetryStep={(stepId)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log("Retry***REMOVED***step:",***REMOVED***stepId);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***In***REMOVED***production,***REMOVED***this***REMOVED***would***REMOVED***trigger***REMOVED***a***REMOVED***step***REMOVED***retry
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{!workflow***REMOVED***&&***REMOVED***!isExecuting***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="rounded-lg***REMOVED***border***REMOVED***border-dashed***REMOVED***p-12***REMOVED***text-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Click***REMOVED***"Start***REMOVED***Demo***REMOVED***Workflow"***REMOVED***to***REMOVED***see***REMOVED***the***REMOVED***execution***REMOVED***tracker***REMOVED***in***REMOVED***action
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
