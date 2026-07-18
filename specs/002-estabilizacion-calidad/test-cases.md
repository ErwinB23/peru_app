# Catálogo Final de Pruebas — SPEC-002

## 1. Resumen

| Nivel | Cantidad de referencia | Herramienta |
|---|---:|---|
| Unitarias | 351 | Jest |
| Integración HTTP | 25 | Jest + Supertest |
| Total backend | 376 | Jest |
| API encadenada | 11 solicitudes | Postman + Newman |
| E2E frontend | 4 flujos | Playwright |

Cobertura de referencia: **S 91.20% · B 87.01% · F 96.85% · L 91.08%**.

## 2. Casos por capacidad

| ID | Nivel | Capacidad | Resultado principal | Evidencia |
|---|---|---|---|---|
| CP-AUTH-001 | Unit/Integración | Registro y login | 201/200; credenciales inválidas 401 | Jest |
| CP-AUTH-002 | Unit/Integración | Token ausente, inválido o expirado | 401 | Jest/Supertest |
| CP-AUTH-003 | Unit | Usuario eliminado o rol cambiado | 401/403 según caso | Jest |
| CP-AUTH-004 | E2E | Sesión, recarga y logout | Redirección correcta | Playwright |
| CP-ROLE-001 | Unit/Integración | Usuario intenta administrar | 403 | Jest/Newman |
| CP-USER-001 | Unit | Listar, buscar, actualizar y eliminar usuario | 200/404/409 | Jest |
| CP-USER-002 | Unit | Último admin y autoeliminación | 409 | Jest |
| CP-TERR-001 | Unit/Integración | CRUD departamentos | 200/201/404/409 | Jest/Supertest |
| CP-TERR-002 | Unit/Integración | CRUD provincias | relación, duplicado e imagen | Jest/Supertest |
| CP-TERR-003 | Unit/Integración | CRUD distritos | paginación, catálogos y relación | Jest/Supertest |
| CP-TERR-004 | Unit/Integración | CRUD ciudades | filtros, coordenadas y tipo | Jest/Supertest |
| CP-CONT-001 | Unit/Integración | Lugares en cuatro ámbitos | listar/crear/editar/eliminar | Jest/Supertest |
| CP-CONT-002 | Unit/Integración | Comidas en cuatro ámbitos | listar/crear/editar/eliminar | Jest/Supertest |
| CP-VAL-001 | Unit | Campos obligatorios, email, fecha y números | 400 + detalles | Jest |
| CP-INT-001 | Unit | Relación inexistente | 404 | Jest |
| CP-INT-002 | Unit | Duplicado en mismo ámbito | 409 | Jest |
| CP-IMG-001 | Unit | Firma JPEG/PNG/WEBP | aceptar archivo válido | Jest |
| CP-IMG-002 | Unit/API | MIME/firma inválida o >5 MB | 415/413 | Jest/Newman |
| CP-IMG-003 | Unit | Reemplazo, borrado y limpieza ante error | sin archivo huérfano | Jest |
| CP-ERR-001 | Unit/Integración | Contrato de errores | 400/401/403/404/409/413/415/500 | Jest/Newman |
| CP-SDD-001 | Calidad | Rutas Express vs OpenAPI | 70/70 | `check-openapi-sync.mjs` |
| CP-BUILD-001 | Calidad | ESLint y Vite build | código de salida 0 | npm |
| CP-DEPLOY-001 | Producción | Health, login, consulta y CRUD | pruebas de humo aprobadas | Newman/Playwright |

## 3. Cuentas QA

Las pruebas API/E2E utilizan `admin.qa` y `usuario.qa`, cargadas desde `tests/qa-credentials.local.ps1`. El archivo local está excluido de Git y las cuentas no sustituyen usuarios reales.

## 4. Reglas de repetibilidad

- Las unitarias e integración local utilizan mocks y no alteran la base productiva.
- Newman y Playwright crean datos temporales identificables y deben limpiarlos.
- Los reportes se resumen en `docs/estabilizacion/evidencias`.
- Una suite fallida bloquea el cierre o el despliegue.
