"use***REMOVED***client";

import***REMOVED***{***REMOVED***useEffect***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***registerServiceWorker***REMOVED***}***REMOVED***from***REMOVED***"@/lib/sw-register";

/**
***REMOVED*******REMOVED***Component***REMOVED***to***REMOVED***register***REMOVED***service***REMOVED***worker***REMOVED***on***REMOVED***mount
***REMOVED*******REMOVED***Should***REMOVED***be***REMOVED***included***REMOVED***in***REMOVED***the***REMOVED***root***REMOVED***layout
***REMOVED****/
export***REMOVED***function***REMOVED***ServiceWorkerRegistration()***REMOVED***{
***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***registerServiceWorker();
***REMOVED******REMOVED***},***REMOVED***[]);
***REMOVED******REMOVED***
***REMOVED******REMOVED***return***REMOVED***null;
}
