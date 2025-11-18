"use***REMOVED***client";

import***REMOVED***{***REMOVED***SWRConfig***REMOVED***}***REMOVED***from***REMOVED***"swr";
import***REMOVED***{***REMOVED***swrConfig***REMOVED***}***REMOVED***from***REMOVED***"@/lib/swr-config";

/**
***REMOVED*******REMOVED***SWR***REMOVED***Provider***REMOVED***component***REMOVED***for***REMOVED***global***REMOVED***cache***REMOVED***configuration
***REMOVED*******REMOVED***Wraps***REMOVED***the***REMOVED***application***REMOVED***to***REMOVED***enable***REMOVED***SWR***REMOVED***caching***REMOVED***for***REMOVED***all***REMOVED***API***REMOVED***calls
***REMOVED****/
export***REMOVED***function***REMOVED***SwrProvider({***REMOVED***children***REMOVED***}:***REMOVED***{***REMOVED***children:***REMOVED***React.ReactNode***REMOVED***})***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***<SWRConfig***REMOVED***value={swrConfig}>{children}</SWRConfig>;
}
