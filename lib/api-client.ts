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
export interface Player {
  id: string;
  playerUuid: string;
  username: string;
  email: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  country?: string;
  lang?: string;
  currency: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  avatar?: string;
  kycStatus?: string;
  kycFront?: string;
  kycBack?: string;
  kycSelfie?: string;
  kycAddress?: string;
  addressProofStatus?: string;
}

export interface UpdateProfileData {
  // Password fields
  password?: string;
  new_password?: string;
  repeat_password?: string;
  
  // Personal info
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  country?: string;
  lang?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  city?: string;
  postal_code?: string;
  
  // Files
  avatar?: File;
  kyc_front?: File;
  kyc_back?: File;
  kyc_selfie?: File;
  kyc_address?: File;
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

// Coin Network Types
export interface CoinNetwork {
  id: string;
  name: string;
  slug: string;
  baseFee: number;
  isActive: boolean;
  createDt: string;
  modifyDt: string;
}

// Country Types
export interface Country {
  id: number;
  name: string;
  iso: string;
  timeZone: string;
  utcOffset: string;
  defaultLanguage: string;
  isRestricted: boolean;
  isActive: boolean;
}

// Language Types
export interface Language {
  id: number;
  name: string;
  iso: string;
  flag_iso: string | null;
  is_active: boolean;
}

// Backend Wallet Types
interface BackendWallet {
  id: string;
  playerId: string;
  currency: string;
  walletType: 'crypto' | 'fiat';
  balance: number;
  bonusBalance: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendTransaction {
  id: string;
  walletId: string;
  playerId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  bonusBalanceBefore: number;
  bonusBalanceAfter: number;
  status: string;
  currency: string;
  txid: string | null;
  provider: string | null;
  metadata: any;
  createdAt: string;
}

interface WalletBalanceResponse {
  totalBalance: number;
  totalBonusBalance: number;
  walletCount: number;
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

