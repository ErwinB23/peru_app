param(
    [switch]$Apply,
    [switch]$KeepGeneratedReports
)

$ErrorActionPreference = 'Stop'

function Write-Step([string]$Message) {
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Warn([string]$Message) {
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$required = @('backend', 'frontend', 'specs', 'docs', 'database')
foreach ($item in $required) {
    if (-not (Test-Path (Join-Path $projectRoot $item))) {
        throw "No se encontro '$item'. Ejecute el script desde la copia ubicada en scripts dentro de la raiz del proyecto."
    }
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$parent = Split-Path $projectRoot -Parent
$archive = Join-Path $parent "PERU_APP_ARCHIVO_AUXILIAR_$timestamp"

$exactItems = @(
    'phase0-backups',
    'CIERRE_FASES_0_A_3_SDD'
)

$wildcardItems = @(
    'backup-documentacion-sdd-*',
    'LEEME_BLOQUE_*.md',
    'ARCHIVOS_INCLUIDOS*.txt',
    'MANIFEST*.txt',
    'MANIFIESTO*.txt',
    'VALIDACION_BLOQUE_*.txt',
    'VALIDACION_INTERNA_BLOQUE_*.txt'
)

$generatedDirs = @(
    'frontend\dist',
    'frontend\.vite',
    'backend\reports',
    'frontend\reports'
)

$itemsToArchive = New-Object System.Collections.Generic.List[System.IO.FileSystemInfo]
foreach ($relative in $exactItems) {
    $path = Join-Path $projectRoot $relative
    if (Test-Path $path) {
        $itemsToArchive.Add((Get-Item $path))
    }
}
foreach ($pattern in $wildcardItems) {
    Get-ChildItem -Path $projectRoot -Filter $pattern -Force -ErrorAction SilentlyContinue |
        ForEach-Object { $itemsToArchive.Add($_) }
}
$itemsToArchive = $itemsToArchive | Sort-Object FullName -Unique

Write-Host "LIMPIEZA DE ESTRUCTURA FINAL - PERU APP" -ForegroundColor White
Write-Host "Raiz: $projectRoot"
Write-Host "Modo: $(if ($Apply) { 'APLICAR' } else { 'SOLO AUDITORIA' })"

Write-Step "Elementos auxiliares encontrados: $($itemsToArchive.Count)"
foreach ($item in $itemsToArchive) {
    Write-Host "  - $($item.Name)"
}

Write-Step 'Directorios generados detectados:'
foreach ($relative in $generatedDirs) {
    $path = Join-Path $projectRoot $relative
    if (Test-Path $path) {
        Write-Host "  - $relative"
    }
}

if (-not $Apply) {
    Write-Warn 'No se realizo ningun cambio. Vuelva a ejecutar con -Apply para aplicar la limpieza.'
    Write-Host ".\scripts\limpieza-estructura-final.ps1 -Apply"
    exit 0
}

New-Item -ItemType Directory -Force -Path $archive | Out-Null

# Preservar los reportes finales relevantes antes de retirar reportes generados.
$evidenceDir = Join-Path $projectRoot 'docs\evidencias\pruebas-finales'
New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

$reportCopies = @(
    @{ Source = 'backend\reports\newman\peru-app-api.html'; Target = 'newman-peru-app-api.html' },
    @{ Source = 'frontend\reports\playwright\html\index.html'; Target = 'playwright-report.html' },
    @{ Source = 'frontend\reports\playwright\junit.xml'; Target = 'playwright-junit.xml' },
    @{ Source = 'backend\reports\jest\coverage\coverage-summary.json'; Target = 'jest-coverage-summary.json' },
    @{ Source = 'backend\reports\jest\results.json'; Target = 'jest-results.json' }
)
foreach ($entry in $reportCopies) {
    $source = Join-Path $projectRoot $entry.Source
    if (Test-Path $source) {
        Copy-Item -Force $source (Join-Path $evidenceDir $entry.Target)
        Write-Ok "Evidencia preservada: $($entry.Target)"
    }
}

foreach ($item in $itemsToArchive) {
    $target = Join-Path $archive $item.Name
    if (Test-Path $target) {
        $target = Join-Path $archive ("{0}-{1}" -f $timestamp, $item.Name)
    }
    Move-Item -Force $item.FullName $target
    Write-Ok "Archivado fuera del proyecto: $($item.Name)"
}

if (-not $KeepGeneratedReports) {
    foreach ($relative in $generatedDirs) {
        $path = Join-Path $projectRoot $relative
        if (Test-Path $path) {
            Remove-Item -Recurse -Force $path
            Write-Ok "Eliminado artefacto regenerable: $relative"
        }
    }
}

$summary = @"
# Resultado de limpieza de estructura

- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Proyecto: $projectRoot
- Archivo externo: $archive
- Elementos auxiliares archivados: $($itemsToArchive.Count)
- Reportes finales preservados en: docs/evidencias/pruebas-finales
- .git: conservado
- .env: conservados localmente y excluidos por .gitignore
- backend/uploads: conservado para la futura migracion a Cloudinary
- node_modules: no modificado

## Siguiente control

Ejecutar:

``````powershell
git status
git add -A
git commit -m "chore(repo): depurar estructura antes del despliegue"
git push
``````
"@
$summaryPath = Join-Path $evidenceDir 'limpieza-estructura-final.md'
Set-Content -Path $summaryPath -Value $summary -Encoding UTF8

Write-Host ''
Write-Ok "Limpieza aplicada. Respaldo externo: $archive"
Write-Ok "Resumen: $summaryPath"
Write-Warn 'Revise git status antes de confirmar los cambios.'
