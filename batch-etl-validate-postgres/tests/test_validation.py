import pandas as pd
import pytest
from src.etl.schemas import OrdersSchema

def test_schema_rejects_negative_amount():
    df = pd.DataFrame([{
        "order_id": 1,
        "customer_id": 1,
        "amount": -10.0,
        "currency": "EUR",
        "event_ts": "2025-01-01T00:00:00Z",
    }])
    with pytest.raises(Exception):
        OrdersSchema.validate(df)

def test_schema_requires_known_currency():
    df = pd.DataFrame([{
        "order_id": 1,
        "customer_id": 1,
        "amount": 10.0,
        "currency": "BTC",
        "event_ts": "2025-01-01T00:00:00Z",
    }])
    with pytest.raises(Exception):
        OrdersSchema.validate(df)
