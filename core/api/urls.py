from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    SystemMetricsViewSet,
    OptimizationProfileViewSet,
    OptimizationResultViewSet,
    SystemAlertViewSet,
    AutoTuningViewSet
)

# Initialize router with trailing slashes for proper aristocratic dignity
router = DefaultRouter(trailing_slash=True)

# Register our distinguished viewsets
router.register(r'metrics', SystemMetricsViewSet, basename='metrics')
router.register(r'profiles', OptimizationProfileViewSet, basename='profiles')
router.register(r'results', OptimizationResultViewSet, basename='results')
router.register(r'alerts', SystemAlertViewSet, basename='alerts')
router.register(r'tuning', AutoTuningViewSet, basename='tuning')

# Auto-tuning endpoints with proper REST structure
urlpatterns = [
    # Include router URLs with distinguished swagger
    path('', include(router.urls)),
    
    # Dashboard and testing endpoints
    path('dashboard/', SystemMetricsViewSet.as_view({'get': 'dashboard'}), name='dashboard'),
    path('metrics/test/', SystemMetricsViewSet.as_view({'get': 'test_data'}), name='test-data'),
    
    # Auto-tuning endpoints with proper REST naming
    path('tuning/state/', AutoTuningViewSet.as_view({'get': 'current_state'}), name='tuning-state'),
    path('tuning/recommendations/', AutoTuningViewSet.as_view({'get': 'recommendations'}), name='tuning-recommendations'),
    path('tuning/apply/', AutoTuningViewSet.as_view({'post': 'apply_tuning'}), name='tuning-apply'),
    path('tuning/visualize/', AutoTuningViewSet.as_view({'get': 'visualization_data'}), name='tuning-visualize'),
]




"""
Copyright © 2024 [Your Name/Company]
All rights reserved.

This source code is proprietary and confidential.
Unauthorized copying, transfer, or reproduction of this file,
via any medium, is strictly prohibited.

Created: 2024-02-22 12:22:22
"""