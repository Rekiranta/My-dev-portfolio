"""
consumer.py
Simulates a Kinesis consumer that reads new events from stream.json,
stores them in SQLite (events.db) and prints a small summary.

Usage:
    python consumer.py
"""

import json
import sqlite3
from pathlib import Path

import pandas as pd

STREAM_FILE = Path("stream.json")
OFFSET_FILE = Path("offset.txt")
DB_FILE = Path("events.db")


def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            device_id TEXT NOT NULL,
            temperature REAL NOT NULL,
            humidity REAL NOT NULL
        );
        """
    )
    conn.commit()
    conn.close()


def read_offset() -> int:
    if not OFFSET_FILE.exists():
        return 0
    raw = OFFSET_FILE.read_text(encoding="utf-8").strip()
    return int(raw) if raw else 0


def write_offset(offset: int) -> None:
    OFFSET_FILE.write_text(str(offset), encoding="utf-8")


def process_new_events():
    if not STREAM_FILE.exists():
        print("No stream.json file yet. Run producer.py first.")
        return 0

    offset = read_offset()
    print(f"Starting from offset: {offset}")
    processed = 0

    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    with STREAM_FILE.open("r", encoding="utf-8") as f:
        f.seek(offset)
        while True:
            line = f.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
            event = json.loads(line)
            cur.execute(
                """
                INSERT INTO events (timestamp, device_id, temperature, humidity)
                VALUES (?, ?, ?, ?)
                """,
                (
                    event["timestamp"],
                    event["device_id"],
                    float(event["temperature"]),
                    float(event["humidity"]),
                ),
            )
            processed += 1

        new_offset = f.tell()

    conn.commit()
    conn.close()
    write_offset(new_offset)

    return processed


def print_summary():
    conn = sqlite3.connect(DB_FILE)
    df = pd.read_sql_query("SELECT * FROM events", conn)
    conn.close()

    if df.empty:
        print("No events in database yet.")
        return

    print("\n=== Events summary ===")
    print(f"Total events: {len(df)}")
    print("\nAverage temperature by device:")
    print(df.groupby("device_id")["temperature"].mean().round(2))
    print("\nAverage humidity by device:")
    print(df.groupby("device_id")["humidity"].mean().round(2))
    print("======================\n")


def main():
    init_db()
    processed = process_new_events()
    if processed == 0:
        print("No new events to process.")
    else:
        print(f"Processed {processed} new events.")
    print_summary()


if __name__ == "__main__":
    main()
