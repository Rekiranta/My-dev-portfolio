$ErrorActionPreference="Stop"
Set-Location (Split-Path $MyInvocation.MyCommand.Path -Parent)
$Root = Resolve-Path ".."
Set-Location $Root

docker compose up -d

if (!(Test-Path ".\.venv")) { python -m venv .venv }
.\.venv\Scripts\Activate.ps1

python -m pip install -U pip
pip install -r .\requirements.txt

Write-Host "Starting API on http://127.0.0.1:8005 (Ctrl+C to stop)..." -ForegroundColor Yellow
python -m uvicorn src.cache_api.main:app --host 127.0.0.1 --port 8005 --reload --reload-dir .\src
