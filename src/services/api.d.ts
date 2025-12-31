// Type definitions for api.js

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface AuthResponse {
  token: string;
  user?: any;
}

export interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface ProductData {
  [key: string]: any;
}

export interface SupplierData {
  [key: string]: any;
}

export interface CategoryData {
  [key: string]: any;
}

export interface SaleData {
  [key: string]: any;
}

export interface ReminderData {
  [key: string]: any;
}

export interface UserData {
  [key: string]: any;
}

export const authAPI: {
  login: (pin: string) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiResponse<any>>;
  getUsers: () => Promise<ApiResponse<any[]>>;
  createUser: (userData: UserData) => Promise<ApiResponse<any>>;
  updatePin: (userId: string, currentPin: string, newPin: string) => Promise<ApiResponse<any>>;
  isAuthenticated: () => boolean;
};

export const productsAPI: {
  getAll: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  search: (query: string) => Promise<ApiResponse<any[]>>;
  getById: (id: string) => Promise<ApiResponse<any>>;
  create: (productData: ProductData) => Promise<ApiResponse<any>>;
  update: (id: string, productData: ProductData) => Promise<ApiResponse<any>>;
  updateStock: (id: string, stock: number) => Promise<ApiResponse<any>>;
  delete: (id: string) => Promise<ApiResponse<any>>;
  getCategories: () => Promise<ApiResponse<any>>;
  getSKUs: () => Promise<ApiResponse<any>>;
};

export const customersAPI: {
  getAll: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  search: (query: string) => Promise<ApiResponse<any[]>>;
  getById: (id: string) => Promise<ApiResponse<any>>;
  getByPhone: (phone: string) => Promise<ApiResponse<any>>;
  create: (customerData: CustomerData) => Promise<ApiResponse<any>>;
  update: (id: string, customerData: CustomerData) => Promise<ApiResponse<any>>;
  delete: (id: string) => Promise<ApiResponse<any>>;
  getPurchases: (id: string, params?: Record<string, any>) => Promise<ApiResponse<any>>;
};

export const suppliersAPI: {
  getAll: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  search: (query: string) => Promise<ApiResponse<any[]>>;
  getById: (id: string) => Promise<ApiResponse<any>>;
  create: (supplierData: SupplierData) => Promise<ApiResponse<any>>;
  update: (id: string, supplierData: SupplierData) => Promise<ApiResponse<any>>;
  updateStatus: (id: string, status: string) => Promise<ApiResponse<any>>;
  delete: (id: string) => Promise<ApiResponse<any>>;
  getStats: () => Promise<ApiResponse<any>>;
};

export const salesAPI: {
  getAll: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  getById: (id: string) => Promise<ApiResponse<any>>;
  create: (saleData: SaleData) => Promise<ApiResponse<any>>;
  getDashboardSummary: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  getReportsByDate: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
};

export const categoriesAPI: {
  getAll: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  search: (query: string) => Promise<ApiResponse<any[]>>;
  getById: (id: string) => Promise<ApiResponse<any>>;
  create: (categoryData: CategoryData) => Promise<ApiResponse<any>>;
  update: (id: string, categoryData: CategoryData) => Promise<ApiResponse<any>>;
  delete: (id: string) => Promise<ApiResponse<any>>;
};

export const remindersAPI: {
  getAll: (params?: Record<string, any>) => Promise<ApiResponse<any>>;
  getById: (id: string) => Promise<ApiResponse<any>>;
  create: (reminderData: ReminderData) => Promise<ApiResponse<any>>;
  update: (id: string, reminderData: ReminderData) => Promise<ApiResponse<any>>;
  updateStatus: (id: string, status: string, nextTrigger?: string) => Promise<ApiResponse<any>>;
  delete: (id: string) => Promise<ApiResponse<any>>;
};

export const apiUtils: {
  getAuthToken: () => string | null;
  setAuthToken: (token: string) => void;
  removeAuthToken: () => void;
  isAuthenticated: () => boolean;
};

export const getApiBaseUrl: () => string;
export const ensureBackendURL: () => Promise<string>;

export default {
  auth: typeof authAPI;
  products: typeof productsAPI;
  customers: typeof customersAPI;
  suppliers: typeof suppliersAPI;
  categories: typeof categoriesAPI;
  sales: typeof salesAPI;
  reminders: typeof remindersAPI;
  utils: typeof apiUtils;
};


