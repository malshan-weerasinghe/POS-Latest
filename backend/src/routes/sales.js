const express = require('express');
const router = express.Router();
const database = require('../models/database');
const { authenticate, posUser } = require('../middleware/auth');
const { validateSale, validateId, validatePagination } = require('../middleware/validation');

// Generate invoice number
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const timestamp = Date.now().toString().slice(-5);
  return `INV${year}${month}-${timestamp}`;
};

// Get all sales with pagination and filters
router.get('/', authenticate, posUser, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 50, start_date, end_date, cashier_id } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT s.*, c.name as customer_name, c.phone as customer_phone, u.name as cashier_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN users u ON s.cashier_id = u.id
      WHERE 1 = 1
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM sales s WHERE 1 = 1
    `;
    const params = [];
    const countParams = [];
    
    // Add date range filter
    if (start_date) {
      query += ` AND DATE(s.sale_date) >= ?`;
      countQuery += ` AND DATE(s.sale_date) >= ?`;
      params.push(start_date);
      countParams.push(start_date);
    }
    
    if (end_date) {
      query += ` AND DATE(s.sale_date) <= ?`;
      countQuery += ` AND DATE(s.sale_date) <= ?`;
      params.push(end_date);
      countParams.push(end_date);
    }
    
    // Add cashier filter
    if (cashier_id) {
      query += ` AND s.cashier_id = ?`;
      countQuery += ` AND s.cashier_id = ?`;
      params.push(cashier_id);
      countParams.push(cashier_id);
    }
    
    // Add ordering and pagination
    query += ` ORDER BY s.sale_date DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [sales, countResult] = await Promise.all([
      database.all(query, params),
      database.get(countQuery, countParams)
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
      error: 'Failed to fetch sales',
      message: error.message
    });
  }
});

