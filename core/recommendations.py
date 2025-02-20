# core/recommendations.py
from typing import Dict, List
import numpy as np
from datetime import datetime, timedelta
from .models import SystemMetrics, OptimizationProfile

class RecommendationsEngine:
    def __init__(self):
        self.threshold_configs = {
            'cpu': {
                'high': 80.0,
                'medium': 60.0,
                'low': 40.0
            },
            'memory': {
                'high': 85.0,
                'medium': 70.0,
                'low': 50.0
            },
            'disk': {
                'high': 90.0,
                'medium': 75.0,
                'low': 60.0
            }
        }

    def analyze_metrics(self, metrics: SystemMetrics) -> List[Dict]:
        """Analyze current metrics and generate recommendations"""
        recommendations = []

        # CPU Analysis
        if metrics.cpu_usage > self.threshold_configs['cpu']['high']:
            recommendations.append({
                'type': 'cpu',
                'severity': 'high',
                'title': 'High CPU Usage Detected',
                'description': 'System is experiencing heavy CPU load',
                'suggestion': 'Consider upgrading to full version for automatic process optimization',
                'potential_gain': f"Up to {self._calculate_potential_gain(metrics.cpu_usage, 'cpu')}% improvement",
                'metrics': {
                    'current_usage': metrics.cpu_usage,
                    'threshold': self.threshold_configs['cpu']['high']
                }
            })

        # Memory Analysis
        if metrics.memory_usage > self.threshold_configs['memory']['medium']:
            recommendations.append({
                'type': 'memory',
                'severity': 'medium',
                'title': 'Memory Usage Optimization Available',
                'description': 'Memory usage could be optimized',
                'suggestion': 'Full version includes automatic memory management',
                'potential_gain': f"Up to {self._calculate_potential_gain(metrics.memory_usage, 'memory')}% improvement",
                'metrics': {
                    'current_usage': metrics.memory_usage,
                    'threshold': self.threshold_configs['memory']['medium']
                }
            })

        # Pattern Analysis
        pattern_recommendations = self._analyze_patterns(metrics)
        if pattern_recommendations:
            recommendations.extend(pattern_recommendations)

        return recommendations

    def _analyze_patterns(self, metrics: SystemMetrics) -> List[Dict]:
        """Analyze usage patterns for predictive recommendations"""
        patterns = []
        
        # Example pattern detection
        if hasattr(metrics, 'additional_metrics') and metrics.additional_metrics:
            if 'active_python_processes' in metrics.additional_metrics:
                if metrics.additional_metrics['active_python_processes'] > 5:
                    patterns.append({
                        'type': 'development',
                        'severity': 'info',
                        'title': 'Development Environment Detected',
                        'description': 'Multiple Python processes detected',
                        'suggestion': 'Full version includes specialized development environment optimization',
                        'potential_gain': 'Improved IDE performance and build times',
                    })

        return patterns

    def _calculate_potential_gain(self, current_usage: float, resource_type: str) -> int:
        """Calculate potential improvement percentage"""
        if current_usage > self.threshold_configs[resource_type]['high']:
            return int((current_usage - self.threshold_configs[resource_type]['low']) * 0.4)
        return int((current_usage - self.threshold_configs[resource_type]['low']) * 0.25)

    def get_optimization_summary(self, metrics: SystemMetrics) -> Dict:
        """Generate overall optimization summary"""
        recommendations = self.analyze_metrics(metrics)
        total_potential_gain = sum(
            int(r['potential_gain'].split('%')[0]) 
            for r in recommendations 
            if 'potential_gain' in r and isinstance(r['potential_gain'], str)
        )

        return {
            'total_recommendations': len(recommendations),
            'high_priority': len([r for r in recommendations if r['severity'] == 'high']),
            'potential_improvement': f"{total_potential_gain}%",
            'recommendations': recommendations
        }