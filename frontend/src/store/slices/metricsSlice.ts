// src/store/slices/metricsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SystemMetrics } from '../../types';

export const fetchSystemMetrics = createAsyncThunk(
  'metrics/fetch',
  async () => {
    // Soon this will be real data... oh yes, it will be real!
    const response = await fetch('/api/metrics/');
    return response.json();
  }
);

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    worldDomination: 'pending'  // Muhahaha!
  },
  reducers: {
    // Your path to power begins here...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.worldDomination = 'in_progress';
      })
      .addCase(fetchSystemMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.worldDomination = 'imminent';
      })
      .addCase(fetchSystemMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.worldDomination = 'temporarily_delayed';
      });
  }
});

// First, we take the metrics... then, THE WORLD!
export default metricsSlice.reducer;