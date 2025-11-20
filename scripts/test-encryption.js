/**
 * Test script for encryption utilities
 * Run with: node scripts/test-encryption.js
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

function generateEncryptionKey() {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

function encrypt(text, keyHex) {
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(encryptedText, keyHex) {
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const [ivHex, authTagHex, encryptedData] = parts;
  
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Main test
console.log('🔐 AURA Encryption Test\n');

// Generate a new key
console.log('1. Generating encryption key...');
const key = generateEncryptionKey();
console.log(`   ✓ Generated key: ${key}`);
console.log(`   ✓ Key length: ${key.length} characters (${key.length / 2} bytes)\n`);

// Test encryption
console.log('2. Testing encryption...');
const testData = 'ya29.a0AfH6SMBxxx_test_access_token_xxx';
console.log(`   Original: ${testData}`);

const encrypted = encrypt(testData, key);
console.log(`   Encrypted: ${encrypted.substring(0, 50)}...`);
console.log(`   ✓ Encryption successful\n`);

// Test decryption
console.log('3. Testing decryption...');
const decrypted = decrypt(encrypted, key);
console.log(`   Decrypted: ${decrypted}`);

if (decrypted === testData) {
  console.log('   ✓ Decryption successful\n');
} else {
  console.log('   ✗ Decryption failed - data mismatch\n');
  process.exit(1);
}

// Test with multiple values
console.log('4. Testing with multiple tokens...');
const tokens = [
  'access_token_1',
  'refresh_token_2',
  'very_long_token_with_special_chars_!@#$%^&*()',
];

let allPassed = true;
tokens.forEach((token, i) => {
  const enc = encrypt(token, key);
  const dec = decrypt(enc, key);
  const passed = dec === token;
  console.log(`   Token ${i + 1}: ${passed ? '✓' : '✗'}`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log('   ✓ All tokens encrypted/decrypted successfully\n');
} else {
  console.log('   ✗ Some tokens failed\n');
  process.exit(1);
}

// Test error handling
console.log('5. Testing error handling...');
try {
  decrypt('invalid:format', key);
  console.log('   ✗ Should have thrown error for invalid format\n');
  process.exit(1);
} catch (error) {
  console.log('   ✓ Correctly handles invalid format\n');
}

// Summary
console.log('═══════════════════════════════════════════════════');
console.log('✅ All tests passed!');
console.log('═══════════════════════════════════════════════════\n');

console.log('📋 Setup Instructions:');
console.log('1. Copy the generated key above');
console.log('2. Add to your .env.local file:');
console.log(`   ENCRYPTION_KEY=${key}`);
console.log('3. Restart your development server\n');
