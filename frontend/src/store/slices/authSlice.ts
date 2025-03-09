// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials } from '../../types/auth';

// First, let's add some console logging to track the auth flow
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            console.log("🔐 Attempting login with credentials:", {
                username: credentials.username,
                passwordLength: credentials.password.length
            });

            const response = await fetch('/api/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
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
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;