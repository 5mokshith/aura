"useclient";

import{useState}from"react";
import{TopNavigation}from"./TopNavigation";
import{QuickActionsSidebar}from"./QuickActionsSidebar";
import{MobileBottomNav}from"./MobileBottomNav";
import{MobileExecutionTracker}from"@/components/execution/MobileExecutionTracker";
import{SkipLink}from"@/components/shared/SkipLink";

interfaceDashboardLayoutProps{
children:React.ReactNode;
onQuickActionSelect?:(template:string)=>void;
}

exportfunctionDashboardLayout({children,onQuickActionSelect}:DashboardLayoutProps){
const[sidebarCollapsed,setSidebarCollapsed]=useState(false);

consthandleQuickActionSelect=(template:string)=>{
if(onQuickActionSelect){
onQuickActionSelect(template);
}
};

return(
<divclassName="flexmin-h-screenflex-col">
{/*Skiplinkforkeyboardnavigation-Requirement9.1*/}
<SkipLink/>

<TopNavigation/>

{/*Single-columnlayoutonmobile(<768px),multi-columnondesktop*/}
<divclassName="flexflex-1overflow-hidden">
{/*DesktopSidebar-Hiddenonmobile-Usingsemanticasideelement*/}
<QuickActionsSidebar
onActionSelect={handleQuickActionSelect}
isCollapsed={sidebarCollapsed}
onToggleCollapse={()=>setSidebarCollapsed(!sidebarCollapsed)}
/>

{/*MainContent-Fullwidthonmobile,constrainedondesktop*/}
<mainid="main-content"className="flex-1overflow-y-autow-full"tabIndex={-1}>
<divclassName="containermx-autopx-4py-4sm:px-6sm:py-6md:px-8md:py-8pb-20lg:pb-8max-w-fulllg:max-w-7xl">
{children}
</div>
</main>
</div>

{/*MobileBottomNavigation-Onlyvisibleonmobile*/}
<MobileBottomNav/>

{/*MobileExecutionTrackerBottomSheet-Onlyvisibleonmobile*/}
<MobileExecutionTracker/>
</div>
);
}
