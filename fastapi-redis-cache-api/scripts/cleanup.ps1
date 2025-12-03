$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
Set-Location ..

docker compose down -v
Remove-Item -Recurse -Force ..venv -ErrorAction SilentlyContinue
Write-Host "Cleaned " -ForegroundColor Green
