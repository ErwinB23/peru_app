# Fase 0 — Respaldo y línea base de PERU APP

## 1. Identificación

- **Proyecto:** PERU APP
- **Rama:** `002-estabilizacion-calidad`
- **Fecha de inicio:** 14 de julio de 2026
- **Responsable:** Erwin Brayam Inca Pauccara
- **Objetivo:** conservar evidencia verificable del estado funcional anterior a la estabilización.

## 2. Regla de la fase

Durante la Fase 0 no se cambia la lógica del frontend, backend ni base de datos. Solo se respalda, ejecuta y registra el comportamiento existente.

## 3. Respaldo obligatorio

| Evidencia | Estado | Ubicación / observación |
|---|---|---|
| Copia ZIP del código fuente | Completado | `phase0-backups/PERU_APP_PRE_ESTABILIZACION_20260714-173307.zip` |
| Hash SHA-256 del ZIP | Completado | `5ADA56EC7C020CCD4EFF0AB47FA8CC74B0F1B3BF63E04857B240666B07ADC15A` |
| Respaldo `.bak` de SQL Server | Pendiente de evidencia | Ejecutar `database/maintenance/000-backup-before-stabilization.sql` |
| Verificación `RESTORE VERIFYONLY` | Pendiente de evidencia | Conservar la salida de SSMS |
| Rama `002-estabilizacion-calidad` | Completado | Verificada en el repositorio |
| Estado Git registrado | Completado | `docs/estabilizacion/evidencias/fase-0/20260714-173307/git-status.txt` |

## 4. Línea base automática

Ejecución registrada mediante:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\phase0-baseline.ps1
```

Carpeta principal de evidencia:

```text
docs/estabilizacion/evidencias/fase-0/20260714-173307
```

| Comprobación | Resultado |
|---|---|
| Sintaxis JavaScript del backend | Aprobado |
| ESLint del frontend | Aprobado |
| Build de producción del frontend | Aprobado |
| Auditoría de dependencias | Registrada, no bloqueante |
| Dependencias desactualizadas | Registradas |
| Respaldo del código y hash | Aprobado |

## 5. Línea base funcional manual

### 5.1. Evidencias disponibles

| Caso | Estado | Evidencia |
|---|---|---|
| Backend ejecutándose | Aprobado | `manual/01-backend-ejecutandose.png` |
| Frontend ejecutándose | Aprobado | `manual/02-frontend-ejecutandose.png` |
| Pantalla de autenticación | Aprobado | `manual/03-login-inicial.png` |
| Login administrador | Aprobado | `manual/04-login-admin-exitoso.png` |
| Acceso de usuario normal | Aprobado | `manual/06-acceso-usuario-normal.png` |
| Cierre de sesión | Aprobado | `manual/07-cierre-sesion.png` |

### 5.2. Casos que deben reconfirmarse

| Caso | Resultado esperado | Estado |
|---|---|---|
| Registrar usuario | HTTP 201 y rol `usuario` | Pendiente de evidencia específica |
| Login inválido | HTTP 401 | Pendiente de evidencia específica |
| Consultar perfil con token | HTTP 200 sin contraseña | Pendiente de evidencia específica |
| Consultar perfil sin token | HTTP 401 | Pendiente de evidencia específica |
| Acceso administrativo con usuario normal | HTTP 403 | Se validará en Fase 4 |

## 6. Datos de referencia

- **Base de datos:** `PeruDepartamentosDB`
- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`
- **API:** `http://localhost:5000/api`

No registrar contraseñas, secretos JWT ni tokens completos en las evidencias.

## 7. Criterio de salida

La Fase 0 se considerará completamente aprobada cuando:

1. Exista un respaldo `.bak` verificable.
2. `RESTORE VERIFYONLY` termine correctamente.
3. Se documenten registro, login inválido y perfil con/sin token.
4. Las evidencias automáticas continúen aprobadas.
5. Se confirme que el diseño visual registrado es la línea base.

## 8. Aprobación

- **Estado actual:** Requiere completar evidencias de SQL Server y casos manuales faltantes.
- **Fecha de revisión:** 14 de julio de 2026.
- **Observación:** la línea base del código, compilación, frontend y autenticación principal está registrada; no se declara cerrada totalmente hasta completar los pendientes indicados.
