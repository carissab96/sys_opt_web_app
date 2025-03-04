from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from core import views
from api import urls as api_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('', views.home, name='home'), 
    path('', include('rest_framework.urls', namespace='rest_framework')),
    path('api/test-data', views.test_data, name='test-data'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('api/', include(api_urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]