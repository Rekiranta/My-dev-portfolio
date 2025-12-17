# Streaming Pipeline: Redpanda (Kafka) to Postgres

A real-time streaming pipeline demonstrating event-driven architecture with Redpanda (Kafka-compatible) and idempotent Postgres sink. Features at-least-once delivery guarantees.

## Features

- **Event streaming** - Kafka-compatible message queue via Redpanda
- **Order events** - Producer generates realistic order data
- **Idempotent sink** - Postgres with duplicate protection
- **At-least-once delivery** - Safe offset management
- **CLI interface** - Easy producer/consumer commands
- **Docker-based** - Full local infrastructure

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Redpanda | Kafka-compatible message broker |
| PostgreSQL | Event storage |
| kafka-python | Kafka client library |
| Docker Compose | Infrastructure |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Producer   │────▶│   Redpanda   │────▶│   Consumer   │
│              │     │   (Kafka)    │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  PostgreSQL  │
                                          │ (idempotent) │
                                          └──────────────┘
```

## Delivery Guarantees

- **At-least-once**: Offsets committed only after DB transaction succeeds
- **Idempotent sink**: `event_id` as primary key prevents duplicates on replay

## Run Locally

```powershell
cd streaming-redpanda-postgres

# Start infrastructure
docker compose up -d

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Produce events
python -m src.streaming.cli produce-events --count 50 --rate 25

# Consume events
python -m src.streaming.cli consume-events --max-messages 50
```

## Project Structure

```
streaming-redpanda-postgres/
├── src/
│   └── streaming/
│       ├── cli.py          # CLI commands
│       ├── producer.py     # Event producer
│       ├── consumer.py     # Event consumer
│       └── models.py       # Event schemas
├── docker-compose.yml      # Redpanda + Postgres
├── requirements.txt
└── .env.example
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BOOTSTRAP` | `localhost:9092` | Redpanda broker address |
| `KAFKA_TOPIC` | `orders` | Topic name |
| `POSTGRES_DSN` | `postgresql://...` | Database connection |

## CLI Commands

```bash
# Produce N events at given rate (events/sec)
python -m src.streaming.cli produce-events --count 100 --rate 10

# Consume events (with optional limit)
python -m src.streaming.cli consume-events --max-messages 100
```

## Event Schema

```json
{
  "event_id": "uuid-string",
  "order_id": "ORD-12345",
  "customer_id": "CUST-678",
  "amount": 99.99,
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Use Cases

- Event-driven architecture demos
- Streaming pipeline patterns
- Kafka/Redpanda learning
- Data engineering workflows

