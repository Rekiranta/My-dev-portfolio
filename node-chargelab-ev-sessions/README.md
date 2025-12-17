# ChargeLab - EV Charging Session Tracker

A fullstack EV charging station management system with real-time session monitoring. Built with Node.js, TypeScript, Express, and WebSockets.

## Features

- **Station management** - Create and list EV charging stations
- **Session tracking** - Start and stop charging sessions for vehicles
- **Real-time simulation** - Background loop calculates energy delivery over time
- **WebSocket streaming** - Live updates pushed to connected clients
- **Daily statistics** - Energy consumption and revenue per station
- **File persistence** - State saved to JSON file

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | REST API server |
| WebSocket (ws) | Real-time streaming |
| JSON file | Data persistence |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with station/session counts |
| GET | `/api/stations` | List all charging stations |
| POST | `/api/stations` | Create new station |
| GET | `/api/sessions` | List sessions (filter by status/station) |
| POST | `/api/sessions/start` | Start charging session |
| POST | `/api/sessions/:id/stop` | Stop charging session |
| GET | `/api/stats/daily` | Daily energy & revenue stats |

## WebSocket Events

Connect to `ws://localhost:8093/ws/sessions` for live updates:

| Event | Description |
|-------|-------------|
| `snapshot` | Initial state on connection |
| `session_started` | New session began |
| `sessions_tick` | Energy update for active sessions |
| `session_completed` | Session finished |

## Run Locally

```powershell
cd node-chargelab-ev-sessions

# Install dependencies
npm install

# Start the server
.\scripts\run.ps1
```

Server runs at http://localhost:8093

## Project Structure

```
node-chargelab-ev-sessions/
├── src/
│   └── server.ts        # Express + WebSocket server
├── data/
│   └── state.json       # Persisted state (gitignored)
├── scripts/
│   └── run.ps1          # Start script
├── package.json
└── tsconfig.json
```

## Simulation Details

- **Tick interval**: 10 seconds
- **Charging efficiency**: 90%
- **Price per kWh**: €0.30

Energy calculation:
```
energy (kWh) = station.maxKw × efficiency × time (hours)
```

## Example Usage

```bash
# Create a station
curl -X POST http://localhost:8093/api/stations \
  -H "Content-Type: application/json" \
  -d '{"name":"Station A","location":"Parking Lot","maxKw":50,"connectorType":"DC"}'

# Start a session
curl -X POST http://localhost:8093/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"stationId":"st-abc123","vehicleId":"ABC-123"}'

# Stop a session
curl -X POST http://localhost:8093/api/sessions/sess-xyz789/stop
```

## Use Cases

- EV charging infrastructure demos
- Fleet management simulations
- Real-time WebSocket examples
- IoT device tracking patterns

