"""Tests for FastAPI Redis Cache API."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch


# Mock Redis before importing app
@pytest.fixture
def mock_redis():
    """Mock Redis client for testing without real Redis."""
    with patch("src.cache_api.main.r") as mock_r:
        mock_r.ping.return_value = True
        mock_r.set.return_value = True
        mock_r.get.return_value = None
        mock_r.ttl.return_value = 30
        yield mock_r


@pytest.fixture
def client(mock_redis):
    """Test client with mocked Redis."""
    from src.cache_api.main import app
    return TestClient(app)


def test_root(client):
    """Test root endpoint returns hint."""
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert "hint" in r.json()


def test_health_success(client, mock_redis):
    """Test health check when Redis is up."""
    mock_redis.ping.return_value = True
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert r.json()["redis"] == "up"


def test_health_redis_down(client, mock_redis):
    """Test health check when Redis is down."""
    mock_redis.ping.side_effect = Exception("Connection refused")
    r = client.get("/health")
    assert r.status_code == 503


def test_cache_set(client, mock_redis):
    """Test setting a cache item."""
    mock_redis.set.return_value = True

    r = client.post("/cache/set", json={
        "item_id": "test-item",
        "payload": {"hello": "world"},
        "ttl_seconds": 60
    })

    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert r.json()["item_id"] == "test-item"
    assert r.json()["ttl_seconds"] == 60


def test_cache_set_default_ttl(client, mock_redis):
    """Test setting cache with default TTL."""
    mock_redis.set.return_value = True

    r = client.post("/cache/set", json={
        "item_id": "test-item",
        "payload": {"data": 123}
    })

    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_cache_set_validation_error(client):
    """Test cache set with invalid input."""
    r = client.post("/cache/set", json={
        "item_id": "",  # Too short
        "payload": {}
    })
    assert r.status_code == 422


def test_cache_get_miss(client, mock_redis):
    """Test getting a non-existent cache item."""
    mock_redis.get.return_value = None

    r = client.get("/cache/get/nonexistent")

    assert r.status_code == 200
    assert r.json()["item_id"] == "nonexistent"
    assert r.json()["cached"] is False
    assert r.json()["payload"] is None


def test_cache_get_hit(client, mock_redis):
    """Test getting an existing cache item."""
    import json
    mock_redis.get.return_value = json.dumps({"hello": "world"})
    mock_redis.ttl.return_value = 25

    r = client.get("/cache/get/test-item")

    assert r.status_code == 200
    assert r.json()["item_id"] == "test-item"
    assert r.json()["cached"] is True
    assert r.json()["ttl_seconds"] == 25
    assert r.json()["payload"]["hello"] == "world"


def test_cache_roundtrip(client, mock_redis):
    """Test setting and getting a cache item."""
    import json

    # Set up mock for set
    mock_redis.set.return_value = True

    # Set item
    r1 = client.post("/cache/set", json={
        "item_id": "roundtrip-test",
        "payload": {"value": 42}
    })
    assert r1.status_code == 200

    # Configure mock for get
    mock_redis.get.return_value = json.dumps({"value": 42})
    mock_redis.ttl.return_value = 30

    # Get item
    r2 = client.get("/cache/get/roundtrip-test")
    assert r2.status_code == 200
    assert r2.json()["cached"] is True
    assert r2.json()["payload"]["value"] == 42


def test_demo_slow_cache_miss(client, mock_redis):
    """Test slow endpoint on cache miss (simulated computation)."""
    import json

    mock_redis.get.return_value = None
    mock_redis.set.return_value = True
    mock_redis.ttl.return_value = 30

    # Note: This will actually sleep 2 seconds in the test
    # In a real scenario, you'd mock time.sleep too
    with patch("src.cache_api.main.time.sleep"):
        r = client.get("/demo/slow/test-slow")

    assert r.status_code == 200
    assert r.json()["cached"] is False
    assert r.json()["item_id"] == "test-slow"


def test_demo_slow_cache_hit(client, mock_redis):
    """Test slow endpoint on cache hit (returns immediately)."""
    import json

    mock_redis.get.return_value = json.dumps({
        "item_id": "cached-item",
        "computed_at": 1234567890
    })
    mock_redis.ttl.return_value = 20

    r = client.get("/demo/slow/cached-item")

    assert r.status_code == 200
    assert r.json()["cached"] is True
    assert r.json()["ttl_seconds"] == 20
