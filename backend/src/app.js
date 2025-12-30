// CRITICAL: Check if this is a backend worker process
// If IS_BACKEND is set, skip all Electron GUI initialization
const IS_BACKEND_WORKER = process.env.IS_BACKEND === 'true' || process.env.ELECTRON_MODE === 'true';

if (IS_BACKEND_WORKER) {
  // This is a backend worker - skip Electron GUI initialization
  console.log('[BACKEND WORKER] Running as backend worker process');
  console.log('[BACKEND WORKER] Process PID:', process.pid);
  console.log('[BACKEND WORKER] __dirname:', __dirname);
  console.log('[BACKEND WORKER] __filename:', __filename);
  
  // Don't initialize Electron app for backend worker
  // We'll handle the server startup directly below
} else {
  // This would be a GUI instance (shouldn't happen, but handle gracefully)
  console.log('[BACKEND START] Backend script started (GUI mode - unexpected)');
  console.log('[BACKEND START] Process PID:', process.pid);
}

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

console.log('[BACKEND START] Loading dependencies...');
const express = require('express');
console.log('[BACKEND START] express loaded');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

console.log('[BACKEND START] Loading database module...');
const database = require('./models/database');
console.log('[BACKEND START] database loaded');
console.log('[BACKEND START] Loading routes...');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');
const categoryRoutes = require('./routes/categories');
const salesRoutes = require('./routes/sales');
console.log('[BACKEND START] All routes loaded');

console.log('[BACKEND START] Creating Express app...');
const app = express();
const PORT = process.env.PORT || 5000;
console.log('[BACKEND START] Express app created, PORT:', PORT);

