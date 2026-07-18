param(
    [switch]$Apply
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$EvidenceDir = Join-Path $ProjectRoot "docs\estabilizacion\evidencias\bloque-10\$Timestamp"
New-Item -ItemType Directory -Force -Path $EvidenceDir | Out-Null
$Report = Join-Path $EvidenceDir "precloud-readiness.md"
$Lines = New-Object System.Collections.Generic.List[string]
$Failures = 0
$Warnings = 0

function Add-Line([string]$Text) {
    $Lines.Add($Text)
    Write-Host $Text
}

function Check-Ok([bool]$Condition, [string]$OkText, [string]$FailText) {
    if ($Condition) {
        Add-Line "[OK] $OkText"
    } else {
        Add-Line "[FAIL] $FailText"
        $script:Failures++
    }
}

Add-Line "BLOQUE 10 - PREPARACION PRE-CLOUDINARY"
Add-Line "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Add-Line ""

# 1. Public npm registry
$LockFiles = @(
    (Join-Path $ProjectRoot "backend\package-lock.json"),
    (Join-Path $ProjectRoot "frontend\package-lock.json")
)
$PrivateRegistry = $false
foreach ($Lock in $LockFiles) {
    if ((Get-Content $Lock -Raw) -match "applied-caas|internal\.api\.openai") {
        $PrivateRegistry = $true
    }
}
Check-Ok (-not $PrivateRegistry) "Los package-lock usan registros publicos." "Se encontro un registro npm privado en package-lock."

# 2. Optimized media and obsolete PNG files
$Optimized = @(
    "frontend\src\assets\ImagenHome\Arequipa.webp",
    "frontend\src\assets\ImagenHome\Ayacucho.webp",
    "frontend\src\assets\ImagenHome\Cusco.webp",
    "frontend\src\assets\ImagenHome\Lima.webp",
    "frontend\src\assets\ImagenHome\Pasco.webp",
    "frontend\src\assets\ImagenLogin\loginImage.webp",
    "frontend\src\assets\ImagenLogin\overlayVideo.mp4"
)
foreach ($Relative in $Optimized) {
    Check-Ok (Test-Path (Join-Path $ProjectRoot $Relative)) "Existe $Relative" "Falta $Relative"
}

$OldPng = @(
    "frontend\src\assets\ImagenHome\Arequipa.png",
    "frontend\src\assets\ImagenHome\Ayacucho.png",
    "frontend\src\assets\ImagenHome\Cusco.png",
    "frontend\src\assets\ImagenHome\Lima.png",
    "frontend\src\assets\ImagenHome\Pasco.png",
    "frontend\src\assets\ImagenLogin\loginImage.png"
)
$ExistingOld = @($OldPng | Where-Object { Test-Path (Join-Path $ProjectRoot $_) })
if ($ExistingOld.Count -gt 0) {
    Add-Line "[WARN] Permanecen $($ExistingOld.Count) PNG antiguos y pesados."
    $Warnings++
    if ($Apply) {
        $BackupRoot = Join-Path (Split-Path $ProjectRoot -Parent) "PERU_APP_MEDIA_ANTIGUA_$Timestamp"
        New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
        foreach ($Relative in $ExistingOld) {
            $Source = Join-Path $ProjectRoot $Relative
            $Destination = Join-Path $BackupRoot $Relative
            New-Item -ItemType Directory -Force -Path (Split-Path $Destination -Parent) | Out-Null
            Move-Item -Force $Source $Destination
            Add-Line "[MOVED] $Relative"
        }
        Add-Line "[OK] Respaldo externo: $BackupRoot"
    }
} else {
    Add-Line "[OK] No quedan PNG antiguos."
}

# 3. Temporary root file
$TempReadme = Join-Path $ProjectRoot "LEEME_CORRECCION_REGISTRY.md"
if (Test-Path $TempReadme) {
    Add-Line "[WARN] LEEME_CORRECCION_REGISTRY.md sigue en la raiz."
    $Warnings++
    if ($Apply) {
        Remove-Item -Force $TempReadme
        Add-Line "[REMOVED] LEEME_CORRECCION_REGISTRY.md"
    }
} else {
    Add-Line "[OK] No hay archivo temporal de correccion en la raiz."
}

# 4. Secrets must not be tracked
$Tracked = & git -C $ProjectRoot ls-files -- "backend/.env" "frontend/.env" "tests/qa-credentials.local.ps1" 2>$null
Check-Ok ([string]::IsNullOrWhiteSpace(($Tracked -join ""))) "Los secretos locales no estan versionados." "Hay secretos locales versionados: $($Tracked -join ', ')"

# 5. Block 9 evidence
$Block9 = Get-ChildItem (Join-Path $ProjectRoot "docs\estabilizacion\evidencias\bloque-9") -Recurse -Filter "dependency-security-summary.md" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Check-Ok ($null -ne $Block9) "Existe evidencia del Bloque 9." "Falta evidencia final del Bloque 9."
if ($Block9) {
    $Summary = Get-Content $Block9.FullName -Raw
    Check-Ok ($Summary -match "Backend produccion: 0 vulnerabilidades") "Backend de produccion: 0 vulnerabilidades." "La evidencia no confirma 0 vulnerabilidades backend."
    Check-Ok ($Summary -match "Frontend produccion: 0 vulnerabilidades") "Frontend de produccion: 0 vulnerabilidades." "La evidencia no confirma 0 vulnerabilidades frontend."
}

# 6. Branch and git state
$Branch = (& git -C $ProjectRoot branch --show-current 2>$null).Trim()
Add-Line "[INFO] Rama actual: $Branch"
$Status = & git -C $ProjectRoot status --short 2>$null
if ($Status.Count -gt 0) {
    Add-Line "[WARN] Hay cambios pendientes de commit: $($Status.Count) entradas."
    $Warnings++
} else {
    Add-Line "[OK] Arbol Git limpio."
}

$Markdown = @()
$Markdown += "# Preparacion pre-Cloudinary"
$Markdown += ""
$Markdown += "- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$Markdown += "- Rama: $Branch"
$Markdown += "- Fallos: $Failures"
$Markdown += "- Advertencias: $Warnings"
$Markdown += ""
$Markdown += "## Resultado"
$Markdown += ""
$Markdown += if ($Failures -eq 0) { "APROBADO para iniciar integracion Cloudinary." } else { "NO APROBADO. Corregir los fallos antes de continuar." }
$Markdown += ""
$Markdown += "## Salida"
$Markdown += ""
$Markdown += '```text'
$Markdown += $Lines
$Markdown += '```'
$Markdown | Set-Content -Path $Report -Encoding UTF8

Add-Line ""
Add-Line "Evidencia: $Report"
if ($Failures -gt 0) { exit 1 }
exit 0
