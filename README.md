# My Developer Portfolio

A collection of hands-on projects demonstrating DevOps, cloud engineering, and data pipeline skills. Each project is self-contained with its own documentation.

## Featured Projects (Pinned Repositories)

These are my top projects, available as standalone repositories:

| Project | Description | Tech |
|---------|-------------|------|
| [terraform-k8s-blueprints-ci](https://github.com/Rekiranta/terraform-k8s-blueprints-ci) | Kubernetes infrastructure with Terraform and GitHub Actions CI | Terraform, Kubernetes, GitHub Actions |
| [streaming-redpanda-postgres](https://github.com/Rekiranta/streaming-redpanda-postgres) | Event streaming pipeline with idempotent PostgreSQL sink | Redpanda (Kafka), PostgreSQL, Python |
| [data-pipeline-elt-dbt](https://github.com/Rekiranta/data-pipeline-elt-dbt) | Modern ELT pipeline with dbt transformations and data validation | dbt, DuckDB, Pandera |
| [localstack-sqs-dynamodb-iac](https://github.com/Rekiranta/localstack-sqs-dynamodb-iac) | AWS infrastructure locally with SQS and DynamoDB | LocalStack, Terraform, boto3 |
| [devops-ci-demo](https://github.com/Rekiranta/devops-ci-demo) | CI/CD pipeline with automated testing | Flask, Pytest, GitHub Actions |
| [fastapi-redis-cache-api](https://github.com/Rekiranta/fastapi-redis-cache-api) | REST API with Redis caching and cache-aside pattern | FastAPI, Redis, Pytest |

---

## Additional Projects

### API & Web Services

| Project | Description | Tech |
|---------|-------------|------|
| [data-quality-api](./data-quality-api) | Data validation API with quality checks | FastAPI, Pydantic |
| [task-manager-web](./task-manager-web) | Web-based task management application | Flask, JavaScript |
| [project-planer-flask](./project-planer-flask) | Project planning tool | Flask, SQLite |
| [expense-tracker-charts](./expense-tracker-charts) | Expense tracking with visualizations | Flask, Chart.js |

### Data Pipelines & ETL

| Project | Description | Tech |
|---------|-------------|------|
| [batch-etl-validate-postgres](./batch-etl-validate-postgres) | Batch ETL with data validation | Python, PostgreSQL |
| [local-serverless-etl](./local-serverless-etl) | Serverless ETL simulation with LocalStack | LocalStack, Lambda, S3 |
| [local-streaming-pipeline](./local-streaming-pipeline) | Local streaming data pipeline | Python, Docker |

### DevOps & CI/CD

| Project | Description | Tech |
|---------|-------------|------|
| [devops-statusboard](./devops-statusboard) | Real-time DevOps status dashboard | React, Flask, WebSocket |
| [devops-local-release-pipeline](./devops-local-release-pipeline) | Local release pipeline simulation | Python, Docker |
| [buildwatch-ci-monitor](./buildwatch-ci-monitor) | CI/CD build monitoring tool | Node.js |

### Real-time & Monitoring

| Project | Description | Tech |
|---------|-------------|------|
| [node-ws-realtime-board](./node-ws-realtime-board) | Real-time collaboration board | Node.js, WebSockets |
| [node-sse-task-feed](./node-sse-task-feed) | Server-sent events task feed | Node.js, SSE |
| [eventstream-monitor](./eventstream-monitor) | Event stream monitoring dashboard | Python |
| [service-health-dashboard](./service-health-dashboard) | Service health monitoring | Python, Flask |

### IoT & Simulation

| Project | Description | Tech |
|---------|-------------|------|
| [sensorlab-device-sim-tests](./sensorlab-device-sim-tests) | IoT sensor device simulation | Python |
| [node-chargelab-ev-sessions](./node-chargelab-ev-sessions) | EV charging session simulator | Node.js |
| [fleetpilot-vehicle-telemetry](./fleetpilot-vehicle-telemetry) | Vehicle fleet telemetry system | Python |

---

## Tech Stack Overview

| Category | Technologies |
|----------|-------------|
| **Languages** | Python, TypeScript, JavaScript |
| **Frameworks** | FastAPI, Flask, Node.js, React |
| **Containers** | Docker, Docker Compose, Kubernetes |
| **CI/CD** | GitHub Actions, Terraform |
| **Databases** | PostgreSQL, Redis, DynamoDB, DuckDB |
| **Streaming** | Redpanda (Kafka), WebSockets, SSE |
| **Cloud** | AWS (LocalStack), Terraform |

## Getting Started

Most projects follow a similar setup pattern:

### Python Projects

```powershell
cd <project-name>
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Docker-based Projects

```powershell
cd <project-name>
docker compose up -d
```

### Terraform Projects

```powershell
cd <project-name>/infra
terraform init
terraform apply
```

### Running Tests

```powershell
pytest
```

## Author

**Teemu Rekiranta** - Junior Cloud and DevOps Engineer

- [GitHub](https://github.com/Rekiranta)
- [LinkedIn](https://www.linkedin.com/in/teemurekiranta)
