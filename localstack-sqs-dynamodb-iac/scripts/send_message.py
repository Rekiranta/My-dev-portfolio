import json
import uuid
from pathlib import Path
import boto3

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "infra" / "outputs.json"

def load_outputs() -> dict:
    return json.loads(OUT.read_text(encoding="utf-8-sig"))

def sqs():
    return boto3.client(
        "sqs",
        region_name="eu-west-1",
        aws_access_key_id="test",
        aws_secret_access_key="test",
        endpoint_url="http://127.0.0.1:4566",
    )

def main():
    outputs = load_outputs()
    queue_url = outputs["queue_url"]["value"]

    event = {
        "event_id": str(uuid.uuid4()),
        "type": "order_created",
        "customer_id": 123,
        "amount": 49.90,
    }

    sqs().send_message(QueueUrl=queue_url, MessageBody=json.dumps(event))
    print("Sent:", event)

if __name__ == "__main__":
    main()
