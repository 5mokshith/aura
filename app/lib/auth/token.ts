import { createServiceClient } from '@/app/lib/supabase/server';
import { AuraError, ErrorCategory } from '@/app/lib/errorHandler';
import { decrypt } from '@/app/lib/crypto';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scopes: string[];
}

export interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  expiresIn?: number; // milliseconds
  needsRefresh: boolean;
}

/**
 * Get OAuth tokens for a user
 */
export async function getUserTokens(userId: string): Promise<TokenData | null> {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (error || !data) {
      return null;
    }

    return {
      accessToken: decrypt(data.access_token),
      refreshToken: decrypt(data.refresh_token),
      expiresAt: new Date(data.expires_at),
      scopes: data.scopes || [],
    };
  } catch (error) {
    console.error('Error getting user tokens:', error);
    return null;
  }
}

/**
 * Validate token and check expiration
 */
export function validateToken(tokenData: TokenData | null): TokenValidation {
  if (!tokenData) {
    return {
      isValid: false,
      isExpired: true,
      needsRefresh: true,
    };
  }

  const now = new Date();
  const expiresAt = new Date(tokenData.expiresAt);
  const expiresIn = expiresAt.getTime() - now.getTime();

  // Token is expired
  if (expiresIn <= 0) {
    return {
      isValid: false,
      isExpired: true,
      expiresIn: 0,
      needsRefresh: true,
    };
  }

  // Token expires in less than 5 minutes - should refresh
  const fiveMinutes = 5 * 60 * 1000;
  if (expiresIn < fiveMinutes) {
    return {
      isValid: true,
      isExpired: false,
      expiresIn,
      needsRefresh: true,
    };
  }

  // Token is valid
  return {
    isValid: true,
    isExpired: false,
    expiresIn,
    needsRefresh: false,
  };
}

/**
 * Check if user has valid OAuth tokens
 */
export async function hasValidTokens(userId: string): Promise<boolean> {
  const tokens = await getUserTokens(userId);
  const validation = validateToken(tokens);
  return validation.isValid && !validation.isExpired;
}

/**
 * Throw error if tokens are invalid or expired
 */
export async function requireValidTokens(userId: string): Promise<TokenData> {
  const tokens = await getUserTokens(userId);
  const validation = validateToken(tokens);

  if (!tokens || !validation.isValid || validation.isExpired) {
    throw new AuraError(
      'TOKEN_EXPIRED',
      'OAuth token expired or invalid',
      'Your Google connection expired. Please reconnect.',
      true,
      401,
      ErrorCategory.AUTHENTICATION
    );
  }

  if (validation.needsRefresh) {
    // Token is about to expire, should refresh
    console.warn('Token expires soon, should refresh');
  }

  return tokens;
}

/**
 * Check if user has required OAuth scopes
 */
export async function hasRequiredScopes(userId: string, requiredScopes: string[]): Promise<boolean> {
  const tokens = await getUserTokens(userId);
  
  if (!tokens) {
    return false;
  }

  return requiredScopes.every(scope => tokens.scopes.includes(scope));
}

/**
 * Throw error if user doesn't have required scopes
 */
export async function requireScopes(userId: string, requiredScopes: string[]): Promise<void> {
  const hasScopes = await hasRequiredScopes(userId, requiredScopes);

  if (!hasScopes) {
    throw new AuraError(
      'MISSING_SCOPES',
      'Missing required OAuth scopes',
      'Additional permissions required. Please reconnect your account.',
      true,
      403,
      ErrorCategory.AUTHENTICATION,
      { requiredScopes }
    );
  }
}

/**
 * Get time until token expiration in human-readable format
 */
export function getExpirationTimeString(expiresIn: number): string {
  const seconds = Math.floor(expiresIn / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}
