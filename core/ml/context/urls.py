from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContextViewSet

router = DefaultRouter()
router.register(r'context', ContextViewSet, basename='context')

urlpatterns = [
    path('', include(router.urls)),
]
