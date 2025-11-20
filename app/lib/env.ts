/**
 * Environment variable validation and type-safe access
 * This module ensures all required environment variables are present
 * and provides type-safe access to them throughout the application.
 */

interface EnvConfig {
  // Supabase
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  
  // Google OAuth
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  
  // Encryption
  encryptionKey: string;
  
  // LLM Configuration
  llm: {
    provider: 'gemini' | 'openai' | 'anthropic';
    geminiApiKey?: string;
    geminiModel?: string;
    openaiApiKey?: string;
    openaiModel?: string;
    anthropicApiKey?: string;
    anthropicModel?: string;
    temperature: number;
    maxTokens: number;
    maxRetries: number;
    timeout: number;
  };
  
  // Next.js
  nextAuth: {
    url: string;
    secret: string;
  };
  
  // Optional
  bffApiUrl?: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new EnvironmentError(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file and ensure ${key} is set.`
    );
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

function validateEncryptionKey(key: string): void {
  try {
    const buffer = Buffer.from(key, 'base64');
    if (buffer.length !== 32) {
      throw new Error('Encryption key must be 32 bytes when decoded from base64');
    }
  } catch (error) {
    throw new EnvironmentError(
      `Invalid ENCRYPTION_KEY format. It must be a base64-encoded 32-byte key.\n` +
      `Generate a new key with: openssl rand -base64 32`
    );
  }
}

function validateUrl(url: string, name: string): void {
  try {
    new URL(url);
  } catch {
    throw new EnvironmentError(
      `Invalid URL format for ${name}: ${url}\n` +
      `Please provide a valid URL (e.g., https://example.com)`
    );
  }
}

/**
 * Validates and loads all environment variables
 * Call this at application startup to fail fast if configuration is invalid
 */
export function validateEnv(): EnvConfig {
  // Validate Supabase configuration
  const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const supabaseServiceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  
  validateUrl(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL');
  
  // Validate Google OAuth configuration
  const googleClientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const googleClientSecret = getRequiredEnv('GOOGLE_CLIENT_SECRET');
  const googleRedirectUri = getRequiredEnv('GOOGLE_REDIRECT_URI');
  
  validateUrl(googleRedirectUri, 'GOOGLE_REDIRECT_URI');
  
  // Validate encryption key
  const encryptionKey = getRequiredEnv('ENCRYPTION_KEY');
  validateEncryptionKey(encryptionKey);
  
  // Validate LLM configuration
  const llmProvider = getOptionalEnv('LLM_PROVIDER', 'gemini') as 'gemini' | 'openai' | 'anthropic';
  
  if (!['gemini', 'openai', 'anthropic'].includes(llmProvider)) {
    throw new EnvironmentError(
      `Invalid LLM_PROVIDER: ${llmProvider}\n` +
      `Must be one of: gemini, openai, anthropic`
    );
  }
  
  // Validate provider-specific API keys
  let geminiApiKey: string | undefined;
  let geminiModel: string | undefined;
  let openaiApiKey: string | undefined;
  let openaiModel: string | undefined;
  let anthropicApiKey: string | undefined;
  let anthropicModel: string | undefined;
  
  if (llmProvider === 'gemini') {
    geminiApiKey = getRequiredEnv('GOOGLE_GEMINI_API_KEY');
    geminiModel = getOptionalEnv('GOOGLE_GEMINI_MODEL', 'gemini-2.0-flash-exp');
  } else if (llmProvider === 'openai') {
    openaiApiKey = getRequiredEnv('OPENAI_API_KEY');
    openaiModel = getOptionalEnv('OPENAI_MODEL', 'gpt-4-turbo-preview');
  } else if (llmProvider === 'anthropic') {
    anthropicApiKey = getRequiredEnv('ANTHROPIC_API_KEY');
    anthropicModel = getOptionalEnv('ANTHROPIC_MODEL', 'claude-3-opus-20240229');
  }
  
  const llmTemperature = parseFloat(getOptionalEnv('LLM_TEMPERATURE', '0.7'));
  const llmMaxTokens = parseInt(getOptionalEnv('GEMINI_MAX_TOKENS', '8192'), 10);
  const llmMaxRetries = parseInt(getOptionalEnv('LLM_MAX_RETRIES', '3'), 10);
  const llmTimeout = parseInt(getOptionalEnv('LLM_TIMEOUT', '30000'), 10);
  
  // Validate Next.js configuration
  const nextAuthUrl = getRequiredEnv('NEXTAUTH_URL');
  const nextAuthSecret = getRequiredEnv('NEXTAUTH_SECRET');
  
  validateUrl(nextAuthUrl, 'NEXTAUTH_URL');
  
  // Optional configuration
  const bffApiUrl = getOptionalEnv('BFF_API_URL');
  if (bffApiUrl) {
    validateUrl(bffApiUrl, 'BFF_API_URL');
  }
  
  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      serviceRoleKey: supabaseServiceRoleKey,
    },
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      redirectUri: googleRedirectUri,
    },
    encryptionKey,
    llm: {
      provider: llmProvider,
      geminiApiKey,
      geminiModel,
      openaiApiKey,
      openaiModel,
      anthropicApiKey,
      anthropicModel,
      temperature: llmTemperature,
      maxTokens: llmMaxTokens,
      maxRetries: llmMaxRetries,
      timeout: llmTimeout,
    },
    nextAuth: {
      url: nextAuthUrl,
      secret: nextAuthSecret,
    },
    bffApiUrl,
  };
}

/**
 * Get validated environment configuration
 * This is memoized to avoid repeated validation
 */
let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

/**
 * Check if environment is properly configured
 * Returns true if all required variables are present and valid
 */
export function isEnvConfigured(): boolean {
  try {
    validateEnv();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get environment validation errors
 * Returns array of error messages if validation fails
 */
export function getEnvErrors(): string[] {
  const errors: string[] = [];
  
  try {
    validateEnv();
  } catch (error) {
    if (error instanceof EnvironmentError) {
      errors.push(error.message);
    } else if (error instanceof Error) {
      errors.push(error.message);
    } else {
      errors.push('Unknown environment configuration error');
    }
  }
  
  return errors;
}

// Export for use in API routes and server components
export { EnvironmentError };
