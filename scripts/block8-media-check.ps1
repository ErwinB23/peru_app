param(
    [switch]$Apply,
    [switch]$RunBuild,
    [switch]$OpenReport
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$frontendRoot = Join-Path $projectRoot "frontend"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $projectRoot "docs\estabilizacion\evidencias\bloque-8\$timestamp"
New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

$oldFiles = @(
    "frontend\src\assets\ImagenHome\Arequipa.png",
    "frontend\src\assets\ImagenHome\Ayacucho.png",
    "frontend\src\assets\ImagenHome\Cusco.png",
    "frontend\src\assets\ImagenHome\Lima.png",
    "frontend\src\assets\ImagenHome\Pasco.png",
    "frontend\src\assets\ImagenLogin\loginImage.png"
)

$newFiles = @(
    "frontend\src\assets\ImagenHome\Arequipa.webp",
    "frontend\src\assets\ImagenHome\Ayacucho.webp",
    "frontend\src\assets\ImagenHome\Cusco.webp",
    "frontend\src\assets\ImagenHome\Lima.webp",
    "frontend\src\assets\ImagenHome\Pasco.webp",
    "frontend\src\assets\ImagenLogin\loginImage.webp",
    "frontend\src\assets\ImagenLogin\overlayVideo.mp4"
)

Write-Host "BLOQUE 8 - OPTIMIZACION MULTIMEDIA" -ForegroundColor Cyan
Write-Host "Proyecto: $projectRoot"

$missing = @()
foreach ($relative in $newFiles) {
    $full = Join-Path $projectRoot $relative
    if (-not (Test-Path $full)) {
        $missing += $relative
    }
}
if ($missing.Count -gt 0) {
    throw "Faltan archivos optimizados: $($missing -join ', ')"
}

$homeSource = Get-Content (Join-Path $frontendRoot "src\pages\Home.jsx") -Raw
$authCss = Get-Content (Join-Path $frontendRoot "src\styles\AuthPage.css") -Raw
if ($homeSource -match "ImagenHome/.+\.png") {
    throw "Home.jsx todavia contiene importaciones PNG del carrusel."
}
if ($authCss -match "ImagenLogin/loginImage\.png") {
    throw "AuthPage.css todavia referencia loginImage.png."
}
Write-Host "[OK] Referencias WebP activas" -ForegroundColor Green

if ($Apply) {
    $backupRoot = Join-Path (Split-Path -Parent $projectRoot) "PERU_APP_MEDIA_BACKUP_$timestamp"
    foreach ($relative in $oldFiles) {
        $source = Join-Path $projectRoot $relative
        if (Test-Path $source) {
            $destination = Join-Path $backupRoot $relative
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
            Move-Item -LiteralPath $source -Destination $destination -Force
            Write-Host "[MOVE] $relative" -ForegroundColor Yellow
        }
    }
    Write-Host "[OK] PNG antiguos movidos a: $backupRoot" -ForegroundColor Green
}

$rows = foreach ($relative in $newFiles) {
    $file = Get-Item (Join-Path $projectRoot $relative)
    [PSCustomObject]@{
        Archivo = $relative
        Bytes = $file.Length
        MB = [math]::Round($file.Length / 1MB, 3)
    }
}
$totalBytes = ($rows | Measure-Object -Property Bytes -Sum).Sum
$rows | Export-Csv -NoTypeInformation -Encoding UTF8 (Join-Path $evidenceDir "media-files.csv")

$video = Get-Item (Join-Path $projectRoot "frontend\src\assets\ImagenLogin\overlayVideo.mp4")
if ($video.Length -gt 3MB) {
    throw "El video optimizado supera 3 MB."
}

$buildStatus = "NO EJECUTADO"
if ($RunBuild) {
    $stdout = Join-Path $evidenceDir "frontend-build.stdout.txt"
    $stderr = Join-Path $evidenceDir "frontend-build.stderr.txt"
    Write-Host "[RUN] npm run build" -ForegroundColor Cyan
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/d", "/s", "/c", "npm run build" -WorkingDirectory $frontendRoot -RedirectStandardOutput $stdout -RedirectStandardError $stderr -NoNewWindow -PassThru -Wait
    if (Test-Path $stdout) { Get-Content $stdout }
    if (Test-Path $stderr) { Get-Content $stderr }
    if ($process.ExitCode -ne 0) {
        throw "npm run build termino con codigo $($process.ExitCode)."
    }
    $buildStatus = "OK"
    Write-Host "[OK] Build frontend" -ForegroundColor Green
}

$oldRemaining = @($oldFiles | Where-Object { Test-Path (Join-Path $projectRoot $_) })
$summary = @"
# Evidencia Bloque 8 - Optimizacion multimedia

- Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- Archivos optimizados: $($rows.Count)
- Peso optimizado total: $([math]::Round($totalBytes / 1MB, 2)) MB
- Video optimizado: $([math]::Round($video.Length / 1MB, 2)) MB
- PNG antiguos restantes: $($oldRemaining.Count)
- Build frontend: $buildStatus

## Estado

$(if ($oldRemaining.Count -eq 0) { "APROBADO: los PNG sustituidos ya no permanecen en el proyecto." } else { "PENDIENTE: ejecutar el script con -Apply para retirar los PNG antiguos." })
"@
$report = Join-Path $evidenceDir "media-optimization-summary.md"
Set-Content -Path $report -Value $summary -Encoding UTF8
Write-Host "[OK] Evidencia: $report" -ForegroundColor Green

if ($OpenReport) {
    Start-Process $report
}
