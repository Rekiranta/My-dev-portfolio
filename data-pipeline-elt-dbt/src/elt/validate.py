from __future__ import annotations

import pandas as pd
import pandera as pa
from pandera import Column, Check
from rich.console import Console
from datetime import date

console = Console()

def _email_check(series: pd.Series) -> pd.Series:
    return series.astype(str).str.contains(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", regex=True, na=False)

customers_schema = pa.DataFrameSchema(
    {
        "customer_id": Column(int, Check.ge(1), nullable=False),
        "name": Column(str, Check.str_length(min_value=1), nullable=False),
        "email": Column(str, Check(_email_check, element_wise=False), nullable=False),
        "country": Column(str, Check.isin(["FI", "SE", "US", "DE", "NO", "DK"]), nullable=False),
        "signup_date": Column(pa.DateTime, Check.le(pd.Timestamp(date.today())), nullable=False),
    },
    strict=True,
)

orders_schema = pa.DataFrameSchema(
    {
        "order_id": Column(int, Check.ge(1), nullable=False),
        "customer_id": Column(int, Check.ge(1), nullable=False),
        "order_ts": Column(pa.DateTime, nullable=False),
        "amount": Column(float, Check.gt(0.0), nullable=False),
        "currency": Column(str, Check.isin(["EUR", "USD"]), nullable=False),
        "status": Column(str, Check.isin(["PAID", "REFUNDED", "CANCELLED"]), nullable=False),
    },
    strict=True,
)

def validate_customers(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path, parse_dates=["signup_date"])
    customers_schema.validate(df, lazy=True)
    return df

def validate_orders(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path, parse_dates=["order_ts"])
    orders_schema.validate(df, lazy=True)
    return df

def validate_all(customers_csv: str, orders_csv: str) -> None:
    console.rule("[bold]Validating source data")
    validate_customers(customers_csv)
    validate_orders(orders_csv)
    console.print("[green]✓ Validation passed[/green]")
