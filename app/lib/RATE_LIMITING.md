# Rate Limiting Implementation Guide

## Overview

AURA implements rate limiting to protect API endpoints from abuse and ensure fair resource allocation. The rate limiting system uses a token bucket algorithm with in-memory storage.

## Configuration

### Predefined Presets

The system provides several predefined rate limit configurations:

- **AUTH**: 5 requests/minute - For authentication endpoints
- **API**: 60 requests/minute - Standard API endpoints
- **READ**: 100 requests/minute - Read-only operations
- **WRITE**: 30 requests/minute - Write operations
- **EXPENSIVE**: 10 requests/minute - Resource-intensive operations (LLM calls, etc.)

### Custom Configuration

You can create custom rate limit configurations:

```typescript
import { RateLimitConfig } from '@/lib/rate-limit';

const customConfig: RateLimitConfig = {
  maxRequests: 50,
  windowMs: 60 * 1000, // 1 minute
  identifier: (request) => {
    // Custom identifier logic (e.g., user ID from auth token)
    return request.headers.get('x-user-id') || 'anonymous';
  },
};
```

## Usage

### Method 1: Manual Rate Limiting

```typescript
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Check rate limit
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.API);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Your API logic here
  return Response.json({ success: true });
}
```

### Method 2: Higher-Order Function

```typescript
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';

export const POST = withRateLimit(
  async (request: Request) => {
    // Your API logic here
    return Response.json({ success: true });
  },
  RateLimitPresets.API
);
```

## Endpoint-Specific Recommendations

### Authentication Endpoints
- **Preset**: `RateLimitPresets.AUTH`
- **Limit**: 5 requests/minute
- **Endpoints**: `/api/auth/*`

```typescript
// app/api/auth/google/redirect/route.ts
export async function POST(request: Request) {
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.AUTH);
  if (rateLimitResponse) return rateLimitResponse;
  // ...
}
```

### Agent Endpoints
- **Preset**: `RateLimitPresets.EXPENSIVE`
- **Limit**: 10 requests/minute
- **Endpoints**: `/api/agent/plan`, `/api/agent/execute`

```typescript
// app/api/agent/plan/route.ts
export async function POST(request: Request) {
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.EXPENSIVE);
  if (rateLimitResponse) return rateLimitResponse;
  // ...
}
```

### Google Workspace API Endpoints
- **Preset**: `RateLimitPresets.WRITE` (for write operations)
- **Preset**: `RateLimitPresets.READ` (for read operations)
- **Endpoints**: `/api/gmail/*`, `/api/drive/*`, `/api/docs/*`, etc.

```typescript
// app/api/gmail/send/route.ts
export async function POST(request: Request) {
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.WRITE);
  if (rateLimitResponse) return rateLimitResponse;
  // ...
}

// app/api/drive/search/route.ts
export async function POST(request: Request) {
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.READ);
  if (rateLimitResponse) return rateLimitResponse;
  // ...
}
```

### Database Endpoints
- **Preset**: `RateLimitPresets.API`
- **Limit**: 60 requests/minute
- **Endpoints**: `/api/db/*`

## Response Format

When rate limit is exceeded, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 45
  }
}
```

**HTTP Status**: 429 Too Many Requests

**Headers**:
- `Retry-After`: Seconds until rate limit resets
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when rate limit resets

## Client-Side Handling

### Automatic Retry with Exponential Backoff

```typescript
async function apiCallWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}
```

### Display Rate Limit Info

```typescript
const response = await fetch('/api/agent/plan', { method: 'POST', body: JSON.stringify(data) });

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  showError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
}
```

## Production Considerations

### Current Implementation
- **Storage**: In-memory Map
- **Scope**: Single server instance
- **Persistence**: Lost on server restart

### Production Recommendations

For production deployments, consider:

1. **Redis-based Rate Limiting**
   ```typescript
   import Redis from 'ioredis';
   
   const redis = new Redis(process.env.REDIS_URL);
   
   // Use Redis for distributed rate limiting
   ```

2. **Edge Rate Limiting**
   - Use Vercel Edge Config or Cloudflare Workers
   - Implement rate limiting at CDN level

3. **User-Based Rate Limiting**
   ```typescript
   const config: RateLimitConfig = {
     maxRequests: 100,
     windowMs: 60 * 1000,
     identifier: (request) => {
       // Extract user ID from JWT or session
       const userId = getUserIdFromRequest(request);
       return userId || getIpAddress(request);
     },
   };
   ```

4. **Tiered Rate Limits**
   - Free tier: 10 requests/minute
   - Pro tier: 100 requests/minute
   - Enterprise: Unlimited

## Monitoring

### Get Rate Limit Status

```typescript
import { getRateLimitStatus } from '@/lib/rate-limit';

const status = getRateLimitStatus(request, RateLimitPresets.API);
console.log(`Remaining: ${status.remaining}/${status.limit}`);
```

### Logging

Add logging to track rate limit hits:

```typescript
if (rateLimitResponse) {
  console.warn(`Rate limit exceeded for ${getClientIdentifier(request)}`);
  return rateLimitResponse;
}
```

## Testing

### Test Rate Limiting

```typescript
// Test that rate limiting works
for (let i = 0; i < 10; i++) {
  const response = await fetch('/api/test', { method: 'POST' });
  console.log(`Request ${i + 1}: ${response.status}`);
}
```

### Bypass Rate Limiting in Tests

```typescript
// Set environment variable to disable rate limiting in tests
if (process.env.NODE_ENV === 'test') {
  // Skip rate limiting
  return handler(request);
}
```

## Security Notes

1. **IP Spoofing**: The current implementation uses `x-forwarded-for` header, which can be spoofed. In production, ensure your reverse proxy (Vercel, Cloudflare) sets this header correctly.

2. **DDoS Protection**: Rate limiting alone is not sufficient for DDoS protection. Use additional layers like:
   - CDN-level protection (Cloudflare, Vercel)
   - WAF (Web Application Firewall)
   - Network-level filtering

3. **Authenticated vs Anonymous**: Consider different rate limits for authenticated users vs anonymous requests.

## Troubleshooting

### Rate Limit Not Working

1. Check that rate limiting is applied to the route
2. Verify the identifier is consistent across requests
3. Check server logs for errors

### Too Strict Rate Limits

1. Adjust the preset configuration
2. Implement user-based rate limiting
3. Add rate limit exemptions for trusted clients

### Memory Leaks

The in-memory store automatically cleans up expired entries every 5 minutes. For high-traffic applications, consider:
- Using Redis instead of in-memory storage
- Reducing the cleanup interval
- Monitoring memory usage
