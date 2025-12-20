# POS System - Complete Development Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Database Architecture](#database-architecture)
5. [API Documentation](#api-documentation)
6. [Frontend Architecture](#frontend-architecture)
7. [Key Features](#key-features)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

A modern Point of Sale (POS) system built with React + TypeScript frontend and Node.js + Express backend, featuring:
- Multi-supplier support (single SKU from multiple suppliers)
- Auto-generated SKU and EAN-13 barcodes
- FIFO stock reduction strategy
- Real-time inventory management
- Sales tracking and history
- Customer and supplier management
- LKR currency formatting with comma separators

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS + CSS Variables
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner (toast notifications)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express Validator

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Design System for POS App"
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

#### 4. Initialize Database
```bash
cd backend
npm run init-db
```

This will:
- Create the SQLite database (`pos.db`)
- Set up all tables with proper schema
- Create a default admin user (username: `admin`, password: `admin123`)
- Generate sample data for testing

#### 5. Start Backend Server
```bash
# From backend directory
npm run dev
# Server runs on http://localhost:3000
```

#### 6. Start Frontend Development Server
```bash
# From root directory
npm run dev
# Frontend runs on http://localhost:5173
```

#### 7. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Default Login**: 
  - Username: `admin`
  - Password: `admin123`

---

## 🗄️ Database Architecture

### Database Schema Overview

The system uses SQLite with a multi-supplier architecture where a single product (SKU) can be supplied by multiple suppliers with different pricing and stock levels.

### Core Tables

#### 1. **users** - System Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,          -- bcrypt hashed
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL,              -- 'admin', 'cashier', 'manager'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 2. **categories** - Product Categories
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 3. **products** - Product Metadata (SKU-level)
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,        -- Auto-generated: SM-IP-001
  barcode TEXT UNIQUE,             -- EAN-13 format
  category_id INTEGER,
  warranty_months INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
)
```

**Note**: Products table stores only product metadata. No pricing or stock information here.

#### 4. **suppliers** - Supplier Information
```sql
CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 5. **product_suppliers** - Junction Table (Multi-Supplier Support)
```sql
CREATE TABLE product_suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  supplier_id INTEGER NOT NULL,
  cost_price REAL NOT NULL,        -- Purchase price from this supplier
  sale_price REAL NOT NULL,        -- Selling price for this supplier's stock
  stock INTEGER DEFAULT 0,         -- Stock quantity from this supplier
  reorder_level INTEGER DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  UNIQUE(product_id, supplier_id)
)
```

**Key Concept**: This table enables the same product (SKU) to be supplied by multiple suppliers, each with their own:
- Cost price (what you pay the supplier)
- Sale price (what you charge customers)
- Stock quantity
- Reorder levels

#### 6. **customers** - Customer Information
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 7. **sales** - Sales Transactions
```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE NOT NULL, -- Format: INV2512-12345
  customer_id INTEGER,
  cashier_id INTEGER NOT NULL,
  sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  grand_total REAL NOT NULL,
  payment_method TEXT NOT NULL,        -- 'cash', 'card', 'upi'
  amount_received REAL,
  change_amount REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (cashier_id) REFERENCES users(id)
)
```

#### 8. **sale_items** - Individual Items in Sales
```sql
CREATE TABLE sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  discount REAL DEFAULT 0,
  line_total REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
)
```

---

## 🏗️ Multi-Supplier Architecture

### How It Works

#### Example Scenario:
**Product**: iPhone 13 Pro (SKU: `SM-IP-001`)
- **Supplier A**: Cost: LKR 120,000 | Sale: LKR 135,000 | Stock: 5
- **Supplier B**: Cost: LKR 118,000 | Sale: LKR 133,000 | Stock: 3
- **Supplier C**: Cost: LKR 122,000 | Sale: LKR 137,000 | Stock: 2

#### Database Representation:
```
products table:
  id: 1, name: "iPhone 13 Pro", sku: "SM-IP-001"

product_suppliers table:
  | id | product_id | supplier_id | cost_price | sale_price | stock |
  |----|------------|-------------|------------|------------|-------|
  | 1  | 1          | 1           | 120000     | 135000     | 5     |
  | 2  | 1          | 2           | 118000     | 133000     | 3     |
  | 3  | 1          | 3           | 122000     | 137000     | 2     |
```

#### FIFO Stock Reduction:
When selling 6 units of iPhone 13 Pro:
1. Take 3 from Supplier B (lowest cost: 118,000)
2. Take 3 from Supplier A (next lowest: 120,000)

This ensures maximum profit margin by selling lower-cost inventory first.

### SKU Auto-Generation Format
**Pattern**: `{2-char-category}-{2-char-name}-{3-digit-sequence}`

Examples:
- `SM-IP-001` - Smartphone iPhone 001
- `AC-CH-001` - Accessory Charger 001
- `TA-SA-001` - Tablet Samsung 001

### Barcode Generation
- **Format**: EAN-13 (13 digits)
- **Algorithm**: Auto-generated with check digit validation
- **Example**: `5901234123457`

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All endpoints (except login) require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints Overview

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)

#### Products
- `GET /api/products` - List all products (with aggregated stock)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product with supplier
- `PUT /api/products/:product_supplier_id` - Update product-supplier relationship
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search?query=` - Search products

#### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

#### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/search?query=` - Search customers

#### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Sales
- `GET /api/sales` - List all sales (with filters)
- `GET /api/sales/:id` - Get single sale with items
- `POST /api/sales` - Create new sale (with stock reduction)
- `GET /api/sales/dashboard/summary` - Dashboard statistics

### Example API Calls

#### Create Product with Supplier
```bash
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "iPhone 13 Pro 128GB",
  "category_id": 1,
  "warranty_months": 12,
  "supplier_id": 1,
  "cost_price": 120000,
  "sale_price": 135000,
  "stock": 10,
  "reorder_level": 5
}
```

Response:
```json
{
  "success": true,
  "data": {
    "product_id": 15,
    "sku": "SM-IP-001",
    "barcode": "5901234123457",
    "product_supplier_id": 20
  }
}
```

#### Create Sale with Stock Reduction
```bash
POST /api/sales
Content-Type: application/json
Authorization: Bearer <token>

{
  "customer_id": 5,
  "payment_method": "card",
  "amount_received": 150000,
  "items": [
    {
      "product_id": 15,
      "quantity": 1,
      "unit_price": 135000,
      "discount": 2000
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "sale_id": 123,
    "invoice_number": "INV2512-12345",
    "grand_total": 133000
  }
}
```

---

## 🎨 Frontend Architecture

### Directory Structure
```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── PageHeader.tsx
│   ├── pages/            # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── ItemsListPage.tsx
│   │   ├── SalesBillingPage.tsx
│   │   ├── SalesHistoryPage.tsx
│   │   ├── CustomersListPage.tsx
│   │   ├── SuppliersListPage.tsx
│   │   └── CategoriesPage.tsx
│   ├── templates/        # Page templates
│   │   └── PageTemplate.tsx
│   └── ui/               # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── input.tsx
│       └── ...
├── services/
│   └── api.js           # API service layer
├── styles/
│   └── globals.css      # Global styles
└── App.tsx              # Main app component
```

### API Service Layer
Location: `src/services/api.js`

```javascript
// Example usage
import { productsAPI, salesAPI, customersAPI } from '../services/api';

// Fetch products
const response = await productsAPI.getAll({ page: 1, limit: 20 });

// Create sale
const sale = await salesAPI.create({
  customer_id: 5,
  payment_method: 'cash',
  items: [...]
});
```

### State Management
- Component-level state with React `useState`
- Side effects with `useEffect`
- No global state management (Redux/Context) needed for current scope

### Currency Formatting
All pages use `formatLKR()` function:
```typescript
const formatLKR = (amount: number): string => {
  return amount.toLocaleString('en-LK');
};

// Usage: LKR {formatLKR(135000)} → "LKR 135,000"
```

---

## ✨ Key Features

### 1. Items Management (Multi-Supplier View)
- **Merged Cell Table**: Same SKU shown once, multiple supplier rows beneath
- **Visual Distinction**: Merged cells have background color and border
- **Total Stock Display**: Aggregated stock from all suppliers
- **CRUD Operations**: Add, edit, delete products and supplier relationships

### 2. Sales & Billing
- **Product Search**: Real-time search with stock validation
- **Customer Selection**: Optional customer association
- **Cart Management**: Add, remove, update quantities
- **Payment Processing**: Cash/Card with amount received tracking
- **FIFO Stock Reduction**: Automatic stock deduction from lowest cost first
- **Invoice Generation**: Auto-generated invoice numbers

### 3. Sales History
- **Date Range Filters**: Filter by date range
- **Search**: By invoice number, customer name, or phone
- **Payment Filter**: Cash, Card, UPI
- **Expandable Rows**: View detailed item breakdown
- **Stats Dashboard**: Total invoices, revenue, paid/pending counts

### 4. Auto-Generation
- **SKU**: Format `XX-YY-NNN` based on category and product name
- **Barcode**: EAN-13 with check digit calculation
- **Invoice Numbers**: Format `INV{year}{month}-{timestamp}`

### 5. LKR Currency Display
All monetary values formatted with:
- Comma separators (1,000,000)
- Consistent "LKR" prefix
- Used across all pages: Items, Sales, History, Dashboard

---

## 💻 Development Workflow

### Adding a New Feature

#### 1. Backend (API Endpoint)
```javascript
// backend/src/routes/example.js
router.post('/', authenticate, posUser, async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    
    // Database operation
    const result = await database.run(
      'INSERT INTO table_name (field1, field2) VALUES (?, ?)',
      [field1, field2]
    );
    
    res.json({
      success: true,
      data: { id: result.lastID }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

#### 2. API Service Layer
```javascript
// src/services/api.js
export const exampleAPI = {
  create: (data) => apiRequest('/api/example', 'POST', data),
  getAll: (params) => apiRequest('/api/example', 'GET', null, params),
  getById: (id) => apiRequest(`/api/example/${id}`, 'GET'),
  update: (id, data) => apiRequest(`/api/example/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/api/example/${id}`, 'DELETE')
};
```

#### 3. Frontend Component
```typescript
// src/components/pages/ExamplePage.tsx
import { exampleAPI } from '../../services/api';

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    const response = await exampleAPI.getAll();
    if (response.success) {
      setData(response.data.items);
    }
  } catch (error) {
    toast.error('Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

### Database Migrations

#### Creating a Migration
```javascript
// backend/src/models/migrate-example.js
const database = require('./database');

async function migrate() {
  try {
    await database.run(`
      ALTER TABLE products ADD COLUMN new_field TEXT
    `);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
```

#### Running Migration
```bash
cd backend
node src/models/migrate-example.js
```

### Testing Workflow

#### Backend Testing
```bash
# Start backend
cd backend
npm run dev

# Test with curl or Postman
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer <token>"
```

#### Frontend Testing
1. Start both backend and frontend
2. Login with test credentials
3. Navigate to feature page
4. Test CRUD operations
5. Check browser console for errors
6. Verify API calls in Network tab

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Not Found
```
Error: SQLITE_CANTOPEN: unable to open database file
```
**Solution**: Run database initialization
```bash
cd backend
npm run init-db
```

#### 2. Authentication Failed
```
Error: 401 Unauthorized
```
**Solution**: 
- Check JWT token in localStorage
- Re-login to get fresh token
- Verify backend is running

#### 3. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### 4. CORS Errors
**Solution**: Backend already configured with CORS. Ensure frontend is accessing correct backend URL (`http://localhost:3000`)

#### 5. Stock Validation Errors
```
Error: Insufficient stock
```
**Solution**: Check `product_suppliers` table for actual stock levels:
```sql
SELECT p.name, s.name as supplier, ps.stock 
FROM product_suppliers ps
JOIN products p ON ps.product_id = p.id
JOIN suppliers s ON ps.supplier_id = s.id
WHERE p.id = ?;
```

### Debug Mode

#### Backend Logging
```javascript
// Add to any route
console.log('Request body:', req.body);
console.log('Query params:', req.query);
console.log('User:', req.user);
```

#### Frontend Logging
```typescript
// Check API responses
const response = await productsAPI.getAll();
console.log('API Response:', response);

// Check state
useEffect(() => {
  console.log('Current state:', { data, loading, error });
}, [data, loading, error]);
```

### Database Inspection

#### Using SQLite CLI
```bash
cd backend
sqlite3 pos.db

# Useful commands
.tables                    # List all tables
.schema products          # Show table structure
SELECT * FROM products;   # Query data
.exit                     # Exit
```

#### Reset Database
```bash
cd backend
rm pos.db                 # Delete existing database
npm run init-db          # Recreate with fresh data
```

---

## 📚 Additional Resources

### File Locations
- **Database**: `backend/pos.db`
- **API Routes**: `backend/src/routes/`
- **Database Models**: `backend/src/models/`
- **Frontend Pages**: `src/components/pages/`
- **API Service**: `src/services/api.js`

### Environment Variables
Create `.env` in backend directory:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
```

---

## 📝 Notes

### Design Decisions

1. **SQLite Database**: Chosen for simplicity and portability. Can be replaced with PostgreSQL/MySQL for production.

2. **Multi-Supplier Architecture**: Enables realistic inventory management where same product comes from different suppliers with different costs.

3. **FIFO Stock Reduction**: Maximizes profit by selling lower-cost inventory first.

4. **No Redux/Context**: Current app scope doesn't require global state management. Can be added if needed.

5. **Merged Cell UI**: Visual representation of multi-supplier concept makes it intuitive for users.

### Future Enhancements

- [ ] Receipt printing functionality
- [ ] Dashboard analytics with charts
- [ ] Export sales reports to PDF/Excel
- [ ] Barcode scanner integration
- [ ] Low stock alerts/notifications
- [ ] Role-based access control (RBAC)
- [ ] Audit logs for all operations
- [ ] Multi-location support
- [ ] Return/refund management
- [ ] Advanced reporting (profit margins, best sellers)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper commit messages
4. Test thoroughly
5. Submit pull request

---

## 📄 License

This project is proprietary. All rights reserved.

---

**Last Updated**: December 20, 2025
**Version**: 1.0.0
