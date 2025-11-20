#!/usr/bin/env node

/**
 * Environment validation script
 * Run this to check if your .env.local is properly configured
 * 
 * Usage: node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('\n❌ .env.local file not found!', 'red');
    log('\nTo get started:', 'yellow');
    log('  1. Copy the template: cp .env.local.template .env.local', 'cyan');
    log('  2. Fill in your configuration values', 'cyan');
    log('  3. Run this script again to validate\n', 'cyan');
    return false;
  }
  
  log('\n✓ .env.local file found', 'green');
  return true;
}

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const env = {};
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

function validateRequired(env, key, description) {
  if (!env[key] || env[key] === '') {
    log(`  ❌ ${key} - ${description}`, 'red');
    return false;
  }
  log(`  ✓ ${key}`, 'green');
  return true;
}

function validateUrl(env, key, description) {
  if (!env[key] || env[key] === '') {
    log(`  ❌ ${key} - ${description}`, 'red');
    return false;
  }
  
  try {
    new URL(env[key]);
    log(`  ✓ ${key}`, 'green');
    return true;
  } catch {
    log(`  ❌ ${key} - Invalid URL format`, 'red');
    return false;
  }
}

function validateEncryptionKey(env) {
  const key = env['ENCRYPTION_KEY'];
  
  if (!key || key === '') {
    log('  ❌ ENCRYPTION_KEY - Required for token encryption', 'red');
    log('     Generate with: openssl rand -base64 32', 'yellow');
    return false;
  }
  
  try {
    const buffer = Buffer.from(key, 'base64');
    if (buffer.length !== 32) {
      log('  ❌ ENCRYPTION_KEY - Must be 32 bytes when decoded', 'red');
      log('     Generate with: openssl rand -base64 32', 'yellow');
      return false;
    }
    log('  ✓ ENCRYPTION_KEY', 'green');
    return true;
  } catch {
    log('  ❌ ENCRYPTION_KEY - Invalid base64 format', 'red');
    log('     Generate with: openssl rand -base64 32', 'yellow');
    return false;
  }
}

function validateLLMConfig(env) {
  const provider = env['LLM_PROVIDER'] || 'gemini';
  let valid = true;
  
  if (!['gemini', 'openai', 'anthropic'].includes(provider)) {
    log(`  ❌ LLM_PROVIDER - Invalid value: ${provider}`, 'red');
    log('     Must be one of: gemini, openai, anthropic', 'yellow');
    return false;
  }
  
  log(`  ✓ LLM_PROVIDER (${provider})`, 'green');
  
  if (provider === 'gemini') {
    if (!validateRequired(env, 'GOOGLE_GEMINI_API_KEY', 'Required for Gemini')) {
      valid = false;
    }
    if (env['GOOGLE_GEMINI_MODEL']) {
      log(`  ✓ GOOGLE_GEMINI_MODEL (${env['GOOGLE_GEMINI_MODEL']})`, 'green');
    } else {
      log('  ⚠ GOOGLE_GEMINI_MODEL not set, using default', 'yellow');
    }
  } else if (provider === 'openai') {
    if (!validateRequired(env, 'OPENAI_API_KEY', 'Required for OpenAI')) {
      valid = false;
    }
  } else if (provider === 'anthropic') {
    if (!validateRequired(env, 'ANTHROPIC_API_KEY', 'Required for Anthropic')) {
      valid = false;
    }
  }
  
  return valid;
}

function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('  AURA Environment Validation', 'bold');
  log('='.repeat(60) + '\n', 'cyan');
  
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  const env = loadEnv();
  let allValid = true;
  
  // Validate Supabase
  log('\n📦 Supabase Configuration:', 'blue');
  allValid &= validateUrl(env, 'NEXT_PUBLIC_SUPABASE_URL', 'Supabase project URL');
  allValid &= validateRequired(env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Supabase anonymous key');
  allValid &= validateRequired(env, 'SUPABASE_SERVICE_ROLE_KEY', 'Supabase service role key');
  
  // Validate Google OAuth
  log('\n🔐 Google OAuth Configuration:', 'blue');
  allValid &= validateRequired(env, 'GOOGLE_CLIENT_ID', 'Google OAuth client ID');
  allValid &= validateRequired(env, 'GOOGLE_CLIENT_SECRET', 'Google OAuth client secret');
  allValid &= validateUrl(env, 'GOOGLE_REDIRECT_URI', 'OAuth redirect URI');
  
  // Validate Encryption
  log('\n🔒 Encryption Configuration:', 'blue');
  allValid &= validateEncryptionKey(env);
  
  // Validate LLM
  log('\n🤖 LLM Configuration:', 'blue');
  allValid &= validateLLMConfig(env);
  
  // Validate Next.js
  log('\n⚡ Next.js Configuration:', 'blue');
  allValid &= validateUrl(env, 'NEXTAUTH_URL', 'Application URL');
  allValid &= validateRequired(env, 'NEXTAUTH_SECRET', 'NextAuth secret');
  
  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  if (allValid) {
    log('  ✅ All checks passed! Your environment is configured.', 'green');
    log('  You can now run: npm run dev', 'cyan');
  } else {
    log('  ❌ Some checks failed. Please fix the issues above.', 'red');
    log('  See .env.local.template for reference.', 'yellow');
  }
  log('='.repeat(60) + '\n', 'cyan');
  
  process.exit(allValid ? 0 : 1);
}

main();
