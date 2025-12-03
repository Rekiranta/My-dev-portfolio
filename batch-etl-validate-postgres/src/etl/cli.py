from __future__ import annotations

import typer
from rich.console import Console
from .generate import generate_orders_csv
from .validate import validate_orders_csv
from .db import load_orders, fetch_recent

app = typer.Typer(add_completion=False)
console = Console()

@app.command("generate")
def cmd_generate(count: int = 50):
    """Generate a synthetic orders CSV into data/raw."""
    generate_orders_csv(count=count)

@app.command("validate")
def cmd_validate(path: str = "data/raw/orders.csv"):
    """Validate the orders CSV using Pandera."""
    validate_orders_csv(path)

@app.command("load")
def cmd_load(path: str = "data/raw/orders.csv"):
    """Load validated data into Postgres (idempotent upsert by order_id)."""
    df = validate_orders_csv(path)
    load_orders(df)

@app.command("run")
def cmd_run(count: int = 50):
    """Generate -> validate -> load (one command)."""
    csv_path = generate_orders_csv(count=count)
    df = validate_orders_csv(str(csv_path))
    load_orders(df)

@app.command("show")
def cmd_show(limit: int = 10):
    """Show the most recently loaded rows."""
    rows = fetch_recent(limit=limit)
    for r in rows:
        console.print(r)

if __name__ == "__main__":
    app()
