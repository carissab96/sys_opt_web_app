// src/components/dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { fetchSystemMetrics } from '../../store/slices/metricsSlice';
import { CPUMetric } from './CPUMetrics';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initial fetch
    dispatch(fetchSystemMetrics());

    // Set up polling
    const interval = setInterval(() => {
      dispatch(fetchSystemMetrics());
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Optimizer</h1>
      </header>
      
      <div className="metrics-grid">
        <CPUMetric />
        {/* Other metrics will go here */}
      </div>
    </div>
  );
};
