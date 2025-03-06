// src/components/dashboard/Metrics/CPUMetric/CPUMetric.tsx
// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { useAppSelector } from '../../../../store/hooks';
// import './CPUMetric.css';
// import { SystemMetric } from 'frontend/src/types/metrics.';

// export const CPUMetric: React.FC = () => {
//    const metrics = useAppSelector(state => state.metrics.data);
  
//   return (
//     <div className="metric-card">
//       <h3>CPU Usage</h3>
//       <div className="metric-value">{metric?.cpu_usage ?? 0}%</div>
//       <div className="chart-container">
//         <ResponsiveContainer width="100%" height={200}>
//           <LineChart data={metric?.historicalData ?? []}>
//             <XAxis dataKey="timestamp" />
//             <YAxis domain={[0, 100]} />
//             <Tooltip />
//             <Line 
//               type="monotone" 
//               dataKey="cpu_usage" 
//               stroke="#10b981" 
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default CPUMetric;