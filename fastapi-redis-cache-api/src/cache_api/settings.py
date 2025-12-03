from future import annotations

import os
from dataclasses import dataclass

try:
from dotenv import load_dotenv
load_dotenv()
except Exception:
pass

@dataclass(frozen=True)
class Settings:
app_name: str = os.getenv("APP_NAME", "fastapi-redis-cache-api")
cache_backend: str = os.getenv("CACHE_BACKEND", "redis").lower()
redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
default_ttl_seconds: int = int(os.getenv("CACHE_TTL_SECONDS", "60"))

settings = Settings()
