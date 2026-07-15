param(
    [switch]$OpenReport
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $root "docs\estabilizacion\evidencias\bloque-5-1\$timestamp"
$summaryPath = Join-Path $backend "reports\jest\coverage\coverage-summary.json"
$htmlPath = Join-Path $backend "reports\jest\coverage\index.html"

New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

Write-Host "BLOQUE 5.1 - MEJORA DE COBERTURA" -ForegroundColor Cyan
Write-Host "Proyecto: $root"
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

if (-not (Test-Path (Join-Path $backend "node_modules"))) {
    throw "No existe backend\node_modules. Ejecute npm install dentro de backend."
}

Push-Location $backend
try {
    Write-Host "[RUN] Jest + Supertest con cobertura y umbrales" -ForegroundColor Yellow
    & cmd.exe /d /s /c "npm run test:coverage"
    $testExitCode = $LASTEXITCODE
}
finally {
    Pop-Location
}

if ($testExitCode -ne 0) {
    throw "La suite termino con codigo $testExitCode. Revise la prueba o el umbral que aparece en la consola."
}

if (-not (Test-Path $summaryPath)) {
    throw "No se genero coverage-summary.json. Verifique jest.config.js."
}

$coverage = Get-Content $summaryPath -Raw | ConvertFrom-Json
$total = $coverage.total

$lines = @(
    "BLOQUE 5.1 - RESULTADO DE COBERTURA",
    "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "",
    "Statements: $($total.statements.pct)% ($($total.statements.covered)/$($total.statements.total))",
    "Branches:   $($total.branches.pct)% ($($total.branches.covered)/$($total.branches.total))",
    "Functions:  $($total.functions.pct)% ($($total.functions.covered)/$($total.functions.total))",
    "Lines:      $($total.lines.pct)% ($($total.lines.covered)/$($total.lines.total))",
    "",
    "Umbrales obligatorios:",
    "Statements >= 80%",
    "Branches   >= 70%",
    "Functions  >= 85%",
    "Lines      >= 80%",
    "",
    "Reporte HTML: backend\reports\jest\coverage\index.html"
)

$reportPath = Join-Path $evidenceDir "resultado-cobertura.txt"
$lines | Set-Content -Path $reportPath -Encoding UTF8
Copy-Item $summaryPath (Join-Path $evidenceDir "coverage-summary.json") -Force

Write-Host ""
Write-Host "[OK] Suite aprobada y umbrales alcanzados" -ForegroundColor Green
$lines | ForEach-Object { Write-Host $_ }
Write-Host ""
Write-Host "Evidencia guardada en: $evidenceDir" -ForegroundColor Green

if ($OpenReport -and (Test-Path $htmlPath)) {
    Start-Process $htmlPath
}
