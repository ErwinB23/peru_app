param(
    [switch]$ApplyCleanup
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$EvidenceDir = Join-Path $ProjectRoot "docs\estabilizacion\evidencias\bloque-1\$Timestamp"
$ReportPath = Join-Path $EvidenceDir "reporte-bloque-1.txt"

New-Item -ItemType Directory -Force -Path $EvidenceDir | Out-Null

$Lines = New-Object System.Collections.Generic.List[string]

function Add-Line {
    param([string]$Text = "")
    $Lines.Add($Text)
    Write-Host $Text
}

function Test-RequiredFile {
    param([string]$RelativePath)
    $FullPath = Join-Path $ProjectRoot $RelativePath
    if (Test-Path $FullPath) {
        Add-Line "[OK] $RelativePath"
        return $true
    }

    Add-Line "[FALTA] $RelativePath"
    return $false
}

Add-Line "PERU APP - AUDITORIA DEL BLOQUE 1"
Add-Line "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Add-Line "Raiz: $ProjectRoot"
Add-Line ""

Add-Line "1. ARTEFACTOS SDD"
$RequiredFiles = @(
    ".specify\memory\constitution.md",
    "specs\001-peru-app\spec.md",
    "specs\001-peru-app\openapi.yaml",
    "specs\002-estabilizacion-calidad\spec.md",
    "specs\002-estabilizacion-calidad\plan.md",
    "specs\002-estabilizacion-calidad\tasks.md",
    "specs\002-estabilizacion-calidad\test-cases.md",
    "specs\002-estabilizacion-calidad\route-inventory.md",
    "specs\002-estabilizacion-calidad\traceability-matrix.md",
    "specs\002-estabilizacion-calidad\checklists\sdd-consistency-checklist.md",
    "docs\estabilizacion\bloque-1\inventario-carpetas.md",
    "docs\estabilizacion\bloque-1\cierre-bloque-1.md"
)

$MissingCount = 0
foreach ($File in $RequiredFiles) {
    if (-not (Test-RequiredFile $File)) {
        $MissingCount++
    }
}

Add-Line ""
Add-Line "2. ESTADO GIT"
if (Test-Path (Join-Path $ProjectRoot ".git")) {
    try {
        $Branch = (& git -C $ProjectRoot branch --show-current 2>&1 | Out-String).Trim()
        Add-Line "Rama actual: $Branch"

        $GitStatus = (& git -C $ProjectRoot status --short 2>&1 | Out-String).Trim()
        if ([string]::IsNullOrWhiteSpace($GitStatus)) {
            Add-Line "Estado: limpio"
        }
        else {
            Add-Line "Estado: existen cambios; revise que sean intencionales."
            Add-Line $GitStatus
        }

        $TrackedSecrets = (& git -C $ProjectRoot ls-files ".env" "backend/.env" "frontend/.env" 2>&1 | Out-String).Trim()
        if ([string]::IsNullOrWhiteSpace($TrackedSecrets)) {
            Add-Line "[OK] No se detectaron .env versionados."
        }
        else {
            Add-Line "[CRITICO] Se detectaron .env versionados:"
            Add-Line $TrackedSecrets
            Add-Line "Ejecute: git rm --cached backend/.env frontend/.env"
        }
    }
    catch {
        Add-Line "[ADVERTENCIA] No se pudo consultar Git: $($_.Exception.Message)"
    }
}
else {
    Add-Line "[ADVERTENCIA] No existe .git. Esto es aceptable solo en un ZIP de entrega."
}

Add-Line ""
Add-Line "3. INVENTARIO DE RUTAS"
$RoutesDir = Join-Path $ProjectRoot "backend\src\routes"
if (Test-Path $RoutesDir) {
    $RouteFiles = Get-ChildItem $RoutesDir -Filter "*.js" -File
    $OperationCount = 0
    foreach ($RouteFile in $RouteFiles) {
        $Content = Get-Content $RouteFile.FullName -Raw
        $Matches = [regex]::Matches(
            $Content,
            "router\.(get|post|put|delete|patch)\s*\(",
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
        $OperationCount += $Matches.Count
    }
    Add-Line "Operaciones detectadas en routers: $OperationCount"
    if ($OperationCount -eq 69) {
        Add-Line "[OK] Coincide con ROUTES-002."
    }
    else {
        Add-Line "[REVISAR] El inventario cambio; actualice route-inventory.md y OpenAPI."
    }

    $TerritorialFiles = @(
        "departamentoRoutes.js",
        "provinciaRoutes.js",
        "distritoRoutes.js",
        "ciudadRoutes.js"
    )

    $UnprotectedGets = 0
    foreach ($Name in $TerritorialFiles) {
        $Path = Join-Path $RoutesDir $Name
        if (Test-Path $Path) {
            $GetLines = Get-Content $Path | Where-Object {
                $_ -match "router\.get\(" -and $_ -notmatch "verifyToken"
            }
            $UnprotectedGets += @($GetLines).Count
        }
    }
    Add-Line "GET territoriales aun publicos: $UnprotectedGets"
    if ($UnprotectedGets -gt 0) {
        Add-Line "[BRECHA] Deben corregirse en el siguiente bloque."
    }
}
else {
    Add-Line "[FALTA] backend\src\routes"
}

Add-Line ""
Add-Line "4. CARPETAS GENERADAS O DUPLICADAS"
$GeneratedPaths = @(
    "frontend\dist",
    "frontend\.vite"
)
$DuplicatePaths = @(
    "phase0-backups",
    "backup-documentacion-sdd-20260714-195931",
    "CIERRE_FASES_0_A_3_SDD"
)

foreach ($RelativePath in $GeneratedPaths + $DuplicatePaths) {
    $FullPath = Join-Path $ProjectRoot $RelativePath
    if (Test-Path $FullPath) {
        Add-Line "[ENCONTRADA] $RelativePath"
    }
    else {
        Add-Line "[OK] No presente: $RelativePath"
    }
}

if ($ApplyCleanup) {
    Add-Line ""
    Add-Line "5. LIMPIEZA APLICADA"

    foreach ($RelativePath in $GeneratedPaths) {
        $FullPath = Join-Path $ProjectRoot $RelativePath
        if (Test-Path $FullPath) {
            Remove-Item -Recurse -Force $FullPath
            Add-Line "[ELIMINADO REGENERABLE] $RelativePath"
        }
    }

    $ExternalBackupRoot = Join-Path (Split-Path -Parent $ProjectRoot) "PERU_APP_LOCAL_BACKUPS\$Timestamp"
    New-Item -ItemType Directory -Force -Path $ExternalBackupRoot | Out-Null

    foreach ($RelativePath in $DuplicatePaths) {
        $FullPath = Join-Path $ProjectRoot $RelativePath
        if (Test-Path $FullPath) {
            $Destination = Join-Path $ExternalBackupRoot (Split-Path -Leaf $FullPath)
            Move-Item -Force $FullPath $Destination
            Add-Line "[MOVIDO, NO ELIMINADO] $RelativePath -> $Destination"
        }
    }

    Add-Line "No se modificaron .git, .env, node_modules, backend\uploads ni la base de datos."
}
else {
    Add-Line ""
    Add-Line "5. LIMPIEZA NO APLICADA"
    Add-Line "Para mover respaldos duplicados y borrar solo caches/builds:"
    Add-Line ".\scripts\block1-repository-audit.ps1 -ApplyCleanup"
}

Add-Line ""
Add-Line "6. DICTAMEN"
if ($MissingCount -eq 0) {
    Add-Line "[OK] Artefactos documentales del Bloque 1 completos."
}
else {
    Add-Line "[FALTA] Hay $MissingCount artefactos requeridos ausentes."
}
Add-Line "El proyecto aun no esta listo para despliegue."
Add-Line "Siguiente bloque: autenticacion, sesion, rutas y seguridad HTTP esencial."

$Lines | Set-Content -Path $ReportPath -Encoding UTF8
Write-Host ""
Write-Host "Reporte guardado en:"
Write-Host $ReportPath
