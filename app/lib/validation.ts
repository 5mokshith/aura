/**
 * Input validation and sanitization utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

/**
 * Sanitize string to prevent XSS attacks
 * Removes potentially dangerous HTML/JavaScript
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick, onerror, etc.)
    .trim();
}

/**
 * Sanitize HTML content
 * Allows safe HTML tags while removing dangerous ones
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  return sanitized.trim();
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate URL
 */
export function isValidUrl(url: string, allowedProtocols: string[] = ['http', 'https']): boolean {
  if (typeof url !== 'string') {
    return false;
  }
  
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol.replace(':', ''));
  } catch {
    return false;
  }
}

/**
 * Validate UUID
 */
export function isValidUuid(uuid: string): boolean {
  if (typeof uuid !== 'string') {
    return false;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate string length
 */
export function isValidLength(
  str: string,
  min: number = 0,
  max: number = Infinity
): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  const length = str.length;
  return length >= min && length <= max;
}

/**
 * Validate that string contains only alphanumeric characters
 */
export function isAlphanumeric(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Validate that string contains only alphanumeric characters and specific special chars
 */
export function isValidUsername(username: string): boolean {
  if (typeof username !== 'string') {
    return false;
  }
  
  // Allow letters, numbers, underscores, hyphens
  // Must start with letter or number
  // Length 3-30 characters
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,29}$/.test(username);
}

/**
 * Validate JSON string
 */
export function isValidJson(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate and parse JSON safely
 */
export function parseJsonSafely<T = any>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

/**
 * Validate integer
 */
export function isValidInteger(value: any, min?: number, max?: number): boolean {
  const num = Number(value);
  
  if (!Number.isInteger(num)) {
    return false;
  }
  
  if (min !== undefined && num < min) {
    return false;
  }
  
  if (max !== undefined && num > max) {
    return false;
  }
  
  return true;
}

/**
 * Validate number
 */
export function isValidNumber(value: any, min?: number, max?: number): boolean {
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return false;
  }
  
  if (min !== undefined && num < min) {
    return false;
  }
  
  if (max !== undefined && num > max) {
    return false;
  }
  
  return true;
}

/**
 * Validate boolean
 */
export function isValidBoolean(value: any): boolean {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
}

/**
 * Validate date string
 */
export function isValidDate(dateStr: string): boolean {
  if (typeof dateStr !== 'string') {
    return false;
  }
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate array
 */
export function isValidArray(value: any, minLength?: number, maxLength?: number): boolean {
  if (!Array.isArray(value)) {
    return false;
  }
  
  if (minLength !== undefined && value.length < minLength) {
    return false;
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    return false;
  }
  
  return true;
}

/**
 * Validate enum value
 */
export function isValidEnum<T extends string>(value: any, allowedValues: T[]): value is T {
  return allowedValues.includes(value);
}

/**
 * Schema-based validation
 */
export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'integer' | 'boolean' | 'email' | 'url' | 'uuid' | 'date' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
    sanitize?: boolean;
    custom?: (value: any) => boolean;
  };
}

/**
 * Validate object against schema
 */
export function validateSchema<T = any>(
  data: any,
  schema: ValidationSchema
): ValidationResult<T> {
  const errors: Array<{ field: string; message: string; code: string }> = [];
  const validated: any = {};
  
  // Check required fields
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Check if required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED',
      });
      continue;
    }
    
    // Skip validation if not required and value is empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type validation
    let isValid = true;
    let sanitizedValue = value;
    
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a string`,
            code: 'INVALID_TYPE',
          });
        } else {
          if (rules.sanitize) {
            sanitizedValue = sanitizeString(value);
          }
          if (rules.minLength && !isValidLength(value, rules.minLength)) {
            isValid = false;
            errors.push({
              field,
              message: `${field} must be at least ${rules.minLength} characters`,
              code: 'TOO_SHORT',
            });
          }
          if (rules.maxLength && !isValidLength(value, 0, rules.maxLength)) {
            isValid = false;
            errors.push({
              field,
              message: `${field} must be at most ${rules.maxLength} characters`,
              code: 'TOO_LONG',
            });
          }
          if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errors.push({
              field,
              message: `${field} has invalid format`,
              code: 'INVALID_FORMAT',
            });
          }
        }
        break;
        
      case 'email':
        if (!isValidEmail(value)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid email address`,
            code: 'INVALID_EMAIL',
          });
        }
        break;
        
      case 'url':
        if (!isValidUrl(value)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid URL`,
            code: 'INVALID_URL',
          });
        }
        break;
        
      case 'uuid':
        if (!isValidUuid(value)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid UUID`,
            code: 'INVALID_UUID',
          });
        }
        break;
        
      case 'number':
        if (!isValidNumber(value, rules.min, rules.max)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid number`,
            code: 'INVALID_NUMBER',
          });
        } else {
          sanitizedValue = Number(value);
        }
        break;
        
      case 'integer':
        if (!isValidInteger(value, rules.min, rules.max)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid integer`,
            code: 'INVALID_INTEGER',
          });
        } else {
          sanitizedValue = parseInt(value, 10);
        }
        break;
        
      case 'boolean':
        if (!isValidBoolean(value)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a boolean`,
            code: 'INVALID_BOOLEAN',
          });
        } else {
          sanitizedValue = value === true || value === 'true';
        }
        break;
        
      case 'date':
        if (!isValidDate(value)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid date`,
            code: 'INVALID_DATE',
          });
        } else {
          sanitizedValue = new Date(value);
        }
        break;
        
      case 'array':
        if (!isValidArray(value, rules.minLength, rules.maxLength)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be a valid array`,
            code: 'INVALID_ARRAY',
          });
        }
        break;
        
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          isValid = false;
          errors.push({
            field,
            message: `${field} must be an object`,
            code: 'INVALID_OBJECT',
          });
        }
        break;
    }
    
    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      isValid = false;
      errors.push({
        field,
        message: `${field} must be one of: ${rules.enum.join(', ')}`,
        code: 'INVALID_ENUM',
      });
    }
    
    // Custom validation
    if (rules.custom && !rules.custom(value)) {
      isValid = false;
      errors.push({
        field,
        message: `${field} failed custom validation`,
        code: 'CUSTOM_VALIDATION_FAILED',
      });
    }
    
    if (isValid) {
      validated[field] = sanitizedValue;
    }
  }
  
  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }
  
  return {
    success: true,
    data: validated as T,
  };
}

/**
 * Validate request body against schema
 * Returns validated data or throws ValidationError
 */
export async function validateRequestBody<T = any>(
  request: Request,
  schema: ValidationSchema
): Promise<T> {
  let body: any;
  
  try {
    body = await request.json();
  } catch {
    throw new ValidationError('Invalid JSON in request body', undefined, 'INVALID_JSON');
  }
  
  const result = validateSchema<T>(body, schema);
  
  if (!result.success) {
    const errorMessage = result.errors?.map(e => `${e.field}: ${e.message}`).join(', ');
    throw new ValidationError(
      errorMessage || 'Validation failed',
      result.errors?.[0]?.field,
      result.errors?.[0]?.code
    );
  }
  
  return result.data!;
}

/**
 * Create validation middleware for API routes
 */
export function withValidation<T = any>(
  handler: (request: Request, data: T, context?: any) => Promise<Response>,
  schema: ValidationSchema
) {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      const data = await validateRequestBody<T>(request, schema);
      return handler(request, data, context);
    } catch (error) {
      if (error instanceof ValidationError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: error.code || 'VALIDATION_ERROR',
              message: error.message,
              field: error.field,
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Re-throw unexpected errors
      throw error;
    }
  };
}
