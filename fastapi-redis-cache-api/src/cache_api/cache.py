from future import annotations

import json
import threading
from dataclasses import dataclass
from typing import Any, Optional, Protocol

import redis

class Cache(Protocol):
def get_json(self, key: str) -> Optional[dict[str, Any]]: ...
def set_json(self, key: str, value: dict[str, Any], ttl_seconds: int | None = None) -> None: ...
def incr(self, key: str, amount: int = 1) -> int: ...
def get_int(self, key: str) -> int: ...

class MemoryCache:
def init(self) -> None:
self._lock = threading.Lock()
self._store: dict[str, str] = {}
self._counters: dict[str, int] = {}

def get_json(self, key: str) -> Optional[dict[str, Any]]:
    with self._lock:
        raw = self._store.get(key)
    return None if raw is None else json.loads(raw)

def set_json(self, key: str, value: dict[str, Any], ttl_seconds: int | None = None) -> None:
    raw = json.dumps(value, ensure_ascii=False)
    with self._lock:
        self._store[key] = raw

def incr(self, key: str, amount: int = 1) -> int:
    with self._lock:
        self._counters[key] = self._counters.get(key, 0) + amount
        return self._counters[key]

def get_int(self, key: str) -> int:
    with self._lock:
        return int(self._counters.get(key, 0))


@dataclass
class RedisCache:
redis_url: str

def __post_init__(self) -> None:
    self._client = redis.Redis.from_url(self.redis_url, decode_responses=True)
    self._client.ping()

def get_json(self, key: str) -> Optional[dict[str, Any]]:
    raw = self._client.get(key)
    return None if raw is None else json.loads(raw)

def set_json(self, key: str, value: dict[str, Any], ttl_seconds: int | None = None) -> None:
    raw = json.dumps(value, ensure_ascii=False)
    if ttl_seconds and ttl_seconds > 0:
        self._client.setex(key, ttl_seconds, raw)
    else:
        self._client.set(key, raw)

def incr(self, key: str, amount: int = 1) -> int:
    return int(self._client.incrby(key, amount))

def get_int(self, key: str) -> int:
    raw = self._client.get(key)
    return 0 if raw is None else int(raw)


