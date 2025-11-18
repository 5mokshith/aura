"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***ResultsPanel***REMOVED***}***REMOVED***from***REMOVED***"@/components/results";
import***REMOVED***type***REMOVED***{***REMOVED***WorkflowResult***REMOVED***}***REMOVED***from***REMOVED***"@/types";

//***REMOVED***Demo***REMOVED***data
const***REMOVED***demoResults:***REMOVED***WorkflowResult[]***REMOVED***=***REMOVED***[
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***id:***REMOVED***"1",
***REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"document",
***REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***"Q4***REMOVED***Sales***REMOVED***Report",
***REMOVED******REMOVED******REMOVED******REMOVED***preview:***REMOVED***"Executive***REMOVED***Summary\n\nThis***REMOVED***quarter***REMOVED***has***REMOVED***shown***REMOVED***remarkable***REMOVED***growth***REMOVED***across***REMOVED***all***REMOVED***product***REMOVED***lines.***REMOVED***Our***REMOVED***revenue***REMOVED***increased***REMOVED***by***REMOVED***23%***REMOVED***compared***REMOVED***to***REMOVED***Q3,***REMOVED***with***REMOVED***particularly***REMOVED***strong***REMOVED***performance***REMOVED***in***REMOVED***the***REMOVED***enterprise***REMOVED***segment.***REMOVED***Key***REMOVED***highlights***REMOVED***include:\n\n-***REMOVED***Total***REMOVED***revenue:***REMOVED***$4.2M\n-***REMOVED***New***REMOVED***customers:***REMOVED***156\n-***REMOVED***Customer***REMOVED***retention:***REMOVED***94%\n-***REMOVED***Average***REMOVED***deal***REMOVED***size:***REMOVED***$27,000\n\nThe***REMOVED***sales***REMOVED***team***REMOVED***exceeded***REMOVED***targets***REMOVED***by***REMOVED***15%,***REMOVED***driven***REMOVED***by***REMOVED***successful***REMOVED***product***REMOVED***launches***REMOVED***and***REMOVED***improved***REMOVED***market***REMOVED***positioning.",
***REMOVED******REMOVED******REMOVED******REMOVED***url:***REMOVED***"https://docs.google.com/document/d/demo-doc-1",
***REMOVED******REMOVED******REMOVED******REMOVED***metadata:***REMOVED***{***REMOVED***pages:***REMOVED***12,***REMOVED***lastModified:***REMOVED***"2024-01-15"***REMOVED***},
***REMOVED******REMOVED***},
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***id:***REMOVED***"2",
***REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"email",
***REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***"Meeting***REMOVED***Follow-up***REMOVED***with***REMOVED***Client",
***REMOVED******REMOVED******REMOVED******REMOVED***preview:***REMOVED***"Hi***REMOVED***Team,\n\nThank***REMOVED***you***REMOVED***for***REMOVED***the***REMOVED***productive***REMOVED***meeting***REMOVED***today.***REMOVED***As***REMOVED***discussed,***REMOVED***here***REMOVED***are***REMOVED***the***REMOVED***action***REMOVED***items:\n\n1.***REMOVED***Finalize***REMOVED***the***REMOVED***proposal***REMOVED***by***REMOVED***Friday\n2.***REMOVED***Schedule***REMOVED***technical***REMOVED***demo***REMOVED***for***REMOVED***next***REMOVED***week\n3.***REMOVED***Prepare***REMOVED***pricing***REMOVED***options\n\nLooking***REMOVED***forward***REMOVED***to***REMOVED***moving***REMOVED***this***REMOVED***forward.\n\nBest***REMOVED***regards",
***REMOVED******REMOVED******REMOVED******REMOVED***url:***REMOVED***"https://mail.google.com/mail/u/0/#inbox/demo-email-1",
***REMOVED******REMOVED******REMOVED******REMOVED***metadata:***REMOVED***{***REMOVED***to:***REMOVED***"client@example.com",***REMOVED***sent:***REMOVED***"2024-01-15T10:30:00Z"***REMOVED***},
***REMOVED******REMOVED***},
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***id:***REMOVED***"3",
***REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"sheet",
***REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***"Budget***REMOVED***Analysis***REMOVED***2024",
***REMOVED******REMOVED******REMOVED******REMOVED***preview:***REMOVED***"Department***REMOVED***|***REMOVED***Q1***REMOVED***Budget***REMOVED***|***REMOVED***Q1***REMOVED***Actual***REMOVED***|***REMOVED***Variance\nEngineering***REMOVED***|***REMOVED***$500,000***REMOVED***|***REMOVED***$485,000***REMOVED***|***REMOVED***-3%\nMarketing***REMOVED***|***REMOVED***$300,000***REMOVED***|***REMOVED***$315,000***REMOVED***|***REMOVED***+5%\nSales***REMOVED***|***REMOVED***$400,000***REMOVED***|***REMOVED***$420,000***REMOVED***|***REMOVED***+5%",
***REMOVED******REMOVED******REMOVED******REMOVED***url:***REMOVED***"https://docs.google.com/spreadsheets/d/demo-sheet-1",
***REMOVED******REMOVED******REMOVED******REMOVED***metadata:***REMOVED***{***REMOVED***rows:***REMOVED***150,***REMOVED***columns:***REMOVED***12***REMOVED***},
***REMOVED******REMOVED***},
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***id:***REMOVED***"4",
***REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"calendar",
***REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***"Product***REMOVED***Launch***REMOVED***Planning***REMOVED***Meeting",
***REMOVED******REMOVED******REMOVED******REMOVED***preview:***REMOVED***"Discuss***REMOVED***launch***REMOVED***strategy,***REMOVED***timeline,***REMOVED***and***REMOVED***resource***REMOVED***allocation***REMOVED***for***REMOVED***the***REMOVED***new***REMOVED***product***REMOVED***release***REMOVED***scheduled***REMOVED***for***REMOVED***Q2.",
***REMOVED******REMOVED******REMOVED******REMOVED***url:***REMOVED***"https://calendar.google.com/calendar/event?eid=demo-event-1",
***REMOVED******REMOVED******REMOVED******REMOVED***metadata:***REMOVED***{***REMOVED***start:***REMOVED***"2024-01-20T14:00:00Z",***REMOVED***end:***REMOVED***"2024-01-20T15:30:00Z"***REMOVED***},
***REMOVED******REMOVED***},
***REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***id:***REMOVED***"5",
***REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"file",
***REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***"Product***REMOVED***Mockups.zip",
***REMOVED******REMOVED******REMOVED******REMOVED***url:***REMOVED***"https://drive.google.com/file/d/demo-file-1",
***REMOVED******REMOVED******REMOVED******REMOVED***metadata:***REMOVED***{***REMOVED***size:***REMOVED***"15.2***REMOVED***MB",***REMOVED***type:***REMOVED***"application/zip"***REMOVED***},
***REMOVED******REMOVED***},
];

