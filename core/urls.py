from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from core import views
from api import urls as api_urls

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('', views.home, name='home'), 
    path('', include('rest_framework.urls', namespace='rest_framework')),
    path('api/test-data', views.test_data, name='test-data'),
    path('dashboard', views.dashboard, name='dashboard'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]