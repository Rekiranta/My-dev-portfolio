import argparse
import json
import time
from decimal import Decimal
from pathlib import Path
import boto3

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "infra" / "outputs.json"

def load_outputs() -> dict:
    # handles UTF-8 with BOM too
    return json.loads(OUT.read_text(encoding="utf-8-sig"))

def sqs():
    return boto3.client(
        "sqs",
        region_name="eu-west-1",
        aws_access_key_id="test",
        aws_secret_access_key="test",
        endpoint_url="http://127.0.0.1:4566",
    )

def table(name: str):
    ddb = boto3.resource(
        "dynamodb",
        region_name="eu-west-1",
        aws_access_key_id="test",
        aws_secret_access_key="test",
        endpoint_url="http://127.0.0.1:4566",
    )
    return ddb.Table(name)

def to_decimal(obj):
    """Convert floats inside dict/list recursively to Decimal (DynamoDB requirement)."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    if isinstance(obj, dict):
        return {k: to_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_decimal(v) for v in obj]
    return obj

def main(max_messages: int):
    outputs = load_outputs()
    queue_url = outputs["queue_url"]["value"]
    table_name = outputs["table_name"]["value"]

    s = sqs()
    t = table(table_name)

    processed = 0
    while processed < max_messages:
        resp = s.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=5,
        )

        msgs = resp.get("Messages", [])
        if not msgs:
            time.sleep(1)
            continue

        m = msgs[0]
        body = json.loads(m["Body"])
        event_id = body.get("event_id")

        if not event_id:
            # delete bad message so it doesn't block the queue
            s.delete_message(QueueUrl=queue_url, ReceiptHandle=m["ReceiptHandle"])
            continue

        body_ddb = to_decimal(body)

        # write to DynamoDB first
        t.put_item(Item={"event_id": str(event_id), "payload": body_ddb})

        # then delete message from SQS
        s.delete_message(QueueUrl=queue_url, ReceiptHandle=m["ReceiptHandle"])

        processed += 1
        print("Wrote:", event_id)

    print("Done. processed =", processed)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--max", type=int, default=1)
    args = p.parse_args()
    main(args.max)
