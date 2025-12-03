import pytest
from src.streaming.schemas import OrderEvent

def test_amount_must_be_positive():
with pytest.raises(Exception):
OrderEvent(order_id=1, customer_id=1, amount=0, currency="EUR", source="x")

def test_reject_unknown_fields():
with pytest.raises(Exception):
OrderEvent(order_id=1, customer_id=1, amount=10, currency="EUR", source="x", extra_field="nope")
