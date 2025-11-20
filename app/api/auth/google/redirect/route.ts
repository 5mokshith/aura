import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * POST /api/auth/google/redirect
 * Initiates Google OAuth flow by generating authorization URL
 */
export async function POST() {
  try {
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

    // Generate authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Required for refresh token
      scope: scopes,
      prompt: 'consent', // Force consent screen to get refresh token
      include_granted_scopes: true,
    });

    return NextResponse.json({
      success: true,
      redirectUrl: authUrl,
    });
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