// Get single sale with items
router.get('/:id', authenticate, posUser, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get sale with customer and cashier info
    const sale = await database.get(
      `SELECT s.*, c.name as customer_name, c.phone as customer_phone, 
              c.email as customer_email, c.address as customer_address,
              u.name as cashier_name
       FROM sales s
       LEFT JOIN customers c ON s.customer_id = c.id
       LEFT JOIN users u ON s.cashier_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }
    
    // Get sale items
    const items = await database.all(
      `SELECT si.*, p.name as product_name, p.sku, p.warranty_months
       FROM sale_items si
       LEFT JOIN products p ON si.product_id = p.id
       WHERE si.sale_id = ?`,
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...sale,
        items
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sale',
      message: error.message
    });
  }
});

// Create new sale
router.post('/', authenticate, posUser, validateSale, async (req, res) => {
  try {
    const { customer_id, items, payment_method, amount_received } = req.body;
    const cashier_id = req.user.id;
    
    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    
    // Validate items and calculate totals
    for (const item of items) {
      const product = await database.get(
        'SELECT * FROM products WHERE id = ? AND is_active = 1',
        [item.product_id]
      );
      
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product with ID ${item.product_id} not found`
        });
      }
      
      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`
        });
      }
      
      const lineSubtotal = item.unit_price * item.quantity;
      const lineDiscount = item.discount || 0;
      
      subtotal += lineSubtotal;
      totalDiscount += lineDiscount;
    }
    
    const grand_total = subtotal - totalDiscount;
    const change_amount = payment_method === 'cash' && amount_received ? 
      Math.max(0, amount_received - grand_total) : 0;
    
    // Validate cash payment
    if (payment_method === 'cash') {
      if (!amount_received || amount_received < grand_total) {
        return res.status(400).json({
          success: false,
          error: 'Amount received must be greater than or equal to grand total'
        });
      }
    }
    
    const invoice_number = generateInvoiceNumber();
    
    // Start transaction (using serialize for SQLite)
    try {
      await database.run('BEGIN TRANSACTION');
      
      // Create sale record
      const saleResult = await database.run(
        `INSERT INTO sales (invoice_number, customer_id, cashier_id, subtotal, discount, 
                           grand_total, payment_method, amount_received, change_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [invoice_number, customer_id, cashier_id, subtotal, totalDiscount, 
         grand_total, payment_method, amount_received, change_amount]
      );
      
      const sale_id = saleResult.lastID;
      
      // Create sale items and update stock
      for (const item of items) {
        const line_total = (item.unit_price * item.quantity) - (item.discount || 0);
        
        // Insert sale item
        await database.run(
          `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, discount, line_total)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [sale_id, item.product_id, item.quantity, item.unit_price, item.discount || 0, line_total]
        );
        
        // Update product stock
        await database.run(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      await database.run('COMMIT');
      
      // Get the complete sale data to return
      const newSale = await database.get(
        `SELECT s.*, c.name as customer_name, c.phone as customer_phone,
                u.name as cashier_name
         FROM sales s
         LEFT JOIN customers c ON s.customer_id = c.id
         LEFT JOIN users u ON s.cashier_id = u.id
         WHERE s.id = ?`,
        [sale_id]
      );
      
      const saleItems = await database.all(
        `SELECT si.*, p.name as product_name, p.sku, p.warranty_months
         FROM sale_items si
         LEFT JOIN products p ON si.product_id = p.id
         WHERE si.sale_id = ?`,
        [sale_id]
      );
      
      res.status(201).json({
        success: true,
        message: 'Sale completed successfully',
        data: {
          ...newSale,
          items: saleItems
        }
      });
      
    } catch (error) {
      await database.run('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create sale',
      message: error.message
    });
  }
});

// Get sales summary/dashboard data
router.get('/dashboard/summary', authenticate, posUser, async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    // Today's sales
    const todayStats = await database.get(
      `SELECT 
         COUNT(*) as total_sales,
         COALESCE(SUM(grand_total), 0) as total_revenue,
         COALESCE(SUM(subtotal - (SELECT SUM(si.quantity * p.cost_price) 
                                  FROM sale_items si 
                                  JOIN products p ON si.product_id = p.id 
                                  WHERE si.sale_id = s.id)), 0) as total_profit
       FROM sales s
       WHERE DATE(s.sale_date) = ?`,
      [date]
    );
    
    // This month's sales
    const monthStart = new Date(date);
    monthStart.setDate(1);
    const monthStats = await database.get(
      `SELECT 
         COUNT(*) as total_sales,
         COALESCE(SUM(grand_total), 0) as total_revenue
       FROM sales s
       WHERE DATE(s.sale_date) >= ? AND DATE(s.sale_date) <= ?`,
      [monthStart.toISOString().split('T')[0], date]
    );
    
    // Top selling products (this month)
    const topProducts = await database.all(
      `SELECT p.name, p.sku, SUM(si.quantity) as total_sold,
              SUM(si.line_total) as total_revenue
       FROM sale_items si
       JOIN products p ON si.product_id = p.id
       JOIN sales s ON si.sale_id = s.id
       WHERE DATE(s.sale_date) >= ? AND DATE(s.sale_date) <= ?
       GROUP BY si.product_id
       ORDER BY total_sold DESC
       LIMIT 5`,
      [monthStart.toISOString().split('T')[0], date]
    );
    
    // Payment method breakdown (today)
    const paymentMethods = await database.all(
      `SELECT payment_method, COUNT(*) as count, SUM(grand_total) as total
       FROM sales
       WHERE DATE(sale_date) = ?
       GROUP BY payment_method`,
      [date]
    );
    
    res.json({
      success: true,
      data: {
        today: todayStats,
        month: monthStats,
        top_products: topProducts,
        payment_methods: paymentMethods,
        date: date
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard summary',
      message: error.message
    });
  }
});

// Get sales by date range (for reports)
router.get('/reports/by-date', authenticate, posUser, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'start_date and end_date are required'
      });
    }
    
    const sales = await database.all(
      `SELECT 
         DATE(sale_date) as sale_date,
         COUNT(*) as total_sales,
         SUM(grand_total) as total_revenue,
         SUM(discount) as total_discount,
         COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_sales,
         COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_sales
       FROM sales
       WHERE DATE(sale_date) >= ? AND DATE(sale_date) <= ?
       GROUP BY DATE(sale_date)
       ORDER BY sale_date DESC`,
      [start_date, end_date]
    );
    
    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales report',
      message: error.message
    });
  }
});

module.exports = router;