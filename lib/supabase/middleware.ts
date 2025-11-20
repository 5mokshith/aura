import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check for custom OAuth session (aura_user_id cookie)
  const hasCustomAuth = request.cookies.has('aura_user_id');
  
  // Protected routes - redirect to auth if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isAuthenticated = user || hasCustomAuth;
  
  if (!isAuthenticated && !isAuthRoute && !isApiAuthRoute) {
    // Redirect to OAuth setup page
    const url = request.nextUrl.clone();
    url.pathname = '/auth/setup';
    return NextResponse.redirect(url);
  }
  
  // If authenticated and trying to access auth setup, redirect to home
  if (isAuthenticated && request.nextUrl.pathname === '/auth/setup') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
