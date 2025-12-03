from future import annotations

import json
import random
import time
from decimal import Decimal
from kafka import KafkaProducer
from rich.console import Console
from .schemas import OrderEvent
from .settings import settings

console = Console()

def _make_event(i: int) -> OrderEvent:
customer_id = random.randint(1, 25)
order_id = 1000 + i
amount = Decimal(str(round(random.uniform(5, 250), 2)))
currency = random.choice(["EUR", "USD"])
return OrderEvent(
order_id=order_id,
customer_id=customer_id,
amount=amount,
currency=currency,
source="producer-cli",
)

def produce(count: int = 100, rate_per_sec: float = 10.0, topic: str | None = None) -> None:
topic = topic or settings.kafka_topic
producer = KafkaProducer(
bootstrap_servers=settings.kafka_bootstrap,
value_serializer=lambda v: json.dumps(v).encode("utf-8"),
key_serializer=lambda v: v.encode("utf-8"),
acks="all",
linger_ms=10,
)

delay = 0 if rate_per_sec <= 0 else (1.0 / rate_per_sec)
console.rule("Producing events")

try:
    for i in range(count):
        ev = _make_event(i)
        producer.send(topic, key=ev.event_id, value=ev.model_dump(mode="json"))
        console.print(f"[green]sent[/green] event_id={ev.event_id} customer_id={ev.customer_id} amount={ev.amount} {ev.currency}")
        if delay:
            time.sleep(delay)
    producer.flush()
finally:
    producer.close()


