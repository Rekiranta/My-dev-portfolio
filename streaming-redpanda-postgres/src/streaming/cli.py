from __future__ import annotations

import typer
from .producer import produce
from .consumer import consume

app = typer.Typer(add_completion=False)

@app.command("produce-events")
def produce_events(count: int = 100, rate: float = 10.0, topic: str = "order_events"):
    """Produce synthetic OrderEvent messages into Kafka/Redpanda."""
    produce(count=count, rate_per_sec=rate, topic=topic)

@app.command("consume-events")
def consume_events(group: str = "order-events-consumer", topic: str = "order_events", max_messages: int = 0):
    """Consume OrderEvent messages and write them to Postgres (idempotent)."""
    consume(group_id=group, topic=topic, max_messages=max_messages)

if __name__ == "__main__":
    app()
