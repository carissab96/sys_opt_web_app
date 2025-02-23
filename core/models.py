from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Extended user model for system optimization preferences"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    optimization_preferences = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'users'

class SystemMetrics(models.Model):
    """Store system performance metrics"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(default=timezone.now)
    cpu_usage = models.FloatField()
    memory_usage = models.FloatField()
    disk_usage = models.FloatField()
    network_usage = models.FloatField()
    process_count = models.IntegerField()
    additional_metrics = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'system_metrics'
        indexes = [
            models.Index(fields=['timestamp']),
        ]

class OptimizationProfile(models.Model):
    """Store optimization profiles and settings"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='optimization_profiles')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    settings = models.JSONField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'optimization_profiles'

class OptimizationResult(models.Model):
    """Store results of optimization runs"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        OptimizationProfile, 
        on_delete=models.CASCADE, 
        related_name='results',
        null=True,  # Make profile optional
        blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='optimization_results')
    timestamp = models.DateTimeField(default=timezone.now)
    metrics_before = models.JSONField()
    metrics_after = models.JSONField()
    actions_taken = models.JSONField()
    success = models.BooleanField()
    error_message = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'optimization_results'
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]

class SystemAlert(models.Model):
    """Store system alerts and notifications"""
    SEVERITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')
    timestamp = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=255)
    message = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    is_read = models.BooleanField(default=False)
    related_metrics = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = 'system_alerts'
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'is_read']),
        ]

exported_models = [
    User,
    SystemMetrics,
    OptimizationProfile,
    OptimizationResult,
    SystemAlert,
]