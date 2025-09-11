# Cashback Farm Plot Manager Backend

This is the backend API for the Cashback Farm Plot Manager application, built with Django and PostgreSQL.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL
- pip (Python package manager)

## Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE cashback_farm_db;
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=cashback_farm_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

## Running the Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

- Properties: `/api/properties/`
- Bookings: `/api/bookings/`
- Payments: `/api/payments/`
- Users: `/api/users/`

## Authentication

The API uses Django REST Framework's built-in authentication. You can log in through the `/api-auth/` endpoint.

## Development

For development, make sure to:
1. Keep the virtual environment activated
2. Run migrations when model changes are made
3. Test API endpoints using tools like Postman or curl 