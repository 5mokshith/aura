# Security Quick Reference Guide

Quick reference for implementing security measures in AURA API routes.

## 1. Rate Limiting

### Basic Usage
```typescript
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.API);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Your logic here
}
```

### With Higher-Order Function
```typescript
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';

export const POST = withRateLimit(
  async (request: Request) => {
    // Your logic here
  },
  RateLimitPresets.API
);
```

### Choose the Right Preset
- `RateLimitPresets.AUTH` - 5/min - Authentication endpoints
- `RateLimitPresets.EXPENSIVE` - 10/min - LLM calls, heavy operations
- `RateLimitPresets.WRITE` - 30/min - Write operations
- `RateLimitPresets.API` - 60/min - Standard API endpoints
- `RateLimitPresets.READ` - 100/min - Read operations

## 2. Input Validation

### Define Schema
```typescript
import { ValidationSchema } from '@/lib/validation';

const schema: ValidationSchema = {
  email: { type: 'email', required: true },
  name: { type: 'string', required: true, minLength: 1, maxLength: 100, sanitize: true },
  age: { type: 'integer', min: 0, max: 150 },
  role: { type: 'string', enum: ['user', 'admin'] },
};
```

### Validate Request Body
```typescript
import { validateRequestBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const data = await validateRequestBody(request, schema);
    // Use validated data
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  }
}
```

### With Middleware
```typescript
import { withValidation } from '@/lib/validation';

export const POST = withValidation(
  async (request: Request, data) => {
    // data is already validated
  },
  schema
);
```

## 3. CSRF Protection

### For OAuth Flows (Already Implemented)
```typescript
// Redirect
const csrfToken = generateCsrfToken();
const state = generateOAuthState(csrfToken, redirectUrl);

// Callback
const verifiedState = verifyOAuthState(state, storedCsrfToken);
if (!verifiedState) {
  // Reject request
}
```

### For API Routes
```typescript
import { csrfProtection } from '@/lib/csrf';

export async function POST(request: Request) {
  const csrfResponse = await csrfProtection(request, async () => {
    return getStoredCsrfToken(); // Get from session/cookie
  });
  
  if (csrfResponse) return csrfResponse;
  
  // Your logic here
}
```

## 4. Sanitization

### Sanitize Strings
```typescript
import { sanitizeString, sanitizeHtml } from '@/lib/validation';

const clean = sanitizeString(userInput); // Remove all HTML
const cleanHtml = sanitizeHtml(richContent); // Allow safe HTML
```

### In Schema
```typescript
const schema: ValidationSchema = {
  comment: {
    type: 'string',
    required: true,
    maxLength: 1000,
    sanitize: true, // Automatic sanitization
  },
};
```

## 5. Complete Example

### Secure API Route Template
```typescript
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { withValidation, ValidationSchema } from '@/lib/validation';

// Define validation schema
const schema: ValidationSchema = {
  prompt: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 5000,
    sanitize: true,
  },
  userId: {
    type: 'uuid',
    required: true,
  },
};

// Create secure route handler
export const POST = withValidation(
  async (request: Request, data) => {
    // Apply rate limiting
    const rateLimitResponse = await rateLimit(request, RateLimitPresets.API);
    if (rateLimitResponse) return rateLimitResponse;
    
    // Data is already validated and sanitized
    const { prompt, userId } = data;
    
    try {
      // Your business logic here
      const result = await processRequest(prompt, userId);
      
      return Response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error processing request:', error);
      
      return Response.json({
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: 'Failed to process request',
        },
      }, { status: 500 });
    }
  },
  schema
);
```

## 6. Environment Variables

### Access Validated Config
```typescript
import { getEnv } from '@/lib/env';

const config = getEnv();
const apiKey = config.llm.geminiApiKey;
```

### Validate on Startup
```typescript
import { validateStartup } from '@/lib/startup-validation';

// In your app initialization
validateStartup(); // Throws if invalid
```

## 7. Common Validation Patterns

### Email Array
```typescript
{
  recipients: {
    type: 'array',
    required: true,
    minLength: 1,
    maxLength: 50,
    custom: (value) => Array.isArray(value) && value.every(isValidEmail),
  }
}
```

### URL with Protocol Check
```typescript
{
  redirectUrl: {
    type: 'url',
    required: false,
    custom: (value) => isValidUrl(value, ['http', 'https']),
  }
}
```

### Date Range
```typescript
{
  startDate: { type: 'date', required: true },
  endDate: {
    type: 'date',
    required: true,
    custom: (value, data) => new Date(value) > new Date(data.startDate),
  }
}
```

## 8. Error Responses

### Validation Error
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email: Invalid email address",
    "field": "email"
  }
}
```

### Rate Limit Error
```typescript
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 45
  }
}
```

### CSRF Error
```typescript
{
  "success": false,
  "error": {
    "code": "CSRF_TOKEN_INVALID",
    "message": "Invalid CSRF token"
  }
}
```

## 9. Testing

### Test Rate Limiting
```typescript
test('enforces rate limit', async () => {
  for (let i = 0; i < 100; i++) {
    const response = await fetch('/api/endpoint', { method: 'POST' });
    if (response.status === 429) {
      expect(i).toBeGreaterThan(60); // API preset is 60/min
      return;
    }
  }
});
```

### Test Validation
```typescript
test('rejects invalid input', async () => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' }),
  });
  
  expect(response.status).toBe(400);
  const data = await response.json();
  expect(data.error.code).toBe('VALIDATION_ERROR');
});
```

## 10. Checklist for New API Routes

- [ ] Rate limiting applied
- [ ] Input validation schema defined
- [ ] Request body validated
- [ ] User input sanitized
- [ ] Error handling implemented
- [ ] Generic error messages to client
- [ ] Detailed errors logged server-side
- [ ] CSRF protection (if state-changing)
- [ ] Tests written

## Quick Links

- Full Documentation: `docs/SECURITY_IMPLEMENTATION.md`
- Rate Limiting Guide: `app/lib/RATE_LIMITING.md`
- CSRF Protection Guide: `app/lib/CSRF_PROTECTION.md`
- Input Validation Guide: `app/lib/INPUT_VALIDATION.md`
