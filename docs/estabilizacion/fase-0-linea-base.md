# Fase 0 — Respaldo y línea base de PERU APP

## 1. Identificación

- **Proyecto:** PERU APP
- **Rama prevista:** `002-estabilizacion-calidad`
- **Fecha de inicio:** ____ / ____ / 2026
- **Responsable:** Erwin Brayam Inca Pauccara
- **Objetivo:** conservar evidencia del estado funcional anterior a la estabilización.

## 2. Regla de la fase

Durante la Fase 0 no se cambia la lógica del frontend, backend ni base de datos. Solo se respalda, ejecuta y registra el comportamiento actual.

## 3. Respaldo obligatorio

| Evidencia | Estado | Ubicación / observación |
|---|---|---|
| Copia ZIP del código fuente | ☐ Pendiente ☐ Completado | |
| Hash SHA-256 del ZIP | ☐ Pendiente ☐ Completado | |
| Respaldo `.bak` de SQL Server | ☐ Pendiente ☐ Completado | |
| Verificación `RESTORE VERIFYONLY` | ☐ Pendiente ☐ Completado | |
| Rama `002-estabilizacion-calidad` | ☐ Pendiente ☐ Completado | |
| Estado Git registrado | ☐ Pendiente ☐ Completado | |

## 4. Línea base automática

Ejecutar desde la raíz:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\phase0-baseline.ps1
```

Registrar la carpeta de evidencia generada:

```text
docs/estabilizacion/evidencias/fase-0/________________
```

| Comprobación | Resultado |
|---|---|
| Versión de Node registrada | ☐ Aprobado ☐ Fallido |
| Versión de npm registrada | ☐ Aprobado ☐ Fallido |
| Sintaxis JavaScript del backend | ☐ Aprobado ☐ Fallido |
| ESLint del frontend | ☐ Aprobado ☐ Fallido |
| Build de producción del frontend | ☐ Aprobado ☐ Fallido |
| Auditoría de dependencias registrada | ☐ Aprobado ☐ Fallido |
| Dependencias desactualizadas registradas | ☐ Aprobado ☐ Fallido |

## 5. Línea base funcional manual

### 5.1. Backend

| Caso | Resultado esperado | Estado | Evidencia / observación |
|---|---|---|---|
| Iniciar `npm run dev` | Servidor inicia sin error | ☐ Aprobado ☐ Fallido | |
| Conectar a SQL Server | Conexión confirmada | ☐ Aprobado ☐ Fallido | |
| Registrar usuario | HTTP 201 y rol `usuario` | ☐ Aprobado ☐ Fallido | |
| Login válido | HTTP 200 y token JWT | ☐ Aprobado ☐ Fallido | |
| Login inválido | HTTP 401 | ☐ Aprobado ☐ Fallido | |
| Consultar perfil con token | HTTP 200, sin contraseña | ☐ Aprobado ☐ Fallido | |
| Consultar perfil sin token | HTTP 401 | ☐ Aprobado ☐ Fallido | |

### 5.2. Frontend

| Caso | Resultado esperado | Estado | Evidencia / observación |
|---|---|---|---|
| Iniciar `npm run dev` | Vite inicia sin error | ☐ Aprobado ☐ Fallido | |
| Abrir aplicación sin sesión | Se muestra únicamente autenticación | ☐ Aprobado ☐ Fallido | |
| Registro desde interfaz | Usuario creado | ☐ Aprobado ☐ Fallido | |
| Login desde interfaz | Redirección al Home | ☐ Aprobado ☐ Fallido | |
| Navegación usuario | Acceso a consultas permitidas | ☐ Aprobado ☐ Fallido | |
| Navegación administrador | Acceso al panel administrativo | ☐ Aprobado ☐ Fallido | |
| Cierre de sesión | Token eliminado y retorno al login | ☐ Aprobado ☐ Fallido | |
| Diseño visual | Sin alteraciones respecto a la versión base | ☐ Aprobado ☐ Fallido | |

## 6. Datos de referencia

- **Base de datos:** `PeruDepartamentosDB`
- **Backend esperado:** `http://localhost:5000`
- **Frontend esperado:** `http://localhost:5173`
- **API esperada:** `http://localhost:5000/api`

No registrar contraseñas, secretos JWT ni tokens completos en las evidencias.

## 7. Criterio de salida de Fase 0

La fase se considera completada cuando:

1. El código y la base de datos cuentan con respaldo verificable.
2. Backend y frontend ejecutan desde la rama de estabilización.
3. Se registraron lint, build, sintaxis y auditoría.
4. Se verificaron manualmente registro, login, perfil, roles y logout.
5. Los errores existentes se documentaron sin corregirlos todavía.
6. Se confirma que el diseño visual actual es la referencia que debe conservarse.

## 8. Aprobación

- **Estado final:** ☐ Aprobada ☐ Requiere corrección
- **Fecha:** ____ / ____ / 2026
- **Observación general:**

______________________________________________________________________________
