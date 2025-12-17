# BuildWatch - CI Pipeline Monitor

A fullstack CI/CD monitoring dashboard that tracks build status in real-time. Built with Node.js, TypeScript, and Server-Sent Events for live updates.

## Features

- **Build tracking** - Create and monitor simulated CI builds
- **Status transitions** - Automatic progression through build stages
- **Real-time updates** - Live build status via Server-Sent Events (SSE)
- **Web dashboard** - Live-updating build table UI
- **REST API** - Full API for build management
- **Python tests** - Optional pytest smoke tests

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | HTTP server |
| Server-Sent Events | Real-time streaming |
| HTML/CSS/JS | Frontend dashboard |
| Python/Pytest | API tests (optional) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/builds` | List all builds |
| POST | `/api/builds` | Create new build |
| GET | `/api/builds/:id` | Get build details |
| GET | `/api/stream` | SSE stream for live updates |

## Build Status Flow

```
queued → running → success/failed
```

## Run Locally

```powershell
cd buildwatch-ci-monitor

# Install dependencies
npm install

# Start the server
.\scripts\run.ps1
```

Open http://localhost:8093 to view the dashboard.

## Run Python Tests (Optional)

```powershell
cd python-tests
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -v
```

## Project Structure

```
buildwatch-ci-monitor/
├── src/
│   └── server.ts        # Express + SSE server
├── public/              # Frontend dashboard
├── python-tests/        # Pytest API tests
│   ├── test_builds.py
│   └── requirements.txt
├── scripts/
│   └── run.ps1          # Start script
├── package.json
└── tsconfig.json
```

## Use Cases

- CI/CD monitoring dashboards
- DevOps tooling demonstrations
- Real-time notification systems
- Build pipeline visualization
