// src/components/Metrics/MetricDisplay.tsx
import { useAppSelector } from '../../store/store';
import { useEffect } from 'react';

const MetricDisplay: React.FC = () => {
    const metrics = useAppSelector((state) => state.metrics);
    
    useEffect(() => {
        console.log("🎨 COMPONENT METRICS UPDATED:", {
            current: metrics.current,
            lastUpdated: metrics.lastUpdated,
            historicalLength: metrics.historical.length
        });
    }, [metrics]);

    // ... rest of your component
    return (
        <div>
            <h1>Metrics Display</h1>
            <p>Current metrics: {JSON.stringify(metrics.current)}</p>
            <p>Last updated: {metrics.lastUpdated}</p>
            <p>Historical metrics length: {metrics.historical.length}</p>
        </div>
    );
};

export default MetricDisplay;