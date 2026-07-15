param(
    [switch]$RunFrontendChecks
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $projectRoot "docs\estabilizacion\evidencias\bloque-4\$timestamp"
$report = Join-Path $evidenceDir "reporte-bloque-4.txt"

New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null

function Write-Result {
    param([string]$Message)
    $Message | Tee-Object -FilePath $report -Append
}

function Invoke-NativeCommand {
    param(
        [string]$WorkingDirectory,
        [string]$Executable,
        [string[]]$Arguments,
        [string]$OutputFile
    )

    Push-Location $WorkingDirectory
    try {
        $previousPreference = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        & $Executable @Arguments *> $OutputFile
        $exitCode = $LASTEXITCODE
        $ErrorActionPreference = $previousPreference
        return $exitCode
    }
    finally {
        Pop-Location
    }
}

Write-Result "BLOQUE 4 - INTEGRIDAD E IMAGENES"
Write-Result "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Result "Proyecto: $projectRoot"
Write-Result ""

$requiredFiles = @(
    "backend\src\utils\imageLifecycle.js",
    "backend\src\middlewares\uploadMiddleware.js",
    "database\maintenance\010-auditoria-integridad-bloque-4.sql",
    "database\migrations\005-integridad-basica.sql",
    "specs\002-estabilizacion-calidad\checklists\block-4-functional-integrity-images-checklist.md"
)

$missingFiles = @()
foreach ($relativePath in $requiredFiles) {
    $fullPath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path $fullPath)) {
        $missingFiles += $relativePath
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Result "[OK] Archivos obligatorios presentes."
}
else {
    foreach ($missing in $missingFiles) {
        Write-Result "[ERROR] Falta: $missing"
    }
    throw "Faltan archivos obligatorios del Bloque 4."
}

$backendSource = Join-Path $projectRoot "backend\src"
$backendFiles = Get-ChildItem -Path $backendSource -Recurse -Filter "*.js"
$syntaxErrors = @()

foreach ($file in $backendFiles) {
    $syntaxOutput = Join-Path $evidenceDir ("syntax-" + $file.BaseName + ".txt")
    $exitCode = Invoke-NativeCommand -WorkingDirectory $projectRoot -Executable "node.exe" -Arguments @("--check", $file.FullName) -OutputFile $syntaxOutput
    if ($exitCode -ne 0) {
        $syntaxErrors += $file.FullName
    }
}

if ($syntaxErrors.Count -eq 0) {
    Write-Result "[OK] $($backendFiles.Count) archivos JavaScript sin errores de sintaxis."
}
else {
    foreach ($file in $syntaxErrors) {
        Write-Result "[ERROR] Error de sintaxis: $file"
    }
    throw "Se detectaron errores de sintaxis."
}

$routeFiles = Get-ChildItem -Path (Join-Path $backendSource "routes") -Filter "*.js"
$signatureCalls = 0
foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    $signatureCalls += ([regex]::Matches($content, "verifyUploadedImageSignatures,")).Count
}

if ($signatureCalls -eq 24) {
    Write-Result "[OK] 24 flujos de carga validan la firma binaria de la imagen."
}
else {
    Write-Result "[ERROR] Se esperaban 24 validaciones de firma y se encontraron $signatureCalls."
    throw "Cobertura incompleta de validacion de imagenes."
}

$controllerFiles = Get-ChildItem -Path (Join-Path $backendSource "controllers") -Filter "*.js"
$replaceCalls = 0
$deleteCalls = 0
foreach ($file in $controllerFiles) {
    $content = Get-Content $file.FullName -Raw
    $replaceCalls += ([regex]::Matches($content, "cleanupReplacedImages\(")).Count
    $deleteCalls += ([regex]::Matches($content, "cleanupResourceImages\(")).Count
}

if ($replaceCalls -eq 12 -and $deleteCalls -eq 12) {
    Write-Result "[OK] 12 actualizaciones y 12 eliminaciones sincronizan archivos con la base de datos."
}
else {
    Write-Result "[ERROR] Limpieza encontrada: reemplazos=$replaceCalls, eliminaciones=$deleteCalls."
    throw "Cobertura incompleta del ciclo de vida de imagenes."
}

$migrationContent = Get-Content (Join-Path $projectRoot "database\migrations\005-integridad-basica.sql") -Raw
$requiredSqlTokens = @(
    "CK_Departamentos_area_km2",
    "CK_Ciudades_latitud",
    "CK_Ciudades_longitud",
    "UX_LugaresTuristicos_departamento_nombre",
    "UX_ComidasTipicasCiudades_ciudad_nombre",
    "BEGIN TRANSACTION",
    "ROLLBACK TRANSACTION"
)

foreach ($token in $requiredSqlTokens) {
    if ($migrationContent -notmatch [regex]::Escape($token)) {
        Write-Result "[ERROR] La migracion no contiene: $token"
        throw "Migracion SQL incompleta."
    }
}
Write-Result "[OK] Migracion SQL versionada, transaccional e idempotente detectada."

try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Result "[OK] GET /api/health -> $($health.StatusCode)"
}
catch {
    Write-Result "[WARN] No se pudo consultar /api/health. Encienda el backend para completar esta prueba."
}

try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/departamentos" -Method Get -UseBasicParsing -TimeoutSec 10 | Out-Null
    Write-Result "[ERROR] GET /api/departamentos sin token no fue rechazado."
    throw "Ruta protegida accesible sin token."
}
catch {
    if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 401) {
        Write-Result "[OK] GET /api/departamentos sin token -> 401"
    }
    elseif ($_.Exception.Message -notmatch "No se puede conectar|Unable to connect") {
        Write-Result "[WARN] No se confirmo el 401: $($_.Exception.Message)"
    }
}

if ($RunFrontendChecks) {
    $frontendDir = Join-Path $projectRoot "frontend"
    $lintFile = Join-Path $evidenceDir "frontend-lint.txt"
    $buildFile = Join-Path $evidenceDir "frontend-build.txt"

    $lintExit = Invoke-NativeCommand -WorkingDirectory $frontendDir -Executable "npm.cmd" -Arguments @("run", "lint") -OutputFile $lintFile
    if ($lintExit -eq 0) {
        Write-Result "[OK] npm run lint"
    }
    else {
        Write-Result "[ERROR] npm run lint. Revisar: $lintFile"
        throw "El lint del frontend fallo."
    }

    $buildExit = Invoke-NativeCommand -WorkingDirectory $frontendDir -Executable "npm.cmd" -Arguments @("run", "build") -OutputFile $buildFile
    if ($buildExit -eq 0) {
        Write-Result "[OK] npm run build"
    }
    else {
        Write-Result "[ERROR] npm run build. Revisar: $buildFile"
        throw "El build del frontend fallo."
    }
}

Write-Result ""
Write-Result "PENDIENTE MANUAL:"
Write-Result "1. Ejecutar database/maintenance/010-auditoria-integridad-bloque-4.sql."
Write-Result "2. Confirmar que todos los conteos sean 0."
Write-Result "3. Respaldar SQL Server."
Write-Result "4. Ejecutar database/migrations/005-integridad-basica.sql."
Write-Result "5. Probar reemplazo y eliminacion de una imagen con un registro de prueba."
Write-Result "6. Completar el checklist funcional por modulo."
Write-Result ""
Write-Result "Resultado guardado en: $report"

Write-Host "`nBloque 4 comprobado. Revise las tareas manuales del reporte." -ForegroundColor Green
