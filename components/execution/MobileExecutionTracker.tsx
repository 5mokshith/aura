"use***REMOVED***client";

import***REMOVED***{***REMOVED***useWorkflow***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/WorkflowContext";
import***REMOVED***{***REMOVED***MobileBottomSheet***REMOVED***}***REMOVED***from***REMOVED***"@/components/layout/MobileBottomSheet";
import***REMOVED***{***REMOVED***ExecutionTracker***REMOVED***}***REMOVED***from***REMOVED***"./ExecutionTracker";

export***REMOVED***function***REMOVED***MobileExecutionTracker()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***workflow,***REMOVED***isExecuting,***REMOVED***cancelWorkflow***REMOVED***}***REMOVED***=***REMOVED***useWorkflow();

***REMOVED******REMOVED***//***REMOVED***Only***REMOVED***show***REMOVED***when***REMOVED***there's***REMOVED***an***REMOVED***active***REMOVED***workflow
***REMOVED******REMOVED***const***REMOVED***shouldShow***REMOVED***=***REMOVED***workflow***REMOVED***!==***REMOVED***null;

***REMOVED******REMOVED***if***REMOVED***(!shouldShow)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***null;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<MobileBottomSheet
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isOpen={isExecuting}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***title="Execution***REMOVED***Progress"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="lg:hidden"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ExecutionTracker
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***workflow={workflow}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onCancel={isExecuting***REMOVED***?***REMOVED***cancelWorkflow***REMOVED***:***REMOVED***undefined}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="border-0***REMOVED***shadow-none***REMOVED***p-0"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***</MobileBottomSheet>
***REMOVED******REMOVED***);
}
