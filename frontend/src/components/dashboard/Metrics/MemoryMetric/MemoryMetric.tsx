// src/components/dashboard/Metrics/MemoryMetric/MemoryMetric.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../../store/hooks';
import './MemoryMetric.css';

export const MemoryMetric: React.FC = () => {
    const metrics = useAppSelector(state => state.metrics.data);
    
    return (
      <div className="metric-card">
        <h3>Memory Usage</h3>
        <div className="metric-value">{metrics?.memory_usage ?? 0}%</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics?.historicalData ?? []}>
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="memory_usage" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default MemoryMetric;