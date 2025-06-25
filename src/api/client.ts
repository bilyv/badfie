/**
 * API Client
 * Base HTTP client for making API requests
 */

import { API_CONFIG, buildApiUrl, getAuthHeaders, ApiError, ApiResponse } from './index';

// Request Options Interface
interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// Base API Client Class
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make HTTP request with error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
    } = options;

    // Prepare request configuration
    const config: RequestInit = {
      method,
      headers: {
        ...getAuthHeaders(),
        ...headers,
      },
      signal: AbortSignal.timeout(timeout),
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      console.log(`🌐 API Request: ${method} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`;
        throw new ApiError(errorMessage, response.status, data.code);
      }

      console.log(`✅ API Response: ${method} ${url} - Success`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${method} ${url}`, error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      
      throw new ApiError(
        error.message || 'Network error occurred',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.makeRequest<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = getAuthHeaders();
    // Remove Content-Type header to let browser set it with boundary
    delete headers['Content-Type'];

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  /**
   * Download file
   */
  async download(endpoint: string, filename?: string): Promise<void> {
    const url = buildApiUrl(endpoint);
    const headers = getAuthHeaders();

    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new ApiError(`Download failed: ${response.statusText}`, response.status);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
