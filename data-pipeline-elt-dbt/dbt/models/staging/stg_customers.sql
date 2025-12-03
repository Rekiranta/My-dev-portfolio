with src as (
  select * from raw.customers
),
clean as (
  select
    cast(customer_id as integer) as customer_id,
    trim(name) as name,
    lower(trim(email)) as email,
    upper(trim(country)) as country,
    cast(signup_date as date) as signup_date
  from src
)
select * from clean
