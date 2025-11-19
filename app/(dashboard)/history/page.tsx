"useclient";

importReact,{useState}from"react";
import{useSupabaseAuth}from"@/contexts/SupabaseAuthContext";
import{useRouter}from"next/navigation";
import{useEffect}from"react";
importdynamicfrom"next/dynamic";
import{DashboardLayout}from"@/components/layout/DashboardLayout";
import{HistoryProvider,useHistory}from"@/contexts/HistoryContext";
import{HistoryList}from"@/components/history/HistoryList";
import{HistoryFilters}from"@/components/history/HistoryFilters";
import{PullToRefresh}from"@/components/shared/PullToRefresh";
import{HistoryasHistoryIcon}from"lucide-react";

//Lazyloadthemodalforbetterperformance
constTaskDetailModal=dynamic(
()=>import("@/components/history/TaskDetailModal").then((mod)=>({default:mod.TaskDetailModal})),
{ssr:false}
);

functionHistoryPageContent(){
const[selectedTaskId,setSelectedTaskId]=useState<string|null>(null);
const[isModalOpen,setIsModalOpen]=useState(false);
const{refresh}=useHistory();

consthandleItemSelect=(taskId:string)=>{
setSelectedTaskId(taskId);
setIsModalOpen(true);
};

consthandleModalClose=(open:boolean)=>{
setIsModalOpen(open);
if(!open){
setSelectedTaskId(null);
}
};

consthandleRefresh=async()=>{
awaitrefresh();
};

return(
<DashboardLayout>
<divclassName="space-y-4sm:space-y-6">
{/*Header-Responsivesizing*/}
<divclassName="flexitems-centergap-2sm:gap-3">
<HistoryIconclassName="h-6w-6sm:h-8sm:w-8text-primaryshrink-0"/>
<divclassName="min-w-0">
<h1className="text-2xlsm:text-3xlfont-boldtracking-tight">History</h1>
<pclassName="text-muted-foregroundmt-0.5sm:mt-1text-smsm:text-base">
Viewandmanageyourpastworkflowexecutions
</p>
</div>
</div>

{/*Filters-Responsivelayout*/}
<HistoryFilters/>

{/*HistoryListwithPull-to-Refresh-Responsivepadding*/}
<divclassName="rounded-lgborderbg-cardp-4sm:p-6">
<PullToRefreshonRefresh={handleRefresh}className="lg:pointer-events-none">
<HistoryListonItemSelect={handleItemSelect}/>
</PullToRefresh>
</div>

{/*TaskDetailModal*/}
<TaskDetailModal
taskId={selectedTaskId}
open={isModalOpen}
onOpenChange={handleModalClose}
/>
</div>
</DashboardLayout>
);
}

exportdefaultfunctionHistoryPage(){
const{user,isLoading}=useSupabaseAuth();
constrouter=useRouter();

useEffect(()=>{
//Redirecttologinifnotauthenticated
if(!isLoading&&!user){
router.push("/login");
}
},[user,isLoading,router]);

if(isLoading){
return(
<divclassName="flexmin-h-screenitems-centerjustify-center">
<divclassName="text-center">
<divclassName="mb-4h-8w-8animate-spinrounded-fullborder-4border-gray-300border-t-blue-600mx-auto"></div>
<pclassName="text-gray-600">Loading...</p>
</div>
</div>
);
}

if(!user){
returnnull;//Willredirecttologin
}

return(
<HistoryProvider>
<HistoryPageContent/>
</HistoryProvider>
);
}
