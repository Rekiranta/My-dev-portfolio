@'

# Streaming pipeline: Redpanda (Kafka) → Consumer → Postgres (idempotent sink)

This project is a small streaming setup that you can run locally with Docker.

A producer generates `OrderEvent` messages and publishes them to Kafka (via Redpanda).
A consumer reads events, validates them, and writes them into Postgres — safely.

“Safely” here means:

- offsets are committed **only after** the database transaction succeeds (**at-least-once** processing)
- replays won’t create duplicates because the sink is **idempotent** (`event_id` is a primary key)

The result is a practical pattern you see in real ingestion pipelines.

---
