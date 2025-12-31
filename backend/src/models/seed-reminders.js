const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../../database/pos.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Ensure reminders table exists
const createRemindersTable = () => {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('Supplier', 'Maintenance', 'Tax', 'Staff', 'General')),
        scheduled_date_time TEXT NOT NULL,
        recurrence TEXT NOT NULL CHECK(recurrence IN ('None', 'Every 15 mins', 'Every 1 hour', 'Daily', 'Custom Days')),
        custom_days INTEGER,
        description TEXT,
        priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
        status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Completed', 'Overdue')),
        next_trigger TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(query, (err) => {
      if (err) {
        console.error('Error creating reminders table:', err.message);
        reject(err);
      } else {
        console.log('Reminders table created/verified');
        resolve();
      }
    });
  });
};

// Add dummy reminders data
const seedReminders = () => {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const reminders = [
      {
        title: 'Payment to Supplier ABC',
        category: 'Supplier',
        scheduled_date_time: tomorrow.toISOString(),
        recurrence: 'None',
        custom_days: null,
        description: 'Make payment of LKR 50,000 to Supplier ABC for last month invoice',
        priority: 'High',
        status: 'Pending',
        next_trigger: null
      },
      {
        title: 'Monthly Tax Filing',
        category: 'Tax',
        scheduled_date_time: nextWeek.toISOString(),
        recurrence: 'Daily',
        custom_days: null,
        description: 'File monthly tax returns before deadline',
        priority: 'High',
        status: 'Pending',
        next_trigger: tomorrow.toISOString()
      },
      {
        title: 'Equipment Maintenance Check',
        category: 'Maintenance',
        scheduled_date_time: tomorrow.toISOString(),
        recurrence: 'Custom Days',
        custom_days: 30,
        description: 'Schedule monthly maintenance check for all equipment',
        priority: 'Medium',
        status: 'Pending',
        next_trigger: nextWeek.toISOString()
      },
      {
        title: 'Staff Meeting',
        category: 'Staff',
        scheduled_date_time: tomorrow.toISOString(),
        recurrence: 'Every 1 hour',
        custom_days: null,
        description: 'Weekly staff meeting to discuss sales targets',
        priority: 'Medium',
        status: 'Pending',
        next_trigger: new Date(now.getTime() + 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Inventory Review',
        category: 'General',
        scheduled_date_time: yesterday.toISOString(),
        recurrence: 'None',
        custom_days: null,
        description: 'Review inventory levels and place orders',
        priority: 'Low',
        status: 'Overdue',
        next_trigger: null
      }
    ];

    // Check if reminders already exist
    db.get('SELECT COUNT(*) as count FROM reminders', (err, row) => {
      if (err) {
        console.error('Error checking reminders:', err.message);
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log(`Reminders table already has ${row.count} records. Skipping seed.`);
        resolve();
        return;
      }

      // Insert dummy data
      const insertQuery = `
        INSERT INTO reminders (
          title, category, scheduled_date_time, recurrence, custom_days,
          description, priority, status, next_trigger
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      let completed = 0;
      let hasError = false;

      reminders.forEach((reminder) => {
        db.run(
          insertQuery,
          [
            reminder.title,
            reminder.category,
            reminder.scheduled_date_time,
            reminder.recurrence,
            reminder.custom_days,
            reminder.description,
            reminder.priority,
            reminder.status,
            reminder.next_trigger
          ],
          (err) => {
            completed++;
            if (err) {
              console.error('Error inserting reminder:', err.message);
              if (!hasError) {
                hasError = true;
                reject(err);
              }
            } else if (completed === reminders.length && !hasError) {
              console.log(`Successfully inserted ${reminders.length} dummy reminders`);
              resolve();
            }
          }
        );
      });
    });
  });
};

// Main execution
const run = async () => {
  try {
    await createRemindersTable();
    await seedReminders();
    console.log('Reminders seeding completed successfully');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
      } else {
        console.log('Database connection closed');
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error seeding reminders:', error);
    db.close();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  run();
}

module.exports = { run };


