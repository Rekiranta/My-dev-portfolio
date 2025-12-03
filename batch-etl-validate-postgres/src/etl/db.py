from __future__ import annotations

import psycopg
from psycopg.rows import dict_row
from rich.console import Console
from .settings import settings

console = Console()

CREATE_SQL = """
CREATE TABLE IF NOT EXISTS orders (
  order_id     INTEGER PRIMARY KEY,
  customer_id  INTEGER NOT NULL,
  amount       NUMERIC NOT NULL,
  currency     TEXT NOT NULL,
  event_ts     TIMESTAMPTZ NOT NULL,
  loaded_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""

UPSERT_SQL = """
INSERT INTO orders(order_id, customer_id, amount, currency, event_ts)
VALUES (%s, %s, %s, %s, %s)
ON CONFLICT (order_id) DO UPDATE SET
  customer_id = EXCLUDED.customer_id,
  amount      = EXCLUDED.amount,
  currency    = EXCLUDED.currency,
  event_ts    = EXCLUDED.event_ts,
  loaded_at   = now();
"""

def get_conn():
    return psycopg.connect(settings.postgres_dsn, row_factory=dict_row)

def load_orders(df) -> int:
    rows = [
        (
            int(r["order_id"]),
            int(r["customer_id"]),
            str(r["amount"]),
            str(r["currency"]),
            r["event_ts"],
        )
        for r in df.to_dict(orient="records")
    ]

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(CREATE_SQL)
            cur.executemany(UPSERT_SQL, rows)
        conn.commit()

    console.print(f"[cyan]loaded[/cyan] rows={len(rows)} (upsert by order_id)")
    return len(rows)

def fetch_recent(limit: int = 10):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT order_id, customer_id, amount, currency, event_ts, loaded_at "
                "FROM orders ORDER BY loaded_at DESC LIMIT %s;",
                (limit,),
            )
            return cur.fetchall()
