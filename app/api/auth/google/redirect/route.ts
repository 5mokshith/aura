import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { rateLimit, RateLimitPresets } from '@/app/lib/rate-limit';

/**
 * POST /api/auth/google/redirect
 * Initiates Google OAuth flow by generating authorization URL
 * Rate limited to prevent abuse
 */
export async function POST(request: Request) {
  // Apply rate limiting (5 requests per minute for auth endpoints)
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.AUTH);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const { generateCsrfToken, generateOAuthState } = await import('@/app/lib/csrf');
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
    );

    // All required scopes for Google Workspace integration
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    // Generate CSRF token for OAuth flow
    const csrfToken = generateCsrfToken();
    
    // Parse request body for optional redirect URL
    let redirectUrl: string | undefined;
    try {
      const body = await request.json();
      redirectUrl = body.redirectUrl;
    } catch {
      // No body or invalid JSON, use default redirect
    }
    
    // Generate state parameter with CSRF token
    const state = generateOAuthState(csrfToken, redirectUrl);

    // Generate authorization URL with state parameter
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Required for refresh token
      scope: scopes,
      prompt: 'consent', // Force consent screen to get refresh token
      include_granted_scopes: true,
      state, // CSRF protection
    });

    // Return auth URL and CSRF token (client should store this)
    const response = NextResponse.json({
      success: true,
      redirectUrl: authUrl,
      csrfToken, // Client should store this in sessionStorage
    });

    // Also set CSRF token in a cookie for additional security
    response.cookies.set('oauth_csrf_token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'OAUTH_INIT_ERROR',
          message: 'Failed to initialize OAuth flow',
        },
      },
      { status: 500 }
    );
  }
}
