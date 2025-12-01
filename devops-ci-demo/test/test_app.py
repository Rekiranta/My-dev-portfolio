from app import app

def test_root_has_endpoints():
    client = app.test_client()
    res = client.get("/")
    assert res.status_code == 200
    data = res.get_json()
    assert data["name"] == "devops-ci-demo"
    assert "endpoints" in data
    assert data["endpoints"]["health"] == "/health"

def test_health_ok():
    client = app.test_client()
    res = client.get("/health")
    assert res.status_code == 200
    assert res.get_json() == {"status": "ok"}
