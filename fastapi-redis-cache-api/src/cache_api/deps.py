from future import annotations

from functools import lru_cache

from .cache import Cache, MemoryCache, RedisCache
from .settings import settings

@lru_cache(maxsize=1)
def get_cache() -> Cache:
if settings.cache_backend == "memory":
return MemoryCache()

try:
    return RedisCache(settings.redis_url)
except Exception:
    return MemoryCache()


