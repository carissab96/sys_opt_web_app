// components/dashboard/CPUMetrics.tsx
// src/components/dashboard/CPUMetric.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
//import type { RootState } from '../../store';  // You'll need to create this
//import useSelector from '../../store/hooks';

interface CPUData {
  timestamp: string;
  usage: number;
}

export const CPUMetric: React.FC = () => {
  const cpuData = useSelector((state) => state.metrics.data?.cpu_usage);
  const loading = useSelector((state) => state.metrics.loading);

  // Format data for chart
  const chartData = useMemo(() => {
    if (!cpuData) return [];
    return cpuData.map((data: CPUData) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      value: data.usage
    }));
  }, [cpuData]);

  // Calculate warning thresholds
  const warningThreshold = 70;
  const criticalThreshold = 90;
  const currentValue = chartData[chartData.length - 1]?.value || 0;

  const getStatusColor = (value: number) => {
    if (value >= criticalThreshold) return 'rgb(239, 68, 68)'; // red
    if (value >= warningThreshold) return 'rgb(234, 179, 8)';  // yellow
    return 'rgb(34, 197, 94)'; // green
  };

  return (
    <div className="metric-card">
      <div className="metric-header">
        <h3>CPU Usage</h3>
        <div 
          className="current-value"
          style={{ color: getStatusColor(currentValue) }}
        >
          {currentValue}%
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          Gathering CPU intelligence...
        </div>
      ) : (
        <>
          <div className="chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={getStatusColor(currentValue)}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="metrics-footer">
            <div className="threshold-indicators">
              <div className="threshold warning">
                Warning: {warningThreshold}%
              </div>
              <div className="threshold critical">
                Critical: {criticalThreshold}%
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .metric-card {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .current-value {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .loading-indicator {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        .metrics-footer {
          margin-top: 1rem;
        }

        .threshold-indicators {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .threshold {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .threshold.warning {
          color: rgb(234, 179, 8);
        }

        .threshold.critical {
          color: rgb(239, 68, 68);
        }
      `}</style>
    </div>
  );
};