const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, adminOnly, posUser } = require('../middleware/auth');
const { validateProduct, validateId, validatePagination } = require('../middleware/validation');
const { generateSKU, generateBarcode } = require('../utils/productUtils');

// Get all products with suppliers (aggregated view for POS)
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.barcode,
        p.category,
        p.warranty_months,
        ps.stock,
        ps.sale_price,
        ps.cost_price,
        ps.reorder_level,
        ps.supplier_id,
        s.name as supplier_name,
        ps.id as product_supplier_id,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN product_suppliers ps ON p.id = ps.product_id
      LEFT JOIN suppliers s ON ps.supplier_id = s.id
      WHERE p.is_active = 1
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p
      LEFT JOIN product_suppliers ps ON p.id = ps.product_id
      WHERE p.is_active = 1
    `;
    
    const params = [];
    const countParams = [];
    
    // Add search filter
    if (search) {
      query += ` AND (p.name LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?)`;
      countQuery += ` AND (p.name LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add category filter
    if (category) {
      query += ` AND p.category = ?`;
      countQuery += ` AND p.category = ?`;
      params.push(category);
      countParams.push(category);
    }
    
    // Add ordering/pagination
    query += ` ORDER BY p.name ASC, s.name ASC LIMIT ? OFFSET ?`;
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

// Get all products (SKUs only) for dropdown
router.get('/meta/skus', authenticate, posUser, async (req, res) => {
  try {
    const products = await database.all(
      'SELECT id, name, sku, barcode, category, warranty_months FROM products WHERE is_active = 1 ORDER BY name ASC'
    );
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product SKUs',
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

// Create new product with supplier (Admin only)
router.post('/', authenticate, adminOnly, validateProduct, async (req, res) => {
  try {
    const { 
      product_id, // Optional: for adding to existing product
      name, 
      supplier_id,
      cost_price, 
      sale_price, 
      stock = 0, 
      reorder_level = 5,
      category = '', 
      warranty_months = 0 
    } = req.body;
    
    let productId = product_id;
    
    // If no product_id provided, create new product
    if (!productId) {
      // Generate SKU and barcode
      const sku = await generateSKU(database, name, category);
      const barcode = await generateBarcode(database);
      
      const result = await database.run(
        `INSERT INTO products (name, sku, barcode, category, warranty_months)
         VALUES (?, ?, ?, ?, ?)`,
        [name, sku, barcode, category, warranty_months]
      );
      
      productId = result.lastID;
    }
    
    // Check if this supplier already supplies this product
    const existingLink = await database.get(
      'SELECT id FROM product_suppliers WHERE product_id = ? AND supplier_id = ?',
      [productId, supplier_id]
    );
    
    if (existingLink) {
      return res.status(409).json({
        success: false,
        error: 'This supplier already supplies this product'
      });
    }
    
    // Add supplier-product link
    await database.run(
      `INSERT INTO product_suppliers (product_id, supplier_id, cost_price, sale_price, stock, reorder_level)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, supplier_id, cost_price, sale_price, stock, reorder_level]
    );
    
    // Get the complete product with supplier info
    const product = await database.get(
      `SELECT p.*, ps.cost_price, ps.sale_price, ps.stock, ps.reorder_level, s.name as supplier_name
       FROM products p
       JOIN product_suppliers ps ON p.id = ps.product_id
       JOIN suppliers s ON ps.supplier_id = s.id
       WHERE p.id = ? AND ps.supplier_id = ?`,
      [productId, supplier_id]
    );
    
    res.status(201).json({
      success: true,
      message: product_id ? 'Supplier added to product successfully' : 'Product created successfully',
      data: product
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