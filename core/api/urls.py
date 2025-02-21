from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import SystemMetricsViewSet, OptimizationProfileViewSet, OptimizationResultViewSet, SystemAlertViewSet

router = DefaultRouter()
router.register(r'metrics', SystemMetricsViewSet)
router.register(r'optimization-profile', OptimizationProfileViewSet)
router.register(r'optimization-result', OptimizationResultViewSet)
router.register(r'system-alert', SystemAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test-data', SystemMetricsViewSet.as_view({'get': 'test_data'}), name='test-data'),
    path('dashboard', SystemMetricsViewSet.as_view({'get': 'dashboard'}), name='dashboard'),    
]