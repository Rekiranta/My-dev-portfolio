# SSE Task Feed - Real-time Todo App

A fullstack task management app with Server-Sent Events for live synchronization across browser tabs. Built with Node.js, TypeScript, and Express.

## Features

- **Add tasks** - Create new todo items
- **Toggle completion** - Mark tasks as done/undone
- **Delete tasks** - Remove individual items
- **Clear all** - Reset the entire list
- **Real-time sync** - Changes broadcast to all connected clients via SSE
- **File persistence** - State saved to JSON file
- **No build step** - Vanilla JS frontend

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Express | HTTP server |
| Server-Sent Events | Real-time streaming |
| HTML/CSS/JS | Frontend (no build) |
| JSON file | Data persistence |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/state` | Get current state |
| POST | `/api/items` | Create new item |
| POST | `/api/items/:id/toggle` | Toggle item completion |
| DELETE | `/api/items/:id` | Delete item |
| POST | `/api/clear` | Clear all items |
| GET | `/events` | SSE stream for live updates |

## Run Locally

```powershell
cd node-sse-task-feed

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:8091 in your browser.

## Run Tests

```powershell
npm test
```

## Project Structure

```
node-sse-task-feed/
├── src/
│   └── server.ts      # Express + SSE server
├── public/            # Frontend files
│   ├── index.html
│   ├── style.css
│   └── app.js
├── data/
│   └── state.json     # Persisted state (gitignored)
├── package.json
└── tsconfig.json
```

## How SSE Works

1. Client connects to `/events` endpoint
2. Server keeps connection open
3. On any state change, server pushes full state to all clients
4. Clients update UI instantly

```javascript
// Client-side SSE connection
const events = new EventSource('/events');
events.onmessage = (e) => {
  const state = JSON.parse(e.data);
  renderTasks(state.items);
};
```

## Data Structure

```json
{
  "items": [
    { "id": "abc123", "text": "Learn TypeScript", "done": false },
    { "id": "def456", "text": "Build SSE app", "done": true }
  ]
}
```

## Use Cases

- Real-time collaborative apps
- Live notification systems
- Multi-tab synchronization
- SSE vs WebSocket comparison

