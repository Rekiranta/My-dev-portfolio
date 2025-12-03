# LocalStack IaC: SQS -> Python Consumer -> DynamoDB

A tiny event-ingestion project that runs fully on your laptop.

Terraform creates a queue (SQS) and a table (DynamoDB) inside LocalStack.
Then Python scripts:
1) send an event to SQS
2) consume it
3) write it to DynamoDB

## Run (PowerShell)

```powershell
docker compose up -d

docker run --rm -v "${PWD}:/workspace" -w /workspace/infra hashicorp/terraform:1.7.5 init
docker run --rm -v "${PWD}:/workspace" -w /workspace/infra hashicorp/terraform:1.7.5 apply -auto-approve
docker run --rm -v "${PWD}:/workspace" -w /workspace/infra hashicorp/terraform:1.7.5 output -json > .\infra\outputs.json

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r .\scripts\requirements.txt

python .\scripts\send_message.py
python .\scripts\consume_to_dynamodb.py --max 1
python .\scripts\check_dynamodb.py
