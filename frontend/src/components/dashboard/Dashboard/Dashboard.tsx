import React from 'react';
import './Dashboard.css';
//import { MetricsPanel } from '../MetricsPanel/MetricsPanel';
import { UserProfile } from '../UserProfile/UserProfile';
import { CPUMetric } from '../Metrics/CPUMetrics/CPUMetric.tsx';
import { MemoryMetric } from '../Metrics/MemoryMetric/MemoryMetric';
import { DiskMetric } from '../Metrics/DiskMetric/DiskMetric';
import { NetworkMetric } from '../Metrics/NetworkMetric/NetworkMetric';


export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Optimizer</h1>
        <div className="system-status">
          <span className="status-dot"></span>
          System Monitoring Active
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
            <button className="control-button">
              Run Optimization
            </button>
            <button className="control-button">
              Update System Profile
            </button>
            <button className="control-button">
              Configure Alerts
            </button>
          </div>

          <div className="system-alerts">
            <h2>System Alerts</h2>
            {/* Alert list will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};