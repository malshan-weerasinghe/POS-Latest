const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');

let mainWindow;
let debugWindow;
let backendProcess;
let currentBackendPort = null;
let currentBackendUrl = null;
let isCreatingWindow = false;
let isCreatingDebugWindow = false;
let appReady = false;
let windowsCreated = false;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const showDebugConsole = !isDev; // Show debug console in production

// CRITICAL: Disable hardware acceleration to bypass GPU cache permission bug
// This prevents "Access is denied (0x5)" and "Gpu Cache Creation failed: -2" errors
app.disableHardwareAcceleration();
console.log('Hardware acceleration disabled to prevent GPU cache permission issues');

// CRITICAL: Single instance lock - prevents second instance from causing cache conflicts
// This is the primary cause of the 0x5 error when multiple instances try to move cache
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('Another instance is already running, quitting...');
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    console.log('Second instance attempted, focusing existing window');
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    if (debugWindow) {
      if (debugWindow.isMinimized()) debugWindow.restore();
      debugWindow.focus();
    }
  });
}

// Suppress cache errors (they're harmless warnings)
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// Get the source backend path from installation (read-only)
function getSourceBackendPath() {
  if (isDev) {
    return path.join(__dirname, '../backend');
  }
  
  // In production, backend is in extraResources (outside ASAR)
  const appPath = app.getAppPath();
  
  // Method 1: Use process.resourcesPath (most reliable for extraResources)
  if (process.resourcesPath) {
    const resourcesBackendPath = path.join(process.resourcesPath, 'backend');
    if (fs.existsSync(resourcesBackendPath)) {
      return resourcesBackendPath;
    }
    
    const unpackedBackendPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend');
    if (fs.existsSync(unpackedBackendPath)) {
      return unpackedBackendPath;
    }
  }
  
  // Method 2: Try using app.getAppPath() to find resources directory
  if (appPath.includes('.asar')) {
    const resourcesDir = path.dirname(appPath);
    const extraResourcesBackendPath = path.join(resourcesDir, 'backend');
    if (fs.existsSync(extraResourcesBackendPath)) {
      return extraResourcesBackendPath;
    }
    
    const unpackedPath = path.join(resourcesDir, 'app.asar.unpacked', 'backend');
    if (fs.existsSync(unpackedPath)) {
      return unpackedPath;
    }
  }
  
  // Fallback
  return path.join(path.dirname(appPath), 'backend');
}

// Copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (entry.name === 'node_modules' && fs.existsSync(destPath)) {
        // Don't overwrite existing node_modules, but check if it needs updating
        continue;
      }
      copyDirectory(srcPath, destPath);
    } else {
      // Skip certain files
      if (entry.name === '.git' || entry.name.startsWith('.git')) {
        continue;
      }
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (error) {
        debugLog(`Warning: Could not copy ${entry.name}: ${error.message}`, 'warn');
      }
    }
  }
}

