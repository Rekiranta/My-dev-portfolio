import json
from pathlib import Path
import boto3

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "infra" / "outputs.json"

def load_outputs() -> dict:
    return json.loads(OUT.read_text(encoding="utf-8-sig"))

def main():
    outputs = load_outputs()
    table_name = outputs["table_name"]["value"]

    ddb = boto3.resource(
        "dynamodb",
        region_name="eu-west-1",
        aws_access_key_id="test",
        aws_secret_access_key="test",
        endpoint_url="http://127.0.0.1:4566",
    )

    items = ddb.Table(table_name).scan(Limit=20).get("Items", [])
    print("Table:", table_name)
    print("Items:", len(items))
    for it in items:
        print(it)

if __name__ == "__main__":
    main()
