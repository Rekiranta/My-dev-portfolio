# DevOps Statusboard (React + Flask)

A fullstack environment status dashboard with a Flask API backend and React frontend. Features automated testing and CI pipeline integration.

## Features

- **Status API** - JSON endpoint for environment health data
- **React dashboard** - Polished UI with Vite build
- **Flask backend** - Simple REST API with CORS support
- **Dual UI** - Both React SPA and Flask-rendered HTML
- **Automated tests** - pytest suite for API
- **CI ready** - GitHub Actions workflow
- **Docker support** - Optional containerization

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Backend runtime |
| Flask | REST API |
| React | Frontend SPA |
| Vite | Frontend build tool |
| Pytest | Backend tests |
| GitHub Actions | CI pipeline |
| Docker | Containerization |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info (JSON) |
| GET | `/health` | Health check |
| GET | `/api/status` | Environment status data |
| GET | `/ui` | Flask-rendered HTML UI |

## Run Locally

### Backend

```powershell
cd devops-statusboard/backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest -v

# Start the server
python app.py
```

Backend runs at http://localhost:5000

### Frontend

```powershell
cd devops-statusboard/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at http://localhost:5173

## Project Structure

```
devops-statusboard/
├── backend/
│   ├── app.py              # Flask application
│   ├── tests/
│   │   └── test_app.py     # Pytest suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── App.tsx         # React app
│   ├── package.json
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions
├── docker-compose.yml
└── README.md
```

## Environment Status Response

```json
[
  {"name": "development", "status": "healthy", "detail": "Last deploy: 12 min ago"},
  {"name": "staging", "status": "degraded", "detail": "High latency on /api"},
  {"name": "production", "status": "healthy", "detail": "All checks passing"}
]
```

## Status Types

| Status | Description |
|--------|-------------|
| `healthy` | All systems operational |
| `degraded` | Partial issues detected |
| `down` | Service unavailable |

## Use Cases

- DevOps monitoring dashboards
- Environment status pages
- Fullstack portfolio demonstrations
- CI/CD workflow examples

