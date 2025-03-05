import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { startMetricsPolling, stopMetricsPolling } from '../../../store/slices/metricsSlice';
import './Dashboard.css';
import { UserProfile } from '../UserProfile/UserProfile';
import { CPUMetric } from '../Metrics/CPUMetrics/CPUMetric';
import { MemoryMetric } from '../Metrics/MemoryMetric/MemoryMetric';
import { DiskMetric } from '../Metrics/DiskMetric/DiskMetric';
import { NetworkMetric } from '../Metrics/NetworkMetric/NetworkMetric';
import store from '../../../store/store';
import { RootState } from '../../../store/store';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  // Be explicit about what we're selecting from state
  const { loading, error, pollingInterval } = useAppSelector((state: RootState) => ({
    loading: state.metrics.loading,
    error: state.metrics.error
  }));

  useEffect(() => {
    // Start polling
    dispatch(startMetricsPolling())
      .unwrap()
      .catch((error) => {
        console.error('Failed to start metrics polling:', error);
      });
  
    // Cleanup
    return () => {
      
      if (pollingInterval) {
        dispatch(stopMetricsPolling(pollingInterval));
      }
    };
  }, [dispatch]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Optimizer</h1>
        <div className="system-status">
          <span className={`status-dot ${loading ? 'loading' : error ? 'error' : 'active'}`}></span>
          {loading 
            ? 'Updating metrics and shit...' 
            : error 
              ? `Fuck! ${error}` 
              : 'System Monitoring Active (and actually fucking working)'}
        </div>
      </header>
      <div className="dashboard-content">
        <div className="main-content">
          <UserProfile />
          
          <div className="metrics-grid">
            <CPUMetric />
            <MemoryMetric />
            <DiskMetric />
            <NetworkMetric />
          </div>
        </div>

        <div className="sidebar">
          <div className="optimization-controls">
            <h2>Optimization Controls</h2>
            <button 
              className="control-button"
              disabled={loading || !!error}
            >
              Run Optimization
            </button>
            <button 
              className="control-button"
              disabled={loading || !!error}
            >
              Update System Profile
            </button>
            <button 
              className="control-button"
              disabled={loading || !!error}
            >
              Configure Alerts
            </button>
          </div>

          <div className="system-alerts">
            <h2>System Alerts</h2>
            {error && (
              <div className="alert error">
                {error}
              </div>
            )}
            {/* More alerts will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;