// Get writable backend path (copies from installation to AppData on first run)
function getBackendPath() {
  if (isDev) {
    return path.join(__dirname, '../backend');
  }
  
  // In production, use writable location in AppData
  const userDataPath = app.getPath('userData');
  const writableBackendPath = path.join(userDataPath, 'backend');
  
  // Check if backend already exists in writable location
  // Check for either backend-worker.js or app.js as entry point
  if (fs.existsSync(writableBackendPath)) {
    const backendWorkerPath = path.join(writableBackendPath, 'src', 'backend-worker.js');
    const backendAppPath = path.join(writableBackendPath, 'src', 'app.js');
    if (fs.existsSync(backendWorkerPath) || fs.existsSync(backendAppPath)) {
      debugLog(`Using existing backend at writable path: ${writableBackendPath}`, 'success');
      return writableBackendPath;
    }
  }
  
  // Backend doesn't exist in writable location, copy it from installation
  debugLog('Backend not found in writable location, copying from installation...', 'info');
  const sourceBackendPath = getSourceBackendPath();
  
  if (!fs.existsSync(sourceBackendPath)) {
    debugLog(`Source backend not found at: ${sourceBackendPath}`, 'error');
    throw new Error(`Source backend not found at: ${sourceBackendPath}`);
  }
  
  try {
    debugLog(`Copying backend from: ${sourceBackendPath}`, 'info');
    debugLog(`Copying backend to: ${writableBackendPath}`, 'info');
    
    // Remove existing if it exists (in case of corruption)
    if (fs.existsSync(writableBackendPath)) {
      debugLog('Removing existing backend in writable location...', 'info');
      fs.rmSync(writableBackendPath, { recursive: true, force: true });
    }
    
    // Copy backend to writable location
    copyDirectory(sourceBackendPath, writableBackendPath);
    
    debugLog(`Backend copied successfully to: ${writableBackendPath}`, 'success');
    
    // Verify copy was successful - check for backend-worker.js or app.js
    const backendWorkerPath = path.join(writableBackendPath, 'src', 'backend-worker.js');
    const backendAppPath = path.join(writableBackendPath, 'src', 'app.js');
    
    if (!fs.existsSync(backendWorkerPath) && !fs.existsSync(backendAppPath)) {
      // List what files actually exist in src for debugging
      const srcPath = path.join(writableBackendPath, 'src');
      if (fs.existsSync(srcPath)) {
        const srcFiles = fs.readdirSync(srcPath);
        throw new Error(`Backend copy failed: No entry point found. Files in src: ${srcFiles.join(', ')}`);
      } else {
        throw new Error(`Backend copy failed: src directory not found at ${srcPath}`);
      }
    }
    
    const nodeModulesPath = path.join(writableBackendPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      throw new Error(`Backend copy failed: node_modules not found at ${nodeModulesPath}`);
    }
    
    debugLog('Backend copy verified successfully', 'success');
    return writableBackendPath;
    
  } catch (error) {
    debugLog(`Failed to copy backend: ${error.message}`, 'error');
    debugLog(`Error stack: ${error.stack}`, 'error');
    throw new Error(`Failed to copy backend to writable location: ${error.message}`);
  }
}

function getDatabasePath() {
  if (isDev) {
    return path.join(__dirname, '../backend/database');
  }
  
  // In production, use app userData directory (writable location)
  const userDataPath = app.getPath('userData');
  const dbDir = path.join(userDataPath, 'database');
  
  // Create database directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    
    // Copy initial database if it exists in backend directory
    const backendDbPath = path.join(getBackendPath(), 'database/pos.db');
    if (fs.existsSync(backendDbPath)) {
      try {
        fs.copyFileSync(backendDbPath, path.join(dbDir, 'pos.db'));
        debugLog('Initial database copied to user data directory', 'success');
      } catch (error) {
        debugLog(`Failed to copy initial database: ${error.message}`, 'error');
      }
    }
  }
  
  return dbDir;
}

// Verify backend health by making a test request
function verifyBackendHealth(backendUrl, maxRetries = 10, retryDelay = 500) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    let retries = 0;
    
    const tryHealthCheck = () => {
      const url = new URL(`${backendUrl}/health`);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        timeout: 2000
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            debugLog('Backend health check successful', 'success');
            resolve(true);
          } else {
            if (retries < maxRetries) {
              retries++;
              debugLog(`Backend health check failed (status ${res.statusCode}), retrying... (${retries}/${maxRetries})`, 'warn');
              setTimeout(tryHealthCheck, retryDelay);
            } else {
              reject(new Error(`Backend health check failed after ${maxRetries} retries`));
            }
          }
        });
      });
      
      req.on('error', (error) => {
        if (retries < maxRetries) {
          retries++;
          debugLog(`Backend health check error: ${error.message}, retrying... (${retries}/${maxRetries})`, 'warn');
          setTimeout(tryHealthCheck, retryDelay);
        } else {
          reject(new Error(`Backend health check failed: ${error.message}`));
        }
      });
      
      req.on('timeout', () => {
        req.destroy();
        if (retries < maxRetries) {
          retries++;
          debugLog(`Backend health check timeout, retrying... (${retries}/${maxRetries})`, 'warn');
          setTimeout(tryHealthCheck, retryDelay);
        } else {
          reject(new Error('Backend health check timeout'));
        }
      });
      
      req.end();
    };
    
    // Start health check after a short delay to allow server to fully initialize
    setTimeout(tryHealthCheck, 1000);
  });
}