export***REMOVED***default***REMOVED***function***REMOVED***ResultsDemoPage()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[results,***REMOVED***setResults]***REMOVED***=***REMOVED***useState<WorkflowResult[]>(demoResults);

***REMOVED******REMOVED***const***REMOVED***handleFeedback***REMOVED***=***REMOVED***(resultId:***REMOVED***string,***REMOVED***rating:***REMOVED***"positive"***REMOVED***|***REMOVED***"negative")***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`Feedback***REMOVED***for***REMOVED***${resultId}:***REMOVED***${rating}`);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="container***REMOVED***mx-auto***REMOVED***py-8***REMOVED***px-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mb-8">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h1***REMOVED***className="text-3xl***REMOVED***font-bold***REMOVED***mb-2">Results***REMOVED***Display***REMOVED***Demo</h1>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Preview***REMOVED***of***REMOVED***the***REMOVED***results***REMOVED***panel***REMOVED***with***REMOVED***different***REMOVED***result***REMOVED***types
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ResultsPanel***REMOVED***results={results}***REMOVED***onFeedback={handleFeedback}***REMOVED***/>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mt-8***REMOVED***p-4***REMOVED***border***REMOVED***rounded-lg***REMOVED***bg-muted/30">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h2***REMOVED***className="font-semibold***REMOVED***mb-2">Empty***REMOVED***State***REMOVED***Demo</h2>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ResultsPanel***REMOVED***results={[]}***REMOVED***onFeedback={handleFeedback}***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
