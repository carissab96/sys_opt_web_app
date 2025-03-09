import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import './Dashboard.css';
import { UserProfile } from '../UserProfile/UserProfile';
import { CPUMetric } from '../Metrics/CPUMetrics/CPUMetric';
import { MemoryMetric } from '../Metrics/MemoryMetric/MemoryMetric';
import { DiskMetric } from '../Metrics/DiskMetric/DiskMetric';
import { NetworkMetric } from '../Metrics/NetworkMetric/NetworkMetric';
import { initializeWebSocket } from '../../../store/slices/metricsSlice';
import SystemStatus  from './SystemStatus/SystemStatus';
import { fetchSystemMetrics } from '../../../store/slices/metricsSlice';


export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const wsRef = useRef<AbortController | null>(null);
  const error = useAppSelector((state) => state.metrics.error);
  const isLoading = useAppSelector((state) => state.metrics.loading);
  const mountCountRef = useRef(0);

  useEffect(() => {
    mountCountRef.current += 1;
    console.log(`🎭 Dashboard mounting... (Mount #${mountCountRef.current})`);
    
    if (mountCountRef.current === 2) {
        console.log("⚠️ StrictMode second mount detected, proceeding with initialization");
    }

    wsRef.current = new AbortController();
    const signal = wsRef.current.signal;

    const initializeWS = async () => {
        try {
            if (!signal.aborted) {
                console.log("🚀 Starting WebSocket initialization...");
                const result = await dispatch(initializeWebSocket()).unwrap();
                
                if (!signal.aborted && result.status === 'connected') {
                    console.log("✨ WebSocket connected, fetching metrics...");
                    dispatch(fetchSystemMetrics());
                }
            }
        } catch (error) {
            if (!signal.aborted) {
                console.error("💩 WebSocket initialization fucked up:", error);
            }
        }
    };

    initializeWS();

    return () => {
        console.log(`🧹 Dashboard unmounting... (Mount #${mountCountRef.current})`);
        wsRef.current?.abort();
    };
}, [dispatch]);
  if (isLoading) {
      return <div>Loading your distinguished metrics...</div>;
  }

  if (error) {
      return (
          <div className="error-container">
              <h3>Well, shit...</h3>
              <p>{error}</p>
              <button onClick={() => dispatch(initializeWebSocket())}>
                  Try this shit again
              </button>
          </div>
      );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Optimizer</h1>
        <SystemStatus loading={isLoading} error={error} />
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
              disabled={isLoading || !!error}
            >
              Run Optimization
            </button>
            <button 
              className="control-button"
              disabled={isLoading || !!error}
            >
              Update System Profile
            </button>
            <button 
              className="control-button"
              disabled={isLoading || !!error}
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