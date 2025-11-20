# Input Validation and Sanitization Guide

## Overview

AURA implements comprehensive input validation and sanitization to prevent security vulnerabilities including:
- XSS (Cross-Site Scripting)
- SQL Injection
- Command Injection
- Path Traversal
- Data Integrity Issues

## Core Principles

1. **Never Trust User Input**: All input from clients must be validated and sanitized
2. **Validate Early**: Check input at API boundaries before processing
3. **Sanitize Always**: Remove or escape dangerous characters
4. **Fail Securely**: Reject invalid input with clear error messages
5. **Type Safety**: Use TypeScript types and runtime validation

## Validation Functions

### String Validation

#### Basic Sanitization

```typescript
import { sanitizeString } from '@/lib/validation';

// Remove HTML tags and dangerous characters
const clean = sanitizeString(userInput);
// Input: "<script>alert('xss')</script>Hello"
// Output: "Hello"
```

#### HTML Sanitization

```typescript
import { sanitizeHtml } from '@/lib/validation';

// Allow safe HTML while removing dangerous content
const cleanHtml = sanitizeHtml(userHtml);
// Removes: <script>, onclick, javascript:, etc.
```

#### Length Validation

```typescript
import { isValidLength } from '@/lib/validation';

// Check string length
if (!isValidLength(username, 3, 30)) {
  throw new Error('Username must be 3-30 characters');
}
```

### Email Validation

```typescript
import { isValidEmail } from '@/lib/validation';

if (!isValidEmail(email)) {
  return Response.json(
    { error: 'Invalid email address' },
    { status: 400 }
  );
}
```

### URL Validation

```typescript
import { isValidUrl } from '@/lib/validation';

// Validate URL with allowed protocols
if (!isValidUrl(redirectUrl, ['http', 'https'])) {
  throw new Error('Invalid URL');
}
```

### UUID Validation

```typescript
import { isValidUuid } from '@/lib/validation';

if (!isValidUuid(userId)) {
  return Response.json(
    { error: 'Invalid user ID format' },
    { status: 400 }
  );
}
```

### Number Validation

```typescript
import { isValidInteger, isValidNumber } from '@/lib/validation';

// Validate integer with range
if (!isValidInteger(age, 0, 150)) {
  throw new Error('Age must be between 0 and 150');
}

// Validate float with range
if (!isValidNumber(price, 0.01, 999999.99)) {
  throw new Error('Invalid price');
}
```

### Enum Validation

```typescript
import { isValidEnum } from '@/lib/validation';

type Status = 'pending' | 'running' | 'completed' | 'failed';

if (!isValidEnum(status, ['pending', 'running', 'completed', 'failed'])) {
  throw new Error('Invalid status');
}
```

## Schema-Based Validation

### Define Schema

```typescript
import { ValidationSchema } from '@/lib/validation';

const userSchema: ValidationSchema = {
  email: {
    type: 'email',
    required: true,
  },
  username: {
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    sanitize: true,
  },
  age: {
    type: 'integer',
    required: false,
    min: 13,
    max: 120,
  },
  bio: {
    type: 'string',
    required: false,
    maxLength: 500,
    sanitize: true,
  },
  role: {
    type: 'string',
    required: true,
    enum: ['user', 'admin', 'moderator'],
  },
};
```

### Validate Data

```typescript
import { validateSchema } from '@/lib/validation';

const result = validateSchema(userData, userSchema);

if (!result.success) {
  console.error('Validation errors:', result.errors);
  return Response.json(
    { errors: result.errors },
    { status: 400 }
  );
}

// Use validated and sanitized data
const validatedUser = result.data;
```

### Validate Request Body

```typescript
import { validateRequestBody } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const data = await validateRequestBody(request, userSchema);
    
    // data is now validated and sanitized
    // Use it safely
    await createUser(data);
    
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            field: error.field,
          },
        },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

## Validation Middleware

### Using withValidation

```typescript
import { withValidation, ValidationSchema } from '@/lib/validation';

const createTaskSchema: ValidationSchema = {
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
  priority: {
    type: 'string',
    required: false,
    enum: ['low', 'medium', 'high'],
  },
};

