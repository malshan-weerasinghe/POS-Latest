const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, posUser } = require('../middleware/auth');
const { validateId, validatePagination } = require('../middleware/validation');

// Test route to verify router is working (remove after testing)
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Reminders route is working!',
    timestamp: new Date().toISOString()
  });
});

// Get all reminders with search and pagination
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM reminders 
      WHERE 1=1
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM reminders 
      WHERE 1=1
    `;
    const params = [];
    const countParams = [];
    
    // Add search filter
    if (search) {
      query += ` AND (title LIKE ? OR description LIKE ?)`;
      countQuery += ` AND (title LIKE ? OR description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }
    
    // Add status filter
    if (status) {
      query += ` AND status = ?`;
      countQuery += ` AND status = ?`;
      params.push(status);
      countParams.push(status);
    }
    
    // Add ordering and pagination
    query += ` ORDER BY scheduled_date_time ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [reminders, countResult] = await Promise.all([
      database.all(query, params),
      database.get(countQuery, countParams)
    ]);
    
    const totalPages = Math.ceil((countResult?.total || 0) / limit);
    
    res.json({
      success: true,
      data: {
        reminders: reminders || [],
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_records: countResult?.total || 0,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminders',
      message: error.message
    });
  }
});

// Get single reminder
router.get('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await database.get(
      'SELECT * FROM reminders WHERE id = ?',
      [id]
    );
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Error fetching reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminder',
      message: error.message
    });
  }
});

// Create new reminder
router.post('/', authenticate, posUser, async (req, res) => {
  try {
    const { 
      title, 
      category, 
      scheduled_date_time, 
      recurrence, 
      custom_days, 
      description, 
      priority,
      next_trigger 
    } = req.body;
    
    // Validation
    if (!title || !category || !scheduled_date_time || !priority) {
      return res.status(400).json({
        success: false,
        error: 'Title, category, scheduled date/time, and priority are required'
      });
    }
    
    if (recurrence === 'Custom Days' && (!custom_days || custom_days < 1)) {
      return res.status(400).json({
        success: false,
        error: 'Custom days must be at least 1'
      });
    }
    
    // Determine status based on scheduled date/time
    const scheduledDate = new Date(scheduled_date_time);
    const now = new Date();
    const status = scheduledDate <= now ? 'Overdue' : 'Pending';
    
    const result = await database.run(
      `INSERT INTO reminders (
        title, category, scheduled_date_time, recurrence, custom_days, 
        description, priority, status, next_trigger
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        category, 
        scheduled_date_time, 
        recurrence, 
        recurrence === 'Custom Days' ? custom_days : null,
        description || null, 
        priority, 
        status,
        next_trigger || null
      ]
    );
    
    const newReminder = await database.get(
      'SELECT * FROM reminders WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: newReminder
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reminder',
      message: error.message
    });
  }
});

// Update reminder
router.put('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      category, 
      scheduled_date_time, 
      recurrence, 
      custom_days, 
      description, 
      priority,
      next_trigger 
    } = req.body;
    
    // Check if reminder exists
    const existingReminder = await database.get(
      'SELECT * FROM reminders WHERE id = ?',
      [id]
    );
    
    if (!existingReminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    // Validation
    if (!title || !category || !scheduled_date_time || !priority) {
      return res.status(400).json({
        success: false,
        error: 'Title, category, scheduled date/time, and priority are required'
      });
    }
    
    if (recurrence === 'Custom Days' && (!custom_days || custom_days < 1)) {
      return res.status(400).json({
        success: false,
        error: 'Custom days must be at least 1'
      });
    }
    
    // Determine status based on scheduled date/time (only if not completed)
    const scheduledDate = new Date(scheduled_date_time);
    const now = new Date();
    let status = existingReminder.status;
    if (status !== 'Completed') {
      status = scheduledDate <= now ? 'Overdue' : 'Pending';
    }
    
    await database.run(
      `UPDATE reminders 
       SET title = ?, category = ?, scheduled_date_time = ?, recurrence = ?, 
           custom_days = ?, description = ?, priority = ?, status = ?, 
           next_trigger = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title, 
        category, 
        scheduled_date_time, 
        recurrence, 
        recurrence === 'Custom Days' ? custom_days : null,
        description || null, 
        priority, 
        status,
        next_trigger || null,
        id
      ]
    );
    
    const updatedReminder = await database.get(
      'SELECT * FROM reminders WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: updatedReminder
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update reminder',
      message: error.message
    });
  }
});

// Update reminder status (for snooze/complete)
router.patch('/:id/status', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, next_trigger } = req.body;
    
    if (!status || !['Pending', 'Completed', 'Overdue'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required'
      });
    }
    
    const reminder = await database.get(
      'SELECT * FROM reminders WHERE id = ?',
      [id]
    );
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    await database.run(
      `UPDATE reminders 
       SET status = ?, next_trigger = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, next_trigger || null, id]
    );
    
    const updatedReminder = await database.get(
      'SELECT * FROM reminders WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Reminder status updated successfully',
      data: updatedReminder
    });
  } catch (error) {
    console.error('Error updating reminder status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update reminder status',
      message: error.message
    });
  }
});

// Delete reminder
router.delete('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await database.run(
      'DELETE FROM reminders WHERE id = ?',
      [id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete reminder',
      message: error.message
    });
  }
});

module.exports = router;
