from __future__ import annotations

from pathlib import Path
from datetime import datetime, timezone, timedelta
import random
import pandas as pd
from rich.console import Console
from .settings import settings

console = Console()

def generate_orders_csv(count: int = 50, out_path: Path | None = None, seed: int | None = None) -> Path:
    out_path = out_path or settings.raw_csv_path
    out_path.parent.mkdir(parents=True, exist_ok=True)

    rnd = random.Random(seed if seed is not None else settings.random_seed)
    now = datetime.now(timezone.utc)

    rows = []
    for i in range(count):
        rows.append({
            "order_id": 1000 + i,
            "customer_id": rnd.randint(1, 500),
            "amount": round(rnd.uniform(5.0, 250.0), 2),
            "currency": rnd.choice(["EUR", "USD"]),
            "event_ts": (now - timedelta(minutes=rnd.randint(0, 60*24))).isoformat(),
        })

    df = pd.DataFrame(rows)
    df.to_csv(out_path, index=False)

    console.print(f"[green]generated[/green] {len(df)} rows -> {out_path}")
    return out_path
