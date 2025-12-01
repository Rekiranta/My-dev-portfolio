import sqlite3

DB_PATH = "events.db"
TABLE_NAME = "events"

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

rows = cur.execute(f"SELECT * FROM {TABLE_NAME} LIMIT 20").fetchall()

print("First rows in events table:")
for row in rows:
    print(row)

conn.close()
