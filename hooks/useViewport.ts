"useclient";

import{useEffect,useState}from"react";

interfaceViewportSize{
width:number;
height:number;
isMobile:boolean;
isTablet:boolean;
isDesktop:boolean;
}

/**
*Hooktotrackviewportsizeanddevicetype
*Usefulforconditionalrenderingbasedonscreensize
*/
exportfunctionuseViewport():ViewportSize{
const[viewport,setViewport]=useState<ViewportSize>({
width:typeofwindow!=="undefined"?window.innerWidth:1024,
height:typeofwindow!=="undefined"?window.innerHeight:768,
isMobile:typeofwindow!=="undefined"?window.innerWidth<768:false,
isTablet:typeofwindow!=="undefined"?window.innerWidth>=768&&window.innerWidth<1024:false,
isDesktop:typeofwindow!=="undefined"?window.innerWidth>=1024:true,
});

useEffect(()=>{
if(typeofwindow==="undefined")return;

consthandleResize=()=>{
constwidth=window.innerWidth;
constheight=window.innerHeight;

setViewport({
width,
height,
isMobile:width<768,
isTablet:width>=768&&width<1024,
isDesktop:width>=1024,
});
};

//Debounceresizeeventsforbetterperformance
lettimeoutId:NodeJS.Timeout;
constdebouncedResize=()=>{
clearTimeout(timeoutId);
timeoutId=setTimeout(handleResize,150);
};

window.addEventListener("resize",debouncedResize);

//Initialcall
handleResize();

return()=>{
window.removeEventListener("resize",debouncedResize);
clearTimeout(timeoutId);
};
},[]);

returnviewport;
}
