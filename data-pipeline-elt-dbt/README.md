# ELT Pipeline: Raw → Staging → Marts (DuckDB + dbt + Pandera)

This project is a small, end-to-end ELT pipeline that takes source CSV files, validates them, loads them into a local warehouse (DuckDB), and builds analytics-ready tables using dbt.

It’s designed to be:

- **Easy to run locally** (single-file DuckDB warehouse, minimal dependencies)
- **Reproducible** (clear steps, deterministic transformations)
- **Quality-aware** (data validation + automated tests + CI)

---

## What it does

### Inputs

Two CSV files:

- `data/source/customers.csv`
- `data/source/orders.csv`

### Pipeline steps

1. **Validate** the source data (schema + business rules) using Pandera
2. **Ingest** validated data into DuckDB as `raw.customers` and `raw.orders`
3. **Transform** with dbt into layered models:
   - **Staging** (`stg_*`): cleaned, typed views
   - **Marts** (`dim_*`, `fct_*`): analytics-friendly tables

### Outputs

DuckDB database file:

- `warehouse/analytics.duckdb`

Objects created:

- **Raw tables**: `raw.customers`, `raw.orders`
- **Staging views**: `stg_customers`, `stg_orders`
- **Mart tables**: `dim_customers`, `fct_orders`

---
