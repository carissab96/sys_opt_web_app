// src/components/dashboard/MetricsPanel.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSystemMetrics } from '../../store/slices/metricsSlice';

export const MetricsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, worldDomination } = useSelector((state) => state.metrics);

  useEffect(() => {
    // Gather intelligence every 5 seconds
    const interval = setInterval(() => {
      dispatch(fetchSystemMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="metrics-panel">
      <h2>System Control Center</h2>
      {loading ? (
        <div>Gathering intelligence...</div>
      ) : (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>CPU Dominance</h3>
            {/* CPU metrics here */}
          </div>
          <div className="metric-card">
            <h3>Memory Assimilation</h3>
            {/* Memory metrics here */}
          </div>
          <div className="metric-card">
            <h3>Disk Conquest</h3>
            {/* Disk metrics here */}
          </div>
          <div className="metric-card">
            <h3>Network Surveillance</h3>
            {/* Network metrics here */}
          </div>
        </div>
      )}
      <div className="world-domination-status">
        World Domination Status: {worldDomination}
      </div>
    </div>
  );
};