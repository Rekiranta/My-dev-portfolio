# Realtime Board (Node.js + TypeScript + WebSocket)

A real-time collaborative task board where multiple users can add, edit, and manage items simultaneously. Changes are instantly broadcast to all connected clients via WebSocket.

## Features

- **Real-time sync** - All connected browsers see updates instantly
- **WebSocket communication** - Bidirectional real-time messaging
- **Persistent state** - Data saved to `data/state.json`
- **Simple REST API** - Health check and state endpoints
- **No database required** - File-based persistence

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | HTTP server |
| ws | WebSocket server |
| nanoid | Unique ID generation |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/state` | Get current state |
| WS | `/ws` | WebSocket connection |

## WebSocket Messages

**Client to Server:**
```json
{ "type": "add", "text": "New item" }
{ "type": "toggle", "id": "abc123" }
{ "type": "delete", "id": "abc123" }
{ "type": "rename", "id": "abc123", "text": "Updated text" }
{ "type": "clearDone" }
{ "type": "clearAll" }
```

**Server to Client:**
```json
{ "type": "state", "state": { "items": [...] } }
{ "type": "error", "message": "Invalid message" }
```

## Run Locally

```powershell
cd node-ws-realtime-board

# Install dependencies
npm install

# Start the server
.\scripts\run.ps1
# or: npm run dev
```

Open http://localhost:8090 in multiple browser tabs to test real-time sync.

## Project Structure

```
node-ws-realtime-board/
├── src/
│   └── server.ts      # Express + WebSocket server
├── public/            # Static frontend files
├── data/              # Persisted state (auto-created)
├── scripts/
│   └── run.ps1        # Start script
├── package.json
└── tsconfig.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8090 | Server port |
