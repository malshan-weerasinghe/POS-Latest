const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, posUser } = require('../middleware/auth');
const { validateCustomer, validateId, validatePagination } = require('../middleware/validation');

// Get all customers with search and pagination
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM customers 
      WHERE is_active = 1
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM customers 
      WHERE is_active = 1
    `;
    const params = [];
    const countParams = [];
    
    // Add search filter
    if (search) {
      query += ` AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add ordering and pagination
    query += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [customers, countResult] = await Promise.all([
      database.all(query, params),
      database.get(countQuery, countParams)
    ]);
    
    const totalPages = Math.ceil(countResult.total / limit);
    
    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_records: countResult.total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
      message: error.message
    });
  }
});

// Search customers by name or phone (for POS search)
router.get('/search/:query', authenticate, posUser, async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    
    const customers = await database.all(
      `SELECT * FROM customers 
       WHERE is_active = 1 
       AND (name LIKE ? OR phone LIKE ?) 
       ORDER BY 
         CASE 
           WHEN phone LIKE ? THEN 1
           WHEN name LIKE ? THEN 2
           ELSE 3
         END,
         name ASC
       LIMIT 10`,
      [searchTerm, searchTerm, `${query}%`, `${query}%`]
    );
    
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search customers',
      message: error.message
    });
  }
});

// Get single customer
router.get('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await database.get(
      'SELECT * FROM customers WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
      message: error.message
    });
  }
});

// Get customer by phone number
router.get('/phone/:phone', authenticate, posUser, async (req, res) => {
  try {
    const { phone } = req.params;
    
    const customer = await database.get(
      'SELECT * FROM customers WHERE phone = ? AND is_active = 1',
      [phone]
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
      message: error.message
    });
  }
});

// Create new customer
router.post('/', authenticate, posUser, validateCustomer, async (req, res) => {
  try {
    const { name, phone, email = null, address = null } = req.body;
    
    // Check if phone number already exists
    const existingCustomer = await database.get(
      'SELECT id FROM customers WHERE phone = ?',
      [phone]
    );
    
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        error: 'Customer with this phone number already exists'
      });
    }
    
    const result = await database.run(
      `INSERT INTO customers (name, phone, email, address)
       VALUES (?, ?, ?, ?)`,
      [name, phone, email, address]
    );
    
    const newCustomer = await database.get(
      'SELECT * FROM customers WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: newCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create customer',
      message: error.message
    });
  }
});

// Update customer
router.put('/:id', authenticate, posUser, validateId, validateCustomer, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    
    // Check if customer exists
    const existingCustomer = await database.get(
      'SELECT * FROM customers WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    // Check if phone is being changed and if it conflicts with another customer
    if (phone !== existingCustomer.phone) {
      const phoneConflict = await database.get(
        'SELECT id FROM customers WHERE phone = ? AND id != ?',
        [phone, id]
      );
      
      if (phoneConflict) {
        return res.status(409).json({
          success: false,
          error: 'Phone number already exists'
        });
      }
    }
    
    await database.run(
      `UPDATE customers 
       SET name = ?, phone = ?, email = ?, address = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, phone, email, address, id]
    );
    
    const updatedCustomer = await database.get(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update customer',
      message: error.message
    });
  }
});

// Delete customer (soft delete)
router.delete('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await database.run(
      'UPDATE customers SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete customer',
      message: error.message
    });
  }
});

// Get customer purchase history
router.get('/:id/purchases', authenticate, posUser, validateId, validatePagination, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Check if customer exists
    const customer = await database.get(
      'SELECT id FROM customers WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const [sales, countResult] = await Promise.all([
      database.all(
        `SELECT s.*, u.name as cashier_name
         FROM sales s
         LEFT JOIN users u ON s.cashier_id = u.id
         WHERE s.customer_id = ?
         ORDER BY s.sale_date DESC
         LIMIT ? OFFSET ?`,
        [id, parseInt(limit), parseInt(offset)]
      ),
      database.get(
        'SELECT COUNT(*) as total FROM sales WHERE customer_id = ?',
        [id]
      )
    ]);
    
    const totalPages = Math.ceil(countResult.total / limit);
    
    res.json({
      success: true,
      data: {
        sales,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_records: countResult.total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch purchase history',
      message: error.message
    });
  }
});

module.exports = router;