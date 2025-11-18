"use***REMOVED***client";

import***REMOVED***{***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***TopNavigation***REMOVED***}***REMOVED***from***REMOVED***"./TopNavigation";
import***REMOVED***{***REMOVED***QuickActionsSidebar***REMOVED***}***REMOVED***from***REMOVED***"./QuickActionsSidebar";
import***REMOVED***{***REMOVED***MobileBottomNav***REMOVED***}***REMOVED***from***REMOVED***"./MobileBottomNav";
import***REMOVED***{***REMOVED***MobileExecutionTracker***REMOVED***}***REMOVED***from***REMOVED***"@/components/execution/MobileExecutionTracker";
import***REMOVED***{***REMOVED***SkipLink***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared/SkipLink";

interface***REMOVED***DashboardLayoutProps***REMOVED***{
***REMOVED******REMOVED***children:***REMOVED***React.ReactNode;
***REMOVED******REMOVED***onQuickActionSelect?:***REMOVED***(template:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

export***REMOVED***function***REMOVED***DashboardLayout({***REMOVED***children,***REMOVED***onQuickActionSelect***REMOVED***}:***REMOVED***DashboardLayoutProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[sidebarCollapsed,***REMOVED***setSidebarCollapsed]***REMOVED***=***REMOVED***useState(false);

***REMOVED******REMOVED***const***REMOVED***handleQuickActionSelect***REMOVED***=***REMOVED***(template:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(onQuickActionSelect)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onQuickActionSelect(template);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***min-h-screen***REMOVED***flex-col">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Skip***REMOVED***link***REMOVED***for***REMOVED***keyboard***REMOVED***navigation***REMOVED***-***REMOVED***Requirement***REMOVED***9.1***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<SkipLink***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<TopNavigation***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Single-column***REMOVED***layout***REMOVED***on***REMOVED***mobile***REMOVED***(<***REMOVED***768px),***REMOVED***multi-column***REMOVED***on***REMOVED***desktop***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***flex-1***REMOVED***overflow-hidden">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Desktop***REMOVED***Sidebar***REMOVED***-***REMOVED***Hidden***REMOVED***on***REMOVED***mobile***REMOVED***-***REMOVED***Using***REMOVED***semantic***REMOVED***aside***REMOVED***element***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<QuickActionsSidebar
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onActionSelect={handleQuickActionSelect}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isCollapsed={sidebarCollapsed}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onToggleCollapse={()***REMOVED***=>***REMOVED***setSidebarCollapsed(!sidebarCollapsed)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Main***REMOVED***Content***REMOVED***-***REMOVED***Full***REMOVED***width***REMOVED***on***REMOVED***mobile,***REMOVED***constrained***REMOVED***on***REMOVED***desktop***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<main***REMOVED***id="main-content"***REMOVED***className="flex-1***REMOVED***overflow-y-auto***REMOVED***w-full"***REMOVED***tabIndex={-1}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="container***REMOVED***mx-auto***REMOVED***px-4***REMOVED***py-4***REMOVED***sm:px-6***REMOVED***sm:py-6***REMOVED***md:px-8***REMOVED***md:py-8***REMOVED***pb-20***REMOVED***lg:pb-8***REMOVED***max-w-full***REMOVED***lg:max-w-7xl">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</main>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Mobile***REMOVED***Bottom***REMOVED***Navigation***REMOVED***-***REMOVED***Only***REMOVED***visible***REMOVED***on***REMOVED***mobile***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<MobileBottomNav***REMOVED***/>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Mobile***REMOVED***Execution***REMOVED***Tracker***REMOVED***Bottom***REMOVED***Sheet***REMOVED***-***REMOVED***Only***REMOVED***visible***REMOVED***on***REMOVED***mobile***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<MobileExecutionTracker***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
