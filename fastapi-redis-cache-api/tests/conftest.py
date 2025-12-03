import sys
from pathlib import Path

ROOT = Path(file).resolve().parents[1]
if str(ROOT) not in sys.path:
sys.path.insert(0, str(ROOT))

import pytest
from src.cache_api.main import app
from src.cache_api.deps import get_cache
from src.cache_api.cache import MemoryCache

@pytest.fixture(autouse=True)
def _override_cache():
app.dependency_overrides[get_cache] = lambda: MemoryCache()
yield
app.dependency_overrides.clear()
