# DevOps Statusboard (React + Flask)

A small but production-minded demo that showcases:

- a JSON API (Flask)
- a polished dashboard UI (React)
- automated tests (pytest)
- CI pipeline (GitHub Actions)
- optional containerization (Docker Compose)

## Tech stack

- Python + Flask (API)
- React + Vite (UI)
- pytest (tests)
- GitHub Actions (CI)
- Docker (optional)

## Local run

### 1) Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -q
python app.py
```
