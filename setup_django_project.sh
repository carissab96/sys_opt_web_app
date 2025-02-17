#!/bin/bash
#!/bin/bash

# setup_django_project.sh

echo "Starting Django project setup..."

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install django djangorestframework psycopg2-binary python-dotenv django-cors-headers celery redis
pip freeze > requirements.txt

# Create Django project
echo "Creating Django project structure..."
django-admin startproject config .
python manage.py startapp core

# Create directory structure
mkdir -p config/settings
mkdir -p core/tests
mkdir -p static templates media

# Create settings files
echo "Creating settings files..."

# Base settings
cat > config/settings/base.py << 'EOL'
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'core.apps.CoreConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
EOL

# Development settings
cat > config/settings/development.py << 'EOL'
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
EOL

# Create __init__.py in settings
touch config/settings/__init__.py

# Create .env file
cat > .env << 'EOL'
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=system_optimizer
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
EOL

# Create initial core app files
cat > core/urls.py << 'EOL'
from django.urls import path
from . import views

urlpatterns = [
    # Add URL patterns here
]
EOL

# Create test files
touch core/tests/__init__.py
touch core/tests/test_models.py
touch core/tests/test_views.py

# Update manage.py
sed -i "s/config.settings/config.settings.development/" manage.py

# Create initial README
cat > README.md << 'EOL'
# System Optimizer Web Application

## Setup
1. Create virtual environment: `python -m venv venv`
2. Activate virtual environment: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Update .env file with your database credentials
5. Run migrations: `python manage.py migrate`
6. Run server: `python manage.py runserver`

## Development
- Create superuser: `python manage.py createsuperuser`
- Run tests: `python manage.py test`
EOL

# Initialize git (if not already done)
if [ ! -d ".git" ]; then
    git init
fi

# Create .gitignore
cat > .gitignore << 'EOL'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media

# Virtual Environment
venv/
ENV/

# Environment Variables
.env

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOL

echo "Django project setup complete!"
echo "Remember to:"
echo "1. Update .env with your actual database credentials"
echo "2. Create and activate your PostgreSQL database"
echo "3. Run migrations: python manage.py migrate"
echo "4. Create a superuser: python manage.py createsuperuser"
