from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_ok():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "pass"
    assert "version" in data

def test_version_ok():
    res = client.get("/version")
    assert res.status_code == 200
    assert "version" in res.json()

def test_status_ok():
    res = client.get("/status")
    assert res.status_code == 200
    data = res.json()
    assert "environments" in data
    assert len(data["environments"]) == 3