    // Don't attempt token refresh for auth endpoints (login, register, refresh)
    // These are public endpoints that don't need token refresh logic
    if (originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/forgot-password') ||
        originalRequest.url?.includes('/auth/reset-password')) {
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

    forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.post('/api/v1/auth/forgot-password', { email });
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to send password reset email',
          },
        };
      }
    },

    resetPassword: async (data: {
      email: string;
      token: string;
      password: string;
      password_confirmation: string;
    }): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.post('/api/v1/auth/reset-password', data);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to reset password',
          },
        };
      }
    },

    requestEmailVerification: async (): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.post('/api/v1/auth/email/verify');
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to request email verification',
          },
        };
      }
    },

    verifyEmailWithToken: async (token: string): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.post(`/api/v1/auth/email/verify/${token}`);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to verify email',
          },
        };
      }
    },

    verifyEmailByHash: async (id: string, hash: string): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.get(`/api/v1/auth/email-verification/${id}/${hash}`);
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to verify email',
          },
        };
      }
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

    // Get current authenticated user's profile
    getMe: async (): Promise<ApiResponse<Player>> => {
      try {
        const response = await apiClient.get('/api/v1/players/me');
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

    // Update current user's profile with multipart/form-data support
    updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<{ message: string; data: Player }>> => {
      try {
        const formData = new FormData();
        
        // Add text fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Skip file objects for now, handle them separately
            if (!(value instanceof File)) {
              formData.append(key, String(value));
            }
          }
        });
        
        // Add files to FormData
        if (data.avatar instanceof File) {
          formData.append('avatar', data.avatar);
        }
        if (data.kyc_front instanceof File) {
          formData.append('kyc_front', data.kyc_front);
        }
        if (data.kyc_back instanceof File) {
          formData.append('kyc_back', data.kyc_back);
        }
        if (data.kyc_selfie instanceof File) {
          formData.append('kyc_selfie', data.kyc_selfie);
        }
        if (data.kyc_address instanceof File) {
          formData.append('kyc_address', data.kyc_address);
        }
        
        const response = await apiClient.post('/api/v1/players', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to update profile',
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

  // Wallet endpoints
  wallets: {
    getWallets: async (): Promise<ApiResponse<BackendWallet[]>> => {
      try {
        const response = await apiClient.get('/api/v1/wallets');
        console.log('[API] Raw wallets response:', response);
        console.log('[API] response.data:', response.data);
        console.log('[API] response.data.data:', response.data.data);
        
        // Handle different response structures
        let walletData: BackendWallet[];
        
        // If response.data has a 'data' property (standardized response)
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          walletData = response.data.data;
        } 
        // If response.data is directly an array
        else if (Array.isArray(response.data)) {
          walletData = response.data;
        }
        // If response.data is an object with success flag
        else if (response.data && response.data.success && response.data.data) {
          walletData = response.data.data;
        }
        // Fallback
        else {
          walletData = response.data || [];
        }
        
        console.log('[API] Final wallet data:', walletData);
        console.log('[API] Wallet data type:', typeof walletData, 'Is array?', Array.isArray(walletData));
        
        // Ensure it's an array
        if (!Array.isArray(walletData)) {
          console.error('[API] Wallet data is not an array!', walletData);
          walletData = [];
        }
        
        return {
          success: true,
          data: walletData,
        };
      } catch (error: any) {
        console.error('[API] Failed to fetch wallets:', error);
        console.error('[API] Error response:', error.response);
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load wallets',
          },
        };
      }
    },

    getTotalBalance: async (): Promise<ApiResponse<WalletBalanceResponse>> => {
      try {
        const response = await apiClient.get('/api/v1/wallets/balance');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load balance',
          },
        };
      }
    },

    getTransactions: async (): Promise<ApiResponse<BackendTransaction[]>> => {
      try {
        const response = await apiClient.get('/api/v1/wallets/transactions');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load transactions',
          },
        };
      }
    },
  },

  // Coin Networks endpoints
  coinNetworks: {
    getActive: async (): Promise<ApiResponse<CoinNetwork[]>> => {
      try {
        const response = await apiClient.get('/api/v1/coin-networks/active');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load coin networks',
          },
        };
      }
    },
  },

  // Countries endpoints
  countries: {
    getActive: async (): Promise<ApiResponse<Country[]>> => {
      try {
        const response = await apiClient.get('/api/v1/countries');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load countries',
          },
        };
      }
    },
  },

  // Languages endpoints
  languages: {
    getActive: async (): Promise<ApiResponse<Language[]>> => {
      try {
        const response = await apiClient.get('/api/v1/languages');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load languages',
          },
        };
      }
    },
  },

  // Notification endpoints
  notifications: {
    getNotifications: async (limit: number = 50, offset: number = 0): Promise<ApiResponse<any[]>> => {
      try {
        const response = await apiClient.get('/api/v1/notifications', {
          params: { limit, offset },
        });
        // Handle nested data structure and ensure we return an array
        let notificationsData = response.data.data || response.data;
        
        // If the response is a paginated object, extract the notifications array
        if (notificationsData && typeof notificationsData === 'object' && !Array.isArray(notificationsData)) {
          notificationsData = notificationsData.notifications || notificationsData.items || notificationsData.data || [];
        }
        
        // Ensure we always return an array
        if (!Array.isArray(notificationsData)) {
          notificationsData = [];
        }
        
        return {
          success: true,
          data: notificationsData,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load notifications',
          },
        };
      }
    },

    markAsRead: async (id: number): Promise<ApiResponse<any>> => {
      try {
        const response = await apiClient.patch(`/api/v1/notifications/${id}/read`);
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to mark notification as read',
          },
        };
      }
    },

    markAllAsRead: async (): Promise<ApiResponse<{ message: string; count?: number }>> => {
      try {
        const response = await apiClient.patch('/api/v1/notifications/read-all');
        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to mark all notifications as read',
          },
        };
      }
    },
  },

  // Session endpoints
  sessions: {
    getSessions: async (): Promise<ApiResponse<Session[]>> => {
      try {
        const response = await apiClient.get('/api/v1/sessions');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load sessions',
          },
        };
      }
    },

    revokeSession: async (sessionId: string): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.delete(`/api/v1/sessions/${sessionId}`);
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to revoke session',
          },
        };
      }
    },

    revokeAllOtherSessions: async (): Promise<ApiResponse<{ message: string }>> => {
      try {
        const response = await apiClient.delete('/api/v1/sessions');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to revoke sessions',
          },
        };
      }
    },
  },

  // Games endpoints
  games: {
    getGames: async (params?: {
      page?: number;
      perPage?: number;
      device?: 'mobile' | 'desktop';
      providerId?: number;
      categoryId?: number;
      search?: string;
      isLive?: boolean;
      isTrending?: boolean;
      showAvailablesOnly?: boolean;
      sortBy?: 'sortOrder' | 'gameTitle' | 'launched' | 'popularity';
      sortOrder?: 'ASC' | 'DESC';
    }): Promise<ApiResponse<{
      data: any[];
      meta: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
      };
    }>> => {
      try {
        const response = await apiClient.get('/api/v1/games', { params });
        return {
          success: true,
          data: response.data.data 
            ? { data: response.data.data, meta: response.data.meta }
            : response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load games',
          },
        };
      }
    },

    getGameBySlug: async (slug: string): Promise<ApiResponse<any>> => {
      try {
        const response = await apiClient.get(`/api/v1/games/${slug}`);
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load game',
          },
        };
      }
    },

    generateGameUrl: async (params: {
      id?: number;
      slug?: string;
      gameId?: string;
      device?: 'desktop' | 'mobile';
      lang?: string;
      lobbyData?: string;
    }): Promise<ApiResponse<{ url: string; sessionId: string }>> => {
      try {
        console.log('[API] generateGameUrl called with params:', params);
        const response = await apiClient.get('/api/v1/games/url', { params });
        console.log('[API] generateGameUrl response:', response.data);
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        console.error('[API] generateGameUrl error:', error);
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to generate game URL',
          },
        };
      }
    },

    generateDemoUrl: async (params: {
      id?: number;
      slug?: string;
      gameId?: string;
      device?: 'desktop' | 'mobile';
      lang?: string;
    }): Promise<ApiResponse<{ url: string; sessionId: string }>> => {
      try {
        console.log('[API] generateDemoUrl called with params:', params);
        const response = await apiClient.get('/api/v1/games/demo-url', { params });
        console.log('[API] generateDemoUrl response:', response.data);
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        console.error('[API] generateDemoUrl error:', error);
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to generate demo URL',
          },
        };
      }
    },

    getLobbyData: async (params: {
      id?: number;
      slug?: string;
      gameId?: string;
      currency?: string;
    }): Promise<ApiResponse<any>> => {
      try {
        const response = await apiClient.get('/api/v1/games/lobby', { params });
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to get lobby data',
          },
        };
      }
    },
  },

  // Categories endpoints
  categories: {
    getActive: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await apiClient.get('/api/v1/categories');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load categories',
          },
        };
      }
    },
  },

  // Providers endpoints
  providers: {
    getActive: async (): Promise<ApiResponse<any[]>> => {
      try {
        const response = await apiClient.get('/api/v1/providers');
        return {
          success: true,
          data: response.data.data || response.data,
        };
      } catch (error: any) {
        if (error.response?.data) {
          return error.response.data;
        }
        return {
          success: false,
          error: {
            message: error.message || 'Failed to load providers',
          },
        };
      }
    },
  },
};

export default apiClient;

// Session Types
export interface Session {
  id: string;
  playerId: string;
  ipAddress: string;
  userAgent: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  lastActivityAt: string;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

// Export types for use in other files
export type { BackendWallet, BackendTransaction, WalletBalanceResponse, CoinNetwork, Country, Language };
