$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

npm install
Write-Host "Open: http://localhost:8092" -ForegroundColor Yellow
npm run start