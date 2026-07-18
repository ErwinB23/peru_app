[CmdletBinding()]
param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$Backend = Join-Path $ProjectRoot 'backend'
$Frontend = Join-Path $ProjectRoot 'frontend'
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$EvidenceRoot = Join-Path $ProjectRoot "docs\estabilizacion\evidencias\fase-2\$Stamp"

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

function Invoke-And-Save {
    param(
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$OutputFile
    )

    Push-Location $WorkingDirectory
    try {
        cmd /d /s /c "$Command 2>&1" | Tee-Object -FilePath $OutputFile
        if ($LASTEXITCODE -ne 0) {
            throw "El comando '$Command' terminó con código $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}

Write-Host '=== Validación de configuración - Fase 2 ===' -ForegroundColor Cyan

$requiredFiles = @(
    (Join-Path $Backend '.env.example'),
    (Join-Path $Backend 'src\config\env.js'),
    (Join-Path $Backend 'src\config\database.js'),
    (Join-Path $Backend 'src\server.js'),
    (Join-Path $Frontend '.env.example'),
    (Join-Path $Frontend 'src\services\api.js'),
    (Join-Path $Frontend 'src\services\authService.js')
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "Falta el archivo requerido: $file"
    }
}

Write-Host '- Sintaxis del backend'
$backendSyntax = Join-Path $EvidenceRoot 'backend-syntax.txt'
Get-ChildItem (Join-Path $Backend 'src') -Recurse -Filter '*.js' | ForEach-Object {
    "Verificando $($_.FullName)" | Add-Content -Path $backendSyntax -Encoding UTF8
    node --check $_.FullName 2>&1 | Add-Content -Path $backendSyntax -Encoding UTF8
    if ($LASTEXITCODE -ne 0) {
        throw "Error de sintaxis en $($_.FullName)"
    }
}

Write-Host '- Frontend lint'
Invoke-And-Save $Frontend 'npm run lint' (Join-Path $EvidenceRoot 'frontend-lint.txt')

Write-Host '- Frontend build'
Invoke-And-Save $Frontend 'npm run build' (Join-Path $EvidenceRoot 'frontend-build.txt')

@"
FASE 2 - CONFIGURACIÓN UNIFICADA
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Backend sintaxis: APROBADO
Frontend lint: APROBADO
Frontend build: APROBADO
Pendiente manual: iniciar backend y frontend, probar registro, login y perfil.
"@ | Set-Content -Path (Join-Path $EvidenceRoot 'SUMMARY.txt') -Encoding UTF8

Write-Host "Validación completada. Evidencias: $EvidenceRoot" -ForegroundColor Green
