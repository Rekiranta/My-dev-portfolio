# DevOps Local Release Pipeline

A production-inspired API project demonstrating a complete DevOps workflow: testing, CI, Docker packaging, and release scripting. Built with FastAPI.

## Features

- **Health endpoint** - Standard health check with version info
- **Version management** - Centralized version tracking
- **Environment status** - Mock statusboard data
- **Automated tests** - pytest suite for CI
- **Docker packaging** - Production-ready containerization
- **Release script** - Automated version bumping

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| FastAPI | Web framework |
| Pytest | Testing |
| Docker | Containerization |
| GitHub Actions | CI pipeline |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with version |
| GET | `/version` | Current version |
| GET | `/status` | Environment statusboard |

## Run Locally

```powershell
cd devops-local-release-pipeline

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload --port 8000
```

Server runs at http://localhost:8000

API docs at http://localhost:8000/docs

## Run Tests

```powershell
pytest -v
```

## Run with Docker

```powershell
# Build the image
docker build -t release-pipeline .

# Run the container
docker run -p 8000:8000 release-pipeline
```

## Project Structure

```
devops-local-release-pipeline/
├── app/
│   ├── main.py         # FastAPI application
│   └── version.py      # Version constant
├── tests/
│   └── test_main.py    # Pytest suite
├── scripts/
│   └── release.ps1     # Release script
├── .github/
│   └── workflows/
│       └── ci.yml      # GitHub Actions
├── Dockerfile
├── requirements.txt
└── README.md
```

## Release Workflow

1. Update version in `app/version.py`
2. Run tests: `pytest -v`
3. Build Docker image: `docker build -t app:v1.2.3 .`
4. Tag and push: `git tag v1.2.3 && git push --tags`

## Example Response

```json
// GET /health
{
  "status": "pass",
  "message": "Service is healthy",
  "utc": "2024-01-15T12:00:00Z",
  "version": "1.0.0"
}

// GET /status
{
  "environments": [
    {"name": "dev", "status": "healthy"},
    {"name": "staging", "status": "degraded"},
    {"name": "prod", "status": "healthy"}
  ],
  "generatedBy": "api",
  "utc": "2024-01-15T12:00:00Z"
}
```

## Use Cases

- DevOps workflow demonstration
- Release pipeline patterns
- Docker containerization examples
- CI/CD best practices

