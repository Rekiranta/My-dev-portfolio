from pathlib import Path
from src.etl.generate import generate_orders_csv

def test_generate_creates_file(tmp_path: Path):
    out = tmp_path / "orders.csv"
    p = generate_orders_csv(count=5, out_path=out, seed=123)
    assert p.exists()
    assert p.read_text(encoding="utf-8").strip() != ""
