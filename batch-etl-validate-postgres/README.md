# Batch ETL Pipeline: CSV to Postgres with Validation

A batch ETL pipeline demonstrating data validation with Pandera and idempotent loading to PostgreSQL. Features synthetic data generation and upsert operations.

## Features

- **Data generation** - Synthetic CSV file creation
- **Schema validation** - Pandera-based data quality checks
- **Idempotent upsert** - Safe re-runs using primary key
- **CLI interface** - Easy-to-use commands
- **Docker Postgres** - Local database environment
- **Test suite** - pytest coverage

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Pandera | Data validation |
| PostgreSQL | Database |
| Pandas | Data manipulation |
| Docker Compose | Database container |
| Pytest | Testing |

## Pipeline Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Generate   │────▶│   Validate   │────▶│    Load      │
│   CSV data   │     │  (Pandera)   │     │  (Postgres)  │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Run Locally

```powershell
cd batch-etl-validate-postgres

# Start PostgreSQL
docker compose up -d

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run ETL pipeline
python -m src.etl.cli run --count 50

# View loaded data
python -m src.etl.cli show --limit 10
```

## Run Tests

```powershell
pytest -v
```

## Cleanup

```powershell
docker compose down -v
Remove-Item -Recurse -Force .\.venv -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\data -ErrorAction SilentlyContinue
```

## Project Structure

```
batch-etl-validate-postgres/
├── src/
│   └── etl/
│       ├── cli.py          # CLI commands
│       ├── generate.py     # CSV generation
│       ├── validate.py     # Pandera schemas
│       └── load.py         # Postgres loader
├── tests/
│   └── test_etl.py
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## CLI Commands

```bash
# Generate and load N records
python -m src.etl.cli run --count 100

# Show loaded records
python -m src.etl.cli show --limit 20
```

## Validation Schema

Pandera validates:
- Required columns present
- Data types correct
- Constraints satisfied (positive amounts, valid dates)
- No null values in required fields

## Idempotent Loading

Uses PostgreSQL `ON CONFLICT` clause:
- `order_id` is the primary key
- Re-running updates existing records
- Safe for retry/replay scenarios

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DSN` | See .env.example | Database connection string |
| `RAW_CSV_PATH` | `./data/orders.csv` | Generated CSV location |

## Use Cases

- ETL pipeline demonstrations
- Data validation patterns
- Batch processing workflows
- Data engineering learning