// Support dynamic port finding if PORT is not explicitly set
let serverPort = PORT;
console.log('[BACKEND START] Initial serverPort:', serverPort);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // Default: 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // Default: 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
// Allow requests from Vite dev server, Electron, and localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'file://', // Electron file protocol
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Electron, or curl requests)
    if (!origin || origin.startsWith('file://')) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in desktop app for simplicity
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'POS API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sales', salesRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'POS API Server',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
        users: 'GET /api/auth/users (Admin)',
        createUser: 'POST /api/auth/users (Admin)',
        updatePin: 'PUT /api/auth/users/:id/pin',
        deactivateUser: 'PUT /api/auth/users/:id/deactivate (Admin)',
        activateUser: 'PUT /api/auth/users/:id/activate (Admin)'
      },
      products: {
        list: 'GET /api/products',
        search: 'GET /api/products/search/:query',
        get: 'GET /api/products/:id',
        create: 'POST /api/products (Admin)',
        update: 'PUT /api/products/:id (Admin)',
        updateStock: 'PATCH /api/products/:id/stock (Admin)',
        delete: 'DELETE /api/products/:id (Admin)',
        categories: 'GET /api/products/meta/categories'
      },
      customers: {
        list: 'GET /api/customers',
        search: 'GET /api/customers/search/:query',
        get: 'GET /api/customers/:id',
        getByPhone: 'GET /api/customers/phone/:phone',
        create: 'POST /api/customers',
        update: 'PUT /api/customers/:id',
        delete: 'DELETE /api/customers/:id',
        purchases: 'GET /api/customers/:id/purchases'
      },
      sales: {
        list: 'GET /api/sales',
        get: 'GET /api/sales/:id',
        create: 'POST /api/sales',
        dashboard: 'GET /api/sales/dashboard/summary',
        reports: 'GET /api/sales/reports/by-date'
      }
    },
    documentation: 'All endpoints except /health and /api require Authorization: Bearer <token>'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Find available port if current port is in use
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Try next port
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Initialize database tables
const initializeDatabase = async (db) => {
  return new Promise((resolve, reject) => {
    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'cashier')),
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      // Products table
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        barcode TEXT,
        category TEXT,
        warranty_months INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      // Product Suppliers junction table
      `CREATE TABLE IF NOT EXISTS product_suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        supplier_id INTEGER NOT NULL,
        cost_price REAL NOT NULL,
        sale_price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        reorder_level INTEGER DEFAULT 5,
        is_primary INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        UNIQUE(product_id, supplier_id)
      )`,
      // Customers table
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        address TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      // Suppliers table
      `CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      // Sales table
      `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        total_amount REAL NOT NULL,
        discount REAL DEFAULT 0,
        final_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'completed',
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )`,
      // Sale Items table
      `CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        supplier_id INTEGER,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )`
    ];

    db.serialize(() => {
      let completed = 0;
      let hasError = false;

      queries.forEach((query, index) => {
        db.run(query, (err) => {
          completed++;
          if (err) {
            console.error(`Error creating table ${index + 1}:`, err.message);
            if (!hasError) {
              hasError = true;
              reject(err);
            }
          } else {
            if (completed === queries.length && !hasError) {
              // Create default admin user if none exists
              const bcrypt = require('bcryptjs');
              const defaultPin = process.env.DEFAULT_ADMIN_PIN || '123456';
              
              db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], async (err, row) => {
                if (err) {
                  console.error('Error checking admin users:', err.message);
                  resolve();
                  return;
                }

                if (row.count === 0) {
                  try {
                    const pinHash = await bcrypt.hash(defaultPin, 12);
                    db.run(
                      'INSERT INTO users (name, pin_hash, role) VALUES (?, ?, ?)',
                      ['Administrator', pinHash, 'admin'],
                      (err) => {
                        if (err) {
                          console.error('Error creating default admin:', err.message);
                        } else {
                          console.log(`Default admin user created with PIN: ${defaultPin}`);
                          console.log('*** IMPORTANT: Change the default PIN after first login! ***');
                        }
                        resolve();
                      }
                    );
                  } catch (hashError) {
                    console.error('Error hashing default admin PIN:', hashError);
                    resolve();
                  }
                } else {
                  resolve();
                }
              });
            }
          }
        });
      });
    });
  });
};

// Initialize database connection and start server
const startServer = async () => {
  console.log('[START SERVER] === startServer() function called ===');
  console.log('[START SERVER] Process PID:', process.pid);
  console.log('[START SERVER] Node version:', process.version);
  console.log('[START SERVER] Process will stay alive:', !!process._keepAliveInterval);
  
  try {
    console.log('Attempting to connect to database...');
    console.log('DB_PATH environment variable:', process.env.DB_PATH || 'not set');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('ELECTRON_MODE:', process.env.ELECTRON_MODE || 'not set');
    
    // Connect to database with timeout
    console.log('Calling database.connect()...');
    const connectPromise = database.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout after 10 seconds')), 10000)
    );
    
    console.log('Waiting for database connection...');
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('Database connected successfully');
    
    // Initialize database tables
    try {
      console.log('Initializing database tables...');
      await initializeDatabase(database.getDb());
      console.log('Database tables initialized/verified');
    } catch (initError) {
      console.error('Error initializing database tables:', initError);
      console.error('Error details:', initError.message);
      console.error('Stack:', initError.stack);
      // Don't exit - tables might already exist, continue anyway
    }
    
    // If running in Electron and PORT is not explicitly set, find available port
    if (process.env.ELECTRON_MODE === 'true' && !process.env.PORT) {
      try {
        serverPort = await findAvailablePort(5000);
        console.log(`Found available port: ${serverPort}`);
      } catch (error) {
        console.error('Error finding available port:', error);
        serverPort = 5000; // Fallback
      }
    }
    
    // Start server
    const server = app.listen(serverPort, () => {
      const actualPort = server.address().port;
      serverPort = actualPort; // Update to actual port (in case 0 was used)
      
      console.log(`\n🚀 POS API Server running on port ${actualPort}`);
      console.log(`📍 Health check: http://localhost:${actualPort}/health`);
      console.log(`📍 API info: http://localhost:${actualPort}/api`);
      console.log(`🔐 Default admin PIN: ${process.env.DEFAULT_ADMIN_PIN || '123456'}`);
      console.log('   *** Change default PIN after first login! ***\n');
      
      // If running in Electron, send port info to parent process via IPC
      if (process.send && process.env.ELECTRON_MODE === 'true') {
        process.send({
          type: 'server-started',
          port: actualPort
        });
      }
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${serverPort} is already in use. Attempting to find another port...`);
        // Try to find another port and restart
        findAvailablePort(serverPort + 1)
          .then((newPort) => {
            serverPort = newPort;
            server.listen(newPort);
          })
          .catch((err) => {
            console.error('Failed to find available port:', err);
            process.exit(1);
          });
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    
    // If it's a database error, provide more context
    if (error.message.includes('database') || error.message.includes('SQLite')) {
      console.error('Database error detected. Check:');
      console.error('  1. Database path is correct and writable');
      console.error('  2. Database directory exists and has proper permissions');
      console.error('  3. DB_PATH environment variable:', process.env.DB_PATH || 'not set');
    }
    
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📴 Shutting down server...');
  try {
    await database.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n📴 Shutting down server...');
  try {
    await database.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Stack:', reason?.stack || 'No stack trace');
  // Don't exit - log and continue
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit immediately - try to log and continue
  // Only exit if it's a critical error
  if (error.code === 'EADDRINUSE' || error.message.includes('port')) {
    console.error('Port error detected, will attempt to find another port');
  } else {
    console.error('Critical error, exiting...');
    process.exit(1);
  }
});

// Start the server with error handling
console.log('[BACKEND START] About to call startServer()...');
console.log('[BACKEND START] startServer function exists:', typeof startServer === 'function');

// CRITICAL: Keep process alive IMMEDIATELY - before any async operations
// This prevents the process from exiting before startServer() completes
console.log('[BACKEND START] Setting up keep-alive mechanism...');
const keepAliveInterval = setInterval(() => {
  // This interval keeps the event loop alive
  // Without this, the process will exit when the script finishes
}, 5000); // Check every 5 seconds

// Also keep a reference to prevent garbage collection
process._keepAliveInterval = keepAliveInterval;

console.log('[BACKEND START] Keep-alive interval set, process should stay alive');
console.log('[BACKEND START] Keep-alive interval set');

// Now call startServer
console.log('[BACKEND START] Calling startServer()...');
const startPromise = startServer().catch((error) => {
  console.error('[FATAL ERROR] Fatal error starting server:', error);
  console.error('[FATAL ERROR] Error message:', error.message);
  console.error('[FATAL ERROR] Error code:', error.code);
  console.error('[FATAL ERROR] Stack:', error.stack);
  // Wait a bit before exiting to ensure logs are flushed
  setTimeout(() => {
    clearInterval(keepAliveInterval);
    process.exit(1);
  }, 2000);
});

console.log('[BACKEND START] startServer() called, promise created');
console.log('[BACKEND START] Process should stay alive now...');