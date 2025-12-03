from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import Literal
import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator

Currency = Literal["EUR", "USD"]

class OrderEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    order_id: int = Field(ge=1)
    customer_id: int = Field(ge=1)

    amount: Decimal
    currency: Currency
    source: str = Field(min_length=1, max_length=50)

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("amount must be > 0")
        return v
