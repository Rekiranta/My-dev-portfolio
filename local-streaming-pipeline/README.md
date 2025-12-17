# Local Realtime Streaming Pipeline

A simplified streaming pipeline that simulates AWS Kinesis-style event processing entirely on your local machine. Uses file-based streaming with SQLite storage and Pandas analytics.

## Features

- **Event producer** - Generates JSON events to a stream file
- **Event consumer** - Reads events with offset tracking
- **SQLite storage** - Persistent event storage
- **Analytics summary** - Pandas-based event aggregations
- **Offset tracking** - Resume from last processed position
- **No external services** - Runs with just Python

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| SQLite | Event storage |
| Pandas | Analytics |
| JSON | Event format |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Producer   │────▶│ stream.json  │────▶│   Consumer   │
│              │     │   (file)     │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   SQLite     │
                                          │  (events.db) │
                                          └──────────────┘
```

## Run Locally

```powershell
cd local-streaming-pipeline

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Generate events
python producer.py

# Consume and store events
python consumer.py
```

## Project Structure

```
local-streaming-pipeline/
├── producer.py        # Event generator
├── consumer.py        # Event processor
├── requirements.txt
├── stream.json        # Event stream (auto-created)
├── offset.txt         # Consumer position (auto-created)
└── events.db          # SQLite database (auto-created)
```

## How It Works

1. **Producer** appends JSON events to `stream.json`
2. **Consumer** reads from last offset in `offset.txt`
3. New events are stored in SQLite `events.db`
4. Offset is updated after successful processing
5. Analytics summary printed using Pandas

## Event Format

```json
{
  "event_id": "uuid-string",
  "timestamp": "2024-01-15T12:00:00Z",
  "type": "order_created",
  "payload": { ... }
}
```

## Key Concepts

- **Offset tracking** - Consumer remembers position across restarts
- **Append-only log** - Events are never modified, only appended
- **Idempotent processing** - Safe to replay events

## Use Cases

- Learning event streaming concepts
- Kinesis/Kafka pattern simulation
- Offline data pipeline development
- Stream processing prototypes

