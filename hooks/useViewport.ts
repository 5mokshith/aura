"use***REMOVED***client";

import***REMOVED***{***REMOVED***useEffect,***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";

interface***REMOVED***ViewportSize***REMOVED***{
***REMOVED******REMOVED***width:***REMOVED***number;
***REMOVED******REMOVED***height:***REMOVED***number;
***REMOVED******REMOVED***isMobile:***REMOVED***boolean;
***REMOVED******REMOVED***isTablet:***REMOVED***boolean;
***REMOVED******REMOVED***isDesktop:***REMOVED***boolean;
}

/**
***REMOVED*******REMOVED***Hook***REMOVED***to***REMOVED***track***REMOVED***viewport***REMOVED***size***REMOVED***and***REMOVED***device***REMOVED***type
***REMOVED*******REMOVED***Useful***REMOVED***for***REMOVED***conditional***REMOVED***rendering***REMOVED***based***REMOVED***on***REMOVED***screen***REMOVED***size
***REMOVED****/
export***REMOVED***function***REMOVED***useViewport():***REMOVED***ViewportSize***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[viewport,***REMOVED***setViewport]***REMOVED***=***REMOVED***useState<ViewportSize>({
***REMOVED******REMOVED******REMOVED******REMOVED***width:***REMOVED***typeof***REMOVED***window***REMOVED***!==***REMOVED***"undefined"***REMOVED***?***REMOVED***window.innerWidth***REMOVED***:***REMOVED***1024,
***REMOVED******REMOVED******REMOVED******REMOVED***height:***REMOVED***typeof***REMOVED***window***REMOVED***!==***REMOVED***"undefined"***REMOVED***?***REMOVED***window.innerHeight***REMOVED***:***REMOVED***768,
***REMOVED******REMOVED******REMOVED******REMOVED***isMobile:***REMOVED***typeof***REMOVED***window***REMOVED***!==***REMOVED***"undefined"***REMOVED***?***REMOVED***window.innerWidth***REMOVED***<***REMOVED***768***REMOVED***:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED***isTablet:***REMOVED***typeof***REMOVED***window***REMOVED***!==***REMOVED***"undefined"***REMOVED***?***REMOVED***window.innerWidth***REMOVED***>=***REMOVED***768***REMOVED***&&***REMOVED***window.innerWidth***REMOVED***<***REMOVED***1024***REMOVED***:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED***isDesktop:***REMOVED***typeof***REMOVED***window***REMOVED***!==***REMOVED***"undefined"***REMOVED***?***REMOVED***window.innerWidth***REMOVED***>=***REMOVED***1024***REMOVED***:***REMOVED***true,
***REMOVED******REMOVED***});

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(typeof***REMOVED***window***REMOVED***===***REMOVED***"undefined")***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***handleResize***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***width***REMOVED***=***REMOVED***window.innerWidth;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***height***REMOVED***=***REMOVED***window.innerHeight;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setViewport({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***width,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***height,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isMobile:***REMOVED***width***REMOVED***<***REMOVED***768,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isTablet:***REMOVED***width***REMOVED***>=***REMOVED***768***REMOVED***&&***REMOVED***width***REMOVED***<***REMOVED***1024,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isDesktop:***REMOVED***width***REMOVED***>=***REMOVED***1024,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Debounce***REMOVED***resize***REMOVED***events***REMOVED***for***REMOVED***better***REMOVED***performance
***REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***timeoutId:***REMOVED***NodeJS.Timeout;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***debouncedResize***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***clearTimeout(timeoutId);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timeoutId***REMOVED***=***REMOVED***setTimeout(handleResize,***REMOVED***150);
***REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED***window.addEventListener("resize",***REMOVED***debouncedResize);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Initial***REMOVED***call
***REMOVED******REMOVED******REMOVED******REMOVED***handleResize();

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***window.removeEventListener("resize",***REMOVED***debouncedResize);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***clearTimeout(timeoutId);
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***return***REMOVED***viewport;
}
