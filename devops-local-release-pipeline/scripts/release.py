from pathlib import Path
import re
from datetime import datetime

VERSION_FILE = Path("app/version.py")
CHANGELOG = Path("CHANGELOG.md")

def bump_patch(v: str) -> str:
    major, minor, patch = v.split(".")
    return f"{major}.{minor}.{int(patch)+1}"

def main():
    text = VERSION_FILE.read_text(encoding="utf-8")
    m = re.search(r'VERSION\s*=\s*"(\d+\.\d+\.\d+)"', text)
    if not m:
        raise SystemExit("Could not find VERSION in app/version.py")

    old = m.group(1)
    new = bump_patch(old)

    updated = re.sub(r'VERSION\s*=\s*"\d+\.\d+\.\d+"', f'VERSION = "{new}"', text)
    VERSION_FILE.write_text(updated, encoding="utf-8")

    now = datetime.utcnow().strftime("%Y-%m-%d")
    entry = f"## {new} - {now}\n- Patch release (automated)\n\n"

    if CHANGELOG.exists():
        existing = CHANGELOG.read_text(encoding="utf-8")
        if existing.startswith("# Changelog"):
            parts = existing.split("\n", 2)
            # keep header, insert entry after it
            new_text = parts[0] + "\n\n" + entry + (parts[2] if len(parts) > 2 else "")
        else:
            new_text = "# Changelog\n\n" + entry + existing
    else:
        new_text = "# Changelog\n\n" + entry

    CHANGELOG.write_text(new_text, encoding="utf-8")
    print(f"Released {old} -> {new}")

if __name__ == "__main__":
    main()
