from future import annotations

import time

def fib(n: int) -> int:
if n < 0:
raise ValueError("n must be >= 0")
a, b = 0, 1
for _ in range(n):
a, b = b, a + b
return a

def slow_compute_fib(n: int) -> int:
time.sleep(0.15)
return fib(n)
