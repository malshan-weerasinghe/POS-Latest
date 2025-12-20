const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../../database/pos.db');

const seedData = () => {
  const db = new sqlite3.Database(dbPath);

  console.log('Seeding database with sample data...');

  // Sample products from your frontend
  const products = [
    { name: 'iPhone 13 Pro 128GB', sku: 'PHN-IP13P-128', cost_price: 115000, sale_price: 135000, stock: 12, category: 'Smartphones', warranty_months: 12 },
    { name: 'Samsung Galaxy S23', sku: 'PHN-SAM-S23', cost_price: 95000, sale_price: 110000, stock: 8, category: 'Smartphones', warranty_months: 12 },
    { name: 'iPhone 12 64GB', sku: 'PHN-IP12-64', cost_price: 75000, sale_price: 88000, stock: 15, category: 'Smartphones', warranty_months: 6 },
    { name: 'AirPods Pro 2nd Gen', sku: 'ACC-AP-PRO2', cost_price: 28000, sale_price: 32000, stock: 25, category: 'Accessories', warranty_months: 12 },
    { name: 'Samsung Charger 25W', sku: 'ACC-CHR-25W', cost_price: 1200, sale_price: 1800, stock: 50, category: 'Accessories', warranty_months: 6 },
    { name: 'iPhone 11 128GB', sku: 'PHN-IP11-128', cost_price: 58000, sale_price: 68000, stock: 10, category: 'Smartphones', warranty_months: 6 },
    { name: 'OnePlus Nord 3', sku: 'PHN-OP-N3', cost_price: 42000, sale_price: 52000, stock: 18, category: 'Smartphones', warranty_months: 12 },
    { name: 'Phone Case Universal', sku: 'ACC-CASE-UNI', cost_price: 500, sale_price: 1200, stock: 100, category: 'Accessories', warranty_months: 0 },
    { name: 'Tempered Glass Screen', sku: 'ACC-GLASS-SC', cost_price: 300, sale_price: 800, stock: 150, category: 'Accessories', warranty_months: 0 },
    { name: 'Power Bank 20000mAh', sku: 'ACC-PB-20K', cost_price: 3500, sale_price: 5500, stock: 30, category: 'Accessories', warranty_months: 12 }
  ];

  // Sample customers from your frontend
  const customers = [
    { name: 'John Silva', phone: '0771234567', email: 'john@email.com', address: 'Colombo 03' },
    { name: 'Mary Fernando', phone: '0767654321', email: 'mary@email.com', address: 'Kandy' },
    { name: 'Sunil Perera', phone: '0759876543', email: 'sunil@email.com', address: 'Galle' },
    { name: 'Nimal Kumar', phone: '0771112222', email: 'nimal@email.com', address: 'Negombo' },
    { name: 'Kamala Jayawardena', phone: '0763334444', email: 'kamala@email.com', address: 'Matara' }
  ];

  db.serialize(() => {
    // Clear existing data (optional - be careful in production)
    db.run('DELETE FROM products WHERE 1=1');
    db.run('DELETE FROM customers WHERE 1=1');

    // Insert products
    const insertProduct = db.prepare(`
      INSERT INTO products (name, sku, cost_price, sale_price, stock, category, warranty_months)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach(product => {
      insertProduct.run(
        product.name,
        product.sku,
        product.cost_price,
        product.sale_price,
        product.stock,
        product.category,
        product.warranty_months
      );
    });

    insertProduct.finalize();
    console.log(`Inserted ${products.length} products`);

    // Insert customers
    const insertCustomer = db.prepare(`
      INSERT INTO customers (name, phone, email, address)
      VALUES (?, ?, ?, ?)
    `);

    customers.forEach(customer => {
      insertCustomer.run(
        customer.name,
        customer.phone,
        customer.email,
        customer.address
      );
    });

    insertCustomer.finalize();
    console.log(`Inserted ${customers.length} customers`);

    db.close(() => {
      console.log('Database seeding completed successfully');
    });
  });
};

// Run seeding if called directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };