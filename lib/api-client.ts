import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// API Response Types
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error?: never;
}

interface ApiErrorResponse {
  success: false;
  data?: never;
  error: {
    message: string;
    code?: string;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Data Types
interface Player {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  player: Player;
}

interface CheckAvailabilityResponse {
  exists: boolean;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  type: 'fiat' | 'crypto';
  symbol: string;
  is_active: boolean;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Token management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - attach access token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors and refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If this is a refresh token request that failed, logout user
    if (originalRequest.url?.includes('/auth/refresh')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      isRefreshing = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the token
      const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token } = response.data.data;

      // Store new access token
      localStorage.setItem('access_token', access_token);

      // Update authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }

      // Process queued requests
      processQueue(null, access_token);

      isRefreshing = false;

      // Retry original request with new token
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      isRefreshing = false;

      // Clear tokens and redirect to home
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/';

      return Promise.reject(refreshError);
    }
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    register: async (data: {
      username: string;
      email: string;
      password: string;
      currency?: string;
      country?: string;
      lang?: string;
    }): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await apiClient.post('/api/v1/auth/register', data);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Registration failed',
          },
        };
      }
    },

    login: async (data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await apiClient.post('/api/v1/auth/login', data);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Login failed',
          },
        };
      }
    },

    logout: async (accessToken: string): Promise<ApiResponse<void>> => {
      try {
        const response = await apiClient.post('/api/v1/auth/logout', {
          access_token: accessToken,
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Logout failed',
          },
        };
      }
    },

    refresh: async (refreshToken: string): Promise<ApiResponse<{ access_token: string }>> => {
      const response = await apiClient.post('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });
      return response.data;
    },
  },

  // Player endpoints
  players: {
    checkEmail: async (email: string): Promise<ApiResponse<CheckAvailabilityResponse>> => {
      try {
        const response = await apiClient.post('/api/v1/players/check-email', {
          email,
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to check email availability',
          },
        };
      }
    },

    checkUsername: async (username: string): Promise<ApiResponse<CheckAvailabilityResponse>> => {
      try {
        const response = await apiClient.post('/api/v1/players/check-username', {
          username,
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to check username availability',
          },
        };
      }
    },

    getProfile: async (playerId: string): Promise<ApiResponse<Player>> => {
      try {
        const response = await apiClient.get(`/api/v1/players/${playerId}`);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to get profile',
          },
        };
      }
    },
  },

  // Currency endpoints
  currencies: {
    getActive: async (): Promise<ApiResponse<Currency[]>> => {
      try {
        const response = await apiClient.get('/api/v1/currencies/active');
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load currencies',
          },
        };
      }
    },

    getByType: async (type: 'fiat' | 'crypto'): Promise<ApiResponse<Currency[]>> => {
      try {
        const response = await apiClient.get(`/api/v1/currencies/by-type/${type}`);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load currencies',
          },
        };
      }
    },
  },
};

export default apiClient;

