import***REMOVED***type***REMOVED***{***REMOVED***NextConfig***REMOVED***}***REMOVED***from***REMOVED***"next";

//***REMOVED***Bundle***REMOVED***analyzer***REMOVED***for***REMOVED***monitoring***REMOVED***bundle***REMOVED***size
const***REMOVED***withBundleAnalyzer***REMOVED***=***REMOVED***require("@next/bundle-analyzer")({
***REMOVED******REMOVED***enabled:***REMOVED***process.env.ANALYZE***REMOVED***===***REMOVED***"true",
});

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
***REMOVED******REMOVED******REMOVED******REMOVED***optimizePackageImports:***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"lucide-react",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"@radix-ui/react-icons",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"@radix-ui/react-dialog",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"@radix-ui/react-dropdown-menu",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"@radix-ui/react-tooltip",
***REMOVED******REMOVED******REMOVED******REMOVED***],
***REMOVED******REMOVED***},

***REMOVED******REMOVED***/****REMOVED***Turbopack***REMOVED***configuration***REMOVED***(Next.js***REMOVED***16+)***REMOVED****/
***REMOVED******REMOVED***turbopack:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Empty***REMOVED***config***REMOVED***to***REMOVED***acknowledge***REMOVED***Turbopack***REMOVED***usage
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Turbopack***REMOVED***handles***REMOVED***optimizations***REMOVED***automatically
***REMOVED******REMOVED***},

***REMOVED******REMOVED***/****REMOVED***Headers***REMOVED***for***REMOVED***caching***REMOVED***and***REMOVED***security***REMOVED****/
***REMOVED******REMOVED***async***REMOVED***headers()***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***source:***REMOVED***"/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key:***REMOVED***"Cache-Control",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value:***REMOVED***"public,***REMOVED***max-age=31536000,***REMOVED***immutable",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***source:***REMOVED***"/_next/static/:path*",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key:***REMOVED***"Cache-Control",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value:***REMOVED***"public,***REMOVED***max-age=31536000,***REMOVED***immutable",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***source:***REMOVED***"/manifest.json",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key:***REMOVED***"Cache-Control",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value:***REMOVED***"public,***REMOVED***max-age=86400",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***];
***REMOVED******REMOVED***},
};

export***REMOVED***default***REMOVED***withBundleAnalyzer(nextConfig);
