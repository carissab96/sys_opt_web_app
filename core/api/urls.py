from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SystemMetricsViewSet,
    OptimizationProfileViewSet,
    OptimizationResultViewSet,
    SystemAlertViewSet
)  # Remove ContextViewSet from here

router = DefaultRouter()
router.register(r'metrics', SystemMetricsViewSet, basename='metrics')
router.register(r'optimization-profile', OptimizationProfileViewSet, basename='optimization-profile')
router.register(r'optimization-result', OptimizationResultViewSet, basename='optimization-result')
router.register(r'system-alert', SystemAlertViewSet, basename='system-alert')

urlpatterns = [
    path('', include(router.urls)),
]