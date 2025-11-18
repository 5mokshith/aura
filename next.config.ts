import***REMOVED***type***REMOVED***{***REMOVED***NextConfig***REMOVED***}***REMOVED***from***REMOVED***"next";

const***REMOVED***nextConfig:***REMOVED***NextConfig***REMOVED***=***REMOVED***{
***REMOVED******REMOVED***/****REMOVED***Image***REMOVED***optimization***REMOVED***for***REMOVED***mobile***REMOVED****/
***REMOVED******REMOVED***images:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***formats:***REMOVED***["image/webp",***REMOVED***"image/avif"],
***REMOVED******REMOVED******REMOVED******REMOVED***deviceSizes:***REMOVED***[320,***REMOVED***640,***REMOVED***750,***REMOVED***828,***REMOVED***1080,***REMOVED***1200,***REMOVED***1920,***REMOVED***2048,***REMOVED***3840],
***REMOVED******REMOVED******REMOVED******REMOVED***imageSizes:***REMOVED***[16,***REMOVED***32,***REMOVED***48,***REMOVED***64,***REMOVED***96,***REMOVED***128,***REMOVED***256,***REMOVED***384],
***REMOVED******REMOVED******REMOVED******REMOVED***minimumCacheTTL:***REMOVED***60,
***REMOVED******REMOVED***},

***REMOVED******REMOVED***/****REMOVED***Performance***REMOVED***optimizations***REMOVED****/
***REMOVED******REMOVED***compress:***REMOVED***true,
***REMOVED******REMOVED***poweredByHeader:***REMOVED***false,

***REMOVED******REMOVED***/****REMOVED***Experimental***REMOVED***features***REMOVED***for***REMOVED***better***REMOVED***performance***REMOVED****/
***REMOVED******REMOVED***experimental:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***optimizePackageImports:***REMOVED***["lucide-react",***REMOVED***"@radix-ui/react-icons"],
***REMOVED******REMOVED***},
};

export***REMOVED***default***REMOVED***nextConfig;
