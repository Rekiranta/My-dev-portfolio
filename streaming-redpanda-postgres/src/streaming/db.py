from __future__ import annotations

import json
import psycopg
from psycopg.rows import dict_row
from .schemas import OrderEvent
from .settings import settings

def get_conn():
    return psycopg.connect(settings.postgres_dsn, autocommit=False, row_factory=dict_row)

def upsert_event_and_aggregate(conn, event: OrderEvent) -> bool:
    """
    Returns True if the event was newly inserted, False if it already existed.
    Idempotency is ensured by event_id PRIMARY KEY.
    """
    payload = event.model_dump(mode="json")

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO order_events(event_id, event_ts, order_id, customer_id, amount, currency, source, payload)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s::jsonb)
            ON CONFLICT (event_id) DO NOTHING
            RETURNING event_id;
            """,
            (
                event.event_id,
                event.event_ts,
                event.order_id,
                event.customer_id,
                str(event.amount),
                event.currency,
                event.source,
                json.dumps(payload),
            ),
        )
        inserted = cur.fetchone() is not None

        if inserted:
            cur.execute(
                """
                INSERT INTO customer_spend(customer_id, total_amount, last_event_ts)
                VALUES (%s, %s, %s)
                ON CONFLICT (customer_id)
                DO UPDATE SET
                  total_amount = customer_spend.total_amount + EXCLUDED.total_amount,
                  last_event_ts = GREATEST(customer_spend.last_event_ts, EXCLUDED.last_event_ts);
                """,
                (event.customer_id, str(event.amount), event.event_ts),
            )

    return inserted
