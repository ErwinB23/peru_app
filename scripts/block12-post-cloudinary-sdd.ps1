param(
    [switch]$RunQualityChecks,
    [switch]$OpenReports
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$EvidenceDir = Join-Path $Root "docs\estabilizacion\evidencias\bloque-12\$Timestamp"
New-Item -ItemType Directory -Force -Path $EvidenceDir | Out-Null

$Results = New-Object System.Collections.Generic.List[string]
$Failed = $false
$ExpectedSuites = 15
$ExpectedTests = 388

function Add-Result {
    param([string]$Text)
    $Results.Add($Text)
    Write-Host $Text
}

function Check {
    param([bool]$Condition, [string]$Ok, [string]$Fail)
    if ($Condition) {
        Add-Result "[OK] $Ok"
    }
    else {
        Add-Result "[ERROR] $Fail"
        $script:Failed = $true
    }
}

function Invoke-Native {
    param(
        [string]$Executable,
        [string[]]$CommandArguments,
        [string]$WorkingDirectory,
        [string]$Label,
        [string]$OutputName
    )

    $LogPath = Join-Path $EvidenceDir "$OutputName.log.txt"
    $StdOutPath = Join-Path $EvidenceDir "$OutputName.stdout.tmp"
    $StdErrPath = Join-Path $EvidenceDir "$OutputName.stderr.tmp"

    Add-Result "[RUN] $Label"

    try {
        $Process = Start-Process `
            -FilePath $Executable `
            -ArgumentList $CommandArguments `
            -WorkingDirectory $WorkingDirectory `
            -Wait `
            -PassThru `
            -NoNewWindow `
            -RedirectStandardOutput $StdOutPath `
            -RedirectStandardError $StdErrPath

        $OutputLines = @()

        if (Test-Path $StdOutPath) {
            $OutputLines += @(Get-Content $StdOutPath -Encoding UTF8)
        }

        if (Test-Path $StdErrPath) {
            $OutputLines += @(Get-Content $StdErrPath -Encoding UTF8)
        }

        if ($OutputLines.Count -gt 0) {
            $OutputLines | Set-Content -Path $LogPath -Encoding UTF8
            $OutputLines | ForEach-Object { Write-Host $_ }
        }
        else {
            "Proceso finalizado sin salida de consola." |
                Set-Content -Path $LogPath -Encoding UTF8
        }

        $ExitCode = $Process.ExitCode
    }
    catch {
        $_ | Out-String | Set-Content -Path $LogPath -Encoding UTF8
        $ExitCode = 1
    }
    finally {
        Remove-Item $StdOutPath -Force -ErrorAction SilentlyContinue
        Remove-Item $StdErrPath -Force -ErrorAction SilentlyContinue
    }

    if ($ExitCode -eq 0) {
        Add-Result "[OK] $Label"
        return $true
    }

    Add-Result "[ERROR] $Label termino con codigo $ExitCode. Revise: $LogPath"
    $script:Failed = $true
    return $false
}

function Ensure-Dependencies {
    param(
        [string]$ProjectDirectory,
        [string[]]$RequiredExecutables,
        [string]$Label,
        [string]$OutputName
    )

    $Missing = @()
    foreach ($ExecutableName in $RequiredExecutables) {
        $ExecutablePath = Join-Path $ProjectDirectory "node_modules\.bin\$ExecutableName"
        if (-not (Test-Path $ExecutablePath)) {
            $Missing += $ExecutableName
        }
    }

    if ($Missing.Count -eq 0) {
        Add-Result "[OK] $Label disponibles; no se reinstalaron dependencias"
        return $true
    }

    Add-Result "[INFO] Faltan ejecutables en ${Label}: $($Missing -join ', ')"
    Add-Result "[INFO] Se repararan dependencias con npm install; no se usara npm ci"

    $InstallOk = Invoke-Native `
        $NpmCommand.Source `
        @("install", "--no-audit", "--no-fund") `
        $ProjectDirectory `
        "Reparar dependencias de $Label con npm install" `
        $OutputName

    if (-not $InstallOk) {
        $LogPath = Join-Path $EvidenceDir "$OutputName.log.txt"
        if (Test-Path $LogPath) {
            Write-Host ""
            Write-Host "ULTIMAS LINEAS DEL ERROR DE INSTALACION:" -ForegroundColor Yellow
            Get-Content $LogPath -Tail 35 | ForEach-Object { Write-Host $_ }
            Write-Host ""
        }
        return $false
    }

    $StillMissing = @()
    foreach ($ExecutableName in $RequiredExecutables) {
        $ExecutablePath = Join-Path $ProjectDirectory "node_modules\.bin\$ExecutableName"
        if (-not (Test-Path $ExecutablePath)) {
            $StillMissing += $ExecutableName
        }
    }

    if ($StillMissing.Count -gt 0) {
        Add-Result "[ERROR] La reparacion termino, pero siguen faltando: $($StillMissing -join ', ')"
        $script:Failed = $true
        return $false
    }

    Add-Result "[OK] Dependencias de $Label reparadas"
    return $true
}

Write-Host ""
Write-Host "BLOQUE 12 - CIERRE POST-CLOUDINARY SDD" -ForegroundColor Cyan
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

$NodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
$NpmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
Check ($null -ne $NodeCommand) "Node.js disponible" "No se encontro node.exe en PATH"
Check ($null -ne $NpmCommand) "npm disponible" "No se encontro npm.cmd en PATH"

$Required = @(
    "README.md",
    ".specify\memory\constitution.md",
    "specs\001-peru-app\plan.md",
    "specs\001-peru-app\data-model.md",
    "specs\002-estabilizacion-calidad\spec.md",
    "specs\002-estabilizacion-calidad\plan.md",
    "specs\002-estabilizacion-calidad\tasks.md",
    "specs\002-estabilizacion-calidad\traceability-matrix.md",
    "specs\002-estabilizacion-calidad\implementation-summary.md",
    "specs\002-estabilizacion-calidad\final-review.md",
    "specs\002-estabilizacion-calidad\deployment-readiness.md",
    "database\maintenance\012-limpiar-datos-y-reiniciar-identities.sql",
    "backend\src\services\cloudinaryService.js",
    "backend\src\middlewares\uploadMiddleware.js"
)

foreach ($Item in $Required) {
    Check (Test-Path (Join-Path $Root $Item)) "Existe $Item" "Falta $Item"
}

$Readme = Get-Content (Join-Path $Root "README.md") -Raw -Encoding UTF8
Check ($Readme -match "CSS propio") "README documenta CSS propio" "README no documenta CSS propio"
Check ($Readme -match "Cloudinary") "README documenta Cloudinary" "README no documenta Cloudinary"

$FrontendPackagePath = Join-Path $Root "frontend\package.json"
$FrontendPackage = Get-Content $FrontendPackagePath -Raw -Encoding UTF8 | ConvertFrom-Json
$FrontendDependencyNames = @()
if ($FrontendPackage.dependencies) {
    $FrontendDependencyNames += @($FrontendPackage.dependencies.PSObject.Properties.Name)
}
if ($FrontendPackage.devDependencies) {
    $FrontendDependencyNames += @($FrontendPackage.devDependencies.PSObject.Properties.Name)
}
$TailwindDependencies = @(
    $FrontendDependencyNames |
    Where-Object { $_ -match "^(tailwindcss|@tailwindcss/)" }
)
Check ($TailwindDependencies.Count -eq 0) "Frontend sin dependencias Tailwind" "Frontend contiene dependencias Tailwind: $($TailwindDependencies -join ', ')"

$BackendPackage = Get-Content (Join-Path $Root "backend\package.json") -Raw -Encoding UTF8
Check ($BackendPackage -match '"cloudinary"') "SDK Cloudinary registrado" "Cloudinary no aparece en package.json"

$Uploads = @(Get-ChildItem (Join-Path $Root "backend\uploads") -Recurse -File -Force)
$NonKeep = @($Uploads | Where-Object { $_.Name -ne ".gitkeep" })
Check ($NonKeep.Count -eq 0) "Uploads contiene solo .gitkeep" "Uploads contiene $($NonKeep.Count) archivos reales"

$RootTemp = @(
    Get-ChildItem $Root -File |
    Where-Object { $_.Name -match "^(LEEME_BLOQUE_|MANIFEST|MANIFIESTO)" }
)
Check ($RootTemp.Count -eq 0) "Raiz sin archivos temporales" "Raiz contiene archivos LEEME/MANIFEST"

$PrivateRegistry = $false
foreach ($Lock in @(
    (Join-Path $Root "backend\package-lock.json"),
    (Join-Path $Root "frontend\package-lock.json")
)) {
    if ((Get-Content $Lock -Raw -Encoding UTF8) -match "applied-caas|internal\.api\.openai") {
        $PrivateRegistry = $true
    }
}
Check (-not $PrivateRegistry) "Package-lock usa registro publico" "Package-lock contiene registro privado"

$PlaywrightPath = Join-Path $Root "docs\evidencias\pruebas-finales\playwright-junit.xml"
if (Test-Path $PlaywrightPath) {
    [xml]$Playwright = Get-Content $PlaywrightPath -Raw -Encoding UTF8
    $Suites = $Playwright.testsuites
    Check (($Suites.failures -as [int]) -eq 0 -and ($Suites.tests -as [int]) -eq 4) "Playwright 4/4" "Playwright no coincide"
}
else {
    Check $false "" "Falta evidencia Playwright"
}

$NewmanPath = Join-Path $Root "docs\evidencias\pruebas-finales\newman-peru-app-api.html"
if (Test-Path $NewmanPath) {
    $Newman = Get-Content $NewmanPath -Raw -Encoding UTF8
    Check ($Newman -match "There are no failed tests") "Newman sin fallos" "Newman contiene fallos o no se pudo validar"
}
else {
    Check $false "" "Falta evidencia Newman"
}

$CloudinaryEvidence = Get-ChildItem (Join-Path $Root "docs\estabilizacion\evidencias\bloque-11") `
    -Recurse -File -Filter "cloudinary-check.stdout.txt" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if ($CloudinaryEvidence) {
    $CloudText = Get-Content $CloudinaryEvidence.FullName -Raw -Encoding UTF8
    Check ($CloudText -match "Cloudinary verificada") "Conexion Cloudinary archivada" "Evidencia Cloudinary no indica exito"
}
else {
    Check $false "" "Falta evidencia de conexion Cloudinary"
}

if ($NodeCommand) {
    [void](Invoke-Native $NodeCommand.Source @("scripts/check-openapi-sync.mjs") $Root "OpenAPI 70/70" "openapi")
}

if ($RunQualityChecks -and $NpmCommand) {
    $BackendDir = Join-Path $Root "backend"
    $FrontendDir = Join-Path $Root "frontend"

    # Una validacion no debe borrar node_modules. Solo repara si faltan ejecutables.
    $BackendDependenciesOk = Ensure-Dependencies `
        $BackendDir `
        @("jest.cmd") `
        "dependencias backend" `
        "backend-npm-install"

    $FrontendDependenciesOk = Ensure-Dependencies `
        $FrontendDir `
        @("eslint.cmd", "vite.cmd") `
        "dependencias frontend" `
        "frontend-npm-install"

    if ($BackendDependenciesOk) {
        $BackendTestsOk = Invoke-Native `
            $NpmCommand.Source `
            @("run", "test:coverage") `
            $BackendDir `
            "Jest y cobertura" `
            "backend-tests"

        if ($BackendTestsOk) {
            $GeneratedJest = Join-Path $BackendDir "reports\jest\results.json"
            $GeneratedCoverage = Join-Path $BackendDir "reports\jest\coverage\coverage-summary.json"

            if (Test-Path $GeneratedJest) {
                $Jest = Get-Content $GeneratedJest -Raw -Encoding UTF8 | ConvertFrom-Json

                Check (
                    $Jest.success -and
                    $Jest.numPassedTestSuites -eq $Jest.numTotalTestSuites -and
                    $Jest.numPassedTests -eq $Jest.numTotalTests -and
                    $Jest.numTotalTestSuites -ge $ExpectedSuites -and
                    $Jest.numTotalTests -ge $ExpectedTests
                ) "Jest aprobado: $($Jest.numPassedTestSuites) suites y $($Jest.numPassedTests)/$($Jest.numTotalTests) pruebas" `
                  "Jest no coincide: suites $($Jest.numPassedTestSuites)/$($Jest.numTotalTestSuites), pruebas $($Jest.numPassedTests)/$($Jest.numTotalTests)"

                Copy-Item $GeneratedJest `
                    (Join-Path $Root "docs\evidencias\pruebas-finales\jest-results.json") -Force
            }
            else {
                Check $false "" "No se genero reports\jest\results.json"
            }

            if (Test-Path $GeneratedCoverage) {
                $Coverage = Get-Content $GeneratedCoverage -Raw -Encoding UTF8 | ConvertFrom-Json

                Check (
                    $Coverage.total.statements.pct -ge 80 -and
                    $Coverage.total.branches.pct -ge 70 -and
                    $Coverage.total.functions.pct -ge 85 -and
                    $Coverage.total.lines.pct -ge 80
                ) "Cobertura S$($Coverage.total.statements.pct) B$($Coverage.total.branches.pct) F$($Coverage.total.functions.pct) L$($Coverage.total.lines.pct)" `
                  "La cobertura no cumple los umbrales"

                Copy-Item $GeneratedCoverage `
                    (Join-Path $Root "docs\evidencias\pruebas-finales\jest-coverage-summary.json") -Force
            }
            else {
                Check $false "" "No se genero coverage-summary.json"
            }
        }
    }

    if ($FrontendDependenciesOk) {
        [void](Invoke-Native `
            $NpmCommand.Source `
            @("run", "lint") `
            $FrontendDir `
            "ESLint frontend" `
            "frontend-lint")

        [void](Invoke-Native `
            $NpmCommand.Source `
            @("run", "build") `
            $FrontendDir `
            "Build frontend" `
            "frontend-build")
    }
}

$Status = if ($Failed) { "REQUIERE_CORRECCION" } else { "APROBADO_LOCAL_POST_CLOUDINARY" }
$Summary = @"
# Cierre post-Cloudinary

- Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- Estado: $Status
- Linea base minima: $ExpectedSuites suites y $ExpectedTests casos
- Cloudinary: integrado y validado localmente
- Base local: limpia y con identities reiniciados
- Azure SQL: pendiente
- Render: pendiente
- Vercel: pendiente

## Resultados

$($Results -join "`n")
"@

$SummaryPath = Join-Path $EvidenceDir "post-cloudinary-sdd-summary.md"
[System.IO.File]::WriteAllText(
    $SummaryPath,
    $Summary,
    (New-Object System.Text.UTF8Encoding($true))
)

Add-Result "[OK] Evidencia: $EvidenceDir"

if ($OpenReports) {
    Start-Process $SummaryPath
}

if ($Failed) {
    Write-Host ""
    Write-Host "COMPROBACIONES QUE REQUIEREN CORRECCION:" -ForegroundColor Red
    $ErrorResults = @($Results | Where-Object { $_.StartsWith("[ERROR]") })
    foreach ($ErrorResult in $ErrorResults) {
        Write-Host $ErrorResult -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Revise los logs dentro de: $EvidenceDir" -ForegroundColor Yellow
    throw "El cierre post-Cloudinary encontro $($ErrorResults.Count) comprobacion(es) con error."
}

Write-Host ""
Write-Host "BLOQUE 12 APROBADO CORRECTAMENTE." -ForegroundColor Green
