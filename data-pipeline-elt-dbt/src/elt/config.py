from pydantic import BaseModel
from pathlib import Path

class Settings(BaseModel):
    project_root: Path = Path(__file__).resolve().parents[2]
    data_dir: Path = project_root / "data" / "source"
    warehouse_dir: Path = project_root / "warehouse"
    duckdb_path: Path = warehouse_dir / "analytics.duckdb"

settings = Settings()
