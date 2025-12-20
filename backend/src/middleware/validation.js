const { body, param, query, validationResult } = require('express-validator');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Login validation
const validateLogin = [
  body('pin')
    .isLength({ min: 4, max: 8 })
    .withMessage('PIN must be between 4-8 characters')
    .isNumeric()
    .withMessage('PIN must contain only numbers'),
  handleValidationErrors
];

// Create user validation
const validateCreateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('pin')
    .isLength({ min: 4, max: 8 })
    .withMessage('PIN must be between 4-8 characters')
    .isNumeric()
    .withMessage('PIN must contain only numbers'),
  body('role')
    .isIn(['admin', 'cashier'])
    .withMessage('Role must be either admin or cashier'),
  handleValidationErrors
];

// Update PIN validation
const validateUpdatePin = [
  body('currentPin')
    .isLength({ min: 4, max: 8 })
    .withMessage('Current PIN must be between 4-8 characters')
    .isNumeric()
    .withMessage('Current PIN must contain only numbers'),
  body('newPin')
    .isLength({ min: 4, max: 8 })
    .withMessage('New PIN must be between 4-8 characters')
    .isNumeric()
    .withMessage('New PIN must contain only numbers'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2-200 characters'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3-50 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('cost_price')
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a positive number'),
  body('sale_price')
    .isFloat({ min: 0 })
    .withMessage('Sale price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be maximum 100 characters'),
  body('warranty_months')
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage('Warranty months must be between 0-60'),
  handleValidationErrors
];

// Customer validation
const validateCustomer = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2-100 characters'),
  body('phone')
    .trim()
    .matches(/^(?:\+94|0)?[0-9]{9,10}$/)
    .withMessage('Phone number must be a valid Sri Lankan number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be valid'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must be maximum 500 characters'),
  handleValidationErrors
];

// Sale validation
const validateSale = [
  body('customer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Customer ID must be a positive integer'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Sale must contain at least one item'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('items.*.unit_price')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('items.*.discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a positive number'),
  body('payment_method')
    .isIn(['cash', 'card'])
    .withMessage('Payment method must be cash or card'),
  body('amount_received')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount received must be a positive number'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1-100'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateCreateUser,
  validateUpdatePin,
  validateProduct,
  validateCustomer,
  validateSale,
  validateId,
  validatePagination,
  handleValidationErrors
};