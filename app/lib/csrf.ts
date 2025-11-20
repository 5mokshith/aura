/**
 * CSRF (Cross-Site Request Forgery) Protection
 * Implements token-based CSRF protection for API routes
 */

import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure CSRF token
 * @returns Base64-encoded random token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Verify CSRF token from request
 * Checks both header and body for token
 */
export function verifyCsrfToken(request: Request, expectedToken: string): boolean {
  // Check X-CSRF-Token header
  const headerToken = request.headers.get('X-CSRF-Token');
  if (headerToken && headerToken === expectedToken) {
    return true;
  }
  
  // For form submissions, token might be in body
  // This would need to be checked after parsing the body
  return false;
}

/**
 * CSRF protection middleware for API routes
 * Validates CSRF token for state-changing operations (POST, PUT, DELETE, PATCH)
 * 
 * @param request - The incoming request
 * @param getStoredToken - Function to retrieve the stored CSRF token for the session
 * @returns Response if CSRF validation fails, null if validation passes
 */
export async function csrfProtection(
  request: Request,
  getStoredToken: () => Promise<string | null>
): Promise<Response | null> {
  // Only check CSRF for state-changing methods
  const method = request.method.toUpperCase();
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return null; // GET, HEAD, OPTIONS are safe
  }
  
  // Get stored token from session/cookie
  const storedToken = await getStoredToken();
  
  if (!storedToken) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'CSRF_TOKEN_MISSING',
          message: 'CSRF token not found in session',
        },
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Get token from request
  const requestToken = request.headers.get('X-CSRF-Token');
  
  if (!requestToken) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'CSRF_TOKEN_REQUIRED',
          message: 'CSRF token required in X-CSRF-Token header',
        },
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Verify token matches
  if (requestToken !== storedToken) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'CSRF_TOKEN_INVALID',
          message: 'Invalid CSRF token',
        },
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // CSRF validation passed
  return null;
}

/**
 * Generate state parameter for OAuth flows
 * Includes CSRF token and optional redirect URL
 */
export function generateOAuthState(csrfToken: string, redirectUrl?: string): string {
  const state = {
    csrf: csrfToken,
    redirect: redirectUrl,
    timestamp: Date.now(),
  };
  
  return Buffer.from(JSON.stringify(state)).toString('base64url');
}

/**
 * Verify and parse OAuth state parameter
 * Returns parsed state if valid, null if invalid
 */
export function verifyOAuthState(
  stateParam: string,
  expectedCsrfToken: string,
  maxAgeMs: number = 10 * 60 * 1000 // 10 minutes default
): { csrf: string; redirect?: string; timestamp: number } | null {
  try {
    const decoded = Buffer.from(stateParam, 'base64url').toString('utf8');
    const state = JSON.parse(decoded);
    
    // Verify structure
    if (!state.csrf || !state.timestamp) {
      return null;
    }
    
    // Verify CSRF token
    if (state.csrf !== expectedCsrfToken) {
      return null;
    }
    
    // Verify timestamp (prevent replay attacks)
    const age = Date.now() - state.timestamp;
    if (age > maxAgeMs) {
      return null;
    }
    
    return state;
  } catch {
    return null;
  }
}

/**
 * Create CSRF-protected API route handler
 * 
 * @example
 * export const POST = withCsrfProtection(
 *   async (request: Request) => {
 *     // Your API logic
 *     return Response.json({ success: true });
 *   },
 *   async () => {
 *     // Get CSRF token from session/cookie
 *     return getSessionCsrfToken();
 *   }
 * );
 */
export function withCsrfProtection(
  handler: (request: Request, context?: any) => Promise<Response>,
  getStoredToken: () => Promise<string | null>
) {
  return async (request: Request, context?: any): Promise<Response> => {
    const csrfResponse = await csrfProtection(request, getStoredToken);
    if (csrfResponse) {
      return csrfResponse;
    }
    
    return handler(request, context);
  };
}

/**
 * Middleware to add CSRF token to response headers
 * Useful for SPA applications that need to include token in requests
 */
export function addCsrfTokenToResponse(response: Response, csrfToken: string): Response {
  const headers = new Headers(response.headers);
  headers.set('X-CSRF-Token', csrfToken);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Check if request is from same origin
 * Additional CSRF protection layer
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  if (!origin && !referer) {
    // No origin/referer header - might be a direct request
    // In production, you might want to reject these
    return true;
  }
  
  const requestUrl = new URL(request.url);
  const expectedOrigin = `${requestUrl.protocol}//${requestUrl.host}`;
  
  if (origin && origin !== expectedOrigin) {
    return false;
  }
  
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      if (refererOrigin !== expectedOrigin) {
        return false;
      }
    } catch {
      return false;
    }
  }
  
  return true;
}

/**
 * Combined CSRF and origin check
 */
export async function csrfAndOriginProtection(
  request: Request,
  getStoredToken: () => Promise<string | null>
): Promise<Response | null> {
  // Check origin first
  if (!isSameOrigin(request)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INVALID_ORIGIN',
          message: 'Request origin does not match server origin',
        },
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Then check CSRF token
  return csrfProtection(request, getStoredToken);
}
