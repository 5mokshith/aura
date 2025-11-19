import{createBrowserClient}from"@supabase/ssr";

exportfunctioncreateClient(){
returncreateBrowserClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
}
