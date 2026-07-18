param(
    [string]$ApiBaseUrl = "http://localhost:5000/api",
    [switch]$RunFrontendChecks
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidenceDir = Join-Path $root "docs\estabilizacion\evidencias\bloque-3\$timestamp"
New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
$report = Join-Path $evidenceDir "resultado-bloque-3.txt"

function Write-Result {
    param([string]$Text)
    $Text | Tee-Object -FilePath $report -Append
}


function Invoke-NpmCheck {
    param(
        [string]$ScriptName,
        [string]$OutputFile
    )

    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"

    try {
        $commandOutput = & npm.cmd run $ScriptName 2>&1
        $exitCode = $LASTEXITCODE
        $commandOutput | Out-File -FilePath $OutputFile -Encoding utf8
        return [int]$exitCode
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Invoke-ApiCheck {
    param(
        [string]$Name,
        [string]$Uri,
        [string]$Method,
        [int]$ExpectedStatus,
        [object]$Body = $null
    )

    $status = 0
    $content = ""

    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            UseBasicParsing = $true
            ContentType = "application/json"
        }

        if ($null -ne $Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 5)
        }

        $response = Invoke-WebRequest @params
        $status = [int]$response.StatusCode
        $content = $response.Content
    }
    catch {
        $response = $_.Exception.Response
        $content = $_.ErrorDetails.Message

        if ($null -ne $response) {
            if ($null -ne $response.StatusCode) {
                try {
                    $status = [int]$response.StatusCode
                }
                catch {
                    $status = [int]$response.StatusCode.value__
                }
            }

            if (-not $content -and ($response.PSObject.Methods.Name -contains "GetResponseStream")) {
                $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
                $content = $reader.ReadToEnd()
                $reader.Close()
            }
        }

        if ($status -eq 0) {
            Write-Result "[ERROR] $Name -> no se pudo conectar con la API"
            Write-Result "        Detalle: $($_.Exception.Message)"
            return
        }
    }

    if ($status -eq $ExpectedStatus) {
        Write-Result "[OK] $Name -> $status"
    }
    else {
        Write-Result "[ERROR] $Name -> $status (esperado $ExpectedStatus)"
    }

    if ($content) {
        Write-Result "        Respuesta: $content"
    }
}

Write-Result "AUDITORIA BLOQUE 3 - VALIDACIONES Y ERRORES"
Write-Result "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Result "API: $ApiBaseUrl"
Write-Result ""

$requiredFiles = @(
    "backend\src\validators\validationMiddleware.js",
    "backend\src\middlewares\dataIntegrityMiddleware.js",
    "backend\src\middlewares\errorMiddleware.js",
    "backend\src\middlewares\uploadMiddleware.js",
    "backend\src\utils\httpErrors.js",
    "backend\src\utils\fileCleanup.js",
    "specs\002-estabilizacion-calidad\checklists\block-3-validation-errors-checklist.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path (Join-Path $root $file)) {
        Write-Result "[OK] $file"
    }
    else {
        Write-Result "[FALTA] $file"
    }
}

Write-Result ""
Write-Result "Comprobacion sintactica del backend..."

$backendSource = Join-Path $root "backend\src"
if (-not (Test-Path $backendSource)) {
    Write-Result "[ERROR] No existe la carpeta backend\src"
}
elseif (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Result "[ERROR] Node.js no esta disponible en PATH"
}
else {
    $backendFiles = @(Get-ChildItem $backendSource -Recurse -Filter *.js -File)
    $syntaxErrors = 0

    foreach ($file in $backendFiles) {
        & node --check $file.FullName 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            $syntaxErrors++
            Write-Result "[ERROR] Sintaxis: $($file.FullName)"
        }
    }

    if ($syntaxErrors -eq 0) {
        Write-Result "[OK] $($backendFiles.Count) archivos JavaScript sin errores de sintaxis"
    }
    else {
        Write-Result "[ERROR] Se encontraron $syntaxErrors archivos con errores de sintaxis"
    }
}

Write-Result ""
Write-Result "Comprobaciones HTTP sin credenciales..."
Invoke-ApiCheck -Name "Health check" -Uri "$ApiBaseUrl/health" -Method GET -ExpectedStatus 200
Invoke-ApiCheck -Name "Departamento sin token" -Uri "$ApiBaseUrl/departamentos" -Method GET -ExpectedStatus 401
Invoke-ApiCheck -Name "Registro con datos vacios" -Uri "$ApiBaseUrl/auth/register" -Method POST -ExpectedStatus 400 -Body @{}
Invoke-ApiCheck -Name "Login con correo invalido" -Uri "$ApiBaseUrl/auth/login" -Method POST -ExpectedStatus 400 -Body @{ email = "correo-invalido"; password = "123456" }
Invoke-ApiCheck -Name "Ruta inexistente" -Uri "$ApiBaseUrl/ruta-que-no-existe" -Method GET -ExpectedStatus 404

if ($RunFrontendChecks) {
    Write-Result ""
    Write-Result "Ejecutando lint y build del frontend..."

    $frontendPath = Join-Path $root "frontend"
    if (-not (Test-Path $frontendPath)) {
        Write-Result "[ERROR] No existe la carpeta frontend"
    }
    elseif (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
        Write-Result "[ERROR] npm no esta disponible en PATH"
    }
    else {
        Push-Location $frontendPath
        try {
            $lintExitCode = Invoke-NpmCheck -ScriptName "lint" -OutputFile (Join-Path $evidenceDir "frontend-lint.txt")
            if ($lintExitCode -eq 0) {
                Write-Result "[OK] npm run lint"
            }
            else {
                Write-Result "[ERROR] npm run lint termino con codigo $lintExitCode"
            }

            $buildExitCode = Invoke-NpmCheck -ScriptName "build" -OutputFile (Join-Path $evidenceDir "frontend-build.txt")
            if ($buildExitCode -eq 0) {
                Write-Result "[OK] npm run build"
            }
            else {
                Write-Result "[ERROR] npm run build termino con codigo $buildExitCode"
            }
        }
        finally {
            Pop-Location
        }
    }
}

Write-Result ""
Write-Result "Pruebas que requieren token admin y se realizaran en el bloque de pruebas:"
Write-Result "- Duplicado -> 409"
Write-Result "- Relacion inexistente -> 404"
Write-Result "- Eliminacion con hijos -> 409"
Write-Result "- Imagen mayor de 5 MB -> 413"
Write-Result "- Imagen no permitida -> 415"
Write-Result ""
Write-Result "Evidencia guardada en: $evidenceDir"
Write-Host ""
Write-Host "Resultado guardado en:" -ForegroundColor Green
Write-Host $report -ForegroundColor Green
