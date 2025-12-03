from __future__ import annotations
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Settings:
    kafka_bootstrap: str = os.getenv("KAFKA_BOOTSTRAP", "localhost:9092")
    kafka_topic: str = os.getenv("KAFKA_TOPIC", "order_events")
    postgres_dsn: str = os.getenv("POSTGRES_DSN", "postgresql://app:app@localhost:5432/streaming")

settings = Settings()
