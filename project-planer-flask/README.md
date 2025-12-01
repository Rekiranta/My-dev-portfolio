# Project Planner (Flask + SQLite)

A visually polished project planning web application with status filters and a SQLite database.

## Tech stack

- Python
- Flask
- SQLite
- HTML templates (Jinja2)
- Modern CSS layout and styling
- Docker (optional)

## Run without Docker

```bash
pip install -r requirements.txt
python app.py

Note: This project is tested with Flask 3.x. The database is initialized
eagerly when the app starts (Flask 3 removed the `before_first_request`
hook that older tutorials often use).