export const POST = withValidation(
  async (request: Request, data) => {
    // data is already validated and sanitized
    const { prompt, userId, priority } = data;
    
    // Your API logic here
    const result = await createTask(prompt, userId, priority);
    
    return Response.json({ success: true, data: result });
  },
  createTaskSchema
);
```

## Common Validation Patterns

### Agent Plan Request

```typescript
const agentPlanSchema: ValidationSchema = {
  prompt: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 10000,
    sanitize: true,
  },
  userId: {
    type: 'uuid',
    required: true,
  },
  context: {
    type: 'object',
    required: false,
  },
};

export const POST = withValidation(
  async (request, data) => {
    const plan = await plannerAgent.planTask(data.prompt, data.userId);
    return Response.json({ success: true, data: plan });
  },
  agentPlanSchema
);
```

### Gmail Send Request

```typescript
const gmailSendSchema: ValidationSchema = {
  to: {
    type: 'array',
    required: true,
    minLength: 1,
    maxLength: 50,
    custom: (value) => {
      // Validate each email in array
      return Array.isArray(value) && value.every(isValidEmail);
    },
  },
  subject: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 998, // RFC 2822 limit
    sanitize: true,
  },
  body: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50000,
    sanitize: true,
  },
  cc: {
    type: 'array',
    required: false,
    maxLength: 50,
  },
  bcc: {
    type: 'array',
    required: false,
    maxLength: 50,
  },
};
```

### Drive Search Request

```typescript
const driveSearchSchema: ValidationSchema = {
  query: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 1000,
    sanitize: true,
  },
  fileType: {
    type: 'string',
    required: false,
    enum: ['document', 'spreadsheet', 'presentation', 'pdf', 'image'],
  },
  limit: {
    type: 'integer',
    required: false,
    min: 1,
    max: 100,
  },
  orderBy: {
    type: 'string',
    required: false,
    enum: ['name', 'modifiedTime', 'createdTime', 'size'],
  },
};
```

### Calendar Event Request

```typescript
const calendarEventSchema: ValidationSchema = {
  title: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 255,
    sanitize: true,
  },
  startTime: {
    type: 'date',
    required: true,
  },
  endTime: {
    type: 'date',
    required: true,
    custom: (value, data) => {
      // End time must be after start time
      return new Date(value) > new Date(data.startTime);
    },
  },
  attendees: {
    type: 'array',
    required: false,
    maxLength: 100,
    custom: (value) => {
      return Array.isArray(value) && value.every(isValidEmail);
    },
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 8192,
    sanitize: true,
  },
};
```

## XSS Prevention

### Input Sanitization

```typescript
// Always sanitize user input before storing or displaying
const sanitizedInput = sanitizeString(userInput);

// For HTML content, use HTML sanitization
const sanitizedHtml = sanitizeHtml(userHtml);
```

### Output Encoding

```typescript
// In React components, JSX automatically escapes content
<div>{userInput}</div> // Safe - React escapes by default

// When using dangerouslySetInnerHTML, sanitize first
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userHtml) }} />
```

### Content Security Policy

Add CSP headers to prevent XSS:

```typescript
// In middleware or API routes
response.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
);
```

## SQL Injection Prevention

### Use Parameterized Queries

```typescript
// ✅ GOOD: Parameterized query (Supabase handles this)
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail); // Safe - parameterized

// ❌ BAD: String concatenation (never do this)
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### Validate Input Types

```typescript
// Validate UUID before using in query
if (!isValidUuid(userId)) {
  throw new Error('Invalid user ID');
}

const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);
```

## Path Traversal Prevention

### Validate File Paths

```typescript
import path from 'path';

function validateFilePath(filePath: string, allowedDir: string): boolean {
  // Resolve to absolute path
  const resolved = path.resolve(allowedDir, filePath);
  
  // Check if resolved path is within allowed directory
  return resolved.startsWith(path.resolve(allowedDir));
}

// Usage
if (!validateFilePath(userFilePath, '/uploads')) {
  throw new Error('Invalid file path');
}
```

### Sanitize File Names

```typescript
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .substring(0, 255); // Limit length
}
```

## Command Injection Prevention

### Never Use User Input in Shell Commands

```typescript
// ❌ BAD: User input in shell command
const { exec } = require('child_process');
exec(`ls ${userInput}`); // DANGEROUS!

// ✅ GOOD: Use libraries instead of shell commands
import fs from 'fs/promises';
const files = await fs.readdir(directory);
```

