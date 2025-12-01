# db.py
import sqlite3
from config import DB_PATH

DDL = """
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_time TEXT,
    event_type TEXT,
    payload TEXT
);
"""

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(DDL)
    conn.commit()
    conn.close()
if __name__ == "__main__":
    init_db()   