# LocalStack IaC: SQS to DynamoDB Pipeline

An event ingestion pipeline running entirely on LocalStack. Uses Terraform to provision AWS-like infrastructure locally, with Python scripts for message processing.

## Features

- **Infrastructure as Code** - Terraform provisions SQS queue and DynamoDB table
- **LocalStack** - AWS services running locally in Docker
- **Event producer** - Send messages to SQS queue
- **Event consumer** - Process messages and write to DynamoDB
- **No AWS account needed** - Everything runs on your laptop

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Terraform | Infrastructure provisioning |
| LocalStack | AWS service emulation |
| Python | Message processing scripts |
| Docker Compose | Container orchestration |
| SQS | Message queue |
| DynamoDB | NoSQL database |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Producer   │────▶│     SQS      │────▶│   Consumer   │
│  (Python)    │     │   (Queue)    │     │   (Python)   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  DynamoDB    │
                                          │   (Table)    │
                                          └──────────────┘
```

## Run Locally

```powershell
cd localstack-sqs-dynamodb-iac

# Start LocalStack
docker compose up -d

# Provision infrastructure with Terraform
docker run --rm -v "${PWD}:/workspace" -w /workspace/infra hashicorp/terraform:1.7.5 init
docker run --rm -v "${PWD}:/workspace" -w /workspace/infra hashicorp/terraform:1.7.5 apply -auto-approve
docker run --rm -v "${PWD}:/workspace" -w /workspace/infra hashicorp/terraform:1.7.5 output -json > .\infra\outputs.json

# Set up Python environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r .\scripts\requirements.txt

# Run the pipeline
python .\scripts\send_message.py
python .\scripts\consume_to_dynamodb.py --max 1
python .\scripts\check_dynamodb.py
```

## Project Structure

```
localstack-sqs-dynamodb-iac/
├── infra/
│   ├── main.tf           # Terraform resources
│   ├── variables.tf      # Terraform variables
│   └── outputs.tf        # Terraform outputs
├── scripts/
│   ├── send_message.py        # SQS producer
│   ├── consume_to_dynamodb.py # SQS consumer
│   ├── check_dynamodb.py      # Query DynamoDB
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Terraform Resources

| Resource | Purpose |
|----------|---------|
| `aws_sqs_queue` | Message queue for events |
| `aws_dynamodb_table` | Storage for processed events |

## Scripts

| Script | Description |
|--------|-------------|
| `send_message.py` | Sends test message to SQS |
| `consume_to_dynamodb.py` | Reads SQS, writes to DynamoDB |
| `check_dynamodb.py` | Queries and displays DynamoDB items |

## Use Cases

- AWS development without cloud costs
- Infrastructure as Code learning
- Event-driven architecture demos
- LocalStack experimentation

