param(
    [switch]$Install,
    [switch]$RunApi,
    [switch]$OpenReport
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $projectRoot "docs\estabilizacion\evidencias\bloque-9\$timestamp"
New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null

$isWindowsPlatform = $env:OS -eq "Windows_NT"
$npmCommand = if ($isWindowsPlatform) { "npm.cmd" } else { "npm" }
$nodeCommand = if ($isWindowsPlatform) { "node.exe" } else { "node" }

function Write-Status {
    param([string]$Type, [string]$Message)
    Write-Host "[$Type] $Message"
}

function Invoke-Captured {
    param(
        [string]$Label,
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$StdoutName,
        [string]$StderrName,
        [switch]$AllowFailure
    )

    $stdoutPath = Join-Path $evidenceDir $StdoutName
    $stderrPath = Join-Path $evidenceDir $StderrName
    Write-Status "RUN" $Label

    $startProcessParams = @{
        FilePath = $FilePath
        ArgumentList = $Arguments
        WorkingDirectory = $WorkingDirectory
        Wait = $true
        PassThru = $true
        NoNewWindow = $true
        RedirectStandardOutput = $stdoutPath
        RedirectStandardError = $stderrPath
    }
    $process = Start-Process @startProcessParams

    if (Test-Path $stdoutPath) {
        Get-Content $stdoutPath | ForEach-Object { Write-Host $_ }
    }
    if (Test-Path $stderrPath) {
        Get-Content $stderrPath | ForEach-Object { Write-Host $_ }
    }

    if ($process.ExitCode -ne 0 -and -not $AllowFailure) {
        throw "$Label termino con codigo $($process.ExitCode)"
    }

    return [PSCustomObject]@{
        ExitCode = $process.ExitCode
        Stdout = $stdoutPath
        Stderr = $stderrPath
    }
}

function Get-AuditTotal {
    param([string]$JsonPath)
    $audit = Get-Content $JsonPath -Raw | ConvertFrom-Json
    return [int]$audit.metadata.vulnerabilities.total
}

Write-Host "BLOQUE 9 - SEGURIDAD DE DEPENDENCIAS"
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

$nodeVersion = & $nodeCommand -p "process.versions.node"
$parts = $nodeVersion.Trim().Split('.')
$nodeSupported = ([int]$parts[0] -gt 20) -or (([int]$parts[0] -eq 20) -and ([int]$parts[1] -ge 19))
if (-not $nodeSupported) {
    throw "Node.js $nodeVersion no es compatible. Se requiere Node.js 20.19 o superior."
}
Write-Status "OK" "Node.js $nodeVersion"

if ($Install) {
    Invoke-Captured "npm ci backend" $backendDir $npmCommand @("ci") "backend-npm-ci.stdout.txt" "backend-npm-ci.stderr.txt" | Out-Null
    Invoke-Captured "npm ci frontend" $frontendDir $npmCommand @("ci") "frontend-npm-ci.stdout.txt" "frontend-npm-ci.stderr.txt" | Out-Null
}

$backendProd = Invoke-Captured "Audit backend produccion" $backendDir $npmCommand @("audit", "--omit=dev", "--json") "backend-audit-production.json" "backend-audit-production.stderr.txt" -AllowFailure
$backendAll = Invoke-Captured "Audit backend completo" $backendDir $npmCommand @("audit", "--json") "backend-audit-all.json" "backend-audit-all.stderr.txt" -AllowFailure
$frontendProd = Invoke-Captured "Audit frontend produccion" $frontendDir $npmCommand @("audit", "--omit=dev", "--json") "frontend-audit-production.json" "frontend-audit-production.stderr.txt" -AllowFailure
$frontendAll = Invoke-Captured "Audit frontend completo" $frontendDir $npmCommand @("audit", "--json") "frontend-audit-all.json" "frontend-audit-all.stderr.txt" -AllowFailure

$counts = [ordered]@{
    BackendProduction = Get-AuditTotal $backendProd.Stdout
    BackendAll = Get-AuditTotal $backendAll.Stdout
    FrontendProduction = Get-AuditTotal $frontendProd.Stdout
    FrontendAll = Get-AuditTotal $frontendAll.Stdout
}

foreach ($entry in $counts.GetEnumerator()) {
    if ($entry.Value -ne 0) {
        throw "$($entry.Key) conserva $($entry.Value) vulnerabilidad(es). Revise el JSON generado."
    }
    Write-Status "OK" "$($entry.Key): 0 vulnerabilidades"
}

Invoke-Captured "Jest + Supertest + cobertura" $backendDir $npmCommand @("run", "test:coverage") "backend-tests.stdout.txt" "backend-tests.stderr.txt" | Out-Null
Invoke-Captured "ESLint frontend" $frontendDir $npmCommand @("run", "lint") "frontend-lint.stdout.txt" "frontend-lint.stderr.txt" | Out-Null
Invoke-Captured "Build frontend" $frontendDir $npmCommand @("run", "build") "frontend-build.stdout.txt" "frontend-build.stderr.txt" | Out-Null

$apiStatus = "No ejecutado"
if ($RunApi) {
    $requiredQa = @("QA_ADMIN_EMAIL", "QA_ADMIN_PASSWORD", "QA_USER_EMAIL", "QA_USER_PASSWORD")
    $missingQa = $requiredQa | Where-Object { -not [Environment]::GetEnvironmentVariable($_) }
    if ($missingQa.Count -gt 0) {
        throw "Faltan variables QA: $($missingQa -join ', ')"
    }
    Invoke-Captured "Newman aislado" $backendDir $npmCommand @("run", "test:api") "newman.stdout.txt" "newman.stderr.txt" | Out-Null
    $apiStatus = "Aprobado"
}

$summaryPath = Join-Path $evidenceDir "dependency-security-summary.md"
$summary = @"
# Evidencia del Bloque 9 - Seguridad de dependencias

- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Node.js: $nodeVersion
- Backend produccion: $($counts.BackendProduction) vulnerabilidades
- Backend completo: $($counts.BackendAll) vulnerabilidades
- Frontend produccion: $($counts.FrontendProduction) vulnerabilidades
- Frontend completo: $($counts.FrontendAll) vulnerabilidades
- Jest/Supertest: aprobado
- ESLint: aprobado
- Build: aprobado
- Newman aislado: $apiStatus

## Decision

Dependencias aprobadas para continuar con la integracion de Cloudinary y el despliegue. No se utilizo `npm audit fix --force`.
"@
Set-Content -Path $summaryPath -Value $summary -Encoding UTF8

$tasksPath = Join-Path $projectRoot "specs\002-estabilizacion-calidad\tasks.md"
if (Test-Path $tasksPath) {
    $tasks = Get-Content $tasksPath -Raw
    $tasks = [regex]::Replace(
        $tasks,
        '(?m)^- \[[ x~]\] \*\*T-EST-070\*\*.*$',
        '- [x] **T-EST-070** Revisar y corregir vulnerabilidades de produccion sin `--force`.'
    )
    Set-Content -Path $tasksPath -Value $tasks -Encoding UTF8
}

Write-Status "OK" "Seguridad de dependencias aprobada"
Write-Status "OK" "Evidencia: $summaryPath"

if ($OpenReport) {
    Start-Process $summaryPath
}
