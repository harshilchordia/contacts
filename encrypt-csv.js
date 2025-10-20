#!/usr/bin/env node

/**
 * CSV Encryption Script
 * 
 * This script encrypts your contacts.csv file so it can be safely committed to a public repository.
 * 
 * Usage:
 *   node encrypt-csv.js
 * 
 * It will prompt you for a password and create contacts.csv.enc
 */

const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');

const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// Create readline interface for password input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

function encryptFile(inputFile, outputFile, password) {
    try {
        // Read the CSV file
        const data = fs.readFileSync(inputFile, 'utf8');
        
        // Generate salt and IV
        const salt = crypto.randomBytes(SALT_LENGTH);
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // Derive encryption key from password
        const key = deriveKey(password, salt);
        
        // Create cipher
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        // Encrypt the data
        let encrypted = cipher.update(data, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        // Get auth tag
        const authTag = cipher.getAuthTag();
        
        // Combine salt + iv + authTag + encrypted data
        const combined = Buffer.concat([
            salt,
            iv,
            authTag,
            encrypted
        ]);
        
        // Write encrypted file
        fs.writeFileSync(outputFile, combined);
        
        console.log('✅ Encryption successful!');
        console.log(`📁 Input:  ${inputFile}`);
        console.log(`📁 Output: ${outputFile}`);
        console.log(`🔐 File size: ${(combined.length / 1024).toFixed(2)} KB`);
        console.log('\n⚠️  IMPORTANT:');
        console.log('   1. Add "contacts.csv" to your .gitignore');
        console.log('   2. Only commit "contacts.csv.enc" to git');
        console.log('   3. Use the same password in your browser to decrypt');
        
        return true;
    } catch (error) {
        console.error('❌ Encryption failed:', error.message);
        return false;
    }
}

async function main() {
    console.log('🔐 CSV File Encryption Tool\n');
    
    const inputFile = 'contacts.csv';
    const outputFile = 'contacts.csv.enc';
    
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ Error: ${inputFile} not found!`);
        console.error('   Make sure contacts.csv is in the current directory.');
        rl.close();
        process.exit(1);
    }
    
    // Get file size
    const stats = fs.statSync(inputFile);
    console.log(`📄 Found: ${inputFile} (${(stats.size / 1024).toFixed(2)} KB)\n`);
    
    // Prompt for password
    const password = await question('Enter encryption password: ');
    
    if (!password || password.length < 8) {
        console.error('\n❌ Password must be at least 8 characters long!');
        rl.close();
        process.exit(1);
    }
    
    // Confirm password
    const confirmPassword = await question('Confirm password: ');
    
    if (password !== confirmPassword) {
        console.error('\n❌ Passwords do not match!');
        rl.close();
        process.exit(1);
    }
    
    console.log('\n🔄 Encrypting...\n');
    
    // Encrypt the file
    const success = encryptFile(inputFile, outputFile, password);
    
    rl.close();
    process.exit(success ? 0 : 1);
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n❌ Encryption cancelled');
    rl.close();
    process.exit(1);
});

main();
