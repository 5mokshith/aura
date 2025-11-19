"useclient";

import{useEffect,useState}from"react";

/**
*Hooktodetectifuserprefersreducedmotion
*Respectssystem-levelaccessibilitysettings
*/
exportfunctionuseReducedMotion():boolean{
const[prefersReducedMotion,setPrefersReducedMotion]=useState(false);

useEffect(()=>{
//Checkifwindowisavailable(client-sideonly)
if(typeofwindow==="undefined"){
return;
}

//Checkinitialpreference
constmediaQuery=window.matchMedia("(prefers-reduced-motion:reduce)");
setPrefersReducedMotion(mediaQuery.matches);

//Listenforchanges
consthandleChange=(event:MediaQueryListEvent)=>{
setPrefersReducedMotion(event.matches);
};

//Modernbrowsers
if(mediaQuery.addEventListener){
mediaQuery.addEventListener("change",handleChange);
return()=>mediaQuery.removeEventListener("change",handleChange);
}
//Fallbackforolderbrowsers
elseif(mediaQuery.addListener){
mediaQuery.addListener(handleChange);
return()=>mediaQuery.removeListener(handleChange);
}
},[]);

returnprefersReducedMotion;
}

/**
*Getanimationdurationbasedonreducedmotionpreference
*@paramnormalDuration-Durationinmsfornormalmotion
*@paramreducedDuration-Durationinmsforreducedmotion(default:0)
*/
exportfunctiongetAnimationDuration(
normalDuration:number,
reducedDuration:number=0
):number{
if(typeofwindow==="undefined"){
returnnormalDuration;
}

constmediaQuery=window.matchMedia("(prefers-reduced-motion:reduce)");
returnmediaQuery.matches?reducedDuration:normalDuration;
}
