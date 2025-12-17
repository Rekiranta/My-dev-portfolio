# DevOps CI Demo

A minimal Python API demonstrating CI/CD best practices with GitHub Actions. Built with Flask and pytest for automated testing.

## Features

- **Health endpoint** - Standard health check for monitoring
- **JSON API** - Clean REST endpoints
- **Web UI** - Simple HTML page for demo
- **Automated tests** - pytest suite for CI validation
- **GitHub Actions** - Full CI pipeline configuration

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Flask | Web framework |
| Pytest | Testing |
| GitHub Actions | CI pipeline |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info (JSON) |
| GET | `/health` | Health check |
| GET | `/ui` | Web interface |

## Run Locally

```powershell
cd devops-ci-demo

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

Server runs at http://localhost:5000

## Run Tests

```powershell
pytest -v
```

## Project Structure

```
devops-ci-demo/
├── app.py              # Flask application
├── tests/
│   └── test_app.py     # Pytest suite
├── .github/
│   └── workflows/
│       └── ci.yml      # GitHub Actions workflow
├── requirements.txt
└── README.md
```

## CI Pipeline

The GitHub Actions workflow runs on every push and pull request:

1. Set up Python environment
2. Install dependencies
3. Run pytest
4. Report results

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install -r requirements.txt
      - run: pytest -v
```

## Use Cases

- CI/CD pipeline demonstration
- GitHub Actions learning
- Automated testing patterns
- DevOps workflow examples