### Validate Input for External APIs

```typescript
// Validate before passing to external services
if (!isValidEmail(email)) {
  throw new Error('Invalid email');
}

// Safe to use in API call
await sendEmail(email, subject, body);
```

## Error Handling

### Return Safe Error Messages

```typescript
try {
  await processUserInput(input);
} catch (error) {
  // ❌ BAD: Expose internal details
  return Response.json({ error: error.message });
  
  // ✅ GOOD: Generic error message
  console.error('Internal error:', error);
  return Response.json({
    error: 'An error occurred processing your request'
  }, { status: 500 });
}
```

### Validation Error Responses

```typescript
if (!result.success) {
  return Response.json({
    success: false,
    errors: result.errors.map(e => ({
      field: e.field,
      message: e.message, // User-friendly message
      code: e.code, // Error code for client handling
    })),
  }, { status: 400 });
}
```

## Testing Validation

### Unit Tests

```typescript
import { validateSchema, sanitizeString } from '@/lib/validation';

describe('Input Validation', () => {
  test('sanitizes XSS attempts', () => {
    const malicious = '<script>alert("xss")</script>Hello';
    const sanitized = sanitizeString(malicious);
    expect(sanitized).toBe('Hello');
    expect(sanitized).not.toContain('<script>');
  });
  
  test('validates email format', () => {
    const schema = { email: { type: 'email', required: true } };
    
    const valid = validateSchema({ email: 'user@example.com' }, schema);
    expect(valid.success).toBe(true);
    
    const invalid = validateSchema({ email: 'not-an-email' }, schema);
    expect(invalid.success).toBe(false);
  });
  
  test('enforces length limits', () => {
    const schema = {
      username: { type: 'string', required: true, minLength: 3, maxLength: 20 }
    };
    
    const tooShort = validateSchema({ username: 'ab' }, schema);
    expect(tooShort.success).toBe(false);
    
    const tooLong = validateSchema({ username: 'a'.repeat(21) }, schema);
    expect(tooLong.success).toBe(false);
  });
});
```

## Best Practices

### 1. Validate at API Boundaries

```typescript
// Validate immediately when receiving input
export async function POST(request: Request) {
  const data = await validateRequestBody(request, schema);
  // Now safe to use data
}
```

### 2. Use TypeScript Types

```typescript
interface CreateTaskRequest {
  prompt: string;
  userId: string;
  priority?: 'low' | 'medium' | 'high';
}

// Combine with runtime validation
const data = await validateRequestBody<CreateTaskRequest>(request, schema);
```

### 3. Sanitize Before Storage

```typescript
// Sanitize before saving to database
const sanitizedData = {
  ...data,
  prompt: sanitizeString(data.prompt),
  description: sanitizeHtml(data.description),
};

await supabase.from('tasks').insert(sanitizedData);
```

### 4. Validate on Both Client and Server

```typescript
// Client-side validation (UX)
if (!isValidEmail(email)) {
  setError('Please enter a valid email');
  return;
}

// Server-side validation (Security)
export async function POST(request: Request) {
  const data = await validateRequestBody(request, schema);
  // Always validate on server, even if client validates
}
```

### 5. Use Allowlists Over Denylists

```typescript
// ✅ GOOD: Allowlist of valid values
const validRoles = ['user', 'admin', 'moderator'];
if (!validRoles.includes(role)) {
  throw new Error('Invalid role');
}

// ❌ BAD: Denylist (easy to bypass)
if (role === 'superadmin') {
  throw new Error('Invalid role');
}
```

## Security Checklist

- [ ] All user input is validated
- [ ] Dangerous characters are sanitized
- [ ] Email addresses are validated
- [ ] URLs are validated and protocol-checked
- [ ] File paths are validated against traversal
- [ ] SQL queries use parameterized statements
- [ ] Shell commands never use user input
- [ ] Error messages don't expose internal details
- [ ] Length limits are enforced
- [ ] Type validation is performed
- [ ] Enum values are validated
- [ ] HTML content is sanitized
- [ ] JSON parsing is wrapped in try-catch
- [ ] Validation happens on server-side
- [ ] Tests cover validation logic

## Additional Resources

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
