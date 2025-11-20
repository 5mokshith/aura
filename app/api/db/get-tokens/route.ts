import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/app/lib/supabase/server';
import { decrypt } from '@/app/lib/crypto';

/**
 * GET /api/db/get-tokens
 * 
 * Retrieve and decrypt OAuth tokens for a user
 * Check token expiration and return validity status
 * 
 * Requirements: 14.2
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate required parameter
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required parameter: userId',
          },
        },
        { status: 400 }
      );
    }

    // Create service client for admin operations
    const supabase = createServiceClient();

    // Retrieve tokens for user
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No tokens found
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TOKENS_NOT_FOUND',
              message: 'No tokens found for this user',
            },
          },
          { status: 404 }
        );
      }

      console.error('Error retrieving tokens from Supabase:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to retrieve tokens',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    // Decrypt tokens before returning
    let accessToken: string;
    let refreshToken: string;

    try {
      accessToken = decrypt(data.access_token);
      refreshToken = decrypt(data.refresh_token);
    } catch (decryptError: any) {
      console.error('Error decrypting tokens:', decryptError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DECRYPTION_ERROR',
            message: 'Failed to decrypt tokens',
            details: decryptError.message,
          },
        },
        { status: 500 }
      );
    }

    // Check expiration
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    const isExpired = expiresAt <= now;

    // Calculate time until expiration in seconds
    const expiresInSeconds = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresAt: data.expires_at,
        scopes: data.scopes,
        isExpired,
        expiresInSeconds: isExpired ? 0 : expiresInSeconds,
        provider: data.provider,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/db/get-tokens:', error);
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
