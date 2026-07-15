[CmdletBinding()]
param(
    [string]$ProjectRoot = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'
$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceRoot = Join-Path $PackageRoot 'archivos'
$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BackupRoot = Join-Path $ProjectRoot "backup-documentacion-sdd-$Stamp"

$files = @(
    'README.md',
    'specs\002-estabilizacion-calidad\tasks.md',
    'specs\002-estabilizacion-calidad\checklists\requirements-checklist.md',
    'specs\002-estabilizacion-calidad\checklists\phase-2-configuracion-checklist.md',
    'specs\002-estabilizacion-calidad\checklists\phase-3-estable-checklist.md',
    'docs\estabilizacion\fase-0-linea-base.md'
)

foreach ($relative in $files) {
    $source = Join-Path $SourceRoot $relative
    $destination = Join-Path $ProjectRoot $relative

    if (-not (Test-Path $source)) {
        throw "No se encontró el archivo del paquete: $source"
    }

    if (Test-Path $destination) {
        $backup = Join-Path $BackupRoot $relative
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
        Copy-Item $destination $backup -Force
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item $source $destination -Force
    Write-Host "Actualizado: $relative" -ForegroundColor Green
}

Write-Host ""
Write-Host "Documentación aplicada correctamente." -ForegroundColor Cyan
Write-Host "Respaldo anterior: $BackupRoot"
Write-Host "Revisa ahora: git status --short"
