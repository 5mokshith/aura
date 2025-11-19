"useclient";

import{useEffect}from"react";
import{registerServiceWorker}from"@/lib/sw-register";

/**
*Componenttoregisterserviceworkeronmount
*Shouldbeincludedintherootlayout
*/
exportfunctionServiceWorkerRegistration(){
useEffect(()=>{
registerServiceWorker();
},[]);

returnnull;
}
