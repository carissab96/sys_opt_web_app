import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import metricsReducer from './slices/metricsSlice';
import userProfileReducer from './slices/userProfileSlice';
import systemAlertsReducer from './slices/systemAlertsSlice';
import autoTunerReducer from './slices/autoTunerSlice';
import xsrfMiddleware from './csrf';

const store = configureStore({
  reducer: {
    auth: authReducer,
    metrics: metricsReducer,
    userProfile: userProfileReducer,
    systemAlerts: systemAlertsReducer,
    autoTuner: autoTunerReducer,
    //... other reducers
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(xsrfMiddleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;






