import { AuraError } from './errorHandler';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

export interface RetryState {
  attempt: number;
  lastError?: AuraError;
  nextRetryDelay?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    'NETWORK_ERROR',
    'RATE_LIMIT',
    'TASK_FAILED',
    'EXECUTION_FAILED',
    'GOOGLE_API_ERROR',
  ],
};

/**
 * Calculate delay for next retry using exponential backoff
 */
export function calculateBackoffDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = initialDelay * Math.pow(multiplier, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: AuraError, retryableErrors: string[]): boolean {
  return error.recoverable && retryableErrors.includes(error.code);
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      const auraError = error instanceof AuraError ? error : new AuraError(
        'UNKNOWN_ERROR',
        error.message,
        'An error occurred',
        true
      );

      if (!isRetryableError(auraError, opts.retryableErrors)) {
        throw error;
      }

      // Don't retry if we've reached max attempts
      if (attempt >= opts.maxAttempts) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateBackoffDelay(
        attempt,
        opts.initialDelay,
        opts.maxDelay,
        opts.backoffMultiplier
      );

      console.log(`Retry attempt ${attempt}/${opts.maxAttempts} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Create a retry handler for API calls
 */
export function createRetryHandler(options: RetryOptions = {}) {
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    return retryWithBackoff(fn, options);
  };
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry state manager for UI components
 */
export class RetryManager {
  private retryStates: Map<string, RetryState> = new Map();
  private options: Required<RetryOptions>;

  constructor(options: RetryOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Get retry state for a task
   */
  getRetryState(taskId: string): RetryState | undefined {
    return this.retryStates.get(taskId);
  }

  /**
   * Check if task can be retried
   */
  canRetry(taskId: string, error: AuraError): boolean {
    const state = this.retryStates.get(taskId);
    const attempt = state ? state.attempt + 1 : 1;

    return (
      attempt <= this.options.maxAttempts &&
      isRetryableError(error, this.options.retryableErrors)
    );
  }

  /**
   * Record retry attempt
   */
  recordAttempt(taskId: string, error: AuraError): RetryState {
    const currentState = this.retryStates.get(taskId);
    const attempt = currentState ? currentState.attempt + 1 : 1;

    const nextRetryDelay = calculateBackoffDelay(
      attempt,
      this.options.initialDelay,
      this.options.maxDelay,
      this.options.backoffMultiplier
    );

    const newState: RetryState = {
      attempt,
      lastError: error,
      nextRetryDelay,
    };

    this.retryStates.set(taskId, newState);
    return newState;
  }

  /**
   * Clear retry state for a task
   */
  clearRetryState(taskId: string): void {
    this.retryStates.delete(taskId);
  }

  /**
   * Reset all retry states
   */
  reset(): void {
    this.retryStates.clear();
  }
}

/**
 * Hook-friendly retry handler
 */
export interface UseRetryResult {
  retry: <T>(fn: () => Promise<T>) => Promise<T>;
  canRetry: (taskId: string, error: AuraError) => boolean;
  getRetryState: (taskId: string) => RetryState | undefined;
  recordAttempt: (taskId: string, error: AuraError) => RetryState;
  clearRetryState: (taskId: string) => void;
}

/**
 * Create retry utilities for use in components
 */
export function createRetryUtils(options: RetryOptions = {}): UseRetryResult {
  const manager = new RetryManager(options);
  const handler = createRetryHandler(options);

  return {
    retry: handler,
    canRetry: manager.canRetry.bind(manager),
    getRetryState: manager.getRetryState.bind(manager),
    recordAttempt: manager.recordAttempt.bind(manager),
    clearRetryState: manager.clearRetryState.bind(manager),
  };
}
