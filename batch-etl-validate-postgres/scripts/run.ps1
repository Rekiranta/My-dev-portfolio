$ErrorActionPreference="Stop"
Set-Location (Split-Path $MyInvocation.MyCommand.Path -Parent)
$Root = Resolve-Path ".."
Set-Location $Root

docker compose up -d

python -m venv .venv
..venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r .\requirements.txt

python -m src.etl.cli run --count 50
python -m src.etl.cli show --limit 10
