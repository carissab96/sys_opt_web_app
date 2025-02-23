# Generated by Django 5.1.6 on 2025-02-22 20:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "operating_system",
                    models.CharField(
                        choices=[
                            ("linux", "Linux"),
                            ("windows", "Windows"),
                            ("macos", "macOS"),
                        ],
                        max_length=20,
                    ),
                ),
                ("os_version", models.CharField(max_length=50)),
                (
                    "linux_distro",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                (
                    "linux_distro_version",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                ("cpu_cores", models.IntegerField(blank=True, null=True)),
                (
                    "total_memory",
                    models.IntegerField(
                        blank=True, help_text="Total RAM in MB", null=True
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
