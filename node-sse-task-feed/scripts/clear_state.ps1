$ErrorActionPreference = "Stop"
Set-Location (Split-Path $MyInvocation.MyCommand.Path -Parent)
Set-Location ..

'{ "items": [] }' | Set-Content -Encoding Ascii .\data\state.json
Write-Host "Cleared data\state.json" -ForegroundColor Green