#!/usr/bin/env node

/**
 * Setup script to verify build prerequisites
 * Run: node setup-build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking build prerequisites...\n');

let errors = [];

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    errors.push(`Node.js version ${nodeVersion} is too old. Please install Node.js 18 or higher.`);
  } else {
    console.log(`✅ Node.js version: ${nodeVersion}`);
  }
} catch (error) {
  errors.push('Could not check Node.js version');
}

// Check if frontend dependencies are installed
const frontendNodeModules = path.join(__dirname, 'node_modules');
if (!fs.existsSync(frontendNodeModules)) {
  console.log('⚠️  Frontend dependencies not installed. Run: npm install');
} else {
  console.log('✅ Frontend dependencies installed');
}

// Check if backend dependencies are installed
const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
if (!fs.existsSync(backendNodeModules)) {
  console.log('⚠️  Backend dependencies not installed. Run: cd backend && npm install');
} else {
  console.log('✅ Backend dependencies installed');
}

// Check if icon exists
const iconPath = path.join(__dirname, 'looper7_logo.ico');
if (!fs.existsSync(iconPath)) {
  errors.push('Icon file not found: looper7_logo.ico');
} else {
  console.log('✅ Icon file found');
}

// Check if Electron is installed
try {
  const electronPath = path.join(__dirname, 'node_modules', 'electron');
  if (!fs.existsSync(electronPath)) {
    console.log('⚠️  Electron not installed. It will be installed during build.');
  } else {
    console.log('✅ Electron installed');
  }
} catch (error) {
  console.log('⚠️  Could not check Electron installation');
}

console.log('\n📦 Build Commands:');
console.log('   1. npm install                    - Install frontend dependencies');
console.log('   2. cd backend && npm install       - Install backend dependencies');
console.log('   3. npm run build                   - Build frontend');
console.log('   4. npm run dist                    - Build Windows installer\n');

if (errors.length > 0) {
  console.log('❌ Errors found:');
  errors.forEach(error => console.log(`   - ${error}`));
  process.exit(1);
} else {
  console.log('✅ All prerequisites met! You can proceed with building.');
  console.log('   Run: npm run dist\n');
}

