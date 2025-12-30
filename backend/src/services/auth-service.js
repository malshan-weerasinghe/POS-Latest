const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('../models/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  // Login with PIN
  async login(pin) {
    try {
      // Find user by PIN
      const user = await this.findUserByPin(pin);
      
      if (!user) {
        throw new Error('Invalid PIN');
      }

      if (!user.is_active) {
        throw new Error('Account is deactivated');
      }

      // Generate JWT token
      const token = this.generateToken(user);
      
      // Store session in database
      await this.createSession(user.id, token);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Find user by PIN (with hash comparison)
  async findUserByPin(pin) {
    try {
      const users = await database.all('SELECT * FROM users WHERE is_active = 1');
      
      for (const user of users) {
        const isMatch = await bcrypt.compare(pin, user.pin_hash);
        if (isMatch) {
          return user;
        }
      }
      
      return null;
    } catch (error) {
      throw new Error('Error finding user: ' + error.message);
    }
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Create session record
  async createSession(userId, token) {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

      await database.run(
        'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt.toISOString()]
      );
    } catch (error) {
      console.error('Error creating session:', error.message);
    }
  }

  // Logout (deactivate session)
  async logout(token) {
    try {
      await database.run(
        'UPDATE user_sessions SET is_active = 0 WHERE session_token = ?',
        [token]
      );
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  }

  // Check if session is valid
  async isSessionValid(token) {
    try {
      const session = await database.get(
        'SELECT * FROM user_sessions WHERE session_token = ? AND is_active = 1',
        [token]
      );

      if (!session) {
        return false;
      }

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      
      if (now > expiresAt) {
        // Mark session as inactive
        await database.run(
          'UPDATE user_sessions SET is_active = 0 WHERE session_token = ?',
          [token]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking session validity:', error.message);
      return false;
    }
  }

  // Create new user (Admin only)
  async createUser(userData) {
    try {
      const { name, pin, role } = userData;
      
      // Hash PIN
      const pinHash = await bcrypt.hash(pin, 12);
      
      const result = await database.run(
        'INSERT INTO users (name, pin_hash, role) VALUES (?, ?, ?)',
        [name, pinHash, role]
      );

      return {
        id: result.lastID,
        name,
        role,
        is_active: 1,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  // Update user PIN
  async updateUserPin(userId, newPin) {
    try {
      const pinHash = await bcrypt.hash(newPin, 12);
      
      await database.run(
        'UPDATE users SET pin_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [pinHash, userId]
      );
    } catch (error) {
      throw new Error('Error updating PIN: ' + error.message);
    }
  }

  // Get all users (Admin only)
  async getAllUsers() {
    try {
      const users = await database.all(
        'SELECT id, name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
      return users;
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }

  // Deactivate user (Admin only)
  async deactivateUser(userId) {
    try {
      await database.run(
        'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
      
      // Deactivate all sessions for this user
      await database.run(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      throw new Error('Error deactivating user: ' + error.message);
    }
  }

  // Reactivate user (Admin only)
  async reactivateUser(userId) {
    try {
      await database.run(
        'UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
    } catch (error) {
      throw new Error('Error reactivating user: ' + error.message);
    }
  }
}

module.exports = new AuthService();