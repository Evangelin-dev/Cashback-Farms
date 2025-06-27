# Core Application

This is the core application of the Django project. 

## Setup Instructions

1. Ensure you have Python and Django installed.
2. Add the `core` app to your `INSTALLED_APPS` in the Django settings.
3. Run migrations to set up the database:
   ```
   python manage.py migrate
   ```
4. Create a superuser to access the admin site:
   ```
   python manage.py createsuperuser
   ```
5. Start the development server:
   ```
   python manage.py runserver
   ```

## Usage

This application serves as the main functionality of the project. You can define your models, views, and tests within this app. 

## Directory Structure

- `admin.py`: Register your models here.
- `apps.py`: Configuration for the core app.
- `migrations/`: Contains database migrations.
- `models.py`: Define your data models.
- `tests.py`: Write your tests here.
- `views.py`: Define your views to handle requests.