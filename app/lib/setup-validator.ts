/**
 * Setup validation utility
 * Checks if all required services and configurations are properly set up
 */

import { getEnvErrors, isEnvConfigured } from './env';
import { createClient } from './supabase/client';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    environment: boolean;
    supabase: boolean;
    googleOAuth: boolean;
    encryption: boolean;
    llm: boolean;
  };
}

/**
 * Validate environment variables
 */
function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors = getEnvErrors();
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Supabase connection (client-side)
 */
async function validateSupabase(): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    const supabase = createClient();
    
    // Test connection by checking auth status
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      errors.push(`Supabase connection error: ${error.message}`);
    }
  } catch (error) {
    errors.push(
      `Failed to connect to Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Google OAuth configuration
 */
function validateGoogleOAuth(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    // Just validate environment variables since getOAuth2Client requires userId
    // We can't test the actual client creation without a user context
    
    // Validate required environment variables
    if (!process.env.GOOGLE_CLIENT_ID) {
      errors.push('GOOGLE_CLIENT_ID is not set');
    }
    if (!process.env.GOOGLE_CLIENT_SECRET) {
      errors.push('GOOGLE_CLIENT_SECRET is not set');
    }
    if (!process.env.GOOGLE_REDIRECT_URI) {
      errors.push('GOOGLE_REDIRECT_URI is not set');
    }
  } catch (error) {
    errors.push(
      `Google OAuth configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate encryption configuration
 */
function validateEncryption(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const key = process.env.ENCRYPTION_KEY;
    
    if (!key) {
      errors.push('ENCRYPTION_KEY is not set');
      return { valid: false, errors };
    }
    
    // Validate key format
    const buffer = Buffer.from(key, 'base64');
    if (buffer.length !== 32) {
      errors.push(
        'ENCRYPTION_KEY must be a base64-encoded 32-byte key. ' +
        'Generate with: openssl rand -base64 32'
      );
    }
  } catch (error) {
    errors.push(
      `Encryption configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate LLM configuration
 */
function validateLLM(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const provider = process.env.LLM_PROVIDER || 'gemini';
  
  if (!['gemini', 'openai', 'anthropic'].includes(provider)) {
    errors.push(`Invalid LLM_PROVIDER: ${provider}. Must be one of: gemini, openai, anthropic`);
  }
  
  // Check provider-specific configuration
  if (provider === 'gemini') {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      errors.push('GOOGLE_GEMINI_API_KEY is required when using Gemini');
    }
    if (!process.env.GOOGLE_GEMINI_MODEL) {
      warnings.push('GOOGLE_GEMINI_MODEL not set, using default: gemini-2.0-flash-exp');
    }
  } else if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) {
      errors.push('OPENAI_API_KEY is required when using OpenAI');
    }
    if (!process.env.OPENAI_MODEL) {
      warnings.push('OPENAI_MODEL not set, using default: gpt-4-turbo-preview');
    }
  } else if (provider === 'anthropic') {
    if (!process.env.ANTHROPIC_API_KEY) {
      errors.push('ANTHROPIC_API_KEY is required when using Anthropic');
    }
    if (!process.env.ANTHROPIC_MODEL) {
      warnings.push('ANTHROPIC_MODEL not set, using default: claude-3-opus-20240229');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Run all validation checks
 * This is the main entry point for setup validation
 */
export async function validateSetup(): Promise<ValidationResult> {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  // Check environment variables
  const envCheck = validateEnvironment();
  allErrors.push(...envCheck.errors);
  
  // If environment is not configured, skip other checks
  if (!envCheck.valid) {
    return {
      isValid: false,
      errors: allErrors,
      warnings: allWarnings,
      checks: {
        environment: false,
        supabase: false,
        googleOAuth: false,
        encryption: false,
        llm: false,
      },
    };
  }
  
  // Check Supabase connection
  const supabaseCheck = await validateSupabase();
  allErrors.push(...supabaseCheck.errors);
  
  // Check Google OAuth configuration
  const oauthCheck = validateGoogleOAuth();
  allErrors.push(...oauthCheck.errors);
  
  // Check encryption configuration
  const encryptionCheck = validateEncryption();
  allErrors.push(...encryptionCheck.errors);
  
  // Check LLM configuration
  const llmCheck = validateLLM();
  allErrors.push(...llmCheck.errors);
  allWarnings.push(...llmCheck.warnings);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    checks: {
      environment: envCheck.valid,
      supabase: supabaseCheck.valid,
      googleOAuth: oauthCheck.valid,
      encryption: encryptionCheck.valid,
      llm: llmCheck.valid,
    },
  };
}

/**
 * Get setup status for display in UI
 */
export function getSetupStatus(): {
  configured: boolean;
  missingVariables: string[];
} {
  const configured = isEnvConfigured();
  const missingVariables: string[] = [];
  
  if (!configured) {
    const errors = getEnvErrors();
    errors.forEach((error) => {
      // Extract variable names from error messages
      const match = error.match(/Missing required environment variable: (\w+)/);
      if (match) {
        missingVariables.push(match[1]);
      }
    });
  }
  
  return {
    configured,
    missingVariables,
  };
}
