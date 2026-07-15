param(
    [string]$ApiBaseUrl = "http://localhost:5000/api"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $root "docs\estabilizacion\evidencias\bloque-2\$timestamp"
New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
$report = Join-Path $evidenceDir "resultado-bloque-2.txt"

function Write-Result {
    param([string]$Text)
    $Text | Tee-Object -FilePath $report -Append
}

Write-Result "AUDITORÍA BLOQUE 2"
Write-Result "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Result "API: $ApiBaseUrl"
Write-Result ""

$requiredFiles = @(
    "backend\src\app.js",
    "backend\src\server.js",
    "backend\src\middlewares\authMiddleware.js",
    "backend\src\middlewares\authRateLimiter.js",
    "backend\src\middlewares\errorMiddleware.js",
    "frontend\src\context\AuthContext.jsx",
    "frontend\src\services\api.js"
)

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $root $file
    if (Test-Path $fullPath) {
        Write-Result "[OK] $file"
    } else {
        Write-Result "[FALTA] $file"
    }
}

Write-Result ""
Write-Result "Comprobando endpoints públicos/técnicos..."

try {
    $health = Invoke-WebRequest -Uri "$ApiBaseUrl/health" -Method GET -UseBasicParsing
    Write-Result "[OK] GET /health -> $($health.StatusCode)"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Result "[ERROR] GET /health -> $status $($_.Exception.Message)"
}

try {
    Invoke-WebRequest -Uri "$ApiBaseUrl/departamentos" -Method GET -UseBasicParsing | Out-Null
    Write-Result "[ERROR] GET /departamentos sin token no fue rechazado"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status -eq 401) {
        Write-Result "[OK] GET /departamentos sin token -> 401"
    } else {
        Write-Result "[ERROR] GET /departamentos sin token -> $status"
    }
}

foreach ($debugPath in @("test-db", "debug-token")) {
    try {
        Invoke-WebRequest -Uri "$ApiBaseUrl/$debugPath" -Method GET -UseBasicParsing | Out-Null
        Write-Result "[ERROR] /$debugPath todavía existe"
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 404) {
            Write-Result "[OK] /$debugPath -> 404"
        } else {
            Write-Result "[REVISAR] /$debugPath -> $status"
        }
    }
}

Write-Result ""
Write-Result "Evidencia guardada en: $evidenceDir"
Write-Host "`nResultado guardado en:`n$report" -ForegroundColor Green
