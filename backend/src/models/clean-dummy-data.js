const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/pos.db');

const cleanDummyData = () => {
  const db = new sqlite3.Database(dbPath);

  console.log('Cleaning dummy data from database...');

  const dummyCustomerNames = [
    'John Silva',
    'Mary Fernando', 
    'Sunil Perera',
    'Nimal Kumar',
    'Kamala Jayawardena'
  ];

  db.serialize(() => {
    // Remove dummy customers
    const placeholders = dummyCustomerNames.map(() => '?').join(',');
    
    db.run(
      `DELETE FROM customers WHERE name IN (${placeholders})`,
      dummyCustomerNames,
      function(err) {
        if (err) {
          console.error('Error removing dummy customers:', err.message);
        } else {
          console.log(`Removed ${this.changes} dummy customers`);
        }
      }
    );

    // Also remove any dummy products if needed
    const dummyProductSKUs = [
      'PHN-IP13P-128',
      'PHN-SAM-S23',
      'PHN-IP12-64',
      'ACC-AP-PRO2',
      'ACC-CHR-25W',
      'PHN-IP11-128',
      'PHN-OP-N3',
      'ACC-CASE-UNI',
      'ACC-GLASS-SC',
      'ACC-PB-20K'
    ];

    const productPlaceholders = dummyProductSKUs.map(() => '?').join(',');
    
    db.run(
      `DELETE FROM products WHERE sku IN (${productPlaceholders})`,
      dummyProductSKUs,
      function(err) {
        if (err) {
          console.error('Error removing dummy products:', err.message);
        } else {
          console.log(`Removed ${this.changes} dummy products`);
        }
      }
    );

    db.close(() => {
      console.log('Database cleanup completed');
    });
  });
};

// Run if called directly
if (require.main === module) {
  cleanDummyData();
}

module.exports = { cleanDummyData };