"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# config/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from core.views import error_403, error_404, error_500

try:
    schema_view = get_schema_view(
        openapi.Info(
            title="System Optimizer API",
            default_version='v1',
            description="Sir Hawkington's Distinguished API Documentation",
            terms_of_service="https://www.hawkington.com/terms/",
            contact=openapi.Contact(email="sir.hawkington@distinguished.com"),
            license=openapi.License(name="BSD License"),
        ),
        public=True,
        permission_classes=[permissions.AllowAny],
      
    )

    swagger_urls = [
        path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]
except Exception as e:
    print(f"Failed to initialize schema view: {e}")
    swagger_urls = []

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.api.urls')),
] + swagger_urls
urlpatterns = [
    # The stick insisted on keeping admin properly formatted
    path('admin/', admin.site.urls),
    # Swagger URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # Core API paths
    path('api/', include('core.api.urls')),

    # ML module paths (now with correct routing!)
    path('api/ml/', include('core.ml.urls')),
    
]

# Static and media files (the stick wouldn't let us remove this)
if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL, 
        document_root=settings.STATIC_ROOT
    )
    urlpatterns += static(
        settings.MEDIA_URL, 
        document_root=settings.MEDIA_ROOT
    )
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
# Error handlers (now with extra chaos)
handler404 = 'core.views.error_404'  # Page not found (probably stolen by shadow people)
handler500 = 'core.views.error_500'  # Server error (meth snail is investigating)
handler403 = 'core.views.error_403'  # Forbidden (hamsters deny everything)