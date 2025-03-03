// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import systemMetricsReducer from './slices/metricsSlice';

export const store = configureStore({
  reducer: {
    systemMetrics: systemMetricsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;