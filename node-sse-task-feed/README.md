Run (PowerShell):

  cd .\node-sse-task-feed
  npm install
  npm run dev

Open:
  http://localhost:8091

What you get:
- Express + TypeScript backend
- SSE (/events) that pushes the full state to all connected browsers on every change
- Tiny frontend (no build step): vanilla JS + HTML + CSS
- File persistence: data/state.json (ignored by git)

API:
- GET    /api/state
- POST   /api/items        { "text": "..." }
- POST   /api/items/:id/toggle
- DELETE /api/items/:id
- POST   /api/clear
- GET    /events           (Server-Sent Events)

Tests:
  npm test