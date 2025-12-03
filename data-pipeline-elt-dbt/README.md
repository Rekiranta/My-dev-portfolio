# ELT Pipeline: Raw → Clean → Analytics (DuckDB + dbt + Validation)

A small but production-flavored ELT pipeline for a data engineering portfolio:

- **Validate** source data (schema + business rules)
- **Ingest** into DuckDB `raw.*`
- **Transform** with dbt into `staging` and `marts` layers (dim/fact)
- **Test** with dbt tests + CI

## Architecture (logical)

```mermaid
flowchart LR
  A[CSV Source] --> B[Validation: pandera]
  B -->|pass| C[DuckDB raw.*]
  C --> D[dbt staging views]
  D --> E[dbt marts tables (dim/fct)]
  E --> F[Analytics-ready tables]
  B -->|fail| X[Stop + Report errors]
```
