# Local Serverless-style ETL Pipeline

A serverless-inspired ETL pipeline running locally with Python, Pandas, and SQLite. Simulates an AWS architecture (S3 → Lambda → DynamoDB) without cloud dependencies.

## Features

- **File-based ingestion** - Process CSV files from input folder
- **Data transformation** - Pandas-based processing
- **SQLite storage** - Local database for processed data
- **File tracking** - Moves processed files to archive folder
- **Empty file handling** - Gracefully skips invalid files
- **No cloud required** - Runs entirely on local machine

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Pandas | Data processing |
| SQLite | Data storage |
| Pathlib | File handling |

## Architecture

Simulates this cloud architecture locally:

```
AWS Architecture          Local Implementation
─────────────────         ────────────────────
S3 (raw files)      →     input/ folder
Lambda (ETL)        →     etl.py script
DynamoDB (storage)  →     events.db (SQLite)
```

## Run Locally

```powershell
cd local-serverless-etl

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Place CSV files in input/ folder
# Then run ETL
python etl.py

# Inspect database contents
python inspect_db.py
```

## Project Structure

```
local-serverless-etl/
├── input/           # Incoming CSV files (drop files here)
├── processed/       # Archive of processed files
├── config.py        # Paths & settings
├── etl.py           # Main ETL script
├── inspect_db.py    # Database viewer
├── events.db        # SQLite database (auto-created)
└── requirements.txt
```

## How It Works

1. **Input**: Place CSV files in `input/` folder
2. **Process**: Run `python etl.py`
   - Validates file is not empty
   - Loads data with Pandas
   - Writes to SQLite `events` table
3. **Archive**: Processed files move to `processed/`
4. **Query**: Use `inspect_db.py` to view stored data

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   input/     │────▶│    etl.py    │────▶│  events.db   │
│  (CSV files) │     │   (Pandas)   │     │   (SQLite)   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  processed/  │
                     │  (archive)   │
                     └──────────────┘
```

## Example CSV

```csv
event_id,timestamp,type,value
1,2024-01-15T10:00:00,temperature,22.5
2,2024-01-15T10:01:00,humidity,45.2
```

## Use Cases

- Serverless pattern learning
- Local ETL development
- Data pipeline prototypes
- Offline data processing

