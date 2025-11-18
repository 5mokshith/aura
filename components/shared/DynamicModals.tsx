"use***REMOVED***client";

import***REMOVED***dynamic***REMOVED***from***REMOVED***"next/dynamic";
import***REMOVED***{***REMOVED***LoadingSpinner***REMOVED***}***REMOVED***from***REMOVED***"./LoadingSpinner";

/**
***REMOVED*******REMOVED***Dynamically***REMOVED***imported***REMOVED***modal***REMOVED***components***REMOVED***for***REMOVED***code***REMOVED***splitting
***REMOVED*******REMOVED***These***REMOVED***heavy***REMOVED***components***REMOVED***are***REMOVED***only***REMOVED***loaded***REMOVED***when***REMOVED***needed
***REMOVED****/

//***REMOVED***Loading***REMOVED***fallback***REMOVED***for***REMOVED***modals
const***REMOVED***ModalLoadingFallback***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***(
***REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***justify-center***REMOVED***p-8">
***REMOVED******REMOVED******REMOVED******REMOVED***<LoadingSpinner***REMOVED***size="lg"***REMOVED***/>
***REMOVED******REMOVED***</div>
);

//***REMOVED***Task***REMOVED***Detail***REMOVED***Modal***REMOVED***-***REMOVED***loaded***REMOVED***on***REMOVED***demand
export***REMOVED***const***REMOVED***DynamicTaskDetailModal***REMOVED***=***REMOVED***dynamic(
***REMOVED******REMOVED***()***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED***import("@/components/history/TaskDetailModal").then(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(mod)***REMOVED***=>***REMOVED***mod.TaskDetailModal
***REMOVED******REMOVED******REMOVED******REMOVED***),
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***loading:***REMOVED***ModalLoadingFallback,
***REMOVED******REMOVED******REMOVED******REMOVED***ssr:***REMOVED***false,
***REMOVED******REMOVED***}
);

//***REMOVED***Keyboard***REMOVED***Shortcuts***REMOVED***Modal***REMOVED***-***REMOVED***loaded***REMOVED***on***REMOVED***demand
export***REMOVED***const***REMOVED***DynamicKeyboardShortcutsModal***REMOVED***=***REMOVED***dynamic(
***REMOVED******REMOVED***()***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED***import("@/components/command/KeyboardShortcutsModal").then(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(mod)***REMOVED***=>***REMOVED***mod.KeyboardShortcutsModal
***REMOVED******REMOVED******REMOVED******REMOVED***),
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***loading:***REMOVED***ModalLoadingFallback,
***REMOVED******REMOVED******REMOVED******REMOVED***ssr:***REMOVED***false,
***REMOVED******REMOVED***}
);

//***REMOVED***Quick***REMOVED***Action***REMOVED***Parameter***REMOVED***Modal***REMOVED***-***REMOVED***loaded***REMOVED***on***REMOVED***demand
export***REMOVED***const***REMOVED***DynamicQuickActionParameterModal***REMOVED***=***REMOVED***dynamic(
***REMOVED******REMOVED***()***REMOVED***=>
***REMOVED******REMOVED******REMOVED******REMOVED***import("@/components/layout/QuickActionParameterModal").then(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(mod)***REMOVED***=>***REMOVED***mod.QuickActionParameterModal
***REMOVED******REMOVED******REMOVED******REMOVED***),
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***loading:***REMOVED***ModalLoadingFallback,
***REMOVED******REMOVED******REMOVED******REMOVED***ssr:***REMOVED***false,
***REMOVED******REMOVED***}
);
