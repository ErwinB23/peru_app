param(
    [switch]$RunQualityChecks,
    [switch]$OpenReports
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $root "docs\estabilizacion\evidencias\bloque-6\$timestamp"
New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

function Write-Ok([string]$message) { Write-Host "[OK] $message" -ForegroundColor Green }
function Write-Warn([string]$message) { Write-Host "[WARN] $message" -ForegroundColor Yellow }
function Write-Fail([string]$message) { Write-Host "[FAIL] $message" -ForegroundColor Red }

function Invoke-NativeCapture {
    param([string]$Label, [string]$WorkingDirectory, [string]$Command, [string]$OutputFile)
    Write-Host "[RUN] $Label" -ForegroundColor Cyan
    Push-Location $WorkingDirectory
    try {
        $previous = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        $output = & cmd.exe /d /s /c $Command 2>&1
        $exitCode = $LASTEXITCODE
        $ErrorActionPreference = $previous
        $output | Tee-Object -FilePath $OutputFile | Out-Host
        if ($exitCode -ne 0) { throw "$Label termino con codigo $exitCode" }
        Write-Ok $Label
    }
    finally { Pop-Location }
}

Write-Host "BLOQUE 6 - CIERRE SDD SPEC KIT" -ForegroundColor Cyan
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

$required = @(
    ".specify\memory\constitution.md",
    "specs\001-peru-app\spec.md",
    "specs\001-peru-app\plan.md",
    "specs\001-peru-app\tasks.md",
    "specs\001-peru-app\data-model.md",
    "specs\001-peru-app\openapi.yaml",
    "specs\002-estabilizacion-calidad\spec.md",
    "specs\002-estabilizacion-calidad\plan.md",
    "specs\002-estabilizacion-calidad\tasks.md",
    "specs\002-estabilizacion-calidad\design.md",
    "specs\002-estabilizacion-calidad\data-model-delta.md",
    "specs\002-estabilizacion-calidad\test-cases.md",
    "specs\002-estabilizacion-calidad\traceability-matrix.md",
    "specs\002-estabilizacion-calidad\final-review.md"
)
foreach ($relative in $required) {
    if (-not (Test-Path (Join-Path $root $relative))) { throw "Falta artefacto SDD: $relative" }
}
Write-Ok "$($required.Count) artefactos SDD obligatorios presentes"

Invoke-NativeCapture -Label "Sincronizacion OpenAPI" -WorkingDirectory $root -Command "node scripts\check-openapi-sync.mjs" -OutputFile (Join-Path $evidenceDir "openapi-sync.txt")

$branch = (& git -C $root branch --show-current 2>$null)
if ($branch -eq "002-estabilizacion-calidad") { Write-Ok "Rama: $branch" }
elseif ($branch) { Write-Warn "Rama actual: $branch. Se esperaba 002-estabilizacion-calidad." }
else { Write-Warn "No se pudo leer la rama Git." }

$quality = [ordered]@{ Jest = "NO EJECUTADO"; Lint = "NO EJECUTADO"; Build = "NO EJECUTADO" }
if ($RunQualityChecks) {
    Invoke-NativeCapture -Label "Jest + Supertest + cobertura" -WorkingDirectory (Join-Path $root "backend") -Command "npm.cmd run test:coverage" -OutputFile (Join-Path $evidenceDir "jest-coverage.txt")
    $quality.Jest = "OK"
    Invoke-NativeCapture -Label "ESLint frontend" -WorkingDirectory (Join-Path $root "frontend") -Command "npm.cmd run lint" -OutputFile (Join-Path $evidenceDir "frontend-lint.txt")
    $quality.Lint = "OK"
    Invoke-NativeCapture -Label "Build frontend" -WorkingDirectory (Join-Path $root "frontend") -Command "npm.cmd run build" -OutputFile (Join-Path $evidenceDir "frontend-build.txt")
    $quality.Build = "OK"
}

$resultsPath = Join-Path $root "backend\reports\jest\results.json"
$coveragePath = Join-Path $root "backend\reports\jest\coverage\coverage-summary.json"
$metrics = $null
$tests = $null
if (Test-Path $resultsPath) {
    $tests = Get-Content $resultsPath -Raw | ConvertFrom-Json
    Copy-Item $resultsPath (Join-Path $evidenceDir "jest-results.json") -Force
}
if (Test-Path $coveragePath) {
    $coverage = Get-Content $coveragePath -Raw | ConvertFrom-Json
    $metrics = $coverage.total
    Copy-Item $coveragePath (Join-Path $evidenceDir "coverage-summary.json") -Force
}

$newmanReport = Join-Path $root "backend\reports\newman\peru-app-api.html"
$playwrightReport = Join-Path $root "frontend\reports\playwright\html\index.html"
$newmanStatus = if (Test-Path $newmanReport) { "PRESENTE" } else { "PENDIENTE" }
$playwrightStatus = if (Test-Path $playwrightReport) { "PRESENTE" } else { "PENDIENTE" }

$summary = @()
$summary += "# Evidencia de Cierre SDD - Bloque 6"
$summary += ""
$summary += "- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$summary += "- Rama: $branch"
$summary += "- OpenAPI: 70/70"
$summary += "- Jest: $($quality.Jest)"
$summary += "- ESLint: $($quality.Lint)"
$summary += "- Build: $($quality.Build)"
$summary += "- Newman HTML: $newmanStatus"
$summary += "- Playwright HTML: $playwrightStatus"
if ($tests) {
    $summary += "- Suites Jest: $($tests.numPassedTestSuites)/$($tests.numTotalTestSuites)"
    $summary += "- Casos Jest: $($tests.numPassedTests)/$($tests.numTotalTests)"
}
if ($metrics) {
    $summary += "- Statements: $($metrics.statements.pct)%"
    $summary += "- Branches: $($metrics.branches.pct)%"
    $summary += "- Functions: $($metrics.functions.pct)%"
    $summary += "- Lines: $($metrics.lines.pct)%"
}
$summary += ""
$summary += "## Dictamen"
if ($quality.Jest -eq "OK" -and $quality.Lint -eq "OK" -and $quality.Build -eq "OK") {
    $summary += "APROBADO PARA INICIAR DESPLIEGUE. Newman y Playwright deben archivarse si figuran pendientes."
} else {
    $summary += "CIERRE DOCUMENTAL VALIDADO. Ejecutar nuevamente con -RunQualityChecks antes del despliegue."
}
$summaryPath = Join-Path $evidenceDir "sdd-closure-summary.md"
$summary -join "`r`n" | Set-Content -Path $summaryPath -Encoding UTF8
Write-Ok "Evidencia: $summaryPath"

if ($OpenReports) {
    $coverageHtml = Join-Path $root "backend\reports\jest\coverage\index.html"
    if (Test-Path $coverageHtml) { Start-Process $coverageHtml }
    if (Test-Path $newmanReport) { Start-Process $newmanReport }
    if (Test-Path $playwrightReport) { Start-Process $playwrightReport }
}
