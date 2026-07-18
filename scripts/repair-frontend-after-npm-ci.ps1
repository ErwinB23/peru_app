$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend"

Write-Host ""
Write-Host "REPARACION DE DEPENDENCIAS FRONTEND" -ForegroundColor Cyan
Write-Host "No se usara npm ci."
Write-Host ""

Push-Location $Frontend
try {
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        throw "npm install fallo con codigo $LASTEXITCODE"
    }

    npm run lint
    if ($LASTEXITCODE -ne 0) {
        throw "ESLint fallo con codigo $LASTEXITCODE"
    }

    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build fallo con codigo $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "FRONTEND REPARADO: dependencias, ESLint y build correctos." -ForegroundColor Green
