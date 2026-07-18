$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$badHost = "packages.applied-caas-gateway1.internal.api.openai.org"
$files = @(
    Join-Path $root "backend\package-lock.json",
    Join-Path $root "frontend\package-lock.json"
)
foreach ($file in $files) {
    if (-not (Test-Path $file)) { throw "No existe: $file" }
    $content = Get-Content $file -Raw
    if ($content -match [regex]::Escape($badHost)) {
        throw "[ERROR] El lockfile aun contiene el registro interno: $file"
    }
    if ($content -notmatch "https://registry\.npmjs\.org") {
        throw "[ERROR] No se encontro el registro publico en: $file"
    }
    Write-Host "[OK] Registro publico: $file" -ForegroundColor Green
}
Write-Host "[OK] Ambos package-lock.json usan registry.npmjs.org" -ForegroundColor Green
