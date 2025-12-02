# DevOps Local Release Pipeline

A small but production-inspired API project that demonstrates a DevOps-style workflow:
tests, CI, Docker packaging, and a simple release script.

## Tech stack

- Python + FastAPI
- Pytest
- GitHub Actions (CI)
- Docker

## Run locally

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
