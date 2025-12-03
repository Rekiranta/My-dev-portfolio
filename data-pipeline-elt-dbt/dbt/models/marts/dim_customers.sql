select
  customer_id,
  name,
  email,
  country,
  signup_date
from {{ ref('stg_customers') }}
