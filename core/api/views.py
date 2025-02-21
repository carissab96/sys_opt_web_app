from rest_framework import viewsets, permissions
from ..models import SystemMetrics, OptimizationProfile, OptimizationResult, SystemAlert
from .serializers import SystemMetricsSerializer, OptimizationProfileSerializer, OptimizationResultSerializer, SystemAlertSerializer

class SystemMetricsViewSet(viewsets.ModelViewSet):
    queryset = SystemMetrics.objects.all()
    serializer_class = SystemMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]

class OptimizationProfileViewSet(viewsets.ModelViewSet):
    queryset = OptimizationProfile.objects.all()
    serializer_class = OptimizationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class OptimizationResultViewSet(viewsets.ModelViewSet):
    queryset = OptimizationResult.objects.all()
    serializer_class = OptimizationResultSerializer
    permission_classes = [permissions.IsAuthenticated]

class SystemAlertViewSet(viewsets.ModelViewSet):
    queryset = SystemAlert.objects.all()
    serializer_class = SystemAlertSerializer
    permission_classes = [permissions.IsAuthenticated]