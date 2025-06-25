/**
 * API Configuration
 * Centralized configuration for all API calls
 */

// API Base Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  API_VERSION: 'v1',
  TIMEOUT: 10000, // 10 seconds
} as const;

// Build API URL
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  const version = API_CONFIG.API_VERSION;
  return `${baseUrl}/api/${version}${endpoint}`;
};

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  status: 'success';
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
}

// Common API Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request Headers Helper
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    ADMIN_LOGIN: '/auth/admin/login',
    WORKER_LOGIN: '/auth/worker/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Workers Management
  WORKERS: {
    BASE: '/workers',
    BY_ID: (id: string) => `/workers/${id}`,
    STATS: '/workers/stats/overview',
  },
  
  // Inventory Management
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id: string) => `/inventory/${id}`,
    SEARCH: '/inventory/search',
    LOW_STOCK: '/inventory/low-stock',
    STATS: '/inventory/stats',
  },
  
  // Sales Management
  SALES: {
    BASE: '/sales',
    BY_ID: (id: string) => `/sales/${id}`,
    ITEMS: (saleId: string) => `/sales/${saleId}/items`,
    STATS: '/sales/stats',
    REPORTS: '/sales/reports',
  },
  
  // Expenses Management
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id: string) => `/expenses/${id}`,
    CATEGORIES: '/expenses/categories',
    STATS: '/expenses/stats',
  },
  
  // Reports
  REPORTS: {
    BASE: '/reports',
    BY_ID: (id: string) => `/reports/${id}`,
    GENERATE: '/reports/generate',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  
  // Suppliers
  SUPPLIERS: {
    BASE: '/suppliers',
    BY_ID: (id: string) => `/suppliers/${id}`,
  },
} as const;
