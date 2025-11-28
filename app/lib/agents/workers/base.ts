import { WorkerResult, PlanStep } from '@/app/types/agent';
import { getOAuth2Client } from '@/app/lib/google/auth';

/**
 * Base class for all worker agents
 */
export abstract class BaseWorker {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Execute a step for this service
   */
  abstract executeStep(step: PlanStep, userId: string): Promise<WorkerResult>;

  /**
   * Get authenticated OAuth2 client for the user
   */
  protected async getAuthClient(userId: string) {
    return await getOAuth2Client(userId);
  }

  /**
   * Create a success result
   */
  protected createSuccessResult(
    stepId: string,
    output: WorkerResult['output'],
    metadata?: Record<string, any>
  ): WorkerResult {
    return {
      stepId,
      success: true,
      output,
      metadata,
    };
  }

  /**
   * Create an error result
   */
  protected createErrorResult(
    stepId: string,
    error: string,
    metadata?: Record<string, any>
  ): WorkerResult {
    return {
      stepId,
      success: false,
      error,
      metadata,
    };
  }

  /**
   * Validate required parameters
   */
  protected validateParameters(
    parameters: Record<string, any>,
    required: string[]
  ): void {
    const missing = required.filter(key => {
      const value = parameters[key];

      if (value === undefined || value === null) return true;

      if (typeof value === 'string') {
        return value.trim().length === 0;
      }

      if (Array.isArray(value)) {
        return value.length === 0;
      }

      return false;
    });
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }
}
