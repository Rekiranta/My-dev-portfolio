from datetime import datetime, timezone
from fastapi import FastAPI
from .version import VERSION

app = FastAPI(title="DevOps Local Release Pipeline", version=VERSION)

@app.get("/health")
def health():
    return {
        "status": "pass",
        "message": "Service is healthy",
        "utc": datetime.now(timezone.utc).isoformat(),
        "version": VERSION,
    }

@app.get("/version")
def version():
    return {"version": VERSION}

@app.get("/status")
def status():
    # Mock "environment statusboard" data
    return {
        "environments": [
            {"name": "dev", "status": "healthy"},
            {"name": "staging", "status": "degraded"},
            {"name": "prod", "status": "healthy"},
        ],
        "generatedBy": "api",
        "utc": datetime.now(timezone.utc).isoformat(),
    }
