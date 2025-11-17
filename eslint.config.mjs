import***REMOVED***{***REMOVED***defineConfig,***REMOVED***globalIgnores***REMOVED***}***REMOVED***from***REMOVED***"eslint/config";
import***REMOVED***nextVitals***REMOVED***from***REMOVED***"eslint-config-next/core-web-vitals";
import***REMOVED***nextTs***REMOVED***from***REMOVED***"eslint-config-next/typescript";

const***REMOVED***eslintConfig***REMOVED***=***REMOVED***defineConfig([
***REMOVED******REMOVED***...nextVitals,
***REMOVED******REMOVED***...nextTs,
***REMOVED******REMOVED***//***REMOVED***Override***REMOVED***default***REMOVED***ignores***REMOVED***of***REMOVED***eslint-config-next.
***REMOVED******REMOVED***globalIgnores([
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Default***REMOVED***ignores***REMOVED***of***REMOVED***eslint-config-next:
***REMOVED******REMOVED******REMOVED******REMOVED***".next/**",
***REMOVED******REMOVED******REMOVED******REMOVED***"out/**",
***REMOVED******REMOVED******REMOVED******REMOVED***"build/**",
***REMOVED******REMOVED******REMOVED******REMOVED***"next-env.d.ts",
***REMOVED******REMOVED***]),
]);

export***REMOVED***default***REMOVED***eslintConfig;
