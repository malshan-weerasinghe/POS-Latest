// API Configuration
// Detect if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI;

// Get API base URL - dynamically from Electron or fallback to default
let API_BASE_URL = 'http://localhost:5000/api';
let backendUrlPromise = null;

// Initialize API base URL
const initializeApiBaseUrl = async () => {
  if (isElectron && window.electronAPI) {
    try {
      // Get backend URL from Electron main process
      const backendUrl = await window.electronAPI.getBackendURL();
      if (backendUrl) {
        API_BASE_URL = `${backendUrl}/api`;
        console.log('Using Electron backend URL:', API_BASE_URL);
      }
      
      // Also listen for backend URL ready event (in case it's not ready yet)
      if (window.electronAPI.onBackendURLReady) {
        window.electronAPI.onBackendURLReady((url) => {
          API_BASE_URL = `${url}/api`;
          console.log('Backend URL updated:', API_BASE_URL);
        });
      }
    } catch (error) {
      console.error('Failed to get backend URL from Electron:', error);
      // Fallback to default
      API_BASE_URL = 'http://localhost:5000/api';
    }
  } else {
    // Browser dev mode - use default
    API_BASE_URL = 'http://localhost:5000/api';
  }
  return API_BASE_URL;
};

// Initialize immediately if in Electron (non-blocking)
if (isElectron && window.electronAPI) {
  backendUrlPromise = initializeApiBaseUrl();
}

// Export function to get current API base URL (with async support)
export const getApiBaseUrl = () => API_BASE_URL;

// Export async function to ensure backend URL is ready
export const ensureBackendURL = async () => {
  if (backendUrlPromise) {
    await backendUrlPromise;
  }
  return API_BASE_URL;
};

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
  // Ensure backend URL is ready before making request
  if (isElectron && backendUrlPromise) {
    await backendUrlPromise;
  }
  
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
      // Return validation errors if available
      if (data.details) {
        return { success: false, error: data.error, details: data.details };
      }
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

  // Get all product SKUs (for dropdown)
  getSKUs: async () => {
    return await apiRequest('/products/meta/skus');
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

// Suppliers API
export const suppliersAPI = {
  // Get all suppliers with optional search and pagination
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/suppliers?${queryString}` : '/suppliers';
    return await apiRequest(endpoint);
  },

  // Search suppliers
  search: async (query) => {
    if (!query.trim()) return { success: true, data: [] };
    return await apiRequest(`/suppliers/search/${encodeURIComponent(query)}`);
  },

  // Get single supplier
  getById: async (id) => {
    return await apiRequest(`/suppliers/${id}`);
  },

  // Create supplier
  create: async (supplierData) => {
    return await apiRequest('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  },

  // Update supplier
  update: async (id, supplierData) => {
    return await apiRequest(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  },

  // Update supplier status
  updateStatus: async (id, status) => {
    return await apiRequest(`/suppliers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete supplier
  delete: async (id) => {
    return await apiRequest(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  },

  // Get supplier statistics
  getStats: async () => {
    return await apiRequest('/suppliers/stats/overview');
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

// Categories API
export const categoriesAPI = {
  // Get all categories with optional search and pagination
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/categories?${queryString}` : '/categories';
    return await apiRequest(endpoint);
  },

  // Search categories for quick search
  search: async (query) => {
    if (!query.trim()) return { success: true, data: [] };
    return await apiRequest(`/categories/search/${encodeURIComponent(query)}`);
  },

  // Get single category
  getById: async (id) => {
    return await apiRequest(`/categories/${id}`);
  },

  // Create category (Admin only)
  create: async (categoryData) => {
    return await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category (Admin only)
  update: async (id, categoryData) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category (Admin only)
  delete: async (id) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Reminders API
export const remindersAPI = {
  // Get all reminders with optional search and pagination
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reminders?${queryString}` : '/reminders';
    return await apiRequest(endpoint);
  },

  // Get single reminder
  getById: async (id) => {
    return await apiRequest(`/reminders/${id}`);
  },

  // Create reminder
  create: async (reminderData) => {
    return await apiRequest('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  // Update reminder
  update: async (id, reminderData) => {
    return await apiRequest(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData),
    });
  },

  // Update reminder status
  updateStatus: async (id, status, nextTrigger) => {
    return await apiRequest(`/reminders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, next_trigger: nextTrigger }),
    });
  },

  // Delete reminder
  delete: async (id) => {
    return await apiRequest(`/reminders/${id}`, {
      method: 'DELETE',
    });
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
  suppliers: suppliersAPI,
  categories: categoriesAPI,
  sales: salesAPI,
  reminders: remindersAPI,
  utils: apiUtils,
};