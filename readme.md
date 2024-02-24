# Run API
- cd into `api` directory
- Install poetry `pip install poetry`
- Install packages `poetry install`
- Make sure that DB credentials in `api/config/settings.py` is set correctly
- Run migrations `poetry run python manage.py migrate`
- Run server `poetry run python manage.py runserver`

# Run App
- cd into `app` directory
- Install packages `npm install`
- Run app `npm run dev`
- Open `http://localhost:3000` in browser
