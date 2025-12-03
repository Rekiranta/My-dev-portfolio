# FastAPI + Redis Cache API (dependency injection + tests)

A small API that demonstrates:
- Redis-backed caching (with safe fallback to in-memory cache)
- FastAPI dependency injection (override cache in tests)
- Simple endpoints + pytest suite

## Run (PowerShell)

```powershell
docker compose up -d

python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r requirements.txt

python -m uvicorn src.cache_api.main:app --reload --port 8005
