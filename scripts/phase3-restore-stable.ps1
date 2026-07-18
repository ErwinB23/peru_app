[CmdletBinding()]
param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"

function Write-Section {
    param([string]$Message)
    Write-Host ""
    Write-Host "=== $Message ===" -ForegroundColor Cyan
}

function Invoke-CommandCaptured {
    param(
        [string]$CommandLine,
        [string]$WorkingDirectory,
        [string]$OutputFile,
        [switch]$AllowFailure
    )

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = New-Object System.Diagnostics.ProcessStartInfo
    $process.StartInfo.FileName = $env:ComSpec
    $process.StartInfo.Arguments = "/d /s /c `"$CommandLine 2>&1`""
    $process.StartInfo.WorkingDirectory = $WorkingDirectory
    $process.StartInfo.UseShellExecute = $false
    $process.StartInfo.CreateNoWindow = $true
    $process.StartInfo.RedirectStandardOutput = $true

    [void]$process.Start()
    $output = $process.StandardOutput.ReadToEnd()
    $process.WaitForExit()

    $output | Set-Content -Path $OutputFile -Encoding UTF8

    if (-not [string]::IsNullOrWhiteSpace($output)) {
        Write-Host $output.TrimEnd()
    }

    if ($process.ExitCode -ne 0 -and -not $AllowFailure) {
        throw "El comando fallo con codigo $($process.ExitCode). Revisa: $OutputFile"
    }

    return [PSCustomObject]@{
        ExitCode = $process.ExitCode
        Output = $output
    }
}

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$Backend = Join-Path $ProjectRoot "backend"
$Frontend = Join-Path $ProjectRoot "frontend"

foreach ($required in @($Backend, $Frontend)) {
    if (-not (Test-Path $required)) {
        throw "No se encontro la ruta requerida: $required"
    }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$EvidenceRoot = Join-Path $ProjectRoot "docs\estabilizacion\evidencias\fase-3-estable\$stamp"
New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

Write-Section "Entorno"
$node = Invoke-CommandCaptured -CommandLine "node --version" -WorkingDirectory $ProjectRoot -OutputFile (Join-Path $EvidenceRoot "node-version.txt")
$npm = Invoke-CommandCaptured -CommandLine "npm --version" -WorkingDirectory $ProjectRoot -OutputFile (Join-Path $EvidenceRoot "npm-version.txt")
Write-Host "Node: $($node.Output.Trim())"
Write-Host "npm: $($npm.Output.Trim())"

Write-Section "Recuperacion de dependencias conocidas"
$backendInstall = Invoke-CommandCaptured -CommandLine "npm install --no-audit --no-fund --update-notifier=false" -WorkingDirectory $Backend -OutputFile (Join-Path $EvidenceRoot "backend-npm-install.txt") -AllowFailure
if ($backendInstall.ExitCode -ne 0) {
    Write-Warning "npm install del backend fallo. Se continuara con node_modules existente para comprobar si el sistema aun funciona."
}
$frontendInstall = Invoke-CommandCaptured -CommandLine "npm install --no-audit --no-fund --update-notifier=false" -WorkingDirectory $Frontend -OutputFile (Join-Path $EvidenceRoot "frontend-npm-install.txt") -AllowFailure
if ($frontendInstall.ExitCode -ne 0) {
    Write-Warning "npm install del frontend fallo. Se continuara con node_modules existente para comprobar si el sistema aun funciona."
}

Write-Section "Sintaxis del backend"
$syntaxFile = Join-Path $EvidenceRoot "backend-syntax.txt"
$backendFiles = Get-ChildItem (Join-Path $Backend "src") -Recurse -Filter "*.js"
$syntaxError = $false
foreach ($file in $backendFiles) {
    $tmp = Join-Path $EvidenceRoot "tmp-syntax.txt"
    $result = Invoke-CommandCaptured -CommandLine "node --check `"$($file.FullName)`"" -WorkingDirectory $Backend -OutputFile $tmp -AllowFailure
    if ($result.ExitCode -ne 0) {
        $syntaxError = $true
        "ERROR: $($file.FullName)" | Add-Content -Path $syntaxFile -Encoding UTF8
        $result.Output | Add-Content -Path $syntaxFile -Encoding UTF8
    }
}
Remove-Item (Join-Path $EvidenceRoot "tmp-syntax.txt") -ErrorAction SilentlyContinue
if ($syntaxError) { throw "Se detectaron errores de sintaxis en el backend. Revisa: $syntaxFile" }
"APROBADO: $($backendFiles.Count) archivos JavaScript." | Set-Content -Path $syntaxFile -Encoding UTF8

Write-Section "Frontend lint y build"
$lint = Invoke-CommandCaptured -CommandLine "npm run lint" -WorkingDirectory $Frontend -OutputFile (Join-Path $EvidenceRoot "frontend-lint.txt")
$build = Invoke-CommandCaptured -CommandLine "npm run build" -WorkingDirectory $Frontend -OutputFile (Join-Path $EvidenceRoot "frontend-build.txt")

Write-Section "Auditoria informativa"
$backendAudit = Invoke-CommandCaptured -CommandLine "npm audit --json" -WorkingDirectory $Backend -OutputFile (Join-Path $EvidenceRoot "backend-audit.json") -AllowFailure
$frontendAudit = Invoke-CommandCaptured -CommandLine "npm audit --json" -WorkingDirectory $Frontend -OutputFile (Join-Path $EvidenceRoot "frontend-audit.json") -AllowFailure

$summary = @"
FASE 3 ESTABLE - RECUPERACION Y VALIDACION
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Proyecto: $ProjectRoot
Evidencias: $EvidenceRoot

Backend npm install: codigo $($backendInstall.ExitCode)
Frontend npm install: codigo $($frontendInstall.ExitCode)
Backend sintaxis: APROBADO
Frontend lint: APROBADO
Frontend build: APROBADO
Backend npm audit: registrado, no bloqueante (codigo $($backendAudit.ExitCode))
Frontend npm audit: registrado, no bloqueante (codigo $($frontendAudit.ExitCode))

Decision:
- Se conservaron las dependencias conocidas que ya hacian funcionar el proyecto.
- Las vulnerabilidades pendientes quedan documentadas para una actualizacion posterior, una por una.
- La Fase 3 se considera funcionalmente aprobada si backend, lint y build pasan.
"@
$summary | Set-Content -Path (Join-Path $EvidenceRoot "SUMMARY.txt") -Encoding UTF8
Write-Host ""
Write-Host $summary -ForegroundColor Green
