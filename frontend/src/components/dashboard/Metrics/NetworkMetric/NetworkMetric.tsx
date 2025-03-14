import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../../store/hooks';
import './NetworkMetric.css';

export const NetworkMetric: React.FC = () => {
  const metrics = useAppSelector((state: any) => state.metrics.current);
  
  return (
    <div className="metric-card">
      <h3>Network Usage</h3>
      <div className="metric-value">{metrics?.network_usage ?? 0} MB/s</div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics?.historicalData ?? []}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="network_usage" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkMetric;