import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';
import { encrypt } from '@/app/lib/crypto';

/**
 * GET /api/auth/google/callback
 * Handles OAuth callback from Google
 * Exchanges authorization code for tokens and stores them securely
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/auth/setup?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/setup?error=missing_code', request.url)
      );
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain tokens from Google');
    }

    // Set credentials to get user info
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email || !userInfo.id) {
      throw new Error('Failed to get user information from Google');
    }

    // Calculate expiration timestamp
    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // Default 1 hour

    // Store encrypted tokens in Supabase
    const supabase = createServiceClient();

    // First, check if user exists in auth.users or create session
    // For now, we'll use the Google ID as the user_id
    // In production, you'd integrate with Supabase Auth properly
    const userId = userInfo.id;

    const { error: dbError } = await supabase.from('user_tokens').upsert(
      {
        user_id: userId,
        provider: 'google',
        access_token: encrypt(tokens.access_token),
        refresh_token: encrypt(tokens.refresh_token),
        expires_at: expiresAt.toISOString(),
        scopes: tokens.scope?.split(' ') || [],
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,provider',
      }
    );

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store tokens in database');
    }

    // Create a session cookie or token for the user
    // This is a simplified version - in production, use proper session management
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set a simple session cookie with user info
    response.cookies.set('aura_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    response.cookies.set('aura_user_email', userInfo.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/auth/setup?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
