/**
 * Rate limiting utilities for API routes
 * Implements token bucket algorithm with in-memory storage
 * For production, consider using Redis or a dedicated rate limiting service
 */

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Optional: Custom identifier function
   * Defaults to IP address
   */
  identifier?: (request: Request) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries from the rate limit store
 * Call this periodically to prevent memory leaks
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Get client identifier from request
 * Uses IP address or custom identifier
 */
function getClientIdentifier(request: Request, customIdentifier?: (req: Request) => string): string {
  if (customIdentifier) {
    return customIdentifier(request);
  }
  
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or Response object if rate limited
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): Response | null {
  const identifier = getClientIdentifier(request, config.identifier);
  const key = `${identifier}:${new URL(request.url).pathname}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  // Increment request count
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          retryAfter,
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  }
  
  // Request allowed
  return null;
}

/**
 * Rate limit middleware wrapper for API routes
 * Usage:
 * 
 * export async function POST(request: Request) {
 *   const rateLimitResponse = await rateLimit(request, { maxRequests: 10, windowMs: 60000 });
 *   if (rateLimitResponse) return rateLimitResponse;
 *   
 *   // Your API logic here
 * }
 */
export async function rateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<Response | null> {
  return checkRateLimit(request, config);
}

/**
 * Predefined rate limit configurations for different endpoint types
 */
export const RateLimitPresets = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per minute
   */
  AUTH: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,
  
  /**
   * Standard rate limit for API endpoints
   * 60 requests per minute
   */
  API: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,
  
  /**
   * Relaxed rate limit for read operations
   * 100 requests per minute
   */
  READ: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,
  
  /**
   * Strict rate limit for write operations
   * 30 requests per minute
   */
  WRITE: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,
  
  /**
   * Very strict rate limit for expensive operations (LLM calls, etc.)
   * 10 requests per minute
   */
  EXPENSIVE: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,
};

/**
 * Create a rate-limited API route handler
 * 
 * @example
 * export const POST = withRateLimit(
 *   async (request: Request) => {
 *     // Your API logic
 *     return Response.json({ success: true });
 *   },
 *   RateLimitPresets.API
 * );
 */
export function withRateLimit(
  handler: (request: Request, context?: any) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (request: Request, context?: any): Promise<Response> => {
    const rateLimitResponse = await rateLimit(request, config);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return handler(request, context);
  };
}

/**
 * Get current rate limit status for a client
 * Useful for debugging and monitoring
 */
export function getRateLimitStatus(
  request: Request,
  config: RateLimitConfig
): {
  limit: number;
  remaining: number;
  reset: number;
} {
  const identifier = getClientIdentifier(request, config.identifier);
  const key = `${identifier}:${new URL(request.url).pathname}`;
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < Date.now()) {
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests,
      reset: Date.now() + config.windowMs,
    };
  }
  
  return {
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    reset: entry.resetTime,
  };
}
