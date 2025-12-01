"""
producer.py
Simulates a Kinesis producer by appending JSON events into a local file (stream.json).

Usage:
    python producer.py
"""

import json
import random
import time
from datetime import datetime
from pathlib import Path

STREAM_FILE = Path("stream.json")


def generate_event():
    device_id = random.choice(["sensor-1", "sensor-2", "sensor-3"])
    temperature = round(random.uniform(18.0, 28.0), 2)
    humidity = round(random.uniform(30.0, 60.0), 2)
    timestamp = datetime.utcnow().isoformat() + "Z"
    return {
        "timestamp": timestamp,
        "device_id": device_id,
        "temperature": temperature,
        "humidity": humidity,
    }


def main():
    print("Starting local producer. Writing events to stream.json...")
    STREAM_FILE.touch(exist_ok=True)

    for i in range(30):  # generate 30 events
        event = generate_event()
        with STREAM_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(event) + "\n")
        print(f"[{i+1:02}] Produced event: {event}")
        time.sleep(0.5)  # 0.5s between events

    print("Producer finished.")


if __name__ == "__main__":
    main()
