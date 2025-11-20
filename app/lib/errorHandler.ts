export class AuraError extends Error {
  constructor(
    public code: string,
    message: string,
    public userMessage: string,
    public recoverable: boolean = true,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AuraError';
  }
}

export function handleApiError(error: any): AuraError {
  // OAuth token expired
  if (error.code === 'TOKEN_EXPIRED' || error.message?.includes('token')) {
    return new AuraError(
      'TOKEN_EXPIRED',
      'OAuth token expired',
      'Your Google connection expired. Please reconnect.',
      true,
      401
    );
  }

  // Rate limit exceeded
  if (error.code === 'RATE_LIMIT' || error.status === 429) {
    return new AuraError(
      'RATE_LIMIT',
      'API rate limit exceeded',
      'Too many requests. Please wait a moment.',
      true,
      429
    );
  }

  // Network error
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return new AuraError(
      'NETWORK_ERROR',
      'Network connection failed',
      'Connection lost. Retrying...',
      true,
      503
    );
  }

  // Permission denied
  if (error.code === 'PERMISSION_DENIED' || error.status === 403) {
    return new AuraError(
      'PERMISSION_DENIED',
      'Missing required permissions',
      'Missing required permissions. Please reconnect your Google account.',
      true,
      403
    );
  }

  // Invalid input
  if (error.code === 'INVALID_INPUT' || error.status === 400) {
    return new AuraError(
      'INVALID_INPUT',
      'Invalid request',
      'Invalid request. Please check your input.',
      true,
      400
    );
  }

  // Task execution failed
  if (error.code === 'TASK_FAILED') {
    return new AuraError(
      'TASK_FAILED',
      'Task execution failed',
      'Task execution failed. Would you like to retry?',
      true,
      500
    );
  }

  // Unknown error
  return new AuraError(
    'UNKNOWN_ERROR',
    error.message || 'Unknown error',
    'Something went wrong. Please try again.',
    true,
    500
  );
}

export function apiErrorResponse(error: any): Response {
  const auraError = error instanceof AuraError ? error : handleApiError(error);

  // Log error (in production, send to logging service)
  console.error('API Error:', {
    code: auraError.code,
    message: auraError.message,
    statusCode: auraError.statusCode,
  });

  return Response.json(
    {
      success: false,
      error: {
        code: auraError.code,
        message: auraError.userMessage,
      },
    },
    { status: auraError.statusCode }
  );
}

export const ERROR_MESSAGES = {
  TOKEN_EXPIRED: 'Your Google connection expired. Please reconnect.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  NETWORK_ERROR: 'Connection lost. Retrying...',
  TASK_FAILED: 'Task execution failed. Would you like to retry?',
  INVALID_INPUT: 'Invalid request. Please check your input.',
  PERMISSION_DENIED: 'Missing required permissions.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;
