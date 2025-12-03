from future import annotations

import json
import time
from kafka import KafkaConsumer
from rich.console import Console
from .schemas import OrderEvent
from .settings import settings
from .db import get_conn, upsert_event_and_aggregate

console = Console()

def consume(group_id: str = "order-events-consumer", topic: str | None = None, max_messages: int = 0) -> None:
topic = topic or settings.kafka_topic
consumer = KafkaConsumer(
topic,
bootstrap_servers=settings.kafka_bootstrap,
group_id=group_id,
enable_auto_commit=False,
auto_offset_reset="earliest",
value_deserializer=lambda v: json.loads(v.decode("utf-8")),
consumer_timeout_ms=1000,
)

# wait for Postgres
for _ in range(60):
    try:
        c = get_conn(); c.close()
        break
    except Exception:
        time.sleep(1)
else:
    raise RuntimeError("Postgres not reachable")

processed = 0
console.rule("Consuming events")

try:
    while True:
        got_any = False
        for msg in consumer:
            got_any = True
            try:
                event = OrderEvent(**msg.value)
            except Exception as e:
                console.print(f"[red]invalid event[/red] offset={msg.offset} err={e}")
                consumer.commit()
                continue

            try:
                with get_conn() as c:
                    upsert_event_and_aggregate(c, event)
                    c.commit()
            except Exception as e:
                console.print(f"[red]db error[/red] event_id={event.event_id} err={e}")
                continue

            consumer.commit()
            processed += 1
            console.print(f"[cyan]ok[/cyan] offset={msg.offset} event_id={event.event_id}")

            if max_messages and processed >= max_messages:
                console.print("[bold green]Done[/bold green]")
                return

        if not got_any:
            if max_messages and processed >= max_messages:
                return
            time.sleep(0.2)
finally:
    consumer.close()


