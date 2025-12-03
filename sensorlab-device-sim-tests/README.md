SensorLab: Device Simulator + Test Automation

What this demonstrates

- Embedded like sensor simulator API (TypeScript/Node) with REST + SSE streaming
- Acceptance tests with Robot Framework + RequestsLibrary
- Docker-based test execution
- CI examples: GitHub Actions + Jenkinsfile

Run (local)

- npm install
- npm run start
  Open:
- http://localhost:8092/

Key endpoints

- GET /health
- GET /api/devices
- POST /api/devices { "name": "Demo", "seed": 123 }
- POST /api/devices/:id/calibrate { "offsetC": 1.5 }
- POST /api/devices/:id/fault { "fault": 0.2 }
- GET /api/devices/:id/reading?at=1700000000 (deterministic for tests)
- GET /api/stream?deviceId=wind-1 (SSE)

Run acceptance tests (docker)

- ./scripts/test_docker.ps1
  Reports are written to ./.reports
