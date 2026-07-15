# Matriz de Trazabilidad — SPEC-002

## 1. Identificación

- **Código:** TRACE-002
- **Especificación:** `SPEC-002`
- **Plan:** `PLAN-002`
- **Tareas:** `TASKS-002`
- **Estado:** activa; se actualiza con cada bloque
- **Fecha de corte:** 14 de julio de 2026 — Bloque 4 implementado

## 2. Convención de estados

- **Documentado:** requisito, tarea y caso de prueba definidos.
- **Implementado, pendiente de validación:** existe código, pero falta evidencia automatizada o manual suficiente.
- **Validado:** existe código, prueba ejecutada y evidencia.
- **Pendiente:** aún no implementado.
- **Brecha:** el código actual contradice el requisito.

## 3. Trazabilidad principal

| Requisito | Prioridad | Tareas | Código o artefacto objetivo | Endpoint/flujo | Caso de prueba | Evidencia esperada | Estado real |
|---|---|---|---|---|---|---|---|
| RF-EST-001 | P1 | T-EST-012, T-EST-036, T-EST-037 | `backend/src/routes/*.js` | Solo registro/login públicos | CP-EST-AUTH-004/005 | Supertest + Newman | Implementado, pendiente de validación |
| RF-EST-002 | P1 | T-EST-030, T-EST-033, T-EST-036, T-EST-037 | `authMiddleware.js`, rutas | Toda ruta funcional protegida | CP-EST-AUTH-004 | Reporte 401 | Implementado, pendiente de validación |
| RF-EST-003 | P1 | T-EST-030, T-EST-032 | `authMiddleware.js`, `userModel.js` | Token de usuario eliminado | CP-EST-AUTH-008 | Prueba integración | Implementado, pendiente de validación |
| RF-EST-004 | P1 | T-EST-031, T-EST-038 | `authMiddleware.js`, `roleMiddleware.js` | Administración por rol vigente | CP-EST-AUTH-006/007/009 | Reporte 403/éxito | Implementado, pendiente de validación |
| RF-EST-005 | P1 | T-EST-034 | `frontend/src/context/AuthContext.jsx`, `authService.js` | Recarga con sesión | CP-EST-AUTH-010 | Playwright | Implementado, pendiente de validación |
| RF-EST-006 | P1 | T-EST-035 | Cliente Axios central | Respuesta 401 global | CP-EST-AUTH-010 | Playwright | Implementado, pendiente de validación |
| RF-EST-007 | P1 | T-EST-038, T-EST-040 | `roleMiddleware.js`, routers CRUD | Usuario intenta administrar | CP-EST-AUTH-006 | Supertest/Newman | Implementado, pendiente de validación |
| RF-EST-008 | P1 | T-EST-039 | `authRateLimiter.js`, `authRoutes.js` | Login/registro abusivo | Caso por crear | Reporte 429 | Implementado, pendiente de validación |
| RF-EST-009 | P1 | T-EST-057/058/059 | `validationMiddleware.js`, rutas y controladores | CRUD principal | CP-EST-ERR-001 | Unitarias/integración | Implementado centralmente, pendiente de validación |
| RF-EST-010 | P1 | T-EST-057/058/059 | `validationMiddleware.js`, `api.js` | Errores por campo | CP-EST-ERR-001 | JSON de respuesta | Implementado, pendiente de validación |
| RF-EST-011 | P1 | T-EST-054/055/056 | `errorMiddleware.js`, `httpErrors.js`, `uploadMiddleware.js` | 400/401/403/404/409/413/415/500 | CP-EST-ERR-001..004, IMG-003/004 | Newman | Implementado, pendiente de validación |
| RF-EST-012 | P1 | T-EST-053/054 | `app.js`, `errorMiddleware.js`, `httpErrors.js` | Error inesperado | Caso por crear | Sin datos internos | Implementado, pendiente de validación |
| RF-EST-013 | P2 | T-EST-060 | `database/migrations/005-integridad-basica.sql` | Evolución SQL | CP-EST-DB-001 | Evidencia SSMS | Implementado, pendiente de ejecución |
| RF-EST-014 | P1 | T-EST-061 | Script base, auditoría y migración 005 | Área/población/coordenadas | CP-EST-DB-002 | Evidencia SSMS | Implementado, pendiente de ejecución |
| RF-EST-015 | P1 | T-EST-062 | Modelos/controladores/SQL, `httpErrors.js` | Eliminación con hijos | CP-EST-ERR-004 | HTTP 409 | Mapeo HTTP implementado; prueba pendiente |
| RF-EST-016 | P2 | T-EST-063 | Modelos y transacciones | Operación múltiple | Caso integración | Rollback probado | Pendiente |
| RF-EST-017 | P1 | T-EST-065 | `uploadMiddleware.js`, `errorMiddleware.js` | Archivo inválido | CP-EST-IMG-003/004/006 | 413/415 | Implementado, pendiente de validación |
| RF-EST-018 | P1 | T-EST-066 | `fileCleanup.js`, validación, integridad y controladores | Falla antes o durante SQL | CP-EST-IMG-001 | Archivo no queda huérfano | Implementado, pendiente de validación |
| RF-EST-019 | P1 | T-EST-067/068 | `imageLifecycle.js`, 12 controladores | Reemplazo y eliminación | CP-EST-IMG-002/005 | Archivo anterior o asociado eliminado | Implementado, pendiente de validación |
| RF-EST-020 | P2 | T-EST-023 | `server.js` | `/uploads` | Caso manual | URL única | Implementado, pendiente de validación de despliegue |
| RF-EST-021 | P1 | T-EST-080/081 | `route-inventory.md`, `openapi.yaml` | Contrato REST | CP-EST-SDD-001 | Comparación contrato/código | Inventario validado; OpenAPI pendiente |
| RF-EST-022 | P1 | T-EST-082/083 | `traceability-matrix.md`, checklist | Requisito→código→prueba | CP-EST-SDD-001 | Revisión SDD | **Validado documentalmente en Bloque 1** |
| RF-EST-023 | P1 | T-EST-084 | Backend tests | Autenticación y CRUD | Casos AUTH/ERR | Reporte Jest/Vitest | Pendiente |
| RF-EST-024 | P1 | T-EST-085 | Postman/Newman | API crítica | Casos AUTH/ERR | HTML Newman | Pendiente |
| RF-EST-025 | P1 | T-EST-086/087 | RTL/Playwright | Login, navegación, admin, logout | CP-EST-AUTH-010 y E2E | Reporte Playwright | Pendiente |
| RF-EST-026 | P3 | T-EST-089/090 | Listados/frontend | Paginación | Caso rendimiento | Evidencia comparativa | Postergado |
| RF-EST-027 | P3 | T-EST-089/090/091 | Frontend/assets | Multimedia | CP-EST-REG-002 | Comparación visual | Postergado |
| RF-EST-028 | P1 | T-EST-053 | `app.js` | Debug y health | Caso seguridad | `/api/test-db` y `/api/debug-token` ausentes | Implementado, pendiente de validación |

