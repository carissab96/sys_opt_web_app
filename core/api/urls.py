## core/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    # Authentication views
    UserViewSet,
    CustomTokenObtainPairView,
    
    # System views
    SystemMetricsViewSet,
    OptimizationProfileViewSet,
    OptimizationResultViewSet,
    SystemAlertViewSet,
    AutoTuningViewSet,
    UserPreferencesViewSet
)

router = DefaultRouter()

# User management
router.register(r'users', UserViewSet, basename='user')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')

# System optimization
router.register(r'metrics', SystemMetricsViewSet, basename='metrics')
router.register(r'optimization-profile', OptimizationProfileViewSet, basename='optimization-profile')
router.register(r'optimization-result', OptimizationResultViewSet, basename='optimization-result')
router.register(r'system-alert', SystemAlertViewSet, basename='system-alert')
router.register(r'auto-tuning', AutoTuningViewSet, basename='auto-tuning')

urlpatterns = [
    # API Routes
    path('', include(router.urls)),
    
    # Authentication Routes
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]