// Find an available port dynamically
function findAvailablePort(startPort = 5000, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;
    
    const tryPort = (port) => {
      if (attempts >= maxAttempts) {
        reject(new Error('Could not find an available port'));
        return;
      }
      
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => {
          resolve(port);
        });
        server.close();
      });
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });
    };
    
    tryPort(currentPort);
  });
}

// Start backend server with dynamic port
function startBackendServer() {
  return new Promise(async (resolve, reject) => {
    try {
      // Find an available port
      const port = await findAvailablePort(5000, 20);
      currentBackendPort = port;
      currentBackendUrl = `http://localhost:${port}`;
      
      debugLog(`Starting backend server on port ${port}...`, 'info');
      
      const backendPath = getBackendPath();
      
      // Try backend-worker.js first, fallback to app.js if not found
      const backendWorkerPath = path.join(backendPath, 'src', 'backend-worker.js');
      const backendAppJsPath = path.join(backendPath, 'src', 'app.js');
      
      let backendAppPath;
      if (fs.existsSync(backendWorkerPath)) {
        backendAppPath = backendWorkerPath;
        debugLog('Using backend-worker.js as entry point', 'info');
      } else if (fs.existsSync(backendAppJsPath)) {
        backendAppPath = backendAppJsPath;
        debugLog('Using app.js as entry point (backend-worker.js not found)', 'warn');
      } else {
        // Neither file exists - provide detailed error
        const errorMsg = `Backend entry point not found. Expected backend-worker.js or app.js`;
        debugLog(errorMsg, 'error');
        debugLog(`Backend path: ${backendPath}`, 'error');
        
        // List files in backend root
        if (fs.existsSync(backendPath)) {
          const backendFiles = fs.readdirSync(backendPath);
          debugLog(`Files in backend root: ${backendFiles.join(', ')}`, 'error');
          
          // List files in src directory if it exists
          const srcPath = path.join(backendPath, 'src');
          if (fs.existsSync(srcPath)) {
            const srcFiles = fs.readdirSync(srcPath);
            debugLog(`Files in backend/src: ${srcFiles.join(', ')}`, 'error');
          } else {
            debugLog(`Backend/src directory does not exist!`, 'error');
          }
        } else {
          debugLog(`Backend path does not exist: ${backendPath}`, 'error');
        }
        
        reject(new Error('Backend entry point not found'));
        return;
      }
      
      debugLog(`Backend path: ${backendPath}`, 'info');
      debugLog(`Backend app path: ${backendAppPath}`, 'info');
      
      // Verify backend package.json exists (needed for module resolution)
      const backendPackageJson = path.join(backendPath, 'package.json');
      if (!fs.existsSync(backendPackageJson)) {
        const errorMsg = `Backend package.json not found at: ${backendPackageJson}`;
        debugLog(errorMsg, 'error');
        reject(new Error(errorMsg));
        return;
      }
      
      // Verify node_modules exists
      const nodeModulesPath = path.join(backendPath, 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        const errorMsg = `Backend node_modules not found at: ${nodeModulesPath}`;
        debugLog(errorMsg, 'error');
        debugLog(`Backend path: ${backendPath}`, 'error');
        reject(new Error(errorMsg));
        return;
      }
      
      // Verify key dependencies exist
      const keyDeps = ['express', 'sqlite3'];
      const missingDeps = [];
      for (const dep of keyDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
          missingDeps.push(dep);
        }
      }
      if (missingDeps.length > 0) {
        const errorMsg = `Missing backend dependencies: ${missingDeps.join(', ')}`;
        debugLog(errorMsg, 'error');
        debugLog(`Backend node_modules path: ${nodeModulesPath}`, 'error');
        reject(new Error(errorMsg));
        return;
      }
      
      // Set environment variables
      const env = {
        ...process.env,
        PORT: port.toString(),
        NODE_ENV: isDev ? 'development' : 'production',
        DB_PATH: getDatabasePath(),
        ELECTRON_MODE: 'true', // Flag to indicate running in Electron
        // Ensure backend can find its node_modules
        NODE_PATH: nodeModulesPath,
        // Add node_modules to PATH for native modules
        PATH: `${nodeModulesPath}${path.delimiter}${process.env.PATH || ''}`
      };
      
      debugLog('Backend environment:', 'info');
      debugLog(`  Backend Path: ${backendPath}`, 'info');
      debugLog(`  Backend App: ${backendAppPath}`, 'info');
      debugLog(`  Node Modules: ${nodeModulesPath}`, 'info');
      debugLog(`  Node Modules Exists: ${fs.existsSync(nodeModulesPath)}`, 'info');
      debugLog(`  DB Path: ${env.DB_PATH}`, 'info');
      debugLog(`  Port: ${env.PORT}`, 'info');
      debugLog(`  Node Executable: ${process.execPath}`, 'info');
      
      // Use Electron's Node.js runtime but run as Node.js (not Electron GUI)
      // ELECTRON_RUN_AS_NODE tells Electron to run as Node.js without initializing GUI
      const electronPath = process.execPath;
      // Pass the script path - Electron will run it as Node.js when ELECTRON_RUN_AS_NODE is set
      const nodeArgs = [backendAppPath];
      
      // CRITICAL: Set ELECTRON_RUN_AS_NODE to prevent Electron GUI initialization
      // This prevents the "Another instance is already running" error
      env.ELECTRON_RUN_AS_NODE = '1';
      
      debugLog(`Spawning backend with: ${electronPath} ${nodeArgs.join(' ')}`, 'info');
      debugLog(`Backend will run with IS_BACKEND=${env.IS_BACKEND}`, 'info');
      debugLog(`Backend will run with ELECTRON_RUN_AS_NODE=${env.ELECTRON_RUN_AS_NODE}`, 'info');
      
      backendProcess = spawn(electronPath, nodeArgs, {
        cwd: backendPath,
        env: env,
        stdio: ['ignore', 'pipe', 'pipe'], // stdin, stdout, stderr
        shell: false,
        windowsHide: true
      });
      
      debugLog(`Backend process spawned with PID: ${backendProcess.pid}`, 'info');
      
      let serverStarted = false;
      let outputBuffer = '';
      let errorBuffer = '';
      
      // Handle stdout
      backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        outputBuffer += output;
        
        // Filter out cache errors (they're harmless Chromium warnings)
        const filteredOutput = output.trim();
        if (filteredOutput && 
            !filteredOutput.includes('Unable to move the cache') &&
            !filteredOutput.includes('Unable to create cache') &&
            !filteredOutput.includes('Gpu Cache Creation failed') &&
            !filteredOutput.includes('ERROR:cache_util_win.cc') &&
            !filteredOutput.includes('ERROR:disk_cache.cc') &&
            !filteredOutput.includes('ERROR:gpu_disk_cache.cc')) {
          debugLog(`Backend: ${filteredOutput}`, 'info');
        }
        
        // Check if server started successfully (handle emoji in message)
        // Look for the server startup message which indicates the server is listening
        if (!serverStarted && (
            output.includes('POS API Server running') || 
            output.includes('🚀 POS API Server running') ||
            output.includes('Server running on port') ||
            output.includes('listening on port') ||
            output.includes('Health check:') ||
            output.includes('/health')
        )) {
          serverStarted = true;
          debugLog(`✅ Backend server confirmed listening on port ${port}`, 'success');
          // Resolve immediately when server confirms it's listening
          resolve({ port, url: currentBackendUrl });
        }
        
        // Also check for database connection success
        if (output.includes('Database connected successfully')) {
          debugLog('Database connected successfully', 'success');
        }
        
        // Check for database errors
        if (output.includes('Database connection error') || output.includes('Failed to start server')) {
          debugLog(`Backend error detected: ${output.trim()}`, 'error');
        }
      });
      
      // Handle stderr - capture all errors (but filter cache warnings)
      backendProcess.stderr.on('data', (data) => {
        const error = data.toString();
        errorBuffer += error;
        
        // Filter out cache errors (they're harmless Chromium warnings)
        const filteredError = error.trim();
        if (filteredError && 
            !filteredError.includes('Unable to move the cache') &&
            !filteredError.includes('Unable to create cache') &&
            !filteredError.includes('Gpu Cache Creation failed') &&
            !filteredError.includes('ERROR:cache_util_win.cc') &&
            !filteredError.includes('ERROR:disk_cache.cc') &&
            !filteredError.includes('ERROR:gpu_disk_cache.cc')) {
          debugLog(`Backend Error: ${filteredError}`, 'error');
        }
      });
      
      // Handle process errors
      backendProcess.on('error', (error) => {
        debugLog(`Failed to start backend: ${error.message}`, 'error');
        const errorMsg = `Failed to start backend process: ${error.message}`;
        debugLog(`Backend Path: ${backendPath}`, 'error');
        debugLog(`Backend App Path: ${backendAppPath}`, 'error');
        debugLog(`Node Modules: ${path.join(backendPath, 'node_modules')}`, 'error');
        debugLog(`Node Modules Exists: ${fs.existsSync(path.join(backendPath, 'node_modules'))}`, 'error');
        reject(new Error(errorMsg));
      });
      
      // Handle process exit - capture error details
      backendProcess.on('exit', (code, signal) => {
        debugLog(`Backend process exited with code ${code}, signal ${signal}`, code !== 0 ? 'error' : 'warn');
        
        // If process exited and server didn't start, it's an error
        if (!serverStarted) {
          debugLog('Backend server exited before starting', 'error');
          debugLog(`Error output: ${errorBuffer || 'No error output'}`, 'error');
          debugLog(`Standard output: ${outputBuffer || 'No standard output'}`, 'error');
          
          // Create detailed error message
          let errorMessage = `Backend process exited with code ${code} before server started`;
          if (errorBuffer) {
            errorMessage += `\n\nError details:\n${errorBuffer}`;
          }
          if (outputBuffer) {
            errorMessage += `\n\nOutput:\n${outputBuffer}`;
          }
          
          // Check for common issues
          if (outputBuffer.includes('Database connection error')) {
            errorMessage += '\n\n⚠️ Database connection failed. Check database path and permissions.';
          }
          if (outputBuffer.includes('EADDRINUSE')) {
            errorMessage += '\n\n⚠️ Port is already in use.';
          }
          
          reject(new Error(errorMessage));
        } else if (code !== 0) {
          // Server started but then crashed
          debugLog('Backend server crashed after starting', 'error');
          debugLog(`Error output: ${errorBuffer || 'No error output'}`, 'error');
        }
      });
      
      // Note: spawn doesn't support IPC messages like fork does
      // The backend will communicate via stdout/stderr instead
      
      // Timeout after 15 seconds
      setTimeout(() => {
        if (!serverStarted) {
          if (backendProcess && !backendProcess.killed) {
            // Process is running but we didn't see the startup message
            // Assume it started (might be a timing issue)
            debugLog('⚠️ Backend process is running but startup message not detected', 'warn');
            resolve({ port, url: currentBackendUrl });
          } else {
            debugLog('Backend server failed to start within timeout', 'error');
            reject(new Error('Backend server failed to start within timeout'));
          }
        }
      }, 15000);
      
    } catch (error) {
      console.error('Error starting backend server:', error);
      reject(error);
    }
  });
}

