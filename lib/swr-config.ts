import{SWRConfiguration}from"swr";

/**
*GlobalSWRconfigurationforAPIresponsecaching
*Implementsstale-while-revalidatepatternforoptimalperformance
*/
exportconstswrConfig:SWRConfiguration={
//Revalidateonfocustoensurefreshdatawhenuserreturns
revalidateOnFocus:true,

//Revalidateonreconnectafternetworkissues
revalidateOnReconnect:true,

//Don'trevalidateonmountifdataisfresh
revalidateIfStale:true,

//Deduperequestswithin2seconds
dedupingInterval:2000,

//Retryonerrorwithexponentialbackoff
errorRetryCount:3,
errorRetryInterval:5000,

//Keepdataincachefor5minutes
focusThrottleInterval:5000,

//Defaultfetcherfunction
fetcher:async(url:string)=>{
constres=awaitfetch(url);

if(!res.ok){
consterror:any=newError("Anerroroccurredwhilefetchingthedata.");
error.info=awaitres.json();
error.status=res.status;
throwerror;
}

returnres.json();
},

//Showloadingstateforslowrequests
loadingTimeout:3000,

//Callbackwhenerroroccurs
onError:(error,key)=>{
console.error(`SWRErrorfor${key}:`,error);
},
};

/**
*Cacheconfigurationfordifferentdatatypes
*/
exportconstcacheConfig={
//Historydata-cachefor5minutes
history:{
dedupingInterval:5000,
revalidateOnFocus:true,
revalidateOnMount:false,
},

//Quickactions-cacheindefinitelyuntilmanualrevalidation
quickActions:{
dedupingInterval:60000,
revalidateOnFocus:false,
revalidateOnMount:false,
},

//Authstatus-checkfrequently
authStatus:{
dedupingInterval:1000,
revalidateOnFocus:true,
refreshInterval:30000,//Checkevery30seconds
},

//Profiledata-cachefor10minutes
profile:{
dedupingInterval:10000,
revalidateOnFocus:false,
},
};
