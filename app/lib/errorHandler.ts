/**
 * Error categories for AURA system
 */
export enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  API = 'API',
  AGENT = 'AGENT',
  DATABASE = 'DATABASE',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for AURA system with categorization
 */
export class AuraError extends Error {
  constructor(
    public code: string,
    message: string,
    public userMessage: string,
    public recoverable: boolean = true,
    public statusCode: number = 500,
    public category: ErrorCategory = ErrorCategory.UNKNOWN,
    public details?: any
  ) {
    super(message);
    this.name = 'AuraError';
  }
}

/**
 * Categorize error based on error properties
 */
export function categorizeError(error: any): ErrorCategory {
  // Authentication errors
  if (
    error.code === 'TOKEN_EXPIRED' ||
    error.code === 'INVALID_CREDENTIALS' ||
    error.code === 'MISSING_SCOPES' ||
    error.message?.includes('token') ||
    error.message?.includes('auth')
  ) {
    return ErrorCategory.AUTHENTICATION;
  }

  // API errors
  if (
    error.code === 'RATE_LIMIT' ||
    error.status === 429 ||
    error.status === 503 ||
    error.message?.includes('API')
  ) {
    return ErrorCategory.API;
  }

  // Agent errors
  if (
    error.code === 'TASK_FAILED' ||
    error.code === 'PLANNING_FAILED' ||
    error.code === 'EXECUTION_FAILED' ||
    error.code === 'VALIDATION_FAILED'
  ) {
    return ErrorCategory.AGENT;
  }

  // Database errors
  if (
    error.code?.startsWith('PGRST') ||
    error.message?.includes('database') ||
    error.message?.includes('Supabase')
  ) {
    return ErrorCategory.DATABASE;
  }

  // Validation errors
  if (
    error.code === 'INVALID_INPUT' ||
    error.status === 400 ||
    error.message?.includes('validation')
  ) {
    return ErrorCategory.VALIDATION;
  }

  // Network errors
  if (
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('network')
  ) {
    return ErrorCategory.NETWORK;
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Handle and transform errors into AuraError instances
 */
export function handleApiError(error: any): AuraError {
  const category = categorizeError(error);

  // OAuth token expired
  if (error.code === 'TOKEN_EXPIRED' || error.message?.includes('token expired')) {
    return new AuraError(
      'TOKEN_EXPIRED',
      'OAuth token expired',
      'Your Google connection expired. Please reconnect.',
      true,
      401,
      ErrorCategory.AUTHENTICATION,
      error.details
    );
  }

  // Invalid credentials
  if (error.code === 'INVALID_CREDENTIALS') {
    return new AuraError(
      'INVALID_CREDENTIALS',
      'Invalid credentials',
      'Authentication failed. Please sign in again.',
      true,
      401,
      ErrorCategory.AUTHENTICATION
    );
  }

  // Missing scopes
  if (error.code === 'MISSING_SCOPES') {
    return new AuraError(
      'MISSING_SCOPES',
      'Missing required OAuth scopes',
      'Additional permissions required. Please reconnect your account.',
      true,
      403,
      ErrorCategory.AUTHENTICATION
    );
  }

  // Rate limit exceeded
  if (error.code === 'RATE_LIMIT' || error.status === 429) {
    return new AuraError(
      'RATE_LIMIT',
      'API rate limit exceeded',
      'Too many requests. Please wait a moment.',
      true,
      429,
      ErrorCategory.API,
      { retryAfter: error.retryAfter || 30 }
    );
  }

  // Network error
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'NETWORK_ERROR') {
    return new AuraError(
      'NETWORK_ERROR',
      'Network connection failed',
      'Connection lost. Retrying...',
      true,
      503,
      ErrorCategory.NETWORK
    );
  }

  // Permission denied
  if (error.code === 'PERMISSION_DENIED' || error.status === 403) {
    return new AuraError(
      'PERMISSION_DENIED',
      'Missing required permissions',
      'Missing required permissions. Please reconnect your Google account.',
      true,
      403,
      ErrorCategory.AUTHENTICATION
    );
  }

  // Invalid input
  if (error.code === 'INVALID_INPUT' || error.status === 400) {
    return new AuraError(
      'INVALID_INPUT',
      'Invalid request',
      'Invalid request. Please check your input.',
      true,
      400,
      ErrorCategory.VALIDATION,
      error.details
    );
  }

  // Task planning failed
  if (error.code === 'PLANNING_FAILED') {
    return new AuraError(
      'PLANNING_FAILED',
      'Task planning failed',
      'Unable to plan this task. Please try rephrasing your request.',
      true,
      500,
      ErrorCategory.AGENT
    );
  }

  // Task execution failed
  if (error.code === 'TASK_FAILED' || error.code === 'EXECUTION_FAILED') {
    return new AuraError(
      'TASK_FAILED',
      'Task execution failed',
      'Task execution failed. Would you like to retry?',
      true,
      500,
      ErrorCategory.AGENT,
      error.details
    );
  }

  // Task validation failed
  if (error.code === 'VALIDATION_FAILED') {
    return new AuraError(
      'VALIDATION_FAILED',
      'Task validation failed',
      'Task completed but validation failed. Please review the results.',
      true,
      500,
      ErrorCategory.AGENT
    );
  }

  // Database errors
  if (category === ErrorCategory.DATABASE) {
    return new AuraError(
      'DATABASE_ERROR',
      error.message || 'Database operation failed',
      'A database error occurred. Please try again.',
      true,
      500,
      ErrorCategory.DATABASE
    );
  }

  // Google API errors
  if (error.message?.includes('Google') || error.message?.includes('googleapis')) {
    return new AuraError(
      'GOOGLE_API_ERROR',
      error.message,
      'Google service temporarily unavailable. Please try again.',
      true,
      503,
      ErrorCategory.API
    );
  }

  // Unknown error
  return new AuraError(
    'UNKNOWN_ERROR',
    error.message || 'Unknown error',
    'Something went wrong. Please try again.',
    true,
    500,
    ErrorCategory.UNKNOWN,
    error.details
  );
}

/**
 * Log error to Supabase execution_logs table
 */
export async function logErrorToSupabase(
  error: AuraError,
  context?: {
    userId?: string;
    taskId?: string;
    stepId?: string;
    agentType?: string;
  }
): Promise<void> {
  try {
    // Dynamically import to avoid circular dependencies
    const { createServiceClient } = await import('./supabase/server');
    const supabase = createServiceClient();

    await supabase.from('execution_logs').insert({
      user_id: context?.userId || null,
      task_id: context?.taskId || 'system',
      step_id: context?.stepId || null,
      agent_type: context?.agentType || 'system',
      message: error.message,
      log_level: 'error',
      metadata: {
        code: error.code,
        category: error.category,
        statusCode: error.statusCode,
        recoverable: error.recoverable,
        details: error.details,
        stack: error.stack,
      },
    });
  } catch (logError) {
    // Fail silently - don't let logging errors break the application
    console.error('Failed to log error to Supabase:', logError);
  }
}

/**
 * Create standardized API error response
 */
export function apiErrorResponse(error: any, context?: {
  userId?: string;
  taskId?: string;
  stepId?: string;
  agentType?: string;
}): Response {
  const auraError = error instanceof AuraError ? error : handleApiError(error);

  // Log error to console
  console.error('API Error:', {
    code: auraError.code,
    message: auraError.message,
    category: auraError.category,
    statusCode: auraError.statusCode,
    recoverable: auraError.recoverable,
  });

  // Log to Supabase asynchronously (don't await to avoid blocking response)
  logErrorToSupabase(auraError, context).catch(console.error);

  return Response.json(
    {
      success: false,
      error: {
        code: auraError.code,
        message: auraError.userMessage,
        category: auraError.category,
        recoverable: auraError.recoverable,
        recoveryAction: getRecoveryAction(auraError),
      },
    },
    { status: auraError.statusCode }
  );
}

/**
 * Create standardized API success response
 */
export function apiSuccessResponse<T = any>(data: T, statusCode: number = 200): Response {
  return Response.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Map error codes to user-friendly messages
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  TOKEN_EXPIRED: 'Your Google connection expired. Please reconnect.',
  INVALID_CREDENTIALS: 'Authentication failed. Please sign in again.',
  MISSING_SCOPES: 'Additional permissions required. Please reconnect your account.',
  PERMISSION_DENIED: 'Missing required permissions. Please reconnect your Google account.',

  // API errors
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  GOOGLE_API_ERROR: 'Google service temporarily unavailable. Please try again.',

  // Network errors
  NETWORK_ERROR: 'Connection lost. Retrying...',

  // Agent errors
  TASK_FAILED: 'Task execution failed. Would you like to retry?',
  PLANNING_FAILED: 'Unable to plan this task. Please try rephrasing your request.',
  EXECUTION_FAILED: 'Task execution failed. Would you like to retry?',
  VALIDATION_FAILED: 'Task completed but validation failed. Please review the results.',

  // Validation errors
  INVALID_INPUT: 'Invalid request. Please check your input.',

  // Database errors
  DATABASE_ERROR: 'A database error occurred. Please try again.',

  // Unknown errors
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

/**
 * Get user-friendly message for error code
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: AuraError): boolean {
  return error.recoverable;
}

/**
 * Get recovery action for error
 */
export function getRecoveryAction(error: AuraError): string | null {
  switch (error.code) {
    case 'TOKEN_EXPIRED':
    case 'INVALID_CREDENTIALS':
    case 'MISSING_SCOPES':
    case 'PERMISSION_DENIED':
      return 'reconnect';
    case 'TASK_FAILED':
    case 'EXECUTION_FAILED':
      return 'retry';
    case 'RATE_LIMIT':
      return 'wait';
    case 'NETWORK_ERROR':
      return 'auto-retry';
    default:
      return null;
  }
}