## 4. Trazabilidad del Bloque 1

| Entregable | Tarea | Resultado |
|---|---|---|
| Inventario de carpetas | T-EST-016 | Clasificación de conservar, mover y excluir |
| Matriz TRACE-002 | T-EST-017/T-EST-082 | Requisitos enlazados con código, pruebas y evidencias |
| Inventario ROUTES-002 | T-EST-018/T-EST-080 | 69 operaciones de routers y 8 brechas de autenticación |
| Checklist de consistencia | T-EST-019/T-EST-083 | Estados documentales corregidos sin declarar código no implementado |
| Script de auditoría | T-EST-016 | Limpieza segura y evidencia reproducible |

## 5. Regla de actualización

Una fila solo cambia a **Validado** cuando se cumplen simultáneamente:

1. El código objetivo existe.
2. El caso de prueba está implementado.
3. La prueba fue ejecutada satisfactoriamente.
4. La evidencia fue guardada.
5. `spec.md`, `tasks.md`, OpenAPI y esta matriz son coherentes.

No debe usarse “completado” como sinónimo de “documentado”.


## 6. Trazabilidad del Bloque 2

| Entregable | Requisitos | Archivos principales | Validación pendiente |
|---|---|---|---|
| Sesión revocable | RF-EST-002/003/004 | `authMiddleware.js`, `userModel.js`, `roleMiddleware.js` | Usuario eliminado y cambio de rol |
| Protección integral | RF-EST-001/002/007 | Rutas territoriales y rutas de contenido | Matriz 401/403/200 |
| Sesión frontend | RF-EST-005/006 | `AuthContext.jsx`, `api.js`, rutas privadas | Recarga y expiración |
| Seguridad HTTP | RF-EST-008/012/028 | `app.js`, rate limit, error handler | CORS, 429 y ausencia de debug |
| Preparación de tests | RF-EST-023 | `app.js` separado de `server.js` | Supertest en Bloque 6 |


## 7. Trazabilidad del Bloque 3

| Entregable | Requisitos | Archivos principales | Validación pendiente |
|---|---|---|---|
| Validación central | RF-EST-009/010 | `validationMiddleware.js`, rutas | Casos 400 por módulo |
| Duplicados y relaciones | RF-EST-009/011/015 | `dataIntegrityMiddleware.js`, `httpErrors.js` | Casos 404 y 409 |
| Archivos rechazados | RF-EST-017/018 | `uploadMiddleware.js`, `fileCleanup.js` | Casos 413, 415 y limpieza |
| Errores uniformes | RF-EST-011/012 | `errorMiddleware.js`, controladores | Newman y Supertest |
| Presentación frontend | RNF-EST-005 | `frontend/src/services/api.js` | Revisión visual de mensajes |


## 8. Trazabilidad del Bloque 4

