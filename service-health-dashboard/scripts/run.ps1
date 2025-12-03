param(
  [string]$ApiPort = "8093",
  [string]$WebPort = "5174"
)

$ErrorActionPreference = "Stop"

$root      = Split-Path $PSScriptRoot -Parent
$serverDir = Join-Path $root "server"
$webDir    = Join-Path $root "web"

function Ensure-NpmInstall([string]$dir) {
  if (-not (Test-Path $dir)) {
    throw "Directory not found: $dir"
  }
  Push-Location $dir
  try {
    if (-not (Test-Path "node_modules")) {
      Write-Host "Running npm install in $dir..." -ForegroundColor Yellow
      npm install
    }
  } finally {
    Pop-Location
  }
}

Ensure-NpmInstall $serverDir
Ensure-NpmInstall $webDir

Write-Host "Starting backend on port $ApiPort..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$serverDir`"; $env:PORT='$ApiPort'; npm run dev"

Write-Host "Starting frontend on port $WebPort..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$webDir`"; npm run dev"

Write-Host ""
Write-Host "API:  http://localhost:$ApiPort/health" -ForegroundColor Green
Write-Host "Web:  http://localhost:$WebPort" -ForegroundColor Green