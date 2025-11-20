import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createServiceClient } from '@/app/lib/supabase/server';
import { decrypt } from '@/app/lib/crypto';

/**
 * POST /api/auth/logout
 * Clears user session and optionally revokes Google OAuth tokens
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('aura_user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'No active session found',
          },
        },
        { status: 401 }
      );
    }

    const { revokeTokens = false } = await request.json().catch(() => ({}));

    // If requested, revoke tokens with Google
    if (revokeTokens) {
      try {
        const supabase = createServiceClient();
        
        // Get user tokens
        const { data: tokenData, error: fetchError } = await supabase
          .from('user_tokens')
          .select('access_token')
          .eq('user_id', userId)
          .eq('provider', 'google')
          .single();

        if (!fetchError && tokenData) {
          const accessToken = decrypt(tokenData.access_token);
          
          // Revoke the token with Google
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
          );
          
          await oauth2Client.revokeToken(accessToken);
        }
      } catch (revokeError) {
        // Log but don't fail the logout if revocation fails
        console.error('Error revoking tokens:', revokeError);
      }
    }

    // Delete tokens from database
    const supabase = createServiceClient();
    await supabase
      .from('user_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('provider', 'google');

    // Clear session cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.delete('aura_user_id');
    response.cookies.delete('aura_user_email');

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    
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
