from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Additional development-specific settings
INSTALLED_APPS += [
    'django_extensions',
    'debug_toolbar',
]

MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# Debug Toolbar settings
INTERNAL_IPS = [
    '127.0.0.1',
]
