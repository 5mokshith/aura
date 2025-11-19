/**
*ServiceWorkerregistrationutility
*HandlesPWAserviceworkerlifecycle
*/

exportfunctionregisterServiceWorker(){
if(typeofwindow==="undefined"||!("serviceWorker"innavigator)){
console.log("ServiceWorkernotsupported");
return;
}

//Onlyregisterinproduction
if(process.env.NODE_ENV!=="production"){
console.log("ServiceWorkerregistrationskippedindevelopment");
return;
}

window.addEventListener("load",async()=>{
try{
constregistration=awaitnavigator.serviceWorker.register("/sw.js",{
scope:"/",
});

console.log("ServiceWorkerregisteredsuccessfully:",registration.scope);

//Checkforupdatesperiodically
setInterval(()=>{
registration.update();
},60000);//Checkeveryminute

//Handleupdates
registration.addEventListener("updatefound",()=>{
constnewWorker=registration.installing;

if(newWorker){
newWorker.addEventListener("statechange",()=>{
if(
newWorker.state==="installed"&&
navigator.serviceWorker.controller
){
//Newserviceworkeravailable
console.log("Newserviceworkeravailable");

//Optionallynotifyuseraboutupdate
if(
confirm(
"AnewversionofAURAisavailable.Reloadtoupdate?"
)
){
newWorker.postMessage({type:"SKIP_WAITING"});
window.location.reload();
}
}
});
}
});

//Handlecontrollerchange
navigator.serviceWorker.addEventListener("controllerchange",()=>{
console.log("ServiceWorkercontrollerchanged");
});
}catch(error){
console.error("ServiceWorkerregistrationfailed:",error);
}
});
}

/**
*Unregisterserviceworker(fordevelopment/testing)
*/
exportasyncfunctionunregisterServiceWorker(){
if(typeofwindow==="undefined"||!("serviceWorker"innavigator)){
return;
}

try{
constregistrations=awaitnavigator.serviceWorker.getRegistrations();
for(constregistrationofregistrations){
awaitregistration.unregister();
console.log("ServiceWorkerunregistered");
}
}catch(error){
console.error("ServiceWorkerunregistrationfailed:",error);
}
}

/**
*Clearallcaches(fordevelopment/testing)
*/
exportasyncfunctionclearCaches(){
if(typeofwindow==="undefined"||!("caches"inwindow)){
return;
}

try{
constcacheNames=awaitcaches.keys();
awaitPromise.all(cacheNames.map((name)=>caches.delete(name)));
console.log("Allcachescleared");
}catch(error){
console.error("Cacheclearingfailed:",error);
}
}
