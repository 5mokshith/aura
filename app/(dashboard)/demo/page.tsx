"useclient";

importReactfrom"react";
import{ExecutionTracker}from"@/components/execution";
import{useWorkflow}from"@/contexts/WorkflowContext";
import{Button}from"@/components/ui/button";

exportdefaultfunctionDemoPage(){
const{workflow,isExecuting,executeWorkflow,cancelWorkflow}=useWorkflow();

consthandleStartDemo=async()=>{
awaitexecuteWorkflow("CreateasummarydocumentofmyrecentemailsandsaveittoGoogleDrive");
};

return(
<divclassName="containermx-automax-w-4xlpy-8space-y-6">
<div>
<h1className="text-3xlfont-bold">ExecutionTrackerDemo</h1>
<pclassName="mt-2text-muted-foreground">
Testtheexecutiontrackercomponentwithasimulatedworkflow
</p>
</div>

<divclassName="flexgap-4">
<Button
onClick={handleStartDemo}
disabled={isExecuting}
>
StartDemoWorkflow
</Button>
</div>

{workflow&&(
<ExecutionTracker
workflow={workflow}
onCancel={cancelWorkflow}
onRetryStep={(stepId)=>{
console.log("Retrystep:",stepId);
//Inproduction,thiswouldtriggerastepretry
}}
/>
)}

{!workflow&&!isExecuting&&(
<divclassName="rounded-lgborderborder-dashedp-12text-center">
<pclassName="text-muted-foreground">
Click"StartDemoWorkflow"toseetheexecutiontrackerinaction
</p>
</div>
)}
</div>
);
}
