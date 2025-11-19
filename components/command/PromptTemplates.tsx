"useclient";

import{useState}from"react";
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
}from"@/components/ui/dropdown-menu";
import{Button}from"@/components/ui/button";
import{ChevronDown,Mail,FileText,Calendar,BarChart,Sparkles}from"lucide-react";
import{QuickActionCategory}from"@/types";

exportinterfacePromptTemplate{
id:string;
title:string;
description:string;
template:string;
category:QuickActionCategory;
}

interfacePromptTemplatesProps{
onSelect:(template:string)=>void;
disabled?:boolean;
}

//Defaultprompttemplatesorganizedbycategory
constDEFAULT_TEMPLATES:PromptTemplate[]=[
//Emailtemplates
{
id:"email-summary",
title:"SummarizeRecentEmails",
description:"Getasummaryofunreademailsfromthelast24hours",
template:"Summarizeallunreademailsfromthelast24hoursandhighlightanyurgentitems",
category:"email",
},
{
id:"email-draft",
title:"DraftProfessionalEmail",
description:"Createaprofessionalemaildraft",
template:"Draftaprofessionalemailto[recipient]about[topic]witha[tone]tone",
category:"email",
},
{
id:"email-follow-up",
title:"Follow-upEmail",
description:"Createafollow-upemailforpendingresponses",
template:"FindemailsIsentinthelastweekthathaven'treceivedaresponseanddraftpolitefollow-ups",
category:"email",
},

//Documenttemplates
{
id:"doc-meeting-notes",
title:"CreateMeetingNotes",
description:"Generatestructuredmeetingnotesdocument",
template:"Createameetingnotesdocumentfor[meetingtopic]withsectionsforattendees,agenda,discussionpoints,andactionitems",
category:"docs",
},
{
id:"doc-report",
title:"GenerateReport",
description:"Createacomprehensivereportfromdata",
template:"Generateareportanalyzing[datasource]withkeyinsights,trends,andrecommendations",
category:"docs",
},
{
id:"doc-organize",
title:"OrganizeDocuments",
description:"OrganizefilesinGoogleDrive",
template:"OrganizedocumentsinmyDrivebycreatingfoldersfor[categories]andmovingrelevantfiles",
category:"docs",
},

//Calendartemplates
{
id:"calendar-schedule",
title:"ScheduleMeeting",
description:"Findtimeandscheduleameeting",
template:"Findavailabletimeslotsthisweekfora[duration]meetingwith[attendees]andsendcalendarinvites",
category:"calendar",
},
{
id:"calendar-summary",
title:"DailyScheduleSummary",
description:"Gettoday'sscheduleoverview",
template:"Summarizemycalendarfortodayincludingmeetingtimes,attendees,andanypreparationneeded",
category:"calendar",
},

//Analysistemplates
{
id:"analysis-data",
title:"AnalyzeSpreadsheetData",
description:"Performdataanalysisonasheet",
template:"Analyzethedatain[spreadsheetname]andcreatevisualizationsshowing[metrics]withinsights",
category:"analysis",
},
{
id:"analysis-trends",
title:"IdentifyTrends",
description:"Findpatternsinyourdata",
template:"Review[datasource]fromthepast[timeperiod]andidentifykeytrends,patterns,andanomalies",
category:"analysis",
},
];

constCATEGORY_ICONS:Record<QuickActionCategory,typeofMail>={
email:Mail,
docs:FileText,
calendar:Calendar,
analysis:BarChart,
};

constCATEGORY_LABELS:Record<QuickActionCategory,string>={
email:"Email",
docs:"Documents",
calendar:"Calendar",
analysis:"Analysis",
};

exportfunctionPromptTemplates({onSelect,disabled=false}:PromptTemplatesProps){
const[open,setOpen]=useState(false);

consthandleSelect=(template:string)=>{
onSelect(template);
setOpen(false);
};

//Grouptemplatesbycategory
consttemplatesByCategory=DEFAULT_TEMPLATES.reduce((acc,template)=>{
if(!acc[template.category]){
acc[template.category]=[];
}
acc[template.category].push(template);
returnacc;
},{}asRecord<QuickActionCategory,PromptTemplate[]>);

constcategories=Object.keys(templatesByCategory)asQuickActionCategory[];

return(
<DropdownMenuopen={open}onOpenChange={setOpen}>
<DropdownMenuTriggerasChild>
<Button
variant="outline"
disabled={disabled}
className="gap-2"
aria-label="Selectprompttemplate"
>
<SparklesclassName="size-4"/>
Templates
<ChevronDownclassName="size-4opacity-50"/>
</Button>
</DropdownMenuTrigger>

<DropdownMenuContentalign="start"className="w-[320px]max-h-[500px]overflow-y-auto">
<DropdownMenuLabelclassName="flexitems-centergap-2">
<SparklesclassName="size-4"/>
PromptTemplates
</DropdownMenuLabel>
<DropdownMenuSeparator/>

{categories.map((category,categoryIndex)=>{
constIcon=CATEGORY_ICONS[category];
consttemplates=templatesByCategory[category];

return(
<divkey={category}>
<DropdownMenuGroup>
<DropdownMenuLabelclassName="flexitems-centergap-2text-xsfont-semiboldtext-muted-foregrounduppercase">
<IconclassName="size-3.5"/>
{CATEGORY_LABELS[category]}
</DropdownMenuLabel>

{templates.map((template)=>(
<DropdownMenuItem
key={template.id}
onClick={()=>handleSelect(template.template)}
className="flexflex-colitems-startgap-1py-2cursor-pointer"
>
<divclassName="font-mediumtext-sm">{template.title}</div>
<divclassName="text-xstext-muted-foregroundline-clamp-2">
{template.description}
</div>
</DropdownMenuItem>
))}
</DropdownMenuGroup>

{categoryIndex<categories.length-1&&<DropdownMenuSeparator/>}
</div>
);
})}
</DropdownMenuContent>
</DropdownMenu>
);
}

export{DEFAULT_TEMPLATES};
