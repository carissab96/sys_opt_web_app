from .base import *



print("HOLY SHIT, I'M ACTUALLY BEING USED!")

print("Show me where Django touched you...")

DEBUG = True  # Is this ACTUALLY True or is it lying like my ex?

print(f"DEBUG is set to: {DEBUG}")

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    # Fuck it, let's go nuclear for development
    '*'  # The universal "I don't give a fuck" wildcard
]
print(f"ALLOWED_HOSTS contains: {ALLOWED_HOSTS}")

# Debug Toolbar settings
INSTALLED_APPS = [
    'daphne',
    'core.apps.CoreConfig',
    'authentication.apps.AuthenticationConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'debug_toolbar',  # Add this
    'rest_framework',
    'rest_framework_simplejwt',  # ADD THIS FUCKER
    'corsheaders',
    'channels',
    'channels_redis',
    'drf_spectacular',

 
]
AUTH_USER_MODEL = 'core.User'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: True,
}
CORS_ALLOW_ALL_ORIGINS = True

# CSRF Settings
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
# CSRF Configuration - Sir Hawkington's Cross-Site Request Forgery Shield
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_SECURE = False  # Only send cookie over HTTPS
CSRF_COOKIE_HTTPONLY = False  # Not accessible via JavaScript
CSRF_USE_SESSIONS = True  # Store CSRF in session instead of cookie
CSRF_COOKIE_SAMESITE = 'Lax'  # Strict SameSite policy

CHANNEL_LAYERS = {
    "default": {
        "BACKEND":"channels.layers.InMemoryChannelLayer",
    },
}