| Entregable | Requisitos | Archivos principales | Validación pendiente |
|---|---|---|---|
| Auditoría y migración SQL | RF-EST-013/014/015 | `database/maintenance/010-auditoria-integridad-bloque-4.sql`, `database/migrations/005-integridad-basica.sql` | Ejecución y captura en SSMS |
| Firma real de imágenes | RF-EST-017 | `uploadMiddleware.js`, 12 routers | Casos 413, 415 y archivo falso |
| Ciclo de vida de imágenes | RF-EST-018/019 | `imageLifecycle.js`, 12 controladores | Reemplazo, borrado y error 409 |
| Revisión funcional | RF-EST-009/011/015 | Checklist del Bloque 4 | Matriz manual por módulo |
| Evidencia reproducible | RNF-EST-007/008 | `block4-integrity-image-check.ps1` | Reporte local y commit |


## Cobertura automatizada incorporada en el Bloque 5

| Requisito | Prueba automatizada | Herramienta | Resultado esperado |
|---|---|---|---|
| RF-EST-002 | Consulta sin token | Supertest / Newman | 401 |
| RF-EST-004 | Rol vigente de usuario y admin | Supertest | 403 o acceso |
| RF-EST-005 | Recarga y ruta privada | Playwright | Sesion valida o redireccion |
| RF-EST-006 | Logout y limpieza de token | Playwright | Token eliminado y login |
| RF-EST-007 | Usuario intenta crear departamento | Supertest / Newman | 403 |
| RF-EST-009 | Cuerpo territorial invalido | Jest / Supertest / Newman | 400 con detalles |
| RF-EST-011 | Matriz 400/401/403/404/409 | Supertest / Newman | Estados correctos |
| RF-EST-012 | Normalizacion de errores | Jest | Payload controlado |
| RF-EST-023 | Suite backend | Jest + Supertest | Ejecucion repetible |
| RF-EST-024 | Coleccion API | Postman + Newman | Reporte HTML |
| RF-EST-025 | Flujos frontend | Playwright | Reporte HTML/JUnit |
| RNF-EST-008 | Regresion | GitHub Actions | Jest, lint y build |

**Estado:** codigo de prueba implementado; evidencia de ejecucion local pendiente.

## 10. Trazabilidad del Bloque 5.1 — Mejora de cobertura

| Requisito | Tareas | Archivos de prueba | Evidencia | Estado |
|---|---|---|---|---|
| RF-EST-002/003/004 | T-EST-092, T-EST-094 | `authController.test.js`, `authMiddleware.test.js` | Jest + cobertura HTML | Implementado, pendiente de ejecución local |
| RF-EST-009/010/011/012 | T-EST-093, T-EST-095 | `departamentoController.test.js`, `httpErrors.test.js` | Jest + resumen JSON | Implementado, pendiente de ejecución local |
| RF-EST-018/019 | T-EST-093 | Casos de actualización y eliminación de imagen en `departamentoController.test.js` | Jest | Implementado, pendiente de ejecución local |
| RF-EST-023 | T-EST-092..097 | `backend/tests/unit/*.test.js`, `jest.config.js` | `coverage-summary.json` | Implementado, pendiente de superar umbrales |
| RNF-EST-008 | T-EST-096/097 | `block5-coverage-improvement.ps1` | Evidencia reproducible | Implementado, pendiente de ejecución local |

**Puerta de calidad:** el Bloque 5.1 se considera validado únicamente cuando las pruebas pasan y Jest confirma simultáneamente statements >= 80%, branches >= 70%, functions >= 85% y lines >= 80%.

## 11. Trazabilidad del Bloque 5.2 — Cobertura funcional general

| Requisitos | Tareas | Código cubierto | Pruebas | Evidencia | Estado |
|---|---|---|---|---|---|
| RF-EST-001/002/007 | T-EST-098..105 | Rutas de provincias, distritos, ciudades, usuarios y contenido | `modules.integration.test.js` | Jest + Supertest | Implementado, pendiente de evidencia local |
| RF-EST-009/010/011 | T-EST-098..104 | Controladores territoriales, usuarios y contenido | `territorialControllers.test.js`, `userController.test.js`, `contentControllers.test.js` | Cobertura HTML | Implementado, pendiente de evidencia local |
| RF-EST-013/014/015 | T-EST-104 | `dataIntegrityMiddleware.js` | `dataIntegrityMiddleware.test.js` | Jest | Implementado, pendiente de evidencia local |
| RF-EST-017/018/019 | T-EST-102/103 | `uploadMiddleware.js`, `imageLifecycle.js`, `fileCleanup.js` | `uploadSignature.test.js`, `imageLifecycle.test.js` | Jest | Implementado, pendiente de evidencia local |
| RF-EST-023 | T-EST-098..107 | Todos los controladores funcionales y componentes críticos | 351 unitarias + 25 integración | `coverage-summary.json` | Validación interna aprobada |
| RNF-EST-008 | T-EST-106/107 | `jest.config.js`, script de ejecución | Umbrales globales | Evidencia reproducible | Implementado, pendiente de ejecución local |

**Resultado interno:** 14 suites, 376 pruebas aprobadas; cobertura general S 91.20%, B 87.01%, F 96.85%, L 91.08%.
