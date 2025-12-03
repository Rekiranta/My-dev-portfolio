from __future__ import annotations

from datetime import datetime
import pandera.pandas as pa
from pandera.typing import Series

class OrdersSchema(pa.DataFrameModel):
    order_id: Series[int] = pa.Field(gt=0, unique=True)
    customer_id: Series[int] = pa.Field(gt=0)
    amount: Series[float] = pa.Field(gt=0)
    currency: Series[str] = pa.Field(isin=["EUR", "USD"])
    event_ts: Series[datetime] = pa.Field(coerce=True)

    class Config:
        strict = True
