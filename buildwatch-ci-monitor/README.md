# BuildWatch – CI Pipeline Monitor

Small fullstack project (Node.js + TypeScript backend, plain HTML/JS frontend, optional Python tests).

Features:
- Express API to create and inspect simulated CI build runs
- In-memory build store with automatic status transitions
- Server-Sent Events stream that pushes live build updates to the browser
- Simple web UI showing a live-updating build table
- Python/pytest smoke tests that hit the HTTP API

Run:
- .\scripts\run.ps1
Then open: http://localhost:8093

Run Python tests (optional):
- cd python-tests
- python -m venv .venv
- .\.venv\Scripts\activate
- pip install -r requirements.txt
- pytest