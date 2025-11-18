"use***REMOVED***client";

import***REMOVED***{***REMOVED***useEffect***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***useRouter***REMOVED***}***REMOVED***from***REMOVED***"next/navigation";

export***REMOVED***default***REMOVED***function***REMOVED***Home()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***router***REMOVED***=***REMOVED***useRouter();

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***router.replace("/dashboard");
***REMOVED******REMOVED***},***REMOVED***[router]);

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***min-h-screen***REMOVED***items-center***REMOVED***justify-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="text-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mb-4***REMOVED***h-8***REMOVED***w-8***REMOVED***animate-spin***REMOVED***rounded-full***REMOVED***border-4***REMOVED***border-gray-300***REMOVED***border-t-blue-600***REMOVED***mx-auto"></div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-gray-600">Redirecting...</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
