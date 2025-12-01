import sqlite3
from pathlib import Path

DB_NAME = "datasets.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not Path(DB_NAME).exists():
        conn = get_connection()
        conn.execute("""
        CREATE TABLE data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch_id TEXT NOT NULL,
            value REAL
        )
        """)
        conn.commit()
        conn.close()