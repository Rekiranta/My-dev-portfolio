from __future__ import annotations

import pandas as pd
from rich.console import Console
from .schemas import OrdersSchema

console = Console()

def validate_orders_csv(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    validated = OrdersSchema.validate(df)
    console.print(f"[green]validated[/green] rows={len(validated)}")
    return validated
