import { NextRequest } from 'next/server';
import { getAuthSession } from './session';
import { requireValidTokens, requireScopes } from './token';
import { AuraError, ErrorCategory, apiErrorResponse } from '@/app/lib/errorHandler';

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest) {
  const session = await getAuthSession();

  if (!session || !session.isAuthenticated) {
    throw new AuraError(
      'INVALID_CREDENTIALS',
      'User not authenticated',
      'Authentication required. Please sign in.',
      true,
      401,
      ErrorCategory.AUTHENTICATION
    );
  }

  return session;
}

/**
 * Middleware to require valid OAuth tokens
 */
export async function requireOAuthTokens(request: NextRequest) {
  const session = await requireAuth(request);
  const tokens = await requireValidTokens(session.userId);
  return { session, tokens };
}

/**
 * Middleware to require specific OAuth scopes
 */
export async function requireOAuthScopes(request: NextRequest, scopes: string[]) {
  const { session, tokens } = await requireOAuthTokens(request);
  await requireScopes(session.userId, scopes);
  return { session, tokens };
}

/**
 * Wrap API route handler with authentication
 */
export function withAuth<T = any>(
  handler: (request: NextRequest, session: any) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const session = await requireAuth(request);
      return await handler(request, session);
    } catch (error: any) {
      return apiErrorResponse(error);
    }
  };
}

/**
 * Wrap API route handler with OAuth token validation
 */
export function withOAuth<T = any>(
  handler: (request: NextRequest, context: { session: any; tokens: any }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const context = await requireOAuthTokens(request);
      return await handler(request, context);
    } catch (error: any) {
      return apiErrorResponse(error);
    }
  };
}

/**
 * Wrap API route handler with OAuth scope validation
 */
export function withScopes<T = any>(
  scopes: string[],
  handler: (request: NextRequest, context: { session: any; tokens: any }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const context = await requireOAuthScopes(request, scopes);
      return await handler(request, context);
    } catch (error: any) {
      return apiErrorResponse(error);
    }
  };
}
