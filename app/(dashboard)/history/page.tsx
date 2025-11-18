"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
import***REMOVED***{***REMOVED***useRouter***REMOVED***}***REMOVED***from***REMOVED***"next/navigation";
import***REMOVED***{***REMOVED***useEffect***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***dynamic***REMOVED***from***REMOVED***"next/dynamic";
import***REMOVED***{***REMOVED***DashboardLayout***REMOVED***}***REMOVED***from***REMOVED***"@/components/layout/DashboardLayout";
import***REMOVED***{***REMOVED***HistoryProvider,***REMOVED***useHistory***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/HistoryContext";
import***REMOVED***{***REMOVED***HistoryList***REMOVED***}***REMOVED***from***REMOVED***"@/components/history/HistoryList";
import***REMOVED***{***REMOVED***HistoryFilters***REMOVED***}***REMOVED***from***REMOVED***"@/components/history/HistoryFilters";
import***REMOVED***{***REMOVED***PullToRefresh***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared/PullToRefresh";
import***REMOVED***{***REMOVED***History***REMOVED***as***REMOVED***HistoryIcon***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";

//***REMOVED***Lazy***REMOVED***load***REMOVED***the***REMOVED***modal***REMOVED***for***REMOVED***better***REMOVED***performance
const***REMOVED***TaskDetailModal***REMOVED***=***REMOVED***dynamic(
***REMOVED******REMOVED***()***REMOVED***=>***REMOVED***import("@/components/history/TaskDetailModal").then((mod)***REMOVED***=>***REMOVED***({***REMOVED***default:***REMOVED***mod.TaskDetailModal***REMOVED***})),
***REMOVED******REMOVED***{***REMOVED***ssr:***REMOVED***false***REMOVED***}
);

function***REMOVED***HistoryPageContent()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[selectedTaskId,***REMOVED***setSelectedTaskId]***REMOVED***=***REMOVED***useState<string***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[isModalOpen,***REMOVED***setIsModalOpen]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***refresh***REMOVED***}***REMOVED***=***REMOVED***useHistory();

***REMOVED******REMOVED***const***REMOVED***handleItemSelect***REMOVED***=***REMOVED***(taskId:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setSelectedTaskId(taskId);
***REMOVED******REMOVED******REMOVED******REMOVED***setIsModalOpen(true);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleModalClose***REMOVED***=***REMOVED***(open:***REMOVED***boolean)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setIsModalOpen(open);
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!open)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSelectedTaskId(null);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleRefresh***REMOVED***=***REMOVED***async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***refresh();
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<DashboardLayout>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="space-y-4***REMOVED***sm:space-y-6">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Header***REMOVED***-***REMOVED***Responsive***REMOVED***sizing***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***gap-2***REMOVED***sm:gap-3">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<HistoryIcon***REMOVED***className="h-6***REMOVED***w-6***REMOVED***sm:h-8***REMOVED***sm:w-8***REMOVED***text-primary***REMOVED***shrink-0"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="min-w-0">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h1***REMOVED***className="text-2xl***REMOVED***sm:text-3xl***REMOVED***font-bold***REMOVED***tracking-tight">History</h1>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-muted-foreground***REMOVED***mt-0.5***REMOVED***sm:mt-1***REMOVED***text-sm***REMOVED***sm:text-base">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***View***REMOVED***and***REMOVED***manage***REMOVED***your***REMOVED***past***REMOVED***workflow***REMOVED***executions
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Filters***REMOVED***-***REMOVED***Responsive***REMOVED***layout***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<HistoryFilters***REMOVED***/>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***History***REMOVED***List***REMOVED***with***REMOVED***Pull-to-Refresh***REMOVED***-***REMOVED***Responsive***REMOVED***padding***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="rounded-lg***REMOVED***border***REMOVED***bg-card***REMOVED***p-4***REMOVED***sm:p-6">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<PullToRefresh***REMOVED***onRefresh={handleRefresh}***REMOVED***className="lg:pointer-events-none">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<HistoryList***REMOVED***onItemSelect={handleItemSelect}***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</PullToRefresh>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Task***REMOVED***Detail***REMOVED***Modal***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<TaskDetailModal
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***taskId={selectedTaskId}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***open={isModalOpen}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onOpenChange={handleModalClose}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</DashboardLayout>
***REMOVED******REMOVED***);
}

export***REMOVED***default***REMOVED***function***REMOVED***HistoryPage()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***session,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useAuth();
***REMOVED******REMOVED***const***REMOVED***router***REMOVED***=***REMOVED***useRouter();

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Redirect***REMOVED***to***REMOVED***login***REMOVED***if***REMOVED***not***REMOVED***authenticated
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!isLoading***REMOVED***&&***REMOVED***!session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***router.push("/login");
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[session,***REMOVED***isLoading,***REMOVED***router]);

***REMOVED******REMOVED***if***REMOVED***(isLoading)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***min-h-screen***REMOVED***items-center***REMOVED***justify-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="text-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mb-4***REMOVED***h-8***REMOVED***w-8***REMOVED***animate-spin***REMOVED***rounded-full***REMOVED***border-4***REMOVED***border-gray-300***REMOVED***border-t-blue-600***REMOVED***mx-auto"></div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-gray-600">Loading...</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}

***REMOVED******REMOVED***if***REMOVED***(!session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***null;***REMOVED***//***REMOVED***Will***REMOVED***redirect***REMOVED***to***REMOVED***login
***REMOVED******REMOVED***}

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<HistoryProvider>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<HistoryPageContent***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***</HistoryProvider>
***REMOVED******REMOVED***);
}
