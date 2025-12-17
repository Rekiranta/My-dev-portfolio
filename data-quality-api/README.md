# Data Quality API & Analyzer

A data engineering tool that ingests datasets via API and generates automatic quality reports. Built with Python and Flask.

## Features

- **Data ingestion** - Upload datasets via REST API
- **Quality analysis** - Automatic detection of data issues
- **Missing values** - Count null/empty entries
- **Negative detection** - Flag unexpected negative numbers
- **Duplicate check** - Identify repeated values
- **Quality score** - Computed score (0-100) for data health
- **Batch tracking** - Each upload gets a unique batch ID
- **Upload history** - View recent batch summaries
- **Web dashboard** - Simple UI for testing uploads

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Flask | Web framework |
| SQLite | Data storage |
| HTML/JS | Frontend UI |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Web dashboard |
| POST | `/upload` | Upload data batch |
| GET | `/history` | Recent batch summaries |

## Quality Metrics

The analyzer checks for:

| Metric | Impact on Score |
|--------|-----------------|
| Missing values | -10 per missing |
| Negative values | -5 per negative |
| Duplicates | -2 per duplicate |

Score formula:
```
quality_score = max(0, 100 - (missing×10 + negatives×5 + duplicates×2))
```

## Run Locally

```powershell
cd data-quality-api

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

Server runs at http://localhost:5000

## Project Structure

```
data-quality-api/
├── app.py           # Flask routes
├── database.py      # SQLite connection
├── quality.py       # Analysis logic
├── templates/
│   └── index.html   # Web UI
├── requirements.txt
└── README.md
```

## Example Usage

```bash
# Upload a data batch
curl -X POST http://localhost:5000/upload \
  -H "Content-Type: application/json" \
  -d '{"values": [10, 20, null, -5, 20, 30]}'

# Response
{
  "batch_id": "abc-123-def",
  "total_records": 6,
  "missing_values": 1,
  "negative_values": 1,
  "duplicates": 1,
  "quality_score": 83
}
```

## Use Cases

- Data pipeline validation
- ETL quality gates
- Data ingestion monitoring
- Quality metric dashboards

