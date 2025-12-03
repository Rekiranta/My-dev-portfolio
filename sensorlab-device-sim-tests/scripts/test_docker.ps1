$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from robot
docker compose -f docker-compose.test.yml down -v