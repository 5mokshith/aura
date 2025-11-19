"useclient";

importReact,{useState}from"react";
import{ResultsPanel}from"@/components/results";
importtype{WorkflowResult}from"@/types";

//Demodata
constdemoResults:WorkflowResult[]=[
{
id:"1",
type:"document",
title:"Q4SalesReport",
preview:"ExecutiveSummary\n\nThisquarterhasshownremarkablegrowthacrossallproductlines.Ourrevenueincreasedby23%comparedtoQ3,withparticularlystrongperformanceintheenterprisesegment.Keyhighlightsinclude:\n\n-Totalrevenue:$4.2M\n-Newcustomers:156\n-Customerretention:94%\n-Averagedealsize:$27,000\n\nThesalesteamexceededtargetsby15%,drivenbysuccessfulproductlaunchesandimprovedmarketpositioning.",
url:"https://docs.google.com/document/d/demo-doc-1",
metadata:{pages:12,lastModified:"2024-01-15"},
},
{
id:"2",
type:"email",
title:"MeetingFollow-upwithClient",
preview:"HiTeam,\n\nThankyoufortheproductivemeetingtoday.Asdiscussed,herearetheactionitems:\n\n1.FinalizetheproposalbyFriday\n2.Scheduletechnicaldemofornextweek\n3.Preparepricingoptions\n\nLookingforwardtomovingthisforward.\n\nBestregards",
url:"https://mail.google.com/mail/u/0/#inbox/demo-email-1",
metadata:{to:"client@example.com",sent:"2024-01-15T10:30:00Z"},
},
{
id:"3",
type:"sheet",
title:"BudgetAnalysis2024",
preview:"Department|Q1Budget|Q1Actual|Variance\nEngineering|$500,000|$485,000|-3%\nMarketing|$300,000|$315,000|+5%\nSales|$400,000|$420,000|+5%",
url:"https://docs.google.com/spreadsheets/d/demo-sheet-1",
metadata:{rows:150,columns:12},
},
{
id:"4",
type:"calendar",
title:"ProductLaunchPlanningMeeting",
preview:"Discusslaunchstrategy,timeline,andresourceallocationforthenewproductreleasescheduledforQ2.",
url:"https://calendar.google.com/calendar/event?eid=demo-event-1",
metadata:{start:"2024-01-20T14:00:00Z",end:"2024-01-20T15:30:00Z"},
},
{
id:"5",
type:"file",
title:"ProductMockups.zip",
url:"https://drive.google.com/file/d/demo-file-1",
metadata:{size:"15.2MB",type:"application/zip"},
},
];

exportdefaultfunctionResultsDemoPage(){
const[results,setResults]=useState<WorkflowResult[]>(demoResults);

consthandleFeedback=(resultId:string,rating:"positive"|"negative")=>{
console.log(`Feedbackfor${resultId}:${rating}`);
};

return(
<divclassName="containermx-autopy-8px-4">
<divclassName="mb-8">
<h1className="text-3xlfont-boldmb-2">ResultsDisplayDemo</h1>
<pclassName="text-muted-foreground">
Previewoftheresultspanelwithdifferentresulttypes
</p>
</div>

<ResultsPanelresults={results}onFeedback={handleFeedback}/>

<divclassName="mt-8p-4borderrounded-lgbg-muted/30">
<h2className="font-semiboldmb-2">EmptyStateDemo</h2>
<ResultsPanelresults={[]}onFeedback={handleFeedback}/>
</div>
</div>
);
}
