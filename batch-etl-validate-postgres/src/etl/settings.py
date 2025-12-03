from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Settings:
    postgres_dsn: str = os.getenv("POSTGRES_DSN", "postgresql://app:app@localhost:5433/etl")
    raw_csv_path: Path = Path(os.getenv("RAW_CSV_PATH", "data/raw/orders.csv"))
    random_seed: int = int(os.getenv("RANDOM_SEED", "42"))

settings = Settings()
