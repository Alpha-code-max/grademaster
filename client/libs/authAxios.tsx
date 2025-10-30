import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: TokenPair;
  };
}

interface ApiError {
  success: false;
  message: string;
  code?: string;
  error?: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/auth`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Request data:', config.data);

        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: any) => {
        console.log(`[${new Date().toISOString()}] Response Status: ${response.status}`);
        console.log('Response data:', response.data);
        return response;
      },
      (error: any) => {
        const status = error.response?.status;
        const errorData = error.response?.data as ApiError;

        console.error(`[${new Date().toISOString()}] Error Status: ${status}`);
        console.error('Error Response:', errorData);

        // Only redirect on 401 for non-auth endpoints
        if (status === 401 && !error.config?.url?.includes('/auth/')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/LoginPage';
        }

        // For auth endpoints, throw error so it can be caught in components
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new user
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // Password validation on client side
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (registerData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const { name, email, phone, password } = registerData;

      const response = await this.api.post<AuthResponse>('/register', {
        name,
        email,
        phone: phone || null,
        password,
      });

      // Store tokens
      if (response.data.data.tokens) {
        localStorage.setItem('authToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user
   */
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/login', loginData);

      // Store tokens
      if (response.data.data.tokens) {
        localStorage.setItem('authToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<TokenPair> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post<{ data: TokenPair }>('/refresh', {
        refreshToken,
      });

      // Update tokens
      if (response.data.data.accessToken) {
        localStorage.setItem('authToken', response.data.data.accessToken);
      }
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }

      return response.data.data;
    } catch (error: any) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      throw this.handleError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<{ data: User }>('/me');
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Error handling helper
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      const message =
        errorData?.message ||
        errorData?.error ||
        error.message ||
        'An unexpected error occurred';

      console.error('Axios Error:', {
        status: error.response?.status,
        message,
        code: errorData?.code,
      });

      return new Error(message);
    }

    console.error('Unexpected Error:', error);
    return new Error('An unexpected error occurred');
  }
}

export default new AuthService();
export type { RegisterData, LoginData, AuthResponse, User, TokenPair };