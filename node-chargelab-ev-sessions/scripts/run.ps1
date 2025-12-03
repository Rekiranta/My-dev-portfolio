param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
  npm install
}

Write-Host "ChargeLab  EV Charging Session Tracker" -ForegroundColor Cyan
Write-Host "Open REST API:  http://localhost:8093/api/stations" -ForegroundColor Cyan
Write-Host "Health check:   http://localhost:8093/health" -ForegroundColor Cyan
Write-Host "Daily stats:    http://localhost:8093/api/stats/daily" -ForegroundColor Cyan
Write-Host "WebSocket:      ws://localhost:8093/ws/sessions" -ForegroundColor Cyan

npm run dev