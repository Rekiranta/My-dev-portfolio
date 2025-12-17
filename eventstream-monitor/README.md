# EventStream Monitor - Edge Device Data Pipeline

A fullstack project simulating industrial edge devices with real-time sensor data streaming. Built with Node.js, TypeScript, and Server-Sent Events (SSE).

## Features

- **Device simulation** - Simulates industrial edge devices with sensors
- **Deterministic readings** - Reproducible sensor data generation
- **Calibration support** - Adjust sensor calibration parameters
- **Fault injection** - Simulate device faults for testing
- **Real-time streaming** - Live data via Server-Sent Events (SSE)
- **No database** - In-memory state for simplicity

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | HTTP server |
| Server-Sent Events | Real-time streaming |
| HTML/CSS/JS | Frontend UI |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/devices` | List all devices |
| GET | `/api/devices/:id` | Get device details |
| POST | `/api/devices/:id/calibrate` | Calibrate device |
| POST | `/api/devices/:id/fault` | Inject fault |
| GET | `/api/stream` | SSE stream for live data |

## Run Locally

```powershell
cd eventstream-monitor

# Install dependencies
npm install

# Start the server
.\scripts\run.ps1
```

Open http://localhost:8093 to view the dashboard.

## Project Structure

```
eventstream-monitor/
├── src/
│   └── server.ts      # Express + SSE server
├── public/            # Frontend UI
├── scripts/
│   └── run.ps1        # Start script
├── package.json
└── tsconfig.json
```

## Use Cases

- Industrial IoT monitoring demos
- Edge computing simulations
- Real-time data streaming examples
- Fault tolerance testing
