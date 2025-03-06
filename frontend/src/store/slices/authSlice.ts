import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/auth';
// import { UserProfile, UserPreferences } from '../../types/auth';

// 
const initialState: AuthState = {
  user: null, 
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await fetch('/api/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Get error details
      throw new Error(errorData.message || 'Login failed'); // Throw an error with the message
    }

    return response.json(); // Return the successful response
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (token: string) => {
    const response = await fetch('/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: token }),
    });
    return response.json();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;  // This exports the action creator
export const authReducer = authSlice.reducer;  // This exports the reducer
export default authSlice.reducer;