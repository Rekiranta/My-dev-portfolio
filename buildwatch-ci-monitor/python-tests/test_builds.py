import time
import requests

BASE = "http://server:8093"


def test_health_ok():
    r = requests.get(f"{BASE}/health")
    r.raise_for_status()
    data = r.json()
    assert data.get("ok") is True


def test_trigger_build_and_wait():
    payload = {"branch": "main", "commit": "abc123"}
    r = requests.post(f"{BASE}/api/builds", json=payload)
    r.raise_for_status()
    build = r.json()
    build_id = build["id"]

    final_status = None
    for _ in range(15):
        time.sleep(1)
        r2 = requests.get(f"{BASE}/api/builds/{build_id}")
        r2.raise_for_status()
        data = r2.json()
        status = data["status"]
        if status in ("passed", "failed"):
            final_status = status
            break

    assert final_status in ("passed", "failed")