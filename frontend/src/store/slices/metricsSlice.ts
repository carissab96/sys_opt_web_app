// src/store/slices/metricsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SystemMetric, MetricsState } from '../../types/metrics';

// interface MetricsState {
//   data: SystemMetrics | null;
//   historicalData: SystemMetrics[];
//   loading: boolean;
//   error: string | null;
//   lastUpdated: string | null;
// }

const initialState: MetricsState = {
  data: null,
  historicalData: [],
  loading: false,
  error: null,
  lastUpdated: null
}

interface MetricsApiResponse {
  data: SystemMetric;
  timestamp: string;
}

export const fetchSystemMetrics = createAsyncThunk<
  MetricsApiResponse,  // What we expect from the API
  void,               // What we pass to the thunk
  { rejectValue: string }  // Error type
>('metrics/fetch', async () => {
  const response = await fetch('/api/metrics/');
  return response.json();
});

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    updateMetrics: (state, action: PayloadAction<SystemMetric>) => {
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
        state.data = action.payload.data;
        state.historicalData = [
          ...state.historicalData.slice(-19),
          action.payload.data
        ];
        state.lastUpdated = action.payload.timestamp;
      })
      .addCase(fetchSystemMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch metrics';
      });
  }
});
export const startMetricsPolling = createAsyncThunk(
  'metrics/startPolling',
  async (_, { dispatch }) => {
    const pollInterval = setInterval(() => {
      dispatch(fetchSystemMetrics());
    }, 5000); // Poll every 5 seconds

    return pollInterval;
  }
);

export const stopMetricsPolling = createAsyncThunk(
  'metrics/stopPolling',
  async (intervalId: number) => {
    clearInterval(intervalId);
  }
);

export const { updateMetrics, clearMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;