// src/components/dashboard/Metrics/DiskMetric/DiskMetric.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../../store/hooks';
import './DiskMetric.css';

export const DiskMetric: React.FC = () => {
    const metrics = useAppSelector((state: any) => state.metrics.current);
    
    return (
      <div className="metric-card">
        <h3>Disk Usage</h3>
        <div className="metric-value">{metrics?.disk_usage ?? 0}%</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics?.historicalData ?? []}>
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="disk_usage" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  export default DiskMetric;