# Catálogo Final de Pruebas — SPEC-002

## 1. Resumen

| Nivel | Cantidad de referencia | Herramienta | Estado |
|---|---:|---|---|
| Unitarias | 363 | Jest | Aprobadas |
| Integración HTTP | 25 | Jest + Supertest | Aprobadas |
| Total backend | 388 | Jest | Aprobadas |
| API encadenada | 11 solicitudes | Postman + Newman | Colección disponible; último reporte no aceptado |
| E2E frontend local | 4 flujos | Playwright | 0 fallos archivados |
| Producción | Flujo de humo manual | Navegador + consola | Aprobado |

Cobertura: **S 89.98 % · B 87.48 % · F 96.18 % · L 89.85 %**.

## 2. Casos por capacidad

| ID | Nivel | Capacidad | Resultado principal | Evidencia |
|---|---|---|---|---|
| CP-AUTH-001 | Unit/Integración | Registro y login | 201/200; credenciales inválidas 401 | Jest |
| CP-AUTH-002 | Unit/Integración | Token ausente, inválido o expirado | 401 | Jest/Supertest |
| CP-AUTH-003 | Unit | Usuario eliminado o rol cambiado | 401/403 | Jest |
| CP-AUTH-004 | E2E/Manual | Sesión, recarga y logout | Redirección correcta | Playwright/manual |
| CP-ROLE-001 | Unit/Integración/Manual | Usuario intenta administrar | 403 | Jest y producción |
| CP-USER-001 | Unit | Listar, buscar, actualizar y eliminar usuario | 200/404/409 | Jest |
| CP-USER-002 | Unit | Último admin y autoeliminación | 409 | Jest |
| CP-TERR-001 | Unit/Integración/Manual | CRUD departamentos | 200/201/404/409 | Jest/Supertest/producción |
| CP-TERR-002 | Unit/Integración | CRUD provincias | relación, duplicado e imagen | Jest/Supertest |
| CP-TERR-003 | Unit/Integración | CRUD distritos | paginación, catálogos y relación | Jest/Supertest |
| CP-TERR-004 | Unit/Integración | CRUD ciudades | filtros, coordenadas y tipo | Jest/Supertest |
| CP-CONT-001 | Unit/Integración | Lugares en cuatro ámbitos | listar/crear/editar/eliminar | Jest/Supertest |
| CP-CONT-002 | Unit/Integración | Comidas en cuatro ámbitos | listar/crear/editar/eliminar | Jest/Supertest |
| CP-VAL-001 | Unit | Campos obligatorios, email, fecha y números | 400 + detalles | Jest |
| CP-INT-001 | Unit | Relación inexistente | 404 | Jest |
| CP-INT-002 | Unit | Duplicado en mismo ámbito | 409 | Jest |
| CP-IMG-001 | Unit | Firma JPEG/PNG/WEBP | archivo válido aceptado | Jest |
| CP-IMG-002 | Unit | MIME/firma inválida o >5 MB | 415/413 | Jest |
| CP-IMG-003 | Unit/Manual | Reemplazo, borrado y limpieza ante error | sin recurso huérfano | Jest/producción |
| CP-ERR-001 | Unit/Integración | Contrato de errores | 400/401/403/404/409/413/415/500 | Jest/Supertest |
| CP-SDD-001 | Calidad | Rutas Express vs OpenAPI | 70/70 | `check-openapi-sync.mjs` |
| CP-BUILD-001 | Calidad | ESLint y Vite build | código de salida 0 | npm |
| CP-DEPLOY-001 | Producción | Health, login, consulta y CRUD | flujo manual aprobado | `production-validation.md` |
| CP-DEPLOY-002 | Producción | Rutas SPA y F5 | sin 404 de Vercel | `vercel.json` y prueba manual |

## 3. Política de cuentas QA

No se crearán nuevas cuentas QA en producción. Las credenciales locales, cuando existan, deben mantenerse en `tests/qa-credentials.local.ps1`, archivo excluido de Git.

La última ejecución Newman almacenada en la copia auditada falló porque las cuentas temporales habían sido eliminadas. Por ello:

- no se presenta ese reporte como aprobado;
- no se ejecuta `npm run qa:seed` contra producción;
- la colección se conserva para futuras pruebas en un entorno aislado;
- la aceptación actual usa cuentas existentes autorizadas y un registro temporal que se elimina al terminar.

## 4. Reglas de repetibilidad

- Las pruebas unitarias y de integración usan mocks y no alteran producción.
- Las pruebas manuales de producción deben usar datos identificables y eliminarlos.
- Ninguna prueba debe borrar o alterar registros reales sin respaldo.
- Los resultados deben guardar fecha, entorno y commit.
- Una falla de Jest, lint, build, OpenAPI o del flujo crítico de producción bloquea el cierre.
- La ausencia de Newman final no bloquea esta versión porque fue sustituido explícitamente por la prueba manual y está documentado como decisión de alcance.
