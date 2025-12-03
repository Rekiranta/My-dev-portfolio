# ChargeLab – EV Charging Session Tracker

Small but realistic backend heavy project built with **Node.js + TypeScript + Express + WebSocket**.

Features:

- Manage EV charging stations (create + list)
- Start and stop charging sessions for a vehicle at a station
- Background simulation that increases delivered energy (kWh) over time
- WebSocket stream that pushes session events to connected clients:
  - `session_started`
  - `sessions_tick`
  - `session_completed`
- Daily statistics endpoint (energy + revenue per station)
- State persisted to `data/state.json`

## Run

```powershell
.\scripts\run.ps1
```
