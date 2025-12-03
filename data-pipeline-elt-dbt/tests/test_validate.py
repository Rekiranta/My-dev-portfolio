import pytest
from src.elt.validate import validate_customers, validate_orders

def test_customers_validation_fails_on_bad_email(tmp_path):
    p = tmp_path / "customers.csv"
    p.write_text(
        "customer_id,name,email,country,signup_date\n"
        "1,Ada,not-an-email,FI,2024-01-01\n"
    )
    with pytest.raises(Exception):
        validate_customers(str(p))

def test_orders_validation_fails_on_negative_amount(tmp_path):
    p = tmp_path / "orders.csv"
    p.write_text(
        "order_id,customer_id,order_ts,amount,currency,status\n"
        "1,1,2024-01-01T00:00:00,-1,EUR,PAID\n"
    )
    with pytest.raises(Exception):
        validate_orders(str(p))
