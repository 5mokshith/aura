/**
 * Main library exports
 * Centralized exports for all utility functions and clients
 */

// Environment configuration
export {
  validateEnv,
  getEnv,
  isEnvConfigured,
  getEnvErrors,
  EnvironmentError,
} from './env';

// Supabase clients
export { createClient as createSupabaseClient } from './supabase/client';
export {
  createClient as createSupabaseServerClient,
  createServiceClient as createSupabaseServiceClient,
} from './supabase/server';

// Google OAuth
export {
  createOAuth2Client,
  generateAuthUrl,
  getTokensFromCode,
  refreshAccessToken,
  setCredentials,
  GOOGLE_SCOPES,
} from './google/auth';

// Encryption utilities
export { encrypt, decrypt, generateEncryptionKey } from './crypto';

// Setup validation
export {
  validateSetup,
  getSetupStatus,
  type ValidationResult,
} from './setup-validator';

// Error handling
export { AuraError, handleApiError, apiErrorResponse } from './errorHandler';

// Utilities
export { cn } from './utils';
