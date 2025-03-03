// src/store/types.ts
export interface SystemMetrics {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_usage: number;
    process_count: number;
    timestamp: string;
    additional_metrics?: any;
  }
  
  export interface MetricsState {
    data: SystemMetrics | null;
    historicalData: SystemMetrics[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  }
  
  // src/store/slices/metricsSlice.ts
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import type { MetricsState } from '../types';
  
  const initialState: MetricsState = {
    data: null,
    historicalData: [],
    loading: false,
    error: null,
    lastUpdated: null
  };
  
  export const fetchSystemMetrics = createAsyncThunk(
    'metrics/fetch',
    async () => {
      const response = await fetch('/api/metrics/');
      return response.json();
    }
  );
  
  const metricsSlice = createSlice({
    name: 'metrics',
    initialState,
    reducers: {
      updateMetrics: (state, action) => {
        state.data = action.payload;
        state.historicalData = [
          ...state.historicalData.slice(-19),
          action.payload
        ];
        state.lastUpdated = new Date().toISOString();
      },
      clearMetrics: (state) => {
        state.data = null;
        state.historicalData = [];
        state.lastUpdated = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchSystemMetrics.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSystemMetrics.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
          state.historicalData = [
            ...state.historicalData.slice(-19),
            action.payload
          ];
          state.lastUpdated = new Date().toISOString();
        })
        .addCase(fetchSystemMetrics.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch metrics';
        });
    }
  });
  
  export const { updateMetrics, clearMetrics } = metricsSlice.actions;
  export default metricsSlice.reducer;
  
  // src/store/index.ts
  import { configureStore } from '@reduxjs/toolkit';
  import metricsReducer from './slices/metricsSlice';
  
  export const store = configureStore({
    reducer: {
      metrics: metricsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // For handling Date objects
      }),
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  
  // src/store/hooks.ts
  import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
  import type { RootState, AppDispatch } from './index';
  
  export const useAppDispatch = () => useDispatch<AppDispatch>();
  export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;