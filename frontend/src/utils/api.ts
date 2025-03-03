import axios from 'axios';
import { store } from '../store';
import { logout, refreshToken } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const state = store.getState();
      const refreshTokenStr = state.auth.refreshToken;
      
      if (refreshTokenStr) {
        try {
          const action = await store.dispatch(refreshToken(refreshTokenStr));
          const newToken = action.payload.access;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);