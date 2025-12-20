const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.join(__dirname, '../../database/pos.db');

// Create database and tables
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');
});

// Create tables
const createTables = () => {
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
      cost_price REAL NOT NULL,
      sale_price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      warranty_months INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
      contact_person TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      payment_terms TEXT DEFAULT 'Net 30',
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      total_orders INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Sales table
    `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      cashier_id INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      grand_total REAL NOT NULL,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'card')),
      amount_received REAL,
      change_amount REAL DEFAULT 0,
      sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (cashier_id) REFERENCES users(id)
    )`,

    // Sale Items table
    `CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      discount REAL DEFAULT 0,
      line_total REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`,

    // Sessions table (for logout tracking)
    `CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  ];

  queries.forEach((query, index) => {
    db.run(query, (err) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err.message);
      } else {
        console.log(`Table ${index + 1} created/verified successfully`);
      }
    });
  });
};

// Create default admin user
const createDefaultAdmin = async () => {
  const defaultPin = process.env.DEFAULT_ADMIN_PIN || '123456';
  const defaultName = process.env.DEFAULT_ADMIN_NAME || 'Administrator';
  
  try {
    const pinHash = await bcrypt.hash(defaultPin, 12);
    
    db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], (err, row) => {
      if (err) {
        console.error('Error checking admin users:', err.message);
        return;
      }

      if (row.count === 0) {
        db.run(
          'INSERT INTO users (name, pin_hash, role) VALUES (?, ?, ?)',
          [defaultName, pinHash, 'admin'],
          (err) => {
            if (err) {
              console.error('Error creating default admin:', err.message);
            } else {
              console.log(`Default admin user created with PIN: ${defaultPin}`);
              console.log('*** IMPORTANT: Change the default PIN after first login! ***');
            }
          }
        );
      } else {
        console.log('Admin user already exists');
      }
    });
  } catch (error) {
    console.error('Error hashing default admin PIN:', error);
  }
};

// Initialize database
const initDatabase = () => {
  console.log('Initializing POS Database...');
  
  db.serialize(() => {
    createTables();
    
    setTimeout(() => {
      createDefaultAdmin();
      
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database initialization completed');
          }
        });
      }, 1000);
    }, 1000);
  });
};

// Run initialization if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };