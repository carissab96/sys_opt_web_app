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
