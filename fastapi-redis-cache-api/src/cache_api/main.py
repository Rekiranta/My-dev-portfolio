from __future__ import annotations

import json
import os
import time
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import redis


load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "30"))

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

app = FastAPI(title="FastAPI + Redis cache", version="1.0.0")


class CacheSetIn(BaseModel):
    item_id: str = Field(min_length=1, max_length=100)
    payload: dict[str, Any]
    ttl_seconds: int = Field(default=CACHE_TTL_SECONDS, ge=1, le=3600)


class CacheGetOut(BaseModel):
    item_id: str
    cached: bool
    ttl_seconds: int | None = None
    payload: dict[str, Any] | None = None


@app.get("/health")
def health():
    try:
        r.ping()
        return {"ok": True, "redis": "up"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"redis down: {e}")


@app.post("/cache/set")
def cache_set(inp: CacheSetIn):
    key = f"item:{inp.item_id}"
    value = json.dumps(inp.payload)

    ok = r.set(name=key, value=value, ex=int(inp.ttl_seconds))
    if not ok:
        raise HTTPException(status_code=500, detail="failed to set cache")

    return {"ok": True, "item_id": inp.item_id, "ttl_seconds": int(inp.ttl_seconds)}


@app.get("/cache/get/{item_id}", response_model=CacheGetOut)
def cache_get(item_id: str):
    key = f"item:{item_id}"

    raw = r.get(key)
    if raw is None:
        return CacheGetOut(item_id=item_id, cached=False)

    ttl = r.ttl(key)
    payload = json.loads(raw)

    return CacheGetOut(item_id=item_id, cached=True, ttl_seconds=int(ttl) if ttl is not None else None, payload=payload)


@app.get("/demo/slow/{item_id}", response_model=CacheGetOut)
def demo_slow(item_id: str):
    # "expensive" computation
    key = f"slow:{item_id}"

    cached = r.get(key)
    if cached is not None:
        ttl = r.ttl(key)
        return CacheGetOut(item_id=item_id, cached=True, ttl_seconds=int(ttl) if ttl is not None else None, payload=json.loads(cached))

    time.sleep(2)  # simulate slowness
    payload = {"item_id": item_id, "computed_at": time.time()}

    r.set(key, json.dumps(payload), ex=CACHE_TTL_SECONDS)
    ttl = r.ttl(key)
    return CacheGetOut(item_id=item_id, cached=False, ttl_seconds=int(ttl) if ttl is not None else None, payload=payload)

@app.get("/")
def root():
    return {"ok": True, "hint": "Go to /docs or /health"}
