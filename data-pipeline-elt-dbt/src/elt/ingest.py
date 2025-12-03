from __future__ import annotations

from pathlib import Path
import duckdb
from rich.console import Console

console = Console()

def _ensure_dirs(duckdb_path: Path) -> None:
    duckdb_path.parent.mkdir(parents=True, exist_ok=True)

def ingest_raw(duckdb_path: Path, customers_csv: Path, orders_csv: Path) -> None:
    """
    Loads CSVs to DuckDB into schema raw.* using DuckDB read_csv_auto.
    """
    _ensure_dirs(duckdb_path)

    con = duckdb.connect(str(duckdb_path))
    try:
        con.execute("CREATE SCHEMA IF NOT EXISTS raw;")

        # Replace raw tables each run (simple/clear for portfolio).
        console.print("[cyan]Loading raw.customers[/cyan]")
        con.execute("DROP TABLE IF EXISTS raw.customers;")
        con.execute(
            "CREATE TABLE raw.customers AS SELECT * FROM read_csv_auto(?, header=true);",
            [str(customers_csv)],
        )

        console.print("[cyan]Loading raw.orders[/cyan]")
        con.execute("DROP TABLE IF EXISTS raw.orders;")
        con.execute(
            "CREATE TABLE raw.orders AS SELECT * FROM read_csv_auto(?, header=true);",
            [str(orders_csv)],
        )

        console.print("[green]✓ Ingested raw tables into DuckDB[/green]")
    finally:
        con.close()
