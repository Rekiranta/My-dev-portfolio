from __future__ import annotations

import json
import time
from kafka import KafkaConsumer
from rich.console import Console
from .schemas import OrderEvent
from .settings import settings
from .db import get_conn, upsert_event_and_aggregate

console = Console()

def consume(group_id: str = "order-events-consumer", topic: str | None = None, max_messages: int = 0) -> None:
    """
    max_messages=0 means run forever.
    Manual commits after DB transaction -> at-least-once processing.
    Idempotent DB writes -> safe reprocessing.
    """
    topic = topic or settings.kafka_topic

    consumer = KafkaConsumer(
        topic,
        bootstrap_servers=settings.kafka_bootstrap,
        group_id=group_id,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        key_deserializer=lambda v: v.decode("utf-8") if v else None,
        consumer_timeout_ms=1000,
        max_poll_records=50,
    )

    processed = 0
    console.rule("Consuming events")

    # simple startup retry for Postgres readiness
    for _ in range(60):
        try:
            conn = get_conn()
            conn.close()
            break
        except Exception:
            time.sleep(1)
    else:
        raise RuntimeError("Postgres not reachable")

    try:
        while True:
            batch_empty = True
            for msg in consumer:
                batch_empty = False

                try:
                    event = OrderEvent(**msg.value)
                except Exception as e:
                    console.print(f"[red]invalid event[/red] offset={msg.offset} err={e}")
                    consumer.commit()
                    continue

                try:
                    with get_conn() as c:
                        inserted = upsert_event_and_aggregate(c, event)
                        c.commit()
                except Exception as e:
                    console.print(f"[red]db error[/red] event_id={event.event_id} err={e}")
                    # no commit => message will be retried
                    continue

                consumer.commit()

                processed += 1
                tag = "new" if inserted else "dup"
                console.print(f"[cyan]{tag}[/cyan] offset={msg.offset} event_id={event.event_id} customer_id={event.customer_id}")

                if max_messages and processed >= max_messages:
                    console.print("[bold green]Reached max_messages, exiting[/bold green]")
                    return

            if batch_empty:
                if max_messages and processed >= max_messages:
                    return
                time.sleep(0.2)

    finally:
        consumer.close()
