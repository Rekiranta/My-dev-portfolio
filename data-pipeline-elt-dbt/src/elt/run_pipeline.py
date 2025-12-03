from __future__ import annotations

import os
import subprocess
from pathlib import Path
import typer
from rich.console import Console

from .config import settings
from .validate import validate_all
from .ingest import ingest_raw

app = typer.Typer(add_completion=False)
console = Console()

def _run(cmd: list[str], env: dict[str, str] | None = None) -> None:
    console.print(f"[bold]$ {' '.join(cmd)}[/bold]")
    subprocess.run(cmd, check=True, env=env)

@app.command()
def validate() -> None:
    customers = settings.data_dir / "customers.csv"
    orders = settings.data_dir / "orders.csv"
    validate_all(str(customers), str(orders))

@app.command()
def ingest() -> None:
    ingest_raw(
        settings.duckdb_path,
        settings.data_dir / "customers.csv",
        settings.data_dir / "orders.csv",
    )

@app.command()
def transform(full_refresh: bool = True) -> None:
    """
    Runs dbt build to create staging + marts (analytics).
    """
    env = os.environ.copy()
    env["DBT_PROFILES_DIR"] = str(settings.project_root / "dbt")
    env["DUCKDB_PATH"] = str(settings.duckdb_path)

    cmd = ["dbt", "build", "--project-dir", "dbt"]
    if full_refresh:
        cmd += ["--full-refresh"]

    _run(cmd, env=env)

@app.command()
def run() -> None:
    """
    End-to-end: validate -> ingest -> dbt build
    """
    validate()
    ingest()
    transform(full_refresh=True)
    console.print("[green][bold]✓ Pipeline complete[/bold][/green]")

if __name__ == "__main__":
    app()
