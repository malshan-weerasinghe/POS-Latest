const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, posUser, adminUser } = require('../middleware/auth');
const { validateSupplier, validateId, validatePagination } = require('../middleware/validation');

// Get all suppliers with search and pagination
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM suppliers 
      WHERE 1 = 1
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM suppliers 
      WHERE 1 = 1
    `;
    const params = [];
    const countParams = [];
    
    // Add search filter
    if (search) {
      query += ` AND (name LIKE ? OR contact_person LIKE ? OR phone LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR contact_person LIKE ? OR phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add ordering and pagination
    query += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [suppliers, countResult] = await Promise.all([
      database.all(query, params),
      database.get(countQuery, countParams)
    ]);
    
    const totalPages = Math.ceil(countResult.total / limit);
    
    res.json({
      success: true,
      data: {
        suppliers,
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
      error: 'Failed to fetch suppliers',
      message: error.message
    });
  }
});

// Search suppliers by name or contact person (for quick search)
router.get('/search/:query', authenticate, posUser, async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    
    const suppliers = await database.all(
      `SELECT * FROM suppliers 
       WHERE (name LIKE ? OR contact_person LIKE ? OR phone LIKE ?) 
       ORDER BY 
         CASE 
           WHEN name LIKE ? THEN 1
           WHEN contact_person LIKE ? THEN 2
           ELSE 3
         END,
         name ASC
       LIMIT 10`,
      [searchTerm, searchTerm, searchTerm, `${query}%`, `${query}%`]
    );
    
    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search suppliers',
      message: error.message
    });
  }
});

// Get single supplier
router.get('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const supplier = await database.get(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      });
    }
    
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supplier',
      message: error.message
    });
  }
});

// Create new supplier
router.post('/', authenticate, posUser, validateSupplier, async (req, res) => {
  try {
    const { name, contact_person, phone, email = null, address = null, payment_terms = 'Net 30' } = req.body;
    
    const result = await database.run(
      `INSERT INTO suppliers (name, contact_person, phone, email, address, payment_terms)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, contact_person, phone, email, address, payment_terms]
    );
    
    const newSupplier = await database.get(
      'SELECT * FROM suppliers WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: newSupplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create supplier',
      message: error.message
    });
  }
});

// Update supplier
router.put('/:id', authenticate, posUser, validateId, validateSupplier, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, email, address, payment_terms } = req.body;
    
    // Check if supplier exists
    const existingSupplier = await database.get(
      'SELECT id FROM suppliers WHERE id = ?',
      [id]
    );
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      });
    }
    
    await database.run(
      `UPDATE suppliers 
       SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?, payment_terms = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, contact_person, phone, email, address, payment_terms, id]
    );
    
    const updatedSupplier = await database.get(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update supplier',
      message: error.message
    });
  }
});

// Update supplier status
router.patch('/:id/status', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either active or inactive'
      });
    }
    
    await database.run(
      'UPDATE suppliers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    
    const updatedSupplier = await database.get(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: `Supplier ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: updatedSupplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update supplier status',
      message: error.message
    });
  }
});

// Delete supplier (permanent delete)
router.delete('/:id', authenticate, adminUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier exists
    const existingSupplier = await database.get(
      'SELECT id FROM suppliers WHERE id = ?',
      [id]
    );
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      });
    }
    
    await database.run(
      'DELETE FROM suppliers WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete supplier',
      message: error.message
    });
  }
});

// Get supplier statistics
router.get('/stats/overview', authenticate, posUser, async (req, res) => {
  try {
    const totalSuppliers = await database.get('SELECT COUNT(*) as total FROM suppliers');
    
    res.json({
      success: true,
      data: {
        total: totalSuppliers.total,
        active: totalSuppliers.total,
        inactive: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supplier statistics',
      message: error.message
    });
  }
});

module.exports = router;