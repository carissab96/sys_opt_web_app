from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, logout

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('logout/', logout, name='auth_logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


