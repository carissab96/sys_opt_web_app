"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_asgi_application()


"""
Copyright © 2024 [Your Name/Company]
All rights reserved.

This source code is proprietary and confidential.
Unauthorized copying, transfer, or reproduction of this file,
via any medium, is strictly prohibited.

Created: 2024-02-22 12:22:22
"""