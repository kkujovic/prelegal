Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
docker compose up -d --build
Write-Host "Prelegal started at http://localhost:8000"
