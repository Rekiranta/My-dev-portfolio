# ELT Pipeline: DuckDB + dbt + Pandera

An end-to-end ELT pipeline that validates source data, loads it into a local DuckDB warehouse, and builds analytics-ready tables using dbt. Features data validation with Pandera.

## Features

- **Data validation** - Schema and business rules with Pandera
- **Local warehouse** - Single-file DuckDB database
- **dbt transforms** - Layered model architecture
- **Quality checks** - Automated data tests
- **Reproducible** - Deterministic transformations
- **CI ready** - GitHub Actions integration

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Runtime |
| Pandera | Data validation |
| DuckDB | Local data warehouse |
| dbt | SQL transformations |
| Pytest | Testing |

## Pipeline Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Source CSV  │────▶│   Validate   │────▶│    Load      │────▶│     dbt      │
│              │     │  (Pandera)   │     │   (DuckDB)   │     │  Transform   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## Data Model Layers

| Layer | Models | Description |
|-------|--------|-------------|
| **Raw** | `raw.customers`, `raw.orders` | Ingested source data |
| **Staging** | `stg_customers`, `stg_orders` | Cleaned, typed views |
| **Marts** | `dim_customers`, `fct_orders` | Analytics-ready tables |

## Source Data

Input files:
- `data/source/customers.csv`
- `data/source/orders.csv`

Output:
- `warehouse/analytics.duckdb`

## Run Locally

```powershell
cd data-pipeline-elt-dbt

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run validation + ingestion
python ingest.py

# Run dbt transformations
cd dbt_project
dbt run

# Run dbt tests
dbt test
```

## Project Structure

```
data-pipeline-elt-dbt/
├── data/
│   └── source/
│       ├── customers.csv
│       └── orders.csv
├── warehouse/
│   └── analytics.duckdb    # DuckDB database file
├── dbt_project/
│   ├── models/
│   │   ├── staging/
│   │   │   ├── stg_customers.sql
│   │   │   └── stg_orders.sql
│   │   └── marts/
│   │       ├── dim_customers.sql
│   │       └── fct_orders.sql
│   ├── dbt_project.yml
│   └── profiles.yml
├── ingest.py               # Validation + loading
├── schemas.py              # Pandera schemas
├── requirements.txt
└── README.md
```

## Validation Rules (Pandera)

```python
class OrderSchema(pa.SchemaModel):
    order_id: int = pa.Field(unique=True)
    customer_id: int = pa.Field(ge=1)
    amount: float = pa.Field(gt=0)
    order_date: str = pa.Field()
```

## dbt Model Example

```sql
-- models/marts/fct_orders.sql
SELECT
    o.order_id,
    o.customer_id,
    c.customer_name,
    o.amount,
    o.order_date
FROM {{ ref('stg_orders') }} o
LEFT JOIN {{ ref('stg_customers') }} c
    ON o.customer_id = c.customer_id
```

## Use Cases

- Modern data stack demonstrations
- ELT pipeline patterns
- dbt learning
- Data quality workflows

