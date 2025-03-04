// src/components/dashboard/MetricsPanel/MetricsPanel.tsx
import React from 'react';
import './MetricsPanel.css';
import { CPUMetric } from '../Metrics/CPUMetrics/CPUMetric';
import { useAppSelector } from '../../../store/hooks';

export const MetricsPanel: React.FC = () => {
  const metrics = useAppSelector(state => state.metrics.data);

  return (
    <div className="metrics-panel">
      <div className="metrics-grid">
        <CPUMetric />
        <div className="metric-card memory">
          <h3>Memory Usage</h3>
          {/* Memory metrics coming soon */}
        </div>
        <div className="metric-card disk">
          <h3>Disk Usage</h3>
          {/* Disk metrics coming soon */}
        </div>
        <div className="metric-card network">
          <h3>Network</h3>
          {/* Network metrics coming soon */}
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;