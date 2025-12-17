# FleetPilot - Vehicle Telemetry Tracker

A real-time vehicle fleet telemetry system built with Node.js and TypeScript. Track vehicle location, speed, and fuel levels with Server-Sent Events (SSE) for live updates.

## Features

- **Vehicle registration** - Register and manage fleet vehicles
- **Telemetry ingestion** - POST speed, fuel, and location data
- **Real-time streaming** - SSE endpoint for live telemetry updates
- **History tracking** - Store historical telemetry per vehicle
- **Dashboard UI** - Simple frontend showing live vehicle stats

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | HTTP server |
| Server-Sent Events | Real-time streaming |
| Vanilla JS | Frontend |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/vehicles` | List all vehicles |
| POST | `/api/vehicles` | Register new vehicle |
| GET | `/api/vehicles/:id` | Get vehicle details |
| POST | `/api/vehicles/:id/telemetry` | Post telemetry data |
| GET | `/api/vehicles/:id/telemetry` | Get telemetry history |
| GET | `/api/stream/telemetry` | SSE stream for live updates |

## Telemetry Data Model

```json
{
  "speed": 65.5,
  "fuel": 45.2,
  "latitude": 60.1699,
  "longitude": 24.9384,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Run Locally

```powershell
cd fleetpilot-vehicle-telemetry

# Install dependencies
npm install

# Start the server
.\scripts\run.ps1
```

Open http://localhost:8094 to view the dashboard.

## API Examples

**Register a vehicle:**
```bash
curl -X POST http://localhost:8094/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name": "Truck-001", "type": "truck"}'
```

**Post telemetry:**
```bash
curl -X POST http://localhost:8094/api/vehicles/v-abc123/telemetry \
  -H "Content-Type: application/json" \
  -d '{"speed": 72.5, "fuel": 38.0, "latitude": 60.17, "longitude": 24.94}'
```

**Subscribe to live updates:**
```bash
curl http://localhost:8094/api/stream/telemetry
```

## Project Structure

```
fleetpilot-vehicle-telemetry/
├── src/
│   └── server.ts      # Express + SSE server
├── public/            # Dashboard frontend
├── scripts/
│   └── run.ps1        # Start script
├── package.json
└── tsconfig.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8094 | Server port |

## Use Cases

- Fleet management systems
- Delivery tracking
- Vehicle monitoring dashboards
- IoT telemetry demonstrations
