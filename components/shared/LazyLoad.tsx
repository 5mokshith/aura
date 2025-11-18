"use***REMOVED***client";

import***REMOVED***{***REMOVED***useEffect,***REMOVED***useRef,***REMOVED***useState,***REMOVED***ReactNode***REMOVED***}***REMOVED***from***REMOVED***"react";

interface***REMOVED***LazyLoadProps***REMOVED***{
***REMOVED******REMOVED***children:***REMOVED***ReactNode;
***REMOVED******REMOVED***placeholder?:***REMOVED***ReactNode;
***REMOVED******REMOVED***rootMargin?:***REMOVED***string;
***REMOVED******REMOVED***threshold?:***REMOVED***number;
***REMOVED******REMOVED***className?:***REMOVED***string;
}

export***REMOVED***function***REMOVED***LazyLoad({
***REMOVED******REMOVED***children,
***REMOVED******REMOVED***placeholder***REMOVED***=***REMOVED***null,
***REMOVED******REMOVED***rootMargin***REMOVED***=***REMOVED***"100px",
***REMOVED******REMOVED***threshold***REMOVED***=***REMOVED***0.01,
***REMOVED******REMOVED***className,
}:***REMOVED***LazyLoadProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[isVisible,***REMOVED***setIsVisible]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***ref***REMOVED***=***REMOVED***useRef<HTMLDivElement>(null);

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***element***REMOVED***=***REMOVED***ref.current;
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!element)***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***observer***REMOVED***=***REMOVED***new***REMOVED***IntersectionObserver(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***([entry])***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(entry.isIntersecting)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsVisible(true);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***observer.disconnect();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rootMargin,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***threshold,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED***observer.observe(element);

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***observer.disconnect();
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***},***REMOVED***[rootMargin,***REMOVED***threshold]);

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***ref={ref}***REMOVED***className={className}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isVisible***REMOVED***?***REMOVED***children***REMOVED***:***REMOVED***placeholder}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
