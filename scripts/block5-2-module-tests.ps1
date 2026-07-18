param(
    [switch]$OpenReport
)

$ErrorActionPreference = 'Stop'
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $scriptPath
$backend = Join-Path $root 'backend'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$evidence = Join-Path $root "docs\estabilizacion\evidencias\bloque-5-2\$timestamp"
$log = Join-Path $evidence 'jest-coverage.log'

New-Item -ItemType Directory -Force -Path $evidence | Out-Null

Write-Host 'BLOQUE 5.2 - PRUEBAS DE MODULOS' -ForegroundColor Cyan
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host 'Ejecutando Jest y Supertest...'

Push-Location $backend
try {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & npm.cmd run test:coverage *> $log
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousPreference
}
finally {
    Pop-Location
}

Get-Content $log | ForEach-Object { Write-Host $_ }

if ($exitCode -ne 0) {
    throw "Las pruebas terminaron con codigo $exitCode. Revise: $log"
}

$resultsPath = Join-Path $backend 'reports\jest\results.json'
$coveragePath = Join-Path $backend 'reports\jest\coverage\coverage-summary.json'
$reportPath = Join-Path $backend 'reports\jest\coverage\index.html'

if (!(Test-Path $resultsPath) -or !(Test-Path $coveragePath)) {
    throw 'No se encontraron los reportes JSON de Jest.'
}

$results = Get-Content $resultsPath -Raw | ConvertFrom-Json
$coverage = Get-Content $coveragePath -Raw | ConvertFrom-Json
$total = $coverage.total

$integration = 0
$unit = 0
foreach ($suite in $results.testResults) {
    $count = @($suite.assertionResults).Count
    if ($suite.name -match '[\\/]tests[\\/]integration[\\/]') {
        $integration += $count
    }
    elseif ($suite.name -match '[\\/]tests[\\/]unit[\\/]') {
        $unit += $count
    }
}

$checks = @(
    @{ Name = 'Suites'; Value = [int]$results.numPassedTestSuites; Minimum = 14 },
    @{ Name = 'Pruebas totales'; Value = [int]$results.numPassedTests; Minimum = 388 },
    @{ Name = 'Pruebas unitarias'; Value = $unit; Minimum = 363 },
    @{ Name = 'Pruebas de integracion'; Value = $integration; Minimum = 25 },
    @{ Name = 'Statements'; Value = [double]$total.statements.pct; Minimum = 80 },
    @{ Name = 'Branches'; Value = [double]$total.branches.pct; Minimum = 70 },
    @{ Name = 'Functions'; Value = [double]$total.functions.pct; Minimum = 85 },
    @{ Name = 'Lines'; Value = [double]$total.lines.pct; Minimum = 80 }
)

$failed = $false
Write-Host ''
Write-Host 'RESUMEN DEL BLOQUE 5.2' -ForegroundColor Cyan
foreach ($check in $checks) {
    $ok = $check.Value -ge $check.Minimum
    $status = if ($ok) { '[OK]' } else { '[FAIL]' }
    $color = if ($ok) { 'Green' } else { 'Red' }
    Write-Host ("{0} {1}: {2} (minimo {3})" -f $status, $check.Name, $check.Value, $check.Minimum) -ForegroundColor $color
    if (!$ok) { $failed = $true }
}

Copy-Item $resultsPath (Join-Path $evidence 'results.json') -Force
Copy-Item $coveragePath (Join-Path $evidence 'coverage-summary.json') -Force

$summary = @"
# Evidencia Bloque 5.2

- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Suites aprobadas: $($results.numPassedTestSuites)
- Pruebas totales: $($results.numPassedTests)
- Pruebas unitarias: $unit
- Pruebas de integracion: $integration
- Statements: $($total.statements.pct)%
- Branches: $($total.branches.pct)%
- Functions: $($total.functions.pct)%
- Lines: $($total.lines.pct)%
- Reporte HTML: backend/reports/jest/coverage/index.html
"@
$summary | Set-Content -Path (Join-Path $evidence 'RESUMEN.md') -Encoding UTF8

if ($failed) {
    throw 'Una o mas puertas de calidad no fueron superadas.'
}

Write-Host ''
Write-Host "[OK] Evidencia guardada en: $evidence" -ForegroundColor Green

if ($OpenReport -and (Test-Path $reportPath)) {
    Start-Process $reportPath
}
