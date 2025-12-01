
# config.py
from pathlib import Path

# Base directory = this file's folder
BASE_DIR = Path(__file__).parent.resolve()

INPUT_DIR = BASE_DIR / "input"
PROCESSED_DIR = BASE_DIR / "processed"
DB_PATH = BASE_DIR / "events.db"

# Make sure folders exist
INPUT_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)
TABLE_NAME = "events"