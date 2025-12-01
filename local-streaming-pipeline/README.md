# Local Realtime Streaming Pipeline

This project simulates an AWS Kinesis-style streaming pipeline entirely on a local machine.

It consists of:

- `producer.py` – simulates a Kinesis producer by appending JSON events to `stream.json`
- `consumer.py` – simulates a Kinesis consumer by reading new events, storing them
  into SQLite, and printing a small analytics summary

## Tech stack

- Python 3
- SQLite (`sqlite3` module)
- Pandas (for quick analytics)

## Project structure

```text
local-streaming-pipeline/
  producer.py
  consumer.py
  requirements.txt
  stream.json      # created automatically by producer
  offset.txt       # created automatically by consumer
  events.db        # created automatically by consumer
```
