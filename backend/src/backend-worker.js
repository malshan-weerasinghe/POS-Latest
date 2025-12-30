// Backend worker entry point - runs without Electron GUI initialization
// This file is executed when IS_BACKEND=true is set

// CRITICAL: Check if this is a backend worker process
const IS_BACKEND_WORKER = process.env.IS_BACKEND === 'true' || process.env.ELECTRON_MODE === 'true';

if (!IS_BACKEND_WORKER) {
  console.error('ERROR: This script should only be run as a backend worker');
  console.error('Set IS_BACKEND=true environment variable');
  process.exit(1);
}

console.log('[BACKEND WORKER] Starting backend worker process');
console.log('[BACKEND WORKER] Process PID:', process.pid);
console.log('[BACKEND WORKER] __dirname:', __dirname);
console.log('[BACKEND WORKER] __filename:', __filename);

// Set up error handlers FIRST, before any other code
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
  console.error('[UNHANDLED REJECTION] Stack:', reason?.stack || 'No stack trace');
  // Don't exit - log and continue
});

process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT EXCEPTION]', error);
  console.error('[UNCAUGHT EXCEPTION] Stack:', error.stack);
  // Only exit for critical errors
  if (error.code === 'EADDRINUSE' || error.message.includes('port')) {
    console.error('Port error detected, will attempt to find another port');
  } else {
    console.error('Critical error, exiting...');
    process.exit(1);
  }
});

// CRITICAL: Keep process alive IMMEDIATELY - before any async operations
console.log('[BACKEND WORKER] Setting up keep-alive mechanism...');
const keepAliveInterval = setInterval(() => {
  // This interval keeps the event loop alive
}, 5000);
process._keepAliveInterval = keepAliveInterval;
console.log('[BACKEND WORKER] Keep-alive interval set, process should stay alive');

// Now load and run the actual backend app
console.log('[BACKEND WORKER] Loading backend application...');
require('./app.js');


