import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
// import { MetricsWebSocket } from '../../../utils/websocket';
import './Dashboard.css';
import { UserProfile } from '../UserProfile/UserProfile';
// import { CPUMetric } from '../Metrics/CPUMetrics/CPUMetric';
import { MemoryMetric } from '../Metrics/MemoryMetric/MemoryMetric';
import { DiskMetric } from '../Metrics/DiskMetric/DiskMetric';
import { NetworkMetric } from '../Metrics/NetworkMetric/NetworkMetric';
import store from '../../../store/store';
import { initializeWebSocket } from '../../../store/slices/metricsSlice';
import { RootState } from '../../../store/store';
import SystemStatus  from './systemstatus/systemstatus';


export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state:RootState) => ({
    loading: state.metrics.loading,
    error: state.metrics.error
  }));

      useEffect(() => {
        dispatch(initializeWebSocket())
        .unwrap()
        .catch((error: any) => {
          console.error('Websocket initialization fucked up:', error);
        });

        //cleanup
        return () => {
          const currentState = store.getState();
          const ws = currentState.metrics.websocketInstance;
          if (ws) {
            ws.disconnect();
          }
        };
      }, [dispatch]);

  // useEffect(() => {
  //   // Start polling
  //   dispatch(startMetricsPolling())
  //     .unwrap()
  //     .catch((error) => {
  //       console.error('Failed to start metrics polling:', error);
  //     });
  
  //   // Cleanup
  //   return () => {
      
  //     if (pollingInterval) {
  //       dispatch(stopMetricsPolling(pollingInterval));
  //     }
  //   };
  // }, [dispatch]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Optimizer</h1>
        <SystemStatus loading={loading} error={error} />
      </header>
      <div className="dashboard-content">
        <div className="main-content">
          <UserProfile />
          
          <div className="metrics-grid">
            {/* <CPUMetric /> */}
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