"useclient";

import{useEffect}from"react";
import{useReportWebVitals}from"next/web-vitals";
import{reportWebVitals,rateMetric}from"@/lib/performance";

/**
*ComponenttoreportWebVitalsmetrics
*AutomaticallytracksCoreWebVitalsandreportsthem
*/
exportfunctionWebVitalsReporter(){
useReportWebVitals((metric)=>{
constrating=rateMetric(metric.name,metric.value);

reportWebVitals({
name:metric.name,
value:metric.value,
rating,
delta:metric.delta,
});
});

//Monitorlongtasksindevelopment
useEffect(()=>{
if(process.env.NODE_ENV==="development"){
const{monitorLongTasks}=require("@/lib/performance");
monitorLongTasks();
}
},[]);

returnnull;
}
