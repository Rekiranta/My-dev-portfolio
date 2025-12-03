$ErrorActionPreference="Stop"
Set-Location (Split-Path $MyInvocation.MyCommand.Path -Parent)
$Root = Resolve-Path ".."
Set-Location $Root

Remove-Item -Force .\data\state.json -ErrorAction SilentlyContinue
Write-Host "State cleared (data/state.json removed) ✅" -ForegroundColor Green
