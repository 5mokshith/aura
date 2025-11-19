"useclient";

importdynamicfrom"next/dynamic";
import{LoadingSpinner}from"./LoadingSpinner";

/**
*Dynamicallyimportedmodalcomponentsforcodesplitting
*Theseheavycomponentsareonlyloadedwhenneeded
*/

//Loadingfallbackformodals
constModalLoadingFallback=()=>(
<divclassName="flexitems-centerjustify-centerp-8">
<LoadingSpinnersize="lg"/>
</div>
);

//TaskDetailModal-loadedondemand
exportconstDynamicTaskDetailModal=dynamic(
()=>
import("@/components/history/TaskDetailModal").then(
(mod)=>mod.TaskDetailModal
),
{
loading:ModalLoadingFallback,
ssr:false,
}
);

//KeyboardShortcutsModal-loadedondemand
exportconstDynamicKeyboardShortcutsModal=dynamic(
()=>
import("@/components/command/KeyboardShortcutsModal").then(
(mod)=>mod.KeyboardShortcutsModal
),
{
loading:ModalLoadingFallback,
ssr:false,
}
);

//QuickActionParameterModal-loadedondemand
exportconstDynamicQuickActionParameterModal=dynamic(
()=>
import("@/components/layout/QuickActionParameterModal").then(
(mod)=>mod.QuickActionParameterModal
),
{
loading:ModalLoadingFallback,
ssr:false,
}
);
