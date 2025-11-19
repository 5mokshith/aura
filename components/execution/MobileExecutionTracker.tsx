"useclient";

import{useWorkflow}from"@/contexts/WorkflowContext";
import{MobileBottomSheet}from"@/components/layout/MobileBottomSheet";
import{ExecutionTracker}from"./ExecutionTracker";

exportfunctionMobileExecutionTracker(){
const{workflow,isExecuting,cancelWorkflow}=useWorkflow();

//Onlyshowwhenthere'sanactiveworkflow
constshouldShow=workflow!==null;

if(!shouldShow){
returnnull;
}

return(
<MobileBottomSheet
isOpen={isExecuting}
title="ExecutionProgress"
className="lg:hidden"
>
<ExecutionTracker
workflow={workflow}
onCancel={isExecuting?cancelWorkflow:undefined}
className="border-0shadow-nonep-0"
/>
</MobileBottomSheet>
);
}
