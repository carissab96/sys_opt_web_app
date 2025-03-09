import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../../store/hooks';
import { RootState } from '../../../../store/store';
import './CPUMetric.css';
import { SystemMetric } from '../../../../types/metrics';

export const CPUMetric: React.FC = () => {
    // Explicitly type the selectors with SystemMetric
    const currentMetric = useAppSelector((state: RootState) => state.metrics.current) as SystemMetric | null;
    const historicalMetrics = useAppSelector((state: RootState) => state.metrics.historical) as SystemMetric[];
    const isLoading = useAppSelector((state: RootState) => state.metrics.loading);

    // Type your chart data
    const chartData: SystemMetric[] = historicalMetrics;

    if (isLoading) {
        return <div className="metric-card">Loading metrics...</div>;
    }

    return (
        <div className="metric-card">
            <h3>CPU Usage</h3>
            <div className="metric-value">
                {currentMetric?.cpu_usage?.toFixed(1) ?? 0}%
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <XAxis 
                            dataKey="timestamp"
                            tickFormatter={(time: string) => new Date(time).toLocaleTimeString()}
                        />
                        <YAxis 
                            domain={[0, 100]}
                            tickFormatter={(value: number) => `${value}%`}
                        />
                        <Tooltip 
                            formatter={(value: number) => [`${Number(value).toFixed(1)}%`, 'CPU Usage']}
                            labelFormatter={(label: string) => new Date(label).toLocaleString()}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="cpu_usage" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CPUMetric;