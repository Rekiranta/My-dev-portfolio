# FastAPI + Redis Cache API

A caching API demonstrating Redis integration with FastAPI dependency injection. Features proper cache patterns, TTL management, and a comprehensive pytest suite.

## Features

- **Redis caching** - Store and retrieve cached data with TTL
- **Cache-aside pattern** - Demo endpoint showing slow computation with caching
- **TTL management** - Configurable expiration for cached items
- **Health checks** - Redis connectivity monitoring
- **Dependency injection** - Clean architecture for testability
- **Full test suite** - Pytest with mocked Redis

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| FastAPI | Web framework |
| Redis | Cache storage |
| Pydantic | Data validation |
| Pytest | Testing |
| Docker Compose | Redis container |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (Redis ping) |
| POST | `/cache/set` | Store item in cache |
| GET | `/cache/get/{item_id}` | Retrieve cached item |
| GET | `/demo/slow/{item_id}` | Demo: slow computation with caching |

## Run Locally

```powershell
cd fastapi-redis-cache-api

# Start Redis
docker compose up -d

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn src.cache_api.main:app --reload --port 8005
```

Server runs at http://localhost:8005

API docs at http://localhost:8005/docs

## Run Tests

```powershell
pytest
```

## Project Structure

```
fastapi-redis-cache-api/
├── src/
│   └── cache_api/
│       └── main.py        # FastAPI application
├── tests/
│   └── test_api.py        # Pytest suite
├── docker-compose.yml     # Redis container
├── requirements.txt
└── .env.example
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection URL |
| `CACHE_TTL_SECONDS` | `30` | Default cache expiration |

## Example Usage

```bash
# Set a cached item
curl -X POST http://localhost:8005/cache/set \
  -H "Content-Type: application/json" \
  -d '{"item_id": "user-123", "payload": {"name": "John"}, "ttl_seconds": 60}'

# Get cached item
curl http://localhost:8005/cache/get/user-123

# Demo slow endpoint (2s first call, instant when cached)
curl http://localhost:8005/demo/slow/expensive-calc
```

## Cache-Aside Pattern

The `/demo/slow/{item_id}` endpoint demonstrates the cache-aside pattern:

1. Check cache for existing result
2. If cached, return immediately
3. If not cached, perform expensive computation
4. Store result in cache with TTL
5. Return result

## Use Cases

- API response caching
- Session storage
- Rate limiting data
- Expensive computation results

