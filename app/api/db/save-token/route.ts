import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';
import { encrypt } from '@/app/lib/crypto';

/**
 * POST /api/db/save-token
 * 
 * Save encrypted OAuth tokens to Supabase user_tokens table
 * 
 * Requirements: 14.1, 14.4
 */

interface SaveTokenRequest {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  scopes: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveTokenRequest = await request.json();
    const { userId, accessToken, refreshToken, expiresAt, scopes } = body;

    // Validate required fields
    if (!userId || !accessToken || !refreshToken || !expiresAt || !scopes) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: userId, accessToken, refreshToken, expiresAt, scopes',
          },
        },
        { status: 400 }
      );
    }

    // Encrypt tokens before storage
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = encrypt(refreshToken);

    // Create service client for admin operations
    const supabase = createServiceClient();

    // Upsert to user_tokens table
    const { data, error } = await supabase
      .from('user_tokens')
      .upsert(
        {
          user_id: userId,
          provider: 'google',
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          expires_at: expiresAt,
          scopes,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,provider',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving tokens to Supabase:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to save tokens',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        userId: data.user_id,
        provider: data.provider,
        expiresAt: data.expires_at,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/db/save-token:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
