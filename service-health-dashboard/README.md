# Service Health Dashboard (Node.js + TypeScript + React)

A fullstack monitoring dashboard for tracking service health status. Features a Node/Express backend API and a React + Vite frontend.

## Features

- **Service registry** - Add and manage monitored services
- **Status tracking** - Track healthy, degraded, and down states
- **REST API** - Full CRUD for services
- **React dashboard** - Live status visualization
- **Health endpoint** - Monitor the dashboard itself

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, Vite, TypeScript |
| State | In-memory (easily extendable to DB) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/services` | List all services |
| POST | `/api/services` | Register new service |
| POST | `/api/services/:id/status` | Update service status |

## Service Status Values

- `healthy` - Service is operating normally
- `degraded` - Service is experiencing issues
- `down` - Service is unavailable

## Run Locally

```powershell
cd service-health-dashboard

# Start both backend and frontend
.\scripts\run.ps1
```

- Backend API: http://localhost:8093
- Frontend: http://localhost:5174

## API Examples

**Register a service:**
```bash
curl -X POST http://localhost:8093/api/services \
  -H "Content-Type: application/json" \
  -d '{"name": "My API", "url": "https://api.example.com/health"}'
```

**Update status:**
```bash
curl -X POST http://localhost:8093/api/services/svc-1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "degraded"}'
```

## Project Structure

```
service-health-dashboard/
├── server/
│   ├── src/
│   │   └── server.ts    # Express API
│   └── package.json
├── web/
│   ├── src/             # React components
│   └── package.json
└── scripts/
    └── run.ps1          # Start script
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8093 | Backend API port |
