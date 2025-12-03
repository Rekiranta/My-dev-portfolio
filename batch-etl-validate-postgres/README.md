# Batch ETL with data validation: CSV -> Pandera -> Postgres (idempotent upsert)

This project is a small batch ETL pipeline you can run locally.

What it does:
1) Generate a synthetic orders.csv
2) Validate it with Pandera (schema + constraints)
3) Load into Postgres using an idempotent upsert (order_id is the primary key)

## Run (PowerShell)

```powershell
docker compose up -d

python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r requirements.txt

python -m src.etl.cli run --count 50
python -m src.etl.cli show --limit 10
Test
powershell
Kopioi koodi
pytest -q
Cleanup
powershell
Kopioi koodi
docker compose down -v
Remove-Item -Recurse -Force .\.venv -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\data -ErrorAction SilentlyContinue
