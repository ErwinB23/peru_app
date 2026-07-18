param(
    [switch]$Install,
    [switch]$CheckConnection,
    [switch]$RunTests,
    [switch]$DryRunMigration,
    [switch]$OpenReport
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$evidence = Join-Path $root "docs\estabilizacion\evidencias\bloque-11\$stamp"
New-Item -ItemType Directory -Force -Path $evidence | Out-Null

function Run-Process {
    param(
        [string]$Label,
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$OutputFile
    )

    Write-Host "[RUN] $Label" -ForegroundColor Cyan
    $stdout = "$OutputFile.stdout.txt"
    $stderr = "$OutputFile.stderr.txt"
    $process = Start-Process -FilePath $FilePath -ArgumentList $Arguments `
        -WorkingDirectory $WorkingDirectory -NoNewWindow -Wait -PassThru `
        -RedirectStandardOutput $stdout -RedirectStandardError $stderr

    Get-Content $stdout -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }
    Get-Content $stderr -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }

    if ($process.ExitCode -ne 0) {
        throw "$Label termino con codigo $($process.ExitCode)"
    }

    Write-Host "[OK] $Label" -ForegroundColor Green
}

Write-Host 'BLOQUE 11 - CLOUDINARY' -ForegroundColor Yellow
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

$requiredFiles = @(
    'backend\src\services\cloudinaryService.js',
    'backend\src\utils\uploadedFile.js',
    'backend\scripts\checkCloudinary.js',
    'backend\scripts\migrateLocalImagesToCloudinary.js',
    'backend\.env.example'
)

foreach ($relative in $requiredFiles) {
    $full = Join-Path $root $relative
    if (-not (Test-Path $full)) {
        throw "Falta archivo requerido: $relative"
    }
}
Write-Host '[OK] Archivos Cloudinary presentes' -ForegroundColor Green

$routeFiles = Get-ChildItem (Join-Path $backend 'src\routes') -Filter '*Routes.js'
$uploadRoutes = @($routeFiles | Where-Object {
    (Get-Content $_.FullName -Raw) -match 'verifyUploadedImageSignatures'
})
$persistRoutes = @($routeFiles | Where-Object {
    (Get-Content $_.FullName -Raw) -match 'persistUploadedImages'
})

if ($uploadRoutes.Count -ne 12 -or $persistRoutes.Count -ne 12) {
    throw "Rutas de imagen incompletas. verify=$($uploadRoutes.Count), persist=$($persistRoutes.Count)"
}
Write-Host '[OK] 12 rutas de imagen usan persistencia remota/local' -ForegroundColor Green

if ($Install) {
    Run-Process -Label 'Instalacion SDK Cloudinary' -WorkingDirectory $backend `
        -FilePath 'npm.cmd' `
        -Arguments @('install','cloudinary@2.10.0','--save','--registry=https://registry.npmjs.org/','--no-audit','--no-fund') `
        -OutputFile (Join-Path $evidence 'npm-install-cloudinary')
}

$packageJson = Get-Content (Join-Path $backend 'package.json') -Raw | ConvertFrom-Json
if (-not $packageJson.dependencies.cloudinary) {
    throw 'Cloudinary no esta instalado. Ejecute el script con -Install.'
}
Write-Host "[OK] cloudinary $($packageJson.dependencies.cloudinary) registrado" -ForegroundColor Green

if ($CheckConnection) {
    Run-Process -Label 'Conexion Cloudinary' -WorkingDirectory $backend `
        -FilePath 'npm.cmd' -Arguments @('run','cloudinary:check') `
        -OutputFile (Join-Path $evidence 'cloudinary-check')
}

if ($DryRunMigration) {
    Run-Process -Label 'Simulacion migracion de imagenes' -WorkingDirectory $backend `
        -FilePath 'npm.cmd' -Arguments @('run','cloudinary:migrate:dry') `
        -OutputFile (Join-Path $evidence 'cloudinary-migration-dry-run')
}

if ($RunTests) {
    Run-Process -Label 'Auditoria de produccion backend' -WorkingDirectory $backend `
        -FilePath 'npm.cmd' -Arguments @('audit','--omit=dev','--audit-level=high') `
        -OutputFile (Join-Path $evidence 'backend-audit-production')

    Run-Process -Label 'Jest y Supertest' -WorkingDirectory $backend `
        -FilePath 'npm.cmd' -Arguments @('run','test:coverage') `
        -OutputFile (Join-Path $evidence 'backend-tests')
}

$summary = @"
# Bloque 11 - Cloudinary

- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Rutas de carga verificadas: $($persistRoutes.Count)
- SDK registrado: $($packageJson.dependencies.cloudinary)
- Instalacion solicitada: $Install
- Conexion comprobada: $CheckConnection
- Dry run de migracion: $DryRunMigration
- Pruebas ejecutadas: $RunTests
- Estado SDD: implementado; pendiente de migracion real y validacion en Render.
"@
$summaryPath = Join-Path $evidence 'cloudinary-summary.md'
Set-Content -Path $summaryPath -Value $summary -Encoding UTF8
Write-Host "[OK] Evidencia: $summaryPath" -ForegroundColor Green

if ($OpenReport) {
    Start-Process $summaryPath
}
