# Copia este archivo como qa-credentials.local.ps1 y cambia los valores.
# No subas qa-credentials.local.ps1 a Git.
$env:QA_ADMIN_EMAIL = "admin.qa@ejemplo.com"
$env:QA_ADMIN_PASSWORD = "CAMBIAR_CLAVE_ADMIN"
$env:QA_USER_EMAIL = "usuario.qa@ejemplo.com"
$env:QA_USER_PASSWORD = "CAMBIAR_CLAVE_USUARIO"

$env:E2E_ADMIN_EMAIL = $env:QA_ADMIN_EMAIL
$env:E2E_ADMIN_PASSWORD = $env:QA_ADMIN_PASSWORD
$env:E2E_USER_EMAIL = $env:QA_USER_EMAIL
$env:E2E_USER_PASSWORD = $env:QA_USER_PASSWORD
$env:E2E_BASE_URL = "http://localhost:5173"
$env:QA_API_BASE_URL = "http://localhost:5000"
