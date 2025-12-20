// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('pos_auth_token');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('pos_auth_token', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('pos_auth_token');
};

// API request helper with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      removeAuthToken();
      window.location.reload(); // Force re-login
      throw new Error('Authentication required');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Login with PIN
  login: async (pin) => {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
    
    if (result.success && result.data.token) {
      setAuthToken(result.data.token);
    }
    
    return result;
  },

  // Logout
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  // Get all users (Admin only)
  getUsers: async () => {
    return await apiRequest('/auth/users');
  },

  // Create new user (Admin only)
  createUser: async (userData) => {
    return await apiRequest('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update PIN
  updatePin: async (userId, currentPin, newPin) => {
    return await apiRequest(`/auth/users/${userId}/pin`, {
      method: 'PUT',
      body: JSON.stringify({ currentPin, newPin }),
    });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Products API
export const productsAPI = {
  // Get all products with optional search and pagination
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await apiRequest(endpoint);
  },

  // Search products for POS
  search: async (query) => {
    if (!query.trim()) return { success: true, data: [] };
    return await apiRequest(`/products/search/${encodeURIComponent(query)}`);
  },

  // Get single product
  getById: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  // Create product (Admin only)
  create: async (productData) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (Admin only)
  update: async (id, productData) => {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Update stock (Admin only)
  updateStock: async (id, stock) => {
    return await apiRequest(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },

  // Delete product (Admin only)
  delete: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Get categories
  getCategories: async () => {
    return await apiRequest('/products/meta/categories');
  },
};

// Customers API
export const customersAPI = {
  // Get all customers with optional search and pagination
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/customers?${queryString}` : '/customers';
    return await apiRequest(endpoint);
  },

  // Search customers for POS
  search: async (query) => {
    if (!query.trim()) return { success: true, data: [] };
    return await apiRequest(`/customers/search/${encodeURIComponent(query)}`);
  },

  // Get single customer
  getById: async (id) => {
    return await apiRequest(`/customers/${id}`);
  },

  // Get customer by phone
  getByPhone: async (phone) => {
    return await apiRequest(`/customers/phone/${encodeURIComponent(phone)}`);
  },

  // Create customer
  create: async (customerData) => {
    return await apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  // Update customer
  update: async (id, customerData) => {
    return await apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  // Delete customer
  delete: async (id) => {
    return await apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  },

  // Get customer purchase history
  getPurchases: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/customers/${id}/purchases?${queryString}` : `/customers/${id}/purchases`;
    return await apiRequest(endpoint);
  },
};

// Sales API
export const salesAPI = {
  // Get all sales with optional filters and pagination
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sales?${queryString}` : '/sales';
    return await apiRequest(endpoint);
  },

  // Get single sale
  getById: async (id) => {
    return await apiRequest(`/sales/${id}`);
  },

  // Create new sale
  create: async (saleData) => {
    return await apiRequest('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  // Get dashboard summary
  getDashboardSummary: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sales/dashboard/summary?${queryString}` : '/sales/dashboard/summary';
    return await apiRequest(endpoint);
  },

  // Get sales reports by date
  getReportsByDate: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/sales/reports/by-date?${queryString}` : '/sales/reports/by-date';
    return await apiRequest(endpoint);
  },
};

// API utilities
export const apiUtils = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated: authAPI.isAuthenticated,
};

export default {
  auth: authAPI,
  products: productsAPI,
  customers: customersAPI,
  sales: salesAPI,
  utils: apiUtils,
};