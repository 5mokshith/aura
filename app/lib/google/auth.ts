import { google } from 'googleapis';
import { createServiceClient } from '@/app/lib/supabase/server';
import { encrypt, decrypt } from '@/app/lib/crypto';

/**
 * Token management utilities for Google OAuth
 */

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
}

/**
 * Get valid OAuth2 client for a user
 * Automatically refreshes tokens if expired
 */
export async function getOAuth2Client(userId: string) {
  const tokens = await getValidTokens(userId);
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  );

  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiresAt.getTime(),
  });

  return oauth2Client;
}

/**
 * Get valid tokens for a user, refreshing if necessary
 */
export async function getValidTokens(userId: string): Promise<TokenData> {
  const supabase = createServiceClient();

  // Fetch current tokens
  const { data: tokenData, error: fetchError } = await supabase
    .from('user_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single();

  if (fetchError || !tokenData) {
    throw new Error('No tokens found for user. Please reconnect your Google account.');
  }

  const accessToken = decrypt(tokenData.access_token);
  const refreshToken = decrypt(tokenData.refresh_token);
  const expiresAt = new Date(tokenData.expires_at);

  // Check if token is expired or will expire in the next 5 minutes
  const now = new Date();
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  const isExpired = expiresAt.getTime() - now.getTime() < bufferTime;

  if (!isExpired) {
    // Token is still valid
    return {
      accessToken,
      refreshToken,
      expiresAt,
      scopes: tokenData.scopes,
    };
  }

  // Token is expired or about to expire, refresh it
  console.log(`Refreshing expired token for user ${userId}`);
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    // Refresh the access token
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error('Failed to refresh access token');
    }

    const newExpiresAt = credentials.expiry_date
      ? new Date(credentials.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // Default 1 hour

    // Update tokens in database
    const { error: updateError } = await supabase
      .from('user_tokens')
      .update({
        access_token: encrypt(credentials.access_token),
        // Refresh token might be rotated
        refresh_token: credentials.refresh_token
          ? encrypt(credentials.refresh_token)
          : tokenData.refresh_token,
        expires_at: newExpiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('provider', 'google');

    if (updateError) {
      console.error('Failed to update tokens in database:', updateError);
      throw new Error('Failed to update refreshed tokens');
    }

    return {
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token || refreshToken,
      expiresAt: newExpiresAt,
      scopes: tokenData.scopes,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh access token. Please reconnect your Google account.');
  }
}

/**
 * Check if user has valid tokens
 */
export async function hasValidTokens(userId: string): Promise<boolean> {
  try {
    await getValidTokens(userId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Revoke tokens for a user
 */
export async function revokeTokens(userId: string): Promise<void> {
  const supabase = createServiceClient();

  // Get current tokens
  const { data: tokenData } = await supabase
    .from('user_tokens')
    .select('access_token')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single();

  if (tokenData) {
    try {
      const accessToken = decrypt(tokenData.access_token);
      
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      
      await oauth2Client.revokeToken(accessToken);
    } catch (error) {
      console.error('Error revoking token with Google:', error);
      // Continue to delete from database even if revocation fails
    }
  }

  // Delete from database
  await supabase
    .from('user_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('provider', 'google');
}
