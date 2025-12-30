const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, posUser, adminUser } = require('../middleware/auth');
const { validateCategory, validateId, validatePagination } = require('../middleware/validation');

// Get all categories with search and pagination
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM categories 
      WHERE 1 = 1
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM categories 
      WHERE 1 = 1
    `;
    
    const params = [];
    
    if (search.trim()) {
      query += ` AND (name LIKE ? OR description LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const [categories, countResult] = await Promise.all([
      database.all(query, params),
      database.get(countQuery, params.slice(0, params.length - 2))
    ]);
    
    res.json({
      success: true,
      data: categories || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// Get single category
router.get('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await database.get(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
      message: error.message
    });
  }
});

// Create category
router.post('/', authenticate, adminUser, validateCategory, async (req, res) => {
  try {
    const { name, description = '', color = '#0d9488' } = req.body;
    
    // Check if category already exists
    const existing = await database.get(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );
    
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Category already exists',
        message: `A category with name "${name}" already exists`
      });
    }
    
    const result = await database.run(
      `INSERT INTO categories (name, description, color)
       VALUES (?, ?, ?)`,
      [name, description, color]
    );
    
    const newCategory = await database.get(
      'SELECT * FROM categories WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create category',
      message: error.message
    });
  }
});

// Update category
router.put('/:id', authenticate, adminUser, validateId, validateCategory, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description = '', color = '#0d9488' } = req.body;
    
    const existingCategory = await database.get(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );
    
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Check if new name already exists (excluding current category)
    const duplicateName = await database.get(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [name, id]
    );
    
    if (duplicateName) {
      return res.status(409).json({
        success: false,
        error: 'Category name already exists',
        message: `Another category with name "${name}" already exists`
      });
    }
    
    await database.run(
      `UPDATE categories 
       SET name = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, color, id]
    );
    
    const updatedCategory = await database.get(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
      message: error.message
    });
  }
});

// Delete category
router.delete('/:id', authenticate, adminUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await database.get(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );
    
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Check if any products use this category
    const productsUsingCategory = await database.get(
      'SELECT COUNT(*) as count FROM products WHERE category = (SELECT name FROM categories WHERE id = ?)',
      [id]
    );
    
    if (productsUsingCategory.count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category',
        message: `This category is used by ${productsUsingCategory.count} product(s). Please remove products first.`
      });
    }
    
    await database.run(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
});

// Search categories (for quick search)
router.get('/search/:query', authenticate, posUser, async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    
    const categories = await database.all(
      `SELECT * FROM categories 
       WHERE (name LIKE ? OR description LIKE ?) 
       ORDER BY name ASC LIMIT 20`,
      [searchTerm, searchTerm]
    );
    
    res.json({
      success: true,
      data: categories || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search categories',
      message: error.message
    });
  }
});

module.exports = router;
