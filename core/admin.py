from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, SystemMetrics, OptimizationProfile, OptimizationResult, SystemAlert

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)
    
    # Add custom fields to the default UserAdmin
    fieldsets = UserAdmin.fieldsets + (
        ('Optimization Settings', {'fields': ('optimization_preferences',)}),
    )

@admin.register(SystemMetrics)
class SystemMetricsAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'cpu_usage', 'memory_usage', 'disk_usage')
    list_filter = ('timestamp',)
    ordering = ('-timestamp',)

@admin.register(OptimizationProfile)
class OptimizationProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)

@admin.register(OptimizationResult)
class OptimizationResultAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'success')
    list_filter = ('success', 'timestamp')
    ordering = ('-timestamp',)

@admin.register(SystemAlert)
class SystemAlertAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'title', 'severity', 'is_read')
    list_filter = ('severity', 'is_read', 'timestamp')
    search_fields = ('title', 'message')
    ordering = ('-timestamp',)
# Register your models here.
