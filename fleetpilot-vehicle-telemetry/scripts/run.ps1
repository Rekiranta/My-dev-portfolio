param(
[switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$projRoot = Split-Path $PSScriptRoot -Parent
$serverDir = Join-Path $projRoot "server"

Write-Host "FleetPilot – Vehicle Telemetry Tracker" -ForegroundColor Cyan
Write-Host "Server directory: $serverDir" -ForegroundColor DarkGray

Push-Location $serverDir
try {
if (-not (Test-Path "node_modules")) {
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install
}

if (-not $NoBrowser) {
	Start-Process "http://localhost:8094" | Out-Null
}

Write-Host "Starting dev server on http://localhost:8094" -ForegroundColor Green
npm run dev
}
finally {
Pop-Location
}