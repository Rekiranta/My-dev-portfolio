import pandas as pd
import sqlite3
from pathlib import Path
import shutil
from pandas.errors import EmptyDataError

INPUT_DIR = Path("input")
PROCESSED_DIR = Path("processed")
DB_PATH = Path("events.db")
TABLE_NAME = "events"


def process_csv(csv_path: Path):
    # 1) Jos tiedosto on oikeasti tyhjä (0 tavua)
    if csv_path.stat().st_size == 0:
        print(f"Skipping empty file (0 bytes): {csv_path.name}")
        return

    print(f"Processing file: {csv_path.name}")

    try:
        df = pd.read_csv(csv_path)
    except EmptyDataError:
        print(f"Skipping file with no columns/rows: {csv_path.name}")
        return

    if df.empty:
        print(f"No rows in {csv_path.name}, skipping.")
        return

    # Kirjoitetaan data SQLite-tietokantaan
    with sqlite3.connect(DB_PATH) as conn:
        df.to_sql(TABLE_NAME, conn, if_exists="append", index=False)

    # Siirretään tiedosto processed-kansioon
    PROCESSED_DIR.mkdir(exist_ok=True)
    dest = PROCESSED_DIR / csv_path.name
    shutil.move(str(csv_path), dest)
    print(f"Moved {csv_path.name} -> {dest}")
def main():
    INPUT_DIR.mkdir(exist_ok=True)
    csv_files = list(INPUT_DIR.glob("*.csv"))

    if not csv_files:
        print("No CSV files to process.")
        return

    for csv_file in csv_files:
        process_csv(csv_file)       