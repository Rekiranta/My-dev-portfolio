$ErrorActionPreference = "Stop"
Set-Location (Split-Path $MyInvocation.MyCommand.Path -Parent)
Set-Location ..

npm install
Write-Host "Open: http://localhost:8091" -ForegroundColor Yellow
npm run dev