const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');
const { authenticate, adminOnly } = require('../middleware/auth');
const { validateLogin, validateCreateUser, validateUpdatePin, validateId } = require('../middleware/validation');

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { pin } = req.body;
    
    const result = await authService.login(pin);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    await authService.logout(req.token);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

// Get current user info
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    }
  });
});

// Get all users (Admin only)
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Create new user (Admin only)
router.post('/users', authenticate, adminOnly, validateCreateUser, async (req, res) => {
  try {
    const { name, pin, role } = req.body;
    
    const user = await authService.createUser({ name, pin, role });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// Update user PIN
router.put('/users/:id/pin', authenticate, validateId, validateUpdatePin, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPin, newPin } = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    
    // Users can only change their own PIN unless they are admin
    if (parseInt(id) !== requesterId && requesterRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only change your own PIN'
      });
    }
    
    // Verify current PIN if user is changing their own PIN
    if (parseInt(id) === requesterId) {
      const user = await authService.findUserByPin(currentPin);
      if (!user || user.id !== requesterId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid current PIN'
        });
      }
    }
    
    await authService.updateUserPin(id, newPin);
    
    res.json({
      success: true,
      message: 'PIN updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update PIN',
      message: error.message
    });
  }
});

// Deactivate user (Admin only)
router.put('/users/:id/deactivate', authenticate, adminOnly, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deactivating themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account'
      });
    }
    
    await authService.deactivateUser(id);
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user',
      message: error.message
    });
  }
});

// Reactivate user (Admin only)
router.put('/users/:id/activate', authenticate, adminOnly, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    await authService.reactivateUser(id);
    
    res.json({
      success: true,
      message: 'User reactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reactivate user',
      message: error.message
    });
  }
});

module.exports = router;