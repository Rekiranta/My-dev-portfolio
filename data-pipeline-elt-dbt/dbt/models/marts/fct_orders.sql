with o as (
  select * from {{ ref('stg_orders') }}
),
c as (
  select customer_id from {{ ref('dim_customers') }}
)
select
  o.order_id,
  o.customer_id,
  o.order_ts,
  o.amount,
  o.currency,
  o.status
from o
-- tarkoituksella inner join: faktan pitää viitata olemassa olevaan asiakkaaseen
join c using (customer_id)
