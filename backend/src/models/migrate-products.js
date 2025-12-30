const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/pos.db');
const db = new sqlite3.Database(dbPath);

// Migration to update products schema and create product_suppliers table
const migrateProducts = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('Starting products migration...');

      // Create product_suppliers table
      db.run(`
        CREATE TABLE IF NOT EXISTS product_suppliers (
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
        )
      `, (err) => {
        if (err) {
          console.error('Error creating product_suppliers table:', err.message);
          reject(err);
          return;
        }
        console.log('✓ product_suppliers table created');
      });

      // Check if products table needs migration
      db.all("PRAGMA table_info(products)", [], (err, columns) => {
        if (err) {
          console.error('Error checking products table:', err.message);
          reject(err);
          return;
        }

        const hasBarcode = columns.some(col => col.name === 'barcode');
        const hasCostPrice = columns.some(col => col.name === 'cost_price');

        if (!hasBarcode || hasCostPrice) {
          console.log('Migrating products table schema...');
          
          // Rename old table
          db.run(`ALTER TABLE products RENAME TO products_old`, (err) => {
            if (err) {
              console.error('Error renaming products table:', err.message);
              reject(err);
              return;
            }

            // Create new products table
            db.run(`
              CREATE TABLE products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                sku TEXT UNIQUE NOT NULL,
                barcode TEXT,
                category TEXT,
                warranty_months INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `, (err) => {
              if (err) {
                console.error('Error creating new products table:', err.message);
                reject(err);
                return;
              }

              // Migrate data from old table
              db.run(`
                INSERT INTO products (id, name, sku, barcode, category, warranty_months, is_active, created_at, updated_at)
                SELECT id, name, sku, '', category, warranty_months, is_active, created_at, updated_at
                FROM products_old
              `, (err) => {
                if (err) {
                  console.error('Error migrating product data:', err.message);
                  reject(err);
                  return;
                }

                // Get first supplier ID to use as default
                db.get('SELECT id FROM suppliers LIMIT 1', [], (err, supplier) => {
                  const defaultSupplierId = supplier ? supplier.id : 1;

                  // Migrate pricing/stock data to product_suppliers
                  db.run(`
                    INSERT INTO product_suppliers (product_id, supplier_id, cost_price, sale_price, stock, is_primary)
                    SELECT id, ?, cost_price, sale_price, stock, 1
                    FROM products_old
                  `, [defaultSupplierId], (err) => {
                    if (err) {
                      console.error('Error migrating to product_suppliers:', err.message);
                      reject(err);
                      return;
                    }

                    // Drop old table
                    db.run('DROP TABLE products_old', (err) => {
                      if (err) {
                        console.error('Error dropping old table:', err.message);
                        reject(err);
                        return;
                      }
                      console.log('✓ Products table migrated successfully');
                      resolve();
                    });
                  });
                });
              });
            });
          });
        } else {
          console.log('✓ Products table already migrated');
          resolve();
        }
      });
    });
  });
};

// Run migration
migrateProducts()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Migration failed:', err);
    db.close();
    process.exit(1);
  });
