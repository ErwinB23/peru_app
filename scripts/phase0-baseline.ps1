[CmdletBinding()]
param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [switch]$InstallDependencies
)

$ErrorActionPreference = "Stop"

# Evita caracteres dañados en Windows PowerShell 5.1.
try {
    [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
    $OutputEncoding = New-Object System.Text.UTF8Encoding($false)
}
catch {
    # No bloquear la ejecución si la consola no permite cambiar la codificación.
}

function Write-Section {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Invoke-NativeCommand {
    param(
        [Parameter(Mandatory = $true)][string]$CommandLine
    )

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = New-Object System.Diagnostics.ProcessStartInfo
    $process.StartInfo.FileName = $env:ComSpec
    $process.StartInfo.Arguments = "/d /s /c `"$CommandLine 2>&1`""
    $process.StartInfo.WorkingDirectory = (Get-Location).Path
    $process.StartInfo.UseShellExecute = $false
    $process.StartInfo.CreateNoWindow = $true
    $process.StartInfo.RedirectStandardOutput = $true

    [void]$process.Start()
    $output = $process.StandardOutput.ReadToEnd()
    $process.WaitForExit()

    return [PSCustomObject]@{
        ExitCode = $process.ExitCode
        Output   = $output
    }
}

function Invoke-And-Capture {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$CommandLine,
        [Parameter(Mandatory = $true)][string]$OutputFile,
        [switch]$AllowFailure
    )

    Write-Host "- $Name"

    $result = Invoke-NativeCommand -CommandLine $CommandLine

    if ([string]::IsNullOrWhiteSpace($result.Output)) {
        "" | Set-Content -Path $OutputFile -Encoding UTF8
    }
    else {
        $result.Output.TrimEnd() | Set-Content -Path $OutputFile -Encoding UTF8
        Write-Host $result.Output.TrimEnd()
    }

    if ($result.ExitCode -ne 0 -and -not $AllowFailure) {
        throw "$Name terminó con código $($result.ExitCode). Revisa: $OutputFile"
    }

    return $result.ExitCode
}

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$Backend = Join-Path $ProjectRoot "backend"
$Frontend = Join-Path $ProjectRoot "frontend"

foreach ($required in @($Backend, $Frontend, (Join-Path $ProjectRoot "specs"))) {
    if (-not (Test-Path $required)) {
        throw "No se encontró la ruta requerida: $required. Ejecuta el script desde la raíz de PERU_APP_FINAL."
    }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$EvidenceRoot = Join-Path $ProjectRoot "docs\estabilizacion\evidencias\fase-0\$stamp"
$BackupRoot = Join-Path $ProjectRoot "phase0-backups"
$TempBackup = Join-Path $env:TEMP "peru-app-phase0-$stamp"
$ZipPath = Join-Path $BackupRoot "PERU_APP_PRE_ESTABILIZACION_$stamp.zip"

New-Item -ItemType Directory -Force -Path $EvidenceRoot, $BackupRoot | Out-Null

Write-Section "Información del entorno"
$environmentFile = Join-Path $EvidenceRoot "environment.txt"

$nodeVersion = Invoke-NativeCommand -CommandLine "node --version"
$npmVersion = Invoke-NativeCommand -CommandLine "npm --version"

@(
    "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "ProjectRoot: $ProjectRoot",
    "Node: $($nodeVersion.Output.Trim())",
    "npm: $($npmVersion.Output.Trim())"
) | Set-Content -Path $environmentFile -Encoding UTF8

if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitBranch = Invoke-NativeCommand -CommandLine "git -C `"$ProjectRoot`" branch --show-current"
    "Rama: $($gitBranch.Output.Trim())" | Add-Content -Path $environmentFile -Encoding UTF8

    $gitStatus = Invoke-NativeCommand -CommandLine "git -C `"$ProjectRoot`" status --short"
    $gitStatus.Output.TrimEnd() | Set-Content -Path (Join-Path $EvidenceRoot "git-status.txt") -Encoding UTF8
}
else {
    "Git no está disponible en PATH." |
    Set-Content -Path (Join-Path $EvidenceRoot "git-status.txt") -Encoding UTF8
}

Write-Section "Respaldo del código fuente"

if (Test-Path $TempBackup) {
    Remove-Item $TempBackup -Recurse -Force
}

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
    throw "Robocopy falló con código $robocopyCode."
}

if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

Compress-Archive `
    -Path (Join-Path $TempBackup "*") `
    -DestinationPath $ZipPath `
    -CompressionLevel Optimal

Remove-Item $TempBackup -Recurse -Force

$hash = Get-FileHash $ZipPath -Algorithm SHA256

@(
    "Archivo: $ZipPath",
    "SHA256: $($hash.Hash)",
    "TamañoBytes: $((Get-Item $ZipPath).Length)"
) | Set-Content -Path (Join-Path $EvidenceRoot "source-backup.txt") -Encoding UTF8

Write-Host "Respaldo: $ZipPath" -ForegroundColor Green

if ($InstallDependencies) {
    Write-Section "Instalación reproducible de dependencias"

    Push-Location $Backend
    try {
        Invoke-And-Capture `
            -Name "Backend npm ci" `
            -CommandLine "npm ci" `
            -OutputFile (Join-Path $EvidenceRoot "backend-npm-ci.txt") | Out-Null
    }
    finally {
        Pop-Location
    }

    Push-Location $Frontend
    try {
        Invoke-And-Capture `
            -Name "Frontend npm ci" `
            -CommandLine "npm ci" `
            -OutputFile (Join-Path $EvidenceRoot "frontend-npm-ci.txt") | Out-Null
    }
    finally {
        Pop-Location
    }
}

Write-Section "Sintaxis del backend"

$syntaxFile = Join-Path $EvidenceRoot "backend-syntax.txt"
$backendJs = Get-ChildItem (Join-Path $Backend "src") -Recurse -Filter "*.js"
$syntaxFailed = $false

foreach ($file in $backendJs) {
    "Verificando $($file.FullName)" |
    Add-Content -Path $syntaxFile -Encoding UTF8

    $escapedPath = $file.FullName.Replace('"', '\"')
    $syntaxResult = Invoke-NativeCommand -CommandLine "node --check `"$escapedPath`""

    if (-not [string]::IsNullOrWhiteSpace($syntaxResult.Output)) {
        $syntaxResult.Output.TrimEnd() |
        Add-Content -Path $syntaxFile -Encoding UTF8
    }

    if ($syntaxResult.ExitCode -ne 0) {
        $syntaxFailed = $true
    }
}

if ($syntaxFailed) {
    throw "Se detectaron errores de sintaxis en el backend. Revisa: $syntaxFile"
}

"APROBADO: $($backendJs.Count) archivos JavaScript." |
Add-Content -Path $syntaxFile -Encoding UTF8

Write-Section "Frontend lint y build"

Push-Location $Frontend
try {
    Invoke-And-Capture `
        -Name "Frontend lint" `
        -CommandLine "npm run lint" `
        -OutputFile (Join-Path $EvidenceRoot "frontend-lint.txt") | Out-Null

    Invoke-And-Capture `
        -Name "Frontend build" `
        -CommandLine "npm run build" `
        -OutputFile (Join-Path $EvidenceRoot "frontend-build.txt") | Out-Null
}
finally {
    Pop-Location
}

Write-Section "Auditoría de dependencias"

Push-Location $Backend
try {
    Invoke-And-Capture `
        -Name "Backend npm audit" `
        -CommandLine "npm audit --json" `
        -OutputFile (Join-Path $EvidenceRoot "backend-audit.json") `
        -AllowFailure | Out-Null

    Invoke-And-Capture `
        -Name "Backend npm outdated" `
        -CommandLine "npm outdated --json" `
        -OutputFile (Join-Path $EvidenceRoot "backend-outdated.json") `
        -AllowFailure | Out-Null
}
finally {
    Pop-Location
}

Push-Location $Frontend
try {
    Invoke-And-Capture `
        -Name "Frontend npm audit" `
        -CommandLine "npm audit --json" `
        -OutputFile (Join-Path $EvidenceRoot "frontend-audit.json") `
        -AllowFailure | Out-Null

    Invoke-And-Capture `
        -Name "Frontend npm outdated" `
        -CommandLine "npm outdated --json" `
        -OutputFile (Join-Path $EvidenceRoot "frontend-outdated.json") `
        -AllowFailure | Out-Null
}
finally {
    Pop-Location
}

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
- confirmar el respaldo verificado de SQL Server;
- iniciar realmente backend y frontend;
- comprobar registro, login, perfil, roles y cierre de sesión;
- registrar evidencia visual del diseño actual.
"@

$summary |
Set-Content -Path (Join-Path $EvidenceRoot "SUMMARY.txt") -Encoding UTF8

Write-Host $summary -ForegroundColor Green