param(
    [switch]$Install,
    [switch]$SeedQaUsers,
    [switch]$RunApi,
    [switch]$RunE2E,
    [switch]$InstallBrowser
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportDir = Join-Path $root "docs\estabilizacion\evidencias\bloque-5\$timestamp"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $backend "reports\jest") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $backend "reports\newman") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $frontend "reports\playwright") | Out-Null
$report = Join-Path $reportDir "resultado-bloque-5.txt"

function Write-Result([string]$message) {
    Write-Host $message
    Add-Content -Path $report -Value $message -Encoding UTF8
}

function Run-Npm([string]$workingDir, [string[]]$arguments, [string]$label) {
    Push-Location $workingDir
    try {
        Write-Result "[RUN] $label"
        & npm.cmd @arguments
        $exitCode = $LASTEXITCODE
        if ($exitCode -ne 0) {
            throw "$label termino con codigo $exitCode"
        }
        Write-Result "[OK] $label"
    }
    finally {
        Pop-Location
    }
}

Write-Result "BLOQUE 5 - PRUEBAS AUTOMATIZADAS"
Write-Result "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Result "Rama esperada: 002-estabilizacion-calidad"

if ($Install) {
    Run-Npm $backend @("install") "Instalacion de dependencias backend"
    Run-Npm $frontend @("install") "Instalacion de dependencias frontend"
}

Run-Npm $backend @("run", "test:coverage") "Jest + Supertest con cobertura"
Run-Npm $frontend @("run", "lint") "ESLint frontend"
Run-Npm $frontend @("run", "build") "Build frontend"

if ($SeedQaUsers) {
    Run-Npm $backend @("run", "qa:seed") "Preparacion de usuarios QA"
}

if ($RunApi) {
    if (-not $env:QA_ADMIN_EMAIL -or -not $env:QA_ADMIN_PASSWORD -or -not $env:QA_USER_EMAIL -or -not $env:QA_USER_PASSWORD) {
        throw "Faltan variables QA para Newman. Carga tests\qa-credentials.local.ps1."
    }

    Run-Npm $backend @("run", "test:api") "Postman/Newman"
}

if ($InstallBrowser) {
    Run-Npm $frontend @("run", "test:e2e:install") "Instalacion de Chromium para Playwright"
}

if ($RunE2E) {
    Run-Npm $frontend @("run", "test:e2e") "Playwright E2E"
}

Write-Result "Reportes esperados:"
Write-Result "- backend\reports\jest\coverage\index.html"
Write-Result "- backend\reports\jest\results.json"
Write-Result "- backend\reports\newman\peru-app-api.html"
Write-Result "- frontend\reports\playwright\html\index.html"
Write-Result "Resultado guardado en: $report"
