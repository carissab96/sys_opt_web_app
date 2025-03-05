// api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import store from '../store/store';// Updated import path
import { logout, refreshToken } from '../store/slices/authSlice';
interface ApiError extends AxiosError {
  config: InternalAxiosRequestConfig & { _retry?: boolean };
}

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Added http:// - might've been your issue
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CSRF/cookies
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: ApiError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshTokenStr = store.getState().auth.refreshToken;
      
      if (refreshTokenStr) {
        try {
          const action = await store.dispatch(refreshToken(refreshTokenStr));
          if ('payload' in action) { // Type guard
            const newToken = action.payload.access;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Type your response data
interface AutotunerData {
  // Add your autotuner properties here
  id: number;
  // ... other properties
}

// API methods
export const apiMethods = {
  // Generic GET method with type parameter
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  },

  // Generic POST method with type parameters
  post: async <T, D>(url: string, data: D): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // Add other methods as needed
  autotuner: {
    fetch: async (id: number): Promise<AutotunerData> => {
      try {
        return await apiMethods.get<AutotunerData>(`/autotuner/${id}/`);
      } catch (error) {
        console.error(`Error fetching autotuner ${id}:`, error);
        throw error;
      }
    }
  },

  metrics: {
    fetch: async () => {
      return await apiMethods.get('/metrics/');
    },
    // Add other metric-related methods
  }
};

export default api;