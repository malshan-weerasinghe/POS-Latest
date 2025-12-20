const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const database = require('./models/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');
const categoryRoutes = require('./routes/categories');
const salesRoutes = require('./routes/sales');

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
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

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();
    console.log('Database connected successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 POS API Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API info: http://localhost:${PORT}/api`);
      console.log(`🔐 Default admin PIN: ${process.env.DEFAULT_ADMIN_PIN || '123456'}`);
      console.log('   *** Change default PIN after first login! ***\n');
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
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

// Start the server
startServer();