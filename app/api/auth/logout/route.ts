import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Clears user session and OAuth tokens
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear session cookies
    response.cookies.delete('aura_user_id');
    response.cookies.delete('aura_user_email');
    response.cookies.delete('oauth_csrf_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: 'Failed to logout',
        },
      },
      { status: 500 }
    );
  }
}
