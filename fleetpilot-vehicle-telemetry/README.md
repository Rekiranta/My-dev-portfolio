# FleetPilot – Vehicle Telemetry Tracker

Small TypeScript + Node.js backend with a vanilla JS frontend:

- Express API for registering vehicles and posting telemetry
- In-memory store of latest and historical telemetry per vehicle
- Server-Sent Events stream (`/api/stream/telemetry`) for live updates
- Simple dashboard UI that shows live speed, fuel and location per vehicle

## Run

From the project root:

```powershell
cd .\fleetpilot-vehicle-telemetry
.\scripts\run.ps1