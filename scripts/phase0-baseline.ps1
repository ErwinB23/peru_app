[CmdletBinding()]
param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [switch]$InstallDependencies
)

$ErrorActionPreference = "Stop"

function Write-Section([string]$Message) {
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Invoke-And-Capture {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][scriptblock]$Command,
        [Parameter(Mandatory = $true)][string]$OutputFile,
        [switch]$AllowFailure
    )

    Write-Host "- $Name"
    try {
        & $Command *>&1 | Tee-Object -FilePath $OutputFile
        $exitCode = $LASTEXITCODE
        if ($null -eq $exitCode) { $exitCode = 0 }
        if ($exitCode -ne 0 -and -not $AllowFailure) {
            throw "$Name terminó con código $exitCode"
        }
        return $exitCode
    }
    catch {
        $_ | Out-String | Add-Content -Path $OutputFile
        if (-not $AllowFailure) { throw }
        return 1
    }
}

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$Backend = Join-Path $ProjectRoot "backend"
$Frontend = Join-Path $ProjectRoot "frontend"

foreach ($required in @($Backend, $Frontend, (Join-Path $ProjectRoot "specs"))) {
    if (-not (Test-Path $required)) {
        throw "No se encontró la ruta requerida: $required. Ejecuta el script desde el proyecto PERU APP."
    }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$EvidenceRoot = Join-Path $ProjectRoot "docs\estabilizacion\evidencias\fase-0\$stamp"
$BackupRoot = Join-Path $ProjectRoot "phase0-backups"
$TempBackup = Join-Path $env:TEMP "peru-app-phase0-$stamp"
$ZipPath = Join-Path $BackupRoot "PERU_APP_PRE_ESTABILIZACION_$stamp.zip"

New-Item -ItemType Directory -Force -Path $EvidenceRoot, $BackupRoot | Out-Null

Write-Section "Información del entorno"
"Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Set-Content (Join-Path $EvidenceRoot "environment.txt")
"ProjectRoot: $ProjectRoot" | Add-Content (Join-Path $EvidenceRoot "environment.txt")
node --version 2>&1 | ForEach-Object { "Node: $_" } | Add-Content (Join-Path $EvidenceRoot "environment.txt")
npm --version 2>&1 | ForEach-Object { "npm: $_" } | Add-Content (Join-Path $EvidenceRoot "environment.txt")

if (Get-Command git -ErrorAction SilentlyContinue) {
    git -C $ProjectRoot branch --show-current 2>&1 | ForEach-Object { "Rama: $_" } | Add-Content (Join-Path $EvidenceRoot "environment.txt")
    git -C $ProjectRoot status --short 2>&1 | Set-Content (Join-Path $EvidenceRoot "git-status.txt")
}
else {
    "Git no está disponible en PATH." | Set-Content (Join-Path $EvidenceRoot "git-status.txt")
}

Write-Section "Respaldo del código fuente"
if (Test-Path $TempBackup) { Remove-Item $TempBackup -Recurse -Force }
New-Item -ItemType Directory -Force -Path $TempBackup | Out-Null

$robocopyArgs = @(
    $ProjectRoot,
    $TempBackup,
    "/E",
    "/R:1",
    "/W:1",
    "/NFL",
    "/NDL",
    "/NJH",
    "/NJS",
    "/XD", ".git", "node_modules", "dist", "build", "phase0-backups",
    "/XF", ".env", ".env.local", "*.zip", "*.rar", "*.7z", "*.bak"
)
& robocopy @robocopyArgs | Out-Null
$robocopyCode = $LASTEXITCODE
if ($robocopyCode -ge 8) {
    throw "Robocopy falló con código $robocopyCode"
}

if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
Compress-Archive -Path (Join-Path $TempBackup "*") -DestinationPath $ZipPath -CompressionLevel Optimal
Remove-Item $TempBackup -Recurse -Force

$hash = Get-FileHash $ZipPath -Algorithm SHA256
@(
    "Archivo: $ZipPath",
    "SHA256: $($hash.Hash)",
    "TamañoBytes: $((Get-Item $ZipPath).Length)"
) | Set-Content (Join-Path $EvidenceRoot "source-backup.txt")
Write-Host "Respaldo: $ZipPath" -ForegroundColor Green

if ($InstallDependencies) {
    Write-Section "Instalación reproducible de dependencias"
    Push-Location $Backend
    try { npm ci } finally { Pop-Location }
    Push-Location $Frontend
    try { npm ci } finally { Pop-Location }
}

Write-Section "Sintaxis del backend"
$syntaxFile = Join-Path $EvidenceRoot "backend-syntax.txt"
$backendJs = Get-ChildItem (Join-Path $Backend "src") -Recurse -Filter "*.js"
$syntaxFailed = $false
foreach ($file in $backendJs) {
    "Verificando $($file.FullName)" | Add-Content $syntaxFile
    node --check $file.FullName 2>&1 | Add-Content $syntaxFile
    if ($LASTEXITCODE -ne 0) { $syntaxFailed = $true }
}
if ($syntaxFailed) { throw "Se detectaron errores de sintaxis en el backend." }
"APROBADO: $($backendJs.Count) archivos JavaScript." | Add-Content $syntaxFile

Write-Section "Frontend lint y build"
Push-Location $Frontend
try {
    Invoke-And-Capture -Name "Frontend lint" -Command { npm run lint } -OutputFile (Join-Path $EvidenceRoot "frontend-lint.txt") | Out-Null
    Invoke-And-Capture -Name "Frontend build" -Command { npm run build } -OutputFile (Join-Path $EvidenceRoot "frontend-build.txt") | Out-Null
}
finally {
    Pop-Location
}

Write-Section "Auditoría de dependencias"
Push-Location $Backend
try {
    Invoke-And-Capture -Name "Backend npm audit" -Command { npm audit --json } -OutputFile (Join-Path $EvidenceRoot "backend-audit.json") -AllowFailure | Out-Null
    Invoke-And-Capture -Name "Backend npm outdated" -Command { npm outdated --json } -OutputFile (Join-Path $EvidenceRoot "backend-outdated.json") -AllowFailure | Out-Null
}
finally { Pop-Location }

Push-Location $Frontend
try {
    Invoke-And-Capture -Name "Frontend npm audit" -Command { npm audit --json } -OutputFile (Join-Path $EvidenceRoot "frontend-audit.json") -AllowFailure | Out-Null
    Invoke-And-Capture -Name "Frontend npm outdated" -Command { npm outdated --json } -OutputFile (Join-Path $EvidenceRoot "frontend-outdated.json") -AllowFailure | Out-Null
}
finally { Pop-Location }

Write-Section "Resumen"
$summary = @"
FASE 0 - LÍNEA BASE AUTOMÁTICA
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Proyecto: $ProjectRoot
Evidencias: $EvidenceRoot
Respaldo fuente: $ZipPath
SHA256: $($hash.Hash)
Backend sintaxis: APROBADO
Frontend lint: APROBADO
Frontend build: APROBADO
Auditorías: REGISTRADAS (las vulnerabilidades no hacen fallar esta fase)

Pendiente manual:
- respaldo y verificación de SQL Server;
- inicio real de backend y frontend;
- registro, login, perfil, roles y logout;
- evidencia visual del diseño actual.
"@
$summary | Set-Content (Join-Path $EvidenceRoot "SUMMARY.txt")
Write-Host $summary -ForegroundColor Green
