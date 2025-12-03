.PHONY: venv install validate ingest transform run test lint clean

venv:
	python -m venv .venv

install:
	. .venv/bin/activate && pip install -U pip && pip install -r requirements.txt

validate:
	. .venv/bin/activate && python -m src.elt.run_pipeline validate

ingest:
	. .venv/bin/activate && python -m src.elt.run_pipeline ingest

transform:
	. .venv/bin/activate && python -m src.elt.run_pipeline transform --full-refresh True

run:
	. .venv/bin/activate && python -m src.elt.run_pipeline run

test:
	. .venv/bin/activate && pytest -q

lint:
	. .venv/bin/activate && ruff check .

clean:
	rm -rf .venv warehouse/*.duckdb dbt/target dbt/logs
