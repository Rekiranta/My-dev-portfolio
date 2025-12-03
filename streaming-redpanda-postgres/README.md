# Streaming pipeline: Redpanda (Kafka) → Consumer → Postgres (idempotent sink)

This project is a small streaming setup you can run locally with Docker.

A producer generates `OrderEvent` messages and publishes them to Kafka (via Redpanda).
A consumer reads events, validates them, and writes them into Postgres safely.

“Safely” means:
- offsets are committed **only after** the database transaction succeeds (**at least once**)
- replays won’t create duplicates because the sink is **idempotent** (`event_id` is a primary key)

## Run (PowerShell)

```powershell
cd streaming-redpanda-postgres
docker compose up -d

python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r requirements.txt

python -m src.streaming.cli produce-events --count 50 --rate 25
python -m src.streaming.cli consume-events --max-messages 50
