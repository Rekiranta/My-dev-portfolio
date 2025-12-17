# Project Planner - Flask + SQLite

A project management web application with status tracking and filtering. Built with Python, Flask, and SQLite.

## Features

- **Create projects** - Add projects with title, description, due date
- **Status tracking** - Track progress: Planned → In Progress → Completed
- **Status filtering** - Filter view by project status
- **Quick status update** - Change status with one click
- **Delete projects** - Remove completed or cancelled projects
- **Persistent storage** - SQLite database

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Flask | Web framework |
| SQLite | Database |
| Jinja2 | HTML templates |
| CSS3 | Styling |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Project list (with optional filter) |
| POST | `/` | Create new project |
| GET | `/set_status/<id>/<status>` | Update project status |
| GET | `/delete/<id>` | Delete project |

## Project Statuses

| Status | Description |
|--------|-------------|
| planned | Project is planned but not started |
| in_progress | Currently being worked on |
| completed | Finished |

## Run Locally

```powershell
cd project-planer-flask

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

Server runs at http://localhost:5000

## Run with Docker (Optional)

```powershell
docker build -t project-planner .
docker run -p 5000:5000 project-planner
```

## Project Structure

```
project-planer-flask/
├── app.py              # Flask routes
├── models.py           # Database setup
├── templates/
│   └── index.html      # Main template
├── static/
│   └── style.css       # Styles
├── requirements.txt
├── Dockerfile
└── README.md
```

## Database Schema

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planned',
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Flask 3.x Note

This project uses eager database initialization at startup. Flask 3 removed the `before_first_request` hook, so `init_db()` is called directly when the app starts.

## Use Cases

- Personal project tracking
- Team task management
- Sprint planning boards
- Simple Kanban-style workflows

