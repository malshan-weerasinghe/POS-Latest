# POS Backend API

A robust Node.js + Express + SQLite backend for the POS (Point of Sale) system with PIN-based authentication and role-based access control.

## 🚀 Quick Setup

### Windows
```bash
# Run the setup script
setup.bat
```

### Manual Setup
```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Seed with sample data
npm run seed

# Start server
npm start          # Production
npm run dev        # Development (with auto-reload)
```

## 🔐 Default Credentials

- **Admin PIN**: `123456`
- **⚠️ IMPORTANT**: Change the default PIN immediately after first login!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with PIN
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/users` - Create new user (Admin only)
- `PUT /api/auth/users/:id/pin` - Update user PIN
- `PUT /api/auth/users/:id/deactivate` - Deactivate user (Admin only)
- `PUT /api/auth/users/:id/activate` - Reactivate user (Admin only)

### Products
- `GET /api/products` - List all products (with search & pagination)
- `GET /api/products/search/:query` - Search products for POS
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `PATCH /api/products/:id/stock` - Update stock (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/meta/categories` - Get all categories

### Customers
- `GET /api/customers` - List all customers (with search & pagination)
- `GET /api/customers/search/:query` - Search customers for POS
- `GET /api/customers/:id` - Get single customer
- `GET /api/customers/phone/:phone` - Get customer by phone
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/:id/purchases` - Get customer purchase history

### Sales
- `GET /api/sales` - List all sales (with filters & pagination)
- `GET /api/sales/:id` - Get single sale with items
- `POST /api/sales` - Create new sale
- `GET /api/sales/dashboard/summary` - Get dashboard summary
- `GET /api/sales/reports/by-date` - Get sales report by date range

## 🔑 Authentication

All endpoints (except `/health` and `/api`) require authentication:

```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>'
}
```

### Login Example
```javascript
POST /api/auth/login
{
  "pin": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Administrator",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## 👥 User Roles

### Admin
- Full system access
- Manage users (create, deactivate, change PINs)
- Manage products (create, update, delete)
- View all sales and reports
- Manage customers

### Cashier
- Sales operations only
- View/search products
- Create/manage customers
- Process sales
- View sales history

## 💾 Database Schema

### Tables
- **users** - System users with PIN authentication
- **products** - Product inventory with SKU, pricing, and stock
- **customers** - Customer information and contact details
- **sales** - Sales transactions with payment details
- **sale_items** - Individual items in each sale
- **user_sessions** - JWT session management

### Key Features
- Automatic stock management
- Session tracking and validation
- Soft deletion for data integrity
- Comprehensive audit trail

## 🔧 Configuration

Environment variables (`.env`):

```env
NODE_ENV=development
PORT=5000

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

DB_PATH=./database/pos.db

DEFAULT_ADMIN_PIN=123456
DEFAULT_ADMIN_NAME=Administrator

BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 🛡️ Security Features

- **PIN-based Authentication**: Fast retail-optimized login
- **JWT Tokens**: Secure session management
- **Role-based Access Control**: Admin/Cashier permissions
- **Rate Limiting**: Protection against brute force
- **Session Validation**: Active session tracking
- **Password Hashing**: bcrypt with configurable rounds
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests

## 📊 Sample Data

The seeding script includes:
- **10 products** from your mobile shop (iPhones, accessories, etc.)
- **5 sample customers** with Sri Lankan phone numbers
- **Default admin user** (PIN: 123456)

## 🚨 Production Deployment

1. **Change default credentials**
2. **Set strong JWT secret**
3. **Configure environment variables**
4. **Set up database backups**
5. **Configure reverse proxy (nginx)**
6. **Enable HTTPS**
7. **Monitor logs and performance**

## 📝 API Response Format

All API responses follow this structure:

```javascript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}

// Validation Error
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "pin",
      "message": "PIN must be between 4-8 characters",
      "value": "12"
    }
  ]
}
```

## 🔍 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### API Information
```bash
curl http://localhost:5000/api
```

### Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"pin":"123456"}'
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication & validation
│   ├── models/          # Database models & connection
│   ├── services/        # Business logic
│   └── app.js           # Main Express application
├── database/            # SQLite database files
├── .env                 # Environment configuration
├── package.json         # Dependencies & scripts
└── setup.bat           # Windows setup script
```

## 🤝 Integration with Frontend

The API is designed to work seamlessly with your React frontend. Key integration points:

1. **Authentication Context**: JWT token storage
2. **Product Search**: Real-time search for POS
3. **Customer Management**: Create/search customers
4. **Sales Processing**: Complete transaction workflow
5. **Real-time Updates**: Stock management and reporting

---

## 📞 Support

- Server runs on: `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- API documentation: `http://localhost:5000/api`

**Ready to process your first sale! 💰**