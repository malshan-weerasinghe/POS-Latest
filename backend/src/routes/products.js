const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, adminOnly, posUser } = require('../middleware/auth');
const { validateProduct, validateId, validatePagination } = require('../middleware/validation');

// Get all products with search and pagination
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM products 
      WHERE is_active = 1
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM products 
      WHERE is_active = 1
    `;
    const params = [];
    const countParams = [];
    
    // Add search filter
    if (search) {
      query += ` AND (name LIKE ? OR sku LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR sku LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }
    
    // Add category filter
    if (category) {
      query += ` AND category = ?`;
      countQuery += ` AND category = ?`;
      params.push(category);
      countParams.push(category);
    }
    
    // Add ordering and pagination
    query += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [products, countResult] = await Promise.all([
      database.all(query, params),
      database.get(countQuery, countParams)
    ]);
    
    const totalPages = Math.ceil(countResult.total / limit);
    
    res.json({
      success: true,
      data: {
        products,
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
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// Get single product
router.get('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await database.get(
      'SELECT * FROM products WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// Search products by name or SKU (for POS search)
router.get('/search/:query', authenticate, posUser, async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    
    const products = await database.all(
      `SELECT * FROM products 
       WHERE is_active = 1 
       AND (name LIKE ? OR sku LIKE ?) 
       ORDER BY 
         CASE 
           WHEN name LIKE ? THEN 1
           WHEN sku LIKE ? THEN 2
           ELSE 3
         END,
         name ASC
       LIMIT 10`,
      [searchTerm, searchTerm, `${query}%`, `${query}%`]
    );
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search products',
      message: error.message
    });
  }
});

// Create new product (Admin only)
router.post('/', authenticate, adminOnly, validateProduct, async (req, res) => {
  try {
    const { name, sku, cost_price, sale_price, stock = 0, category = '', warranty_months = 0 } = req.body;
    
    // Check if SKU already exists
    const existingProduct = await database.get(
      'SELECT id FROM products WHERE sku = ?',
      [sku]
    );
    
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        error: 'SKU already exists'
      });
    }
    
    const result = await database.run(
      `INSERT INTO products (name, sku, cost_price, sale_price, stock, category, warranty_months)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, cost_price, sale_price, stock, category, warranty_months]
    );
    
    const newProduct = await database.get(
      'SELECT * FROM products WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, adminOnly, validateId, validateProduct, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, cost_price, sale_price, stock, category, warranty_months } = req.body;
    
    // Check if product exists
    const existingProduct = await database.get(
      'SELECT * FROM products WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check if SKU is being changed and if it conflicts with another product
    if (sku !== existingProduct.sku) {
      const skuConflict = await database.get(
        'SELECT id FROM products WHERE sku = ? AND id != ?',
        [sku, id]
      );
      
      if (skuConflict) {
        return res.status(409).json({
          success: false,
          error: 'SKU already exists'
        });
      }
    }
    
    await database.run(
      `UPDATE products 
       SET name = ?, sku = ?, cost_price = ?, sale_price = ?, stock = ?, 
           category = ?, warranty_months = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, sku, cost_price, sale_price, stock, category, warranty_months, id]
    );
    
    const updatedProduct = await database.get(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// Update product stock
router.patch('/:id/stock', authenticate, adminOnly, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock must be a non-negative number'
      });
    }
    
    const result = await database.run(
      'UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1',
      [stock, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const updatedProduct = await database.get(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update stock',
      message: error.message
    });
  }
});

// Delete product (soft delete - Admin only)
router.delete('/:id', authenticate, adminOnly, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await database.run(
      'UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// Get product categories
router.get('/meta/categories', authenticate, posUser, async (req, res) => {
  try {
    const categories = await database.all(
      `SELECT DISTINCT category FROM products 
       WHERE is_active = 1 AND category IS NOT NULL AND category != ''
       ORDER BY category ASC`
    );
    
    res.json({
      success: true,
      data: categories.map(row => row.category)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

module.exports = router;