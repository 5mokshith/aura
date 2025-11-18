import***REMOVED***{***REMOVED***createBrowserClient***REMOVED***}***REMOVED***from***REMOVED***"@supabase/ssr";

export***REMOVED***function***REMOVED***createClient()***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***createBrowserClient(
***REMOVED******REMOVED******REMOVED******REMOVED***process.env.NEXT_PUBLIC_SUPABASE_URL!,
***REMOVED******REMOVED******REMOVED******REMOVED***process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
***REMOVED******REMOVED***);
}
