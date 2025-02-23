from rest_framework import serializers
from ..models import SystemMetrics, OptimizationProfile, OptimizationResult, SystemAlert

class SystemMetricsSerializer(serializers.ModelSerializer):
    additional_metrics = serializers.JSONField(required=False, allow_null=True)
    
    class Meta:
        model = SystemMetrics
        fields = '__all__'

    def validate_additional_metrics(self, value):
        if value is None:
            return {}  # Return empty dict if null
        return value

class OptimizationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptimizationProfile
        fields = '__all__'
        
class OptimizationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptimizationResult
        fields = '__all__'
        
class SystemAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAlert
        fields = '__all__'





        """
Copyright © 2024 [Your Name/Company]
All rights reserved.

This source code is proprietary and confidential.
Unauthorized copying, transfer, or reproduction of this file,
via any medium, is strictly prohibited.

Created: 2024-02-22 12:22:22
"""