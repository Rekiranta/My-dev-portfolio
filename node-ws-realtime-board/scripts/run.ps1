$ErrorActionPreference="Stop"
Set-Location (Split-Path $MyInvocation.MyCommand.Path -Parent)
$Root = Resolve-Path ".."
Set-Location $Root

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js puuttuu. Asenna Node LTS ja aja uudestaan."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm puuttuu (tulee Node.js:n mukana)."
}

if (!(Test-Path ".\node_modules")) {
  npm install
} else {
  npm install --silent | Out-Null
}

Write-Host "Open: http://localhost:8090" -ForegroundColor Yellow
npm run start
