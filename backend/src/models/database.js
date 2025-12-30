const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Use DB_PATH from environment if provided (for Electron), otherwise use default path
// DB_PATH should point to the directory, not the file
let dbDir = process.env.DB_PATH;
if (!dbDir) {
  // Default: backend/database directory
  dbDir = path.join(__dirname, '../../database');
}
// Normalize the path and resolve to absolute
dbDir = path.resolve(dbDir);

// Ensure dbDir doesn't already end with pos.db (in case DB_PATH was set incorrectly)
if (dbDir.endsWith('pos.db')) {
  dbDir = path.dirname(dbDir);
}

// Construct the database file path
const dbPath = path.join(dbDir, 'pos.db');

// Ensure database directory exists
try {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory: ${dbDir}`);
  }
} catch (error) {
  console.error('Error creating database directory:', error.message);
}

class Database {
  constructor() {
    this.db = null;
  }

  // Initialize database connection
  connect() {
    return new Promise((resolve, reject) => {
      // Use the already resolved absolute path
      console.log(`Connecting to database at: ${dbPath}`);
      console.log(`Database directory: ${dbDir}`);
      console.log(`Database directory exists: ${fs.existsSync(dbDir)}`);
      console.log(`Database file exists: ${fs.existsSync(dbPath)}`);
      
      // Ensure directory exists and is writable
      try {
        if (!fs.existsSync(dbDir)) {
          console.log(`Creating database directory: ${dbDir}`);
          fs.mkdirSync(dbDir, { recursive: true });
          console.log('Database directory created successfully');
        }
        
        // Test write permissions
        const testFile = path.join(dbDir, '.write-test');
        try {
          fs.writeFileSync(testFile, 'test');
          fs.unlinkSync(testFile);
          console.log('Database directory is writable');
        } catch (writeError) {
          console.error('Database directory is NOT writable:', writeError.message);
          reject(new Error(`Database directory is not writable: ${writeError.message}`));
          return;
        }
      } catch (dirError) {
        console.error('Error creating/checking database directory:', dirError.message);
        reject(new Error(`Cannot create database directory: ${dirError.message}`));
        return;
      }
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err.message);
          console.error('Error code:', err.code);
          console.error('Database path attempted:', dbPath);
          console.error('Database directory exists:', fs.existsSync(dbDir));
          console.error('Database file exists:', fs.existsSync(dbPath));
          reject(err);
        } else {
          console.log('Connected to SQLite database successfully');
          resolve(this.db);
        }
      });
    });
  }

  // Close database connection
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Database close error:', err.message);
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Get database instance
  getDb() {
    return this.db;
  }

  // Run a query (for INSERT, UPDATE, DELETE)
  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) {
          console.error('Database run error:', err.message);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Get single row
  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          console.error('Database get error:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get all rows
  all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Database all error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;