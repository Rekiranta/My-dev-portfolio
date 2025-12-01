import sqlite3
from pathlib import Path

DB_NAME = "projects.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not Path(DB_NAME).exists():
        conn = get_connection()
        conn.execute(
            """
            CREATE TABLE projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL,
                due_date TEXT
            )
            """
        )
        conn.commit()
        conn.close()
