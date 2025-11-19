"useclient";

import{SWRConfig}from"swr";
import{swrConfig}from"@/lib/swr-config";

/**
*SWRProvidercomponentforglobalcacheconfiguration
*WrapstheapplicationtoenableSWRcachingforallAPIcalls
*/
exportfunctionSwrProvider({children}:{children:React.ReactNode}){
return<SWRConfigvalue={swrConfig}>{children}</SWRConfig>;
}
