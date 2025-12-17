# SensorLab - Device Simulator + Test Automation

An industrial sensor simulator API with comprehensive test automation. Built with Node.js/TypeScript, featuring Robot Framework acceptance tests and CI pipeline integration.

## Features

- **Device simulation** - Embedded-like sensor API with configurable behavior
- **Deterministic readings** - Reproducible sensor data for testing
- **Calibration support** - Adjust sensor offset parameters
- **Fault injection** - Simulate device faults
- **SSE streaming** - Real-time sensor data stream
- **Robot Framework tests** - Automated acceptance testing
- **CI ready** - GitHub Actions + Jenkinsfile included

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | HTTP server |
| Server-Sent Events | Real-time streaming |
| Robot Framework | Acceptance tests |
| Docker | Test execution |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/devices` | List all devices |
| POST | `/api/devices` | Create device |
| GET | `/api/devices/:id/reading` | Get sensor reading |
| POST | `/api/devices/:id/calibrate` | Calibrate device |
| POST | `/api/devices/:id/fault` | Inject fault |
| GET | `/api/stream` | SSE stream for live data |

## Run Locally

```powershell
cd sensorlab-device-sim-tests

# Install dependencies
npm install

# Start the server
npm run start
```

Server runs at http://localhost:8092

## Run Acceptance Tests

```powershell
# Run tests in Docker
.\scripts\test_docker.ps1
```

Test reports are written to `./.reports`

## Project Structure

```
sensorlab-device-sim-tests/
├── src/
│   └── server.ts          # Express + SSE server
├── robot/
│   └── tests/             # Robot Framework tests
├── scripts/
│   └── test_docker.ps1    # Docker test runner
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions
├── Jenkinsfile            # Jenkins pipeline
├── package.json
└── tsconfig.json
```

## Example Usage

```bash
# Create a device
curl -X POST http://localhost:8092/api/devices \
  -H "Content-Type: application/json" \
  -d '{"name": "TempSensor", "seed": 123}'

# Get deterministic reading (for tests)
curl "http://localhost:8092/api/devices/temp-1/reading?at=1700000000"

# Calibrate device
curl -X POST http://localhost:8092/api/devices/temp-1/calibrate \
  -H "Content-Type: application/json" \
  -d '{"offsetC": 1.5}'

# Inject fault
curl -X POST http://localhost:8092/api/devices/temp-1/fault \
  -H "Content-Type: application/json" \
  -d '{"fault": 0.2}'
```

## Testing Strategy

- **Deterministic mode**: `?at=timestamp` returns reproducible readings
- **Robot Framework**: BDD-style acceptance tests
- **Docker execution**: Isolated test environment
- **CI integration**: Automated testing on push

## Use Cases

- Embedded systems testing
- IoT simulation environments
- Test automation demonstrations
- CI/CD pipeline examples

