const authService = require('../services/auth-service');

// Authenticate middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please provide a valid token'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = authService.verifyToken(token);
    
    // Check if session is still valid
    const isSessionValid = await authService.isSessionValid(token);
    
    if (!isSessionValid) {
      return res.status(401).json({
        error: 'Session expired',
        message: 'Please login again'
      });
    }

    // Add user info to request
    req.user = decoded;
    req.token = token;
    
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      message: error.message
    });
  }
};

// Authorize roles middleware
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This action requires ${allowedRoles.join(' or ')} role`
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize(['admin']);

// Admin or Cashier middleware
const posUser = authorize(['admin', 'cashier']);

// Admin only middleware
const adminUser = authorize(['admin']);

module.exports = {
  authenticate,
  authorize,
  adminOnly,
  posUser,
  adminUser
};