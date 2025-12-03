CREATE TABLE IF NOT EXISTS order_events (
  event_id      TEXT PRIMARY KEY,
  event_ts      TIMESTAMPTZ NOT NULL,
  order_id      INTEGER NOT NULL,
  customer_id   INTEGER NOT NULL,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  source        TEXT NOT NULL,
  payload       JSONB NOT NULL,
  ingested_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_spend (
  customer_id     INTEGER PRIMARY KEY,
  total_amount    NUMERIC NOT NULL DEFAULT 0,
  last_event_ts   TIMESTAMPTZ
);
