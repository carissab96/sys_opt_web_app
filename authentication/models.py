from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

class UserProfile(models.Model):
    LINUX = 'linux'
    WINDOWS = 'windows'
    MACOS = 'macos'
    
    OS_CHOICES = [
        (LINUX, 'Linux'),
        (WINDOWS, 'Windows'),
        (MACOS, 'macOS'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    operating_system = models.CharField(max_length=20, choices=OS_CHOICES)
    os_version = models.CharField(max_length=50)
    linux_distro = models.CharField(max_length=50, blank=True, null=True)
    linux_distro_version = models.CharField(max_length=50, blank=True, null=True)
    cpu_cores = models.IntegerField(null=True, blank=True)
    total_memory = models.IntegerField(help_text='Total RAM in MB', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile - {self.operating_system} {self.os_version}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


