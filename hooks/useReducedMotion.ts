"use***REMOVED***client";

import***REMOVED***{***REMOVED***useEffect,***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";

/**
***REMOVED*******REMOVED***Hook***REMOVED***to***REMOVED***detect***REMOVED***if***REMOVED***user***REMOVED***prefers***REMOVED***reduced***REMOVED***motion
***REMOVED*******REMOVED***Respects***REMOVED***system-level***REMOVED***accessibility***REMOVED***settings
***REMOVED****/
export***REMOVED***function***REMOVED***useReducedMotion():***REMOVED***boolean***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[prefersReducedMotion,***REMOVED***setPrefersReducedMotion]***REMOVED***=***REMOVED***useState(false);

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Check***REMOVED***if***REMOVED***window***REMOVED***is***REMOVED***available***REMOVED***(client-side***REMOVED***only)
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(typeof***REMOVED***window***REMOVED***===***REMOVED***"undefined")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Check***REMOVED***initial***REMOVED***preference
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***mediaQuery***REMOVED***=***REMOVED***window.matchMedia("(prefers-reduced-motion:***REMOVED***reduce)");
***REMOVED******REMOVED******REMOVED******REMOVED***setPrefersReducedMotion(mediaQuery.matches);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Listen***REMOVED***for***REMOVED***changes
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***handleChange***REMOVED***=***REMOVED***(event:***REMOVED***MediaQueryListEvent)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setPrefersReducedMotion(event.matches);
***REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Modern***REMOVED***browsers
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(mediaQuery.addEventListener)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***mediaQuery.addEventListener("change",***REMOVED***handleChange);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***mediaQuery.removeEventListener("change",***REMOVED***handleChange);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Fallback***REMOVED***for***REMOVED***older***REMOVED***browsers
***REMOVED******REMOVED******REMOVED******REMOVED***else***REMOVED***if***REMOVED***(mediaQuery.addListener)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***mediaQuery.addListener(handleChange);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***mediaQuery.removeListener(handleChange);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***return***REMOVED***prefersReducedMotion;
}

/**
***REMOVED*******REMOVED***Get***REMOVED***animation***REMOVED***duration***REMOVED***based***REMOVED***on***REMOVED***reduced***REMOVED***motion***REMOVED***preference
***REMOVED*******REMOVED***@param***REMOVED***normalDuration***REMOVED***-***REMOVED***Duration***REMOVED***in***REMOVED***ms***REMOVED***for***REMOVED***normal***REMOVED***motion
***REMOVED*******REMOVED***@param***REMOVED***reducedDuration***REMOVED***-***REMOVED***Duration***REMOVED***in***REMOVED***ms***REMOVED***for***REMOVED***reduced***REMOVED***motion***REMOVED***(default:***REMOVED***0)
***REMOVED****/
export***REMOVED***function***REMOVED***getAnimationDuration(
***REMOVED******REMOVED***normalDuration:***REMOVED***number,
***REMOVED******REMOVED***reducedDuration:***REMOVED***number***REMOVED***=***REMOVED***0
):***REMOVED***number***REMOVED***{
***REMOVED******REMOVED***if***REMOVED***(typeof***REMOVED***window***REMOVED***===***REMOVED***"undefined")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***normalDuration;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***const***REMOVED***mediaQuery***REMOVED***=***REMOVED***window.matchMedia("(prefers-reduced-motion:***REMOVED***reduce)");
***REMOVED******REMOVED***return***REMOVED***mediaQuery.matches***REMOVED***?***REMOVED***reducedDuration***REMOVED***:***REMOVED***normalDuration;
}
