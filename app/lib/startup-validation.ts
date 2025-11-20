/**
 * Startup validation for AURA application
 * This module validates environment configuration and critical dependencies
 * Call validateStartup() at application initialization to fail fast
 */

import { validateEnv, getEnvErrors } from './env';

export class StartupValidationError extends Error {
  constructor(
    message: string,
    public errors: string[]
  ) {
    super(message);
    this.name = 'StartupValidationError';
  }
}

/**
 * Validate all startup requirements
 * Throws StartupValidationError if validation fails
 */
export function validateStartup(): void {
  const errors: string[] = [];
  
  // Validate environment variables
  try {
    validateEnv();
  } catch (error) {
    const envErrors = getEnvErrors();
    errors.push(...envErrors);
  }
  
  // Validate Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  
  if (majorVersion < 18) {
    errors.push(
      `Node.js version ${nodeVersion} is not supported. ` +
      `Please upgrade to Node.js 18 or higher.`
    );
  }
  
  // Check for required Node.js modules
  try {
    require('crypto');
  } catch {
    errors.push('crypto module is not available. Please check your Node.js installation.');
  }
  
  if (errors.length > 0) {
    throw new StartupValidationError(
      'Application startup validation failed. Please fix the following issues:',
      errors
    );
  }
}

/**
 * Validate startup and log results
 * Returns true if validation passes, false otherwise
 * Use this for non-critical validation that shouldn't block startup
 */
export function validateStartupSafe(): boolean {
  try {
    validateStartup();
    console.log('✓ Startup validation passed');
    return true;
  } catch (error) {
    if (error instanceof StartupValidationError) {
      console.error('✗ Startup validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err}`);
      });
    } else {
      console.error('✗ Unexpected startup validation error:', error);
    }
    return false;
  }
}

/**
 * Get startup validation status
 * Returns object with validation results
 */
export function getStartupStatus(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    validateEnv();
  } catch {
    errors.push(...getEnvErrors());
  }
  
  // Check optional configurations
  if (!process.env.BFF_API_URL) {
    warnings.push('BFF_API_URL not configured (optional)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
