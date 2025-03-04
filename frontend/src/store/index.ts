// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import metricsReducer from './slices/metricsSlice';
import userProfileReducer from './slices/userProfileSlice';
import systemAlertsReducer from './slices/systemAlertsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    metrics: metricsReducer,
    userProfile: userProfileReducer,
    systemAlerts: systemAlertsReducer 
    // Add other reducers as needed
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;