// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials } from '../../types/auth';
import axios from 'axios';

// Function to get CSRF token from cookies
const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return null;
};

// First, let's add some console logging to track the auth flow
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            console.log("🔐 Attempting login with credentials:", {
                username: credentials.username,
                passwordLength: credentials.password.length
            });

            // First, get CSRF token if we don't have it
            if (!getCsrfToken()) {
                console.log("🍪 No CSRF token found, fetching one...");
                await axios.get('http://127.0.0.1:8000/api/auth/token/', {
                    withCredentials: true
                });
                console.log("🍪 CSRF cookie received:", getCsrfToken() ? "Yes" : "No");
            }

            const csrfToken = getCsrfToken();
            console.log("🛡️ Using CSRF token:", csrfToken);

            // Use absolute URL to backend server instead of relative URL
            const response = await fetch('http://127.0.0.1:8000/api/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken || '',
                },
                credentials: 'include',  // Important for cookies
                body: JSON.stringify(credentials)
            });

            console.log("📡 Login response status:", response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error("💩 Login failed:", errorData);
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            console.log("✨ Login successful:", {
                hasToken: !!data.data.access,
                hasRefresh: !!data.data.refresh
            });

            // Store the tokens
            localStorage.setItem('token', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);

            return data;
        } catch (error) {
            console.error("🚨 Login error:", error);
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to login'
            );
        }
    }
);

// Add a refresh token thunk
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (refreshTokenStr: string, { rejectWithValue }) => {
        try {
            console.log("🔄 Attempting to refresh token");
            
            const csrfToken = getCsrfToken();
            console.log("🛡️ Using CSRF token for refresh:", csrfToken);

            // Use absolute URL to backend server instead of relative URL
            const response = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken || '',
                },
                credentials: 'include',
                body: JSON.stringify({ refresh: refreshTokenStr })
            });

            console.log("📡 Refresh response status:", response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error("💩 Token refresh failed:", errorData);
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            console.log("✨ Token refresh successful");

            // Update the tokens
            localStorage.setItem('token', data.access);
            if (data.refresh) {
                localStorage.setItem('refreshToken', data.refresh);
            }

            return data;
        } catch (error) {
            console.error("🚨 Token refresh error:", error);
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to refresh token'
            );
        }
    }
);

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken')
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.access;
                state.refreshToken = action.payload.data.refresh;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.token = action.payload.access;
                if (action.payload.refresh) {
                    state.refreshToken = action.payload.refresh;
                }
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.token = null;
                state.refreshToken = null;
                state.error = action.payload as string;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;