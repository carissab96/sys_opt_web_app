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
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="System Optimizer API",
        default_version='v1',
        description="""Web demo of our system optimization technology.
        
        This API provides access to:
        - Real-time system metrics
        - Optimization profiles and results
        - System alerts and notifications
        - Auto-tuning capabilities
        
        For full system optimization capabilities, check out our system integration solution.
        """,
        contact=openapi.Contact(email="support@systemoptimizer.com"),
        license=openapi.License(name="Proprietary"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],  # Allow unauthenticated access in development
)

urlpatterns = [
    path('api/ml/', include('core.ml.context.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('core.api.urls')),
    path('api/auth/', include('authentication.urls')),  # Sir Hawkington's VIP entrance
    path('', include('core.urls')),
    
    # API Documentation
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include('debug_toolbar.urls')),
    ]



"""
Copyright © 2024 [Your Name/Company]
All rights reserved.

This source code is proprietary and confidential.
Unauthorized copying, transfer, or reproduction of this file,
via any medium, is strictly prohibited.

Created: 2024-02-22 12:22:22
"""