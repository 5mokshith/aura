/**
*Performancemonitoringutilities
*TracksCoreWebVitalsandcustommetrics
*/

exportinterfacePerformanceMetric{
name:string;
value:number;
rating:"good"|"needs-improvement"|"poor";
delta?:number;
}

/**
*ReportWebVitalstoconsole(canbeextendedtosendtoanalytics)
*/
exportfunctionreportWebVitals(metric:PerformanceMetric){
//Logtoconsoleindevelopment
if(process.env.NODE_ENV==="development"){
console.log(`[Performance]${metric.name}:`,{
value:metric.value,
rating:metric.rating,
delta:metric.delta,
});
}

//Inproduction,sendtoanalyticsservice
//Example:sendToAnalytics(metric);
}

/**
*GetCoreWebVitalsthresholds
*/
exportconstwebVitalsThresholds={
FCP:{good:1800,poor:3000},//FirstContentfulPaint
LCP:{good:2500,poor:4000},//LargestContentfulPaint
FID:{good:100,poor:300},//FirstInputDelay
CLS:{good:0.1,poor:0.25},//CumulativeLayoutShift
TTFB:{good:800,poor:1800},//TimetoFirstByte
INP:{good:200,poor:500},//InteractiontoNextPaint
};

/**
*Rateametricvalue
*/
exportfunctionrateMetric(
name:string,
value:number
):"good"|"needs-improvement"|"poor"{
constthresholds=webVitalsThresholds[nameaskeyoftypeofwebVitalsThresholds];

if(!thresholds)return"good";

if(value<=thresholds.good)return"good";
if(value<=thresholds.poor)return"needs-improvement";
return"poor";
}

/**
*Measurecustomperformancemetric
*/
exportfunctionmeasurePerformance(name:string,fn:()=>void|Promise<void>){
conststartTime=performance.now();

constresult=fn();

if(resultinstanceofPromise){
returnresult.then(()=>{
constduration=performance.now()-startTime;
console.log(`[Performance]${name}:${duration.toFixed(2)}ms`);
returnduration;
});
}

constduration=performance.now()-startTime;
console.log(`[Performance]${name}:${duration.toFixed(2)}ms`);
returnduration;
}

/**
*Checkifuserprefersreducedmotion
*/
exportfunctionprefersReducedMotion():boolean{
if(typeofwindow==="undefined")returnfalse;

returnwindow.matchMedia("(prefers-reduced-motion:reduce)").matches;
}

/**
*Getconnectioninformation
*/
exportfunctiongetConnectionInfo(){
if(typeofnavigator==="undefined"||!("connection"innavigator)){
returnnull;
}

constconnection=(navigatorasany).connection;

return{
effectiveType:connection.effectiveType,//'4g','3g','2g','slow-2g'
downlink:connection.downlink,//Mbps
rtt:connection.rtt,//Roundtriptimeinms
saveData:connection.saveData,//Datasavermode
};
}

/**
*Adaptiveloadingbasedonconnection
*/
exportfunctionshouldLoadHeavyResources():boolean{
constconnection=getConnectionInfo();

if(!connection)returntrue;

//Don'tloadheavyresourcesonslowconnectionsordatasavermode
if(connection.saveData)returnfalse;
if(connection.effectiveType==="slow-2g"||connection.effectiveType==="2g"){
returnfalse;
}

returntrue;
}

/**
*Monitorlongtasks(>50ms)
*/
exportfunctionmonitorLongTasks(){
if(typeofwindow==="undefined"||!("PerformanceObserver"inwindow)){
return;
}

try{
constobserver=newPerformanceObserver((list)=>{
for(constentryoflist.getEntries()){
console.warn(
`[Performance]Longtaskdetected:${entry.duration.toFixed(2)}ms`,
entry
);
}
});

observer.observe({entryTypes:["longtask"]});
}catch(error){
//LongtaskAPInotsupported
}
}

/**
*Getmemoryusage(ifavailable)
*/
exportfunctiongetMemoryUsage(){
if(
typeofwindow==="undefined"||
!("performance"inwindow)||
!("memory"in(performanceasany))
){
returnnull;
}

constmemory=(performanceasany).memory;

return{
usedJSHeapSize:memory.usedJSHeapSize,
totalJSHeapSize:memory.totalJSHeapSize,
jsHeapSizeLimit:memory.jsHeapSizeLimit,
usagePercent:(memory.usedJSHeapSize/memory.jsHeapSizeLimit)*100,
};
}
