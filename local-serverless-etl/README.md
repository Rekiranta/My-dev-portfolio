# Local Serverless-style ETL (Python + SQLite)

This project simulates a serverless ETL pipeline entirely on a local machine
using Python, Pandas and SQLite. It mimics an architecture like:

S3 (raw CSV files) → Lambda (Python) → DynamoDB (NoSQL storage)

but implemented as:

`input/` folder → `etl.py` script → `events.db` (SQLite)

## Tech stack

- Python 3
- Pandas
- SQLite (built-in Python module)
- Virtual environment (`venv`)
- VS Code

## Project structure

```text
local-serverless-etl/
  input/           # incoming CSV files
  processed/       # processed CSV files
  config.py        # paths & settings
  etl.py           # ETL pipeline script
  inspect_db.py    # helper to inspect DB contents
  events.db        # SQLite database (created automatically)
  requirements.txt
  README.md
```
