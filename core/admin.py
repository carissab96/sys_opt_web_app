from django.contrib import admin
from .models import (   
    User,
    SystemMetrics,
    OptimizationProfile,
    SystemAlert,
    UserProfile,
    UserPreferences
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'is_active', 'created_at']
    search_fields = ['username', 'email']

@admin.register(SystemMetrics)
class SystemMetricsAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'cpu_usage', 'memory_usage', 'disk_usage']
    list_filter = ['timestamp']

@admin.register(OptimizationProfile)
class OptimizationProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']

@admin.register(SystemAlert)
class SystemAlertAdmin(admin.ModelAdmin):
    list_display = ['title', 'severity', 'timestamp', 'is_read']
    list_filter = ['severity', 'is_read', 'timestamp']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'operating_system', 'os_version']
    list_filter = ['operating_system']

@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ['User', 'optimization_level']
    list_filter = ['optimization_level']