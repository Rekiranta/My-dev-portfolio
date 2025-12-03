from fastapi.testclient import TestClient
from src.cache_api.main import app

client = TestClient(app)

def test_health():
r = client.get("/health")
assert r.status_code == 200
assert r.json()["ok"] is True

def test_items_roundtrip():
r = client.post("/items", json={"item_id": "abc", "value": {"hello": "world"}})
assert r.status_code == 200

r2 = client.get("/items/abc")
assert r2.status_code == 200
assert r2.json()["value"]["hello"] == "world"


def test_compute_fib_cached_second_time():
r1 = client.get("/compute/fib/25")
assert r1.status_code == 200
assert r1.json()["cached"] is False

r2 = client.get("/compute/fib/25")
assert r2.status_code == 200
assert r2.json()["cached"] is True

stats = client.get("/stats").json()
assert stats["hits"] >= 1
assert stats["misses"] >= 1


