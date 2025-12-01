import sqlite3
from pathlib import Path
from typing import Iterable, Dict

from config import DB_PATH

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    if not Path(DB_PATH).exists():
        conn = get_connection()
        conn.execute(
            """
            CREATE TABLE events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_file TEXT NOT NULL,
                user_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                value REAL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()
        conn.close()

def insert_events(source_file: str, events: Iterable[Dict]) -> int:
    conn = get_connection()
    cur = conn.cursor()
    rows = [
        (
            source_file,
            e["user_id"],
            e["event_type"],
            e.get("value"),
            e["created_at"],
        )
        for e in events
    ]
    cur.executemany(
        """
        INSERT INTO events (source_file, user_id, event_type, value, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        rows,
    )
    conn.commit()
    count = cur.rowcount
    conn.close()
    return count