// Stop backend server
function stopBackendServer() {
  if (backendProcess) {
    try {
      backendProcess.kill('SIGTERM');
      // Force kill after 3 seconds if still running
      setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          backendProcess.kill('SIGKILL');
        }
      }, 3000);
    } catch (error) {
      console.error('Error stopping backend:', error);
    }
    backendProcess = null;
    currentBackendPort = null;
    currentBackendUrl = null;
  }
}

// Create debug console window for real-time logging
function createDebugWindow() {
  // Prevent multiple debug windows
  if (!showDebugConsole || debugWindow || isCreatingDebugWindow) {
    if (debugWindow && !debugWindow.isDestroyed()) {
      debugWindow.focus();
    }
    return;
  }

  isCreatingDebugWindow = true;

  debugWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'POS Looper7 - Debug Console',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: true,
    alwaysOnTop: true,
    skipTaskbar: false
  });

  // Create HTML content for debug console
  const debugHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Debug Console</title>
  <style>
    body {
      margin: 0;
      padding: 10px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 12px;
      background: #1e1e1e;
      color: #d4d4d4;
      overflow: auto;
    }
    #log {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.4;
    }
    .log-entry {
      margin: 2px 0;
      padding: 2px 0;
    }
    .log-info { color: #d4d4d4; }
    .log-error { color: #f48771; }
    .log-success { color: #89d185; }
    .log-warn { color: #cca700; }
    .timestamp {
      color: #858585;
      margin-right: 8px;
    }
    .clear-btn {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      background: #007acc;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 3px;
    }
    .clear-btn:hover {
      background: #005a9e;
    }
  </style>
</head>
<body>
  <button class="clear-btn" onclick="clearLog()">Clear Log</button>
  <div id="log"></div>
  <script>
    const { ipcRenderer } = require('electron');
    const logDiv = document.getElementById('log');
    
    function addLog(message, type = 'info') {
      const entry = document.createElement('div');
      entry.className = 'log-entry log-' + type;
      const timestamp = new Date().toLocaleTimeString();
      entry.innerHTML = '<span class="timestamp">[' + timestamp + ']</span>' + escapeHtml(message);
      logDiv.appendChild(entry);
      logDiv.scrollTop = logDiv.scrollHeight;
    }
    
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    function clearLog() {
      logDiv.innerHTML = '';
    }
    
    // Listen for log messages from main process
    ipcRenderer.on('debug-log', (event, data) => {
      addLog(data.message, data.type || 'info');
    });
    
    // Initial message
    addLog('Debug Console Started', 'success');
    addLog('Waiting for application logs...', 'info');
  </script>
</body>
</html>
  `;

  debugWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(debugHTML));

  debugWindow.on('closed', () => {
    debugWindow = null;
    isCreatingDebugWindow = false;
  });

  debugWindow.once('ready-to-show', () => {
    isCreatingDebugWindow = false;
  });

  // Prevent window from being recreated
  debugWindow.on('close', (event) => {
    // Don't prevent close, just clean up
    isCreatingDebugWindow = false;
  });
}

// Send log to debug window
function debugLog(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  // Also log to console
  if (type === 'error') {
    console.error(logMessage);
  } else if (type === 'warn') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
  
  // Send to debug window if it exists
  if (debugWindow && !debugWindow.isDestroyed()) {
    debugWindow.webContents.send('debug-log', { message, type });
  }
}

// Create main window
function createWindow() {
  // Prevent multiple window creation - check if window exists and is not destroyed
  if (mainWindow && !mainWindow.isDestroyed()) {
    debugLog('Window creation prevented - window already exists', 'warn');
    mainWindow.focus();
    return;
  }

  if (isCreatingWindow) {
    debugLog('Window creation prevented - window is being created', 'warn');
    return;
  }

  // Reset mainWindow if it was destroyed
  if (mainWindow && mainWindow.isDestroyed()) {
    mainWindow = null;
  }

  isCreatingWindow = true;
  debugLog('Creating main window...', 'info');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, '../looper7_logo.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, // Disable sandbox to allow proper module resolution
      // Partition for userData - ensures proper cache handling
      partition: 'persist:main'
    },
    show: false, // Don't show until ready
    titleBarStyle: 'default',
    backgroundColor: '#ffffff'
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    debugLog('Loading from Vite dev server: http://localhost:5173', 'info');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    const indexPath = path.join(__dirname, '../dist/index.html');
    debugLog(`Loading from: ${indexPath}`, 'info');
    mainWindow.loadFile(indexPath).catch(err => {
      debugLog(`Failed to load index.html: ${err.message}`, 'error');
    });
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    debugLog('Main window ready to show', 'success');
    mainWindow.show();
    mainWindow.focus();
    isCreatingWindow = false;
  });

  mainWindow.on('closed', () => {
    debugLog('Main window closed', 'info');
    mainWindow = null;
    isCreatingWindow = false;
    windowsCreated = false;
  });

  // Prevent accidental recreation
  mainWindow.on('close', (event) => {
    // Allow normal close
    isCreatingWindow = false;
  });

  // Handle window errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    debugLog(`Failed to load: ${errorCode} - ${errorDescription}`, 'error');
    if (!isDev) {
      const indexPath = path.join(__dirname, '../dist/index.html');
      debugLog(`Retrying load from: ${indexPath}`, 'warn');
      mainWindow.loadFile(indexPath).catch(err => {
        debugLog(`Retry failed: ${err.message}`, 'error');
      });
    }
  });
}

// App event handlers
app.whenReady().then(async () => {
  // Prevent multiple calls to whenReady
  if (appReady) {
    debugLog('App already ready, skipping initialization', 'warn');
    return;
  }

  appReady = true;
  windowsCreated = true;
  debugLog('Application ready', 'success');
  
  // Create debug console first (only once)
  if (showDebugConsole && !debugWindow) {
    createDebugWindow();
  }
  
  try {
    debugLog('Starting backend server...', 'info');
    
    // CRITICAL: Wait for backend to fully start and confirm it's listening
    // This ensures the handshake completes before loading the frontend
    const serverInfo = await startBackendServer();
    debugLog(`Backend server confirmed listening on ${serverInfo.url}`, 'success');
    
    // Additional verification: Test if backend is actually responding
    debugLog('Verifying backend is responding...', 'info');
    try {
      await verifyBackendHealth(serverInfo.url);
      debugLog('Backend health check passed', 'success');
    } catch (healthError) {
      debugLog(`Backend health check failed: ${healthError.message}`, 'warn');
      debugLog('Continuing anyway - backend may still be starting...', 'warn');
    }
    
    // Only create window AFTER backend is confirmed ready
    debugLog('Backend ready, creating main window...', 'info');
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
    }
    
    // Send backend URL to renderer once window is ready
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.once('did-finish-load', () => {
        debugLog('Main window loaded, sending backend URL to renderer', 'info');
        mainWindow.webContents.send('backend-url-ready', currentBackendUrl);
      });
    }
    
    // Handle activate event (macOS dock click, Windows taskbar)
    app.on('activate', () => {
      debugLog('App activated', 'info');
      // Only create window if none exist, we're not creating one, and mainWindow is null or destroyed
      const hasValidMainWindow = mainWindow && !mainWindow.isDestroyed();
      
      if (!hasValidMainWindow && !isCreatingWindow && BrowserWindow.getAllWindows().length === 0) {
        debugLog('No windows found, creating new window', 'info');
        createWindow();
      } else if (hasValidMainWindow) {
        debugLog('Focusing existing window', 'info');
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      } else {
        debugLog('Window creation skipped - already in progress or windows exist', 'warn');
      }
    });
  } catch (error) {
    debugLog(`Failed to start application: ${error.message}`, 'error');
    if (error.stack) {
      debugLog(`Stack trace: ${error.stack}`, 'error');
    }
    
    // Show error dialog to user with full details
    const { dialog } = require('electron');
    const errorMessage = error.message || 'Unknown error';
    const fullError = `Failed to start backend server:\n\n${errorMessage}\n\nPlease check the debug console for more details.`;
    dialog.showErrorBox('Startup Error', fullError);
    
    // Also log to a file for debugging
    try {
      const logPath = path.join(app.getPath('userData'), 'startup-error.log');
      fs.writeFileSync(logPath, `Error at ${new Date().toISOString()}\n\n${errorMessage}\n\nStack:\n${error.stack || 'No stack trace'}`);
      debugLog(`Error log saved to: ${logPath}`, 'info');
    } catch (logError) {
      debugLog(`Failed to write error log: ${logError.message}`, 'error');
    }
    
    // Don't quit immediately - keep debug console open
    if (!showDebugConsole) {
      app.quit();
    }
  }
});

app.on('window-all-closed', () => {
  debugLog('All windows closed', 'info');
  // Stop backend server before quitting
  stopBackendServer();
  // On macOS, keep app running even when all windows are closed
  // On Windows/Linux, quit the app
  if (process.platform !== 'darwin') {
    // Close debug window too
    if (debugWindow && !debugWindow.isDestroyed()) {
      debugWindow.close();
    }
    // Wait a moment for backend to shutdown gracefully
    setTimeout(() => {
      app.quit();
    }, 500);
  }
});

app.on('before-quit', () => {
  stopBackendServer();
});

app.on('will-quit', () => {
  stopBackendServer();
});

// IPC handlers
ipcMain.handle('get-backend-url', () => {
  // Return current backend URL (dynamic port)
  return currentBackendUrl || 'http://localhost:5000';
});

ipcMain.handle('get-database-path', () => {
  return getDatabasePath();
});

// Handle backend port request (for frontend initialization)
ipcMain.handle('get-backend-port', () => {
  return currentBackendPort || 5000;
});

