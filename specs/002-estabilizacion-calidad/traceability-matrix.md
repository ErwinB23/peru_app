# Matriz de Trazabilidad Final — SPEC-002

**Código:** TRACE-002  
**Fecha:** 15 de julio de 2026  
**Estado:** cierre pre-despliegue

| Requisito | Resultado esperado | Código / artefacto | Endpoint o flujo | Prueba / evidencia | Estado |
|---|---|---|---|---|---|
| RF-EST-001 | Rutas públicas mínimas | `app.js; authRoutes.js` | POST register/login; GET health | CP-AUTH-001; CP-SDD-001 | Validado |
| RF-EST-002 | JWT en rutas funcionales | `authMiddleware.js; routes/*.js` | 67 operaciones protegidas | CP-AUTH-002; CP-SDD-001 | Validado |
| RF-EST-003 | Usuario vigente | `authMiddleware.js; userModel.js` | flujo JWT | CP-AUTH-003 | Validado |
| RF-EST-004 | Rol vigente | `authMiddleware.js; roleMiddleware.js` | CRUD admin | CP-AUTH-003; CP-ROLE-001 | Validado |
| RF-EST-005 | Perfil al cargar | `AuthContext.jsx; authService.js` | GET /auth/profile | CP-AUTH-004 | Implementado; evidencia E2E |
| RF-EST-006 | Interceptor 401 | `api.js/AuthContext.jsx` | sesión frontend | CP-AUTH-004 | Implementado; evidencia E2E |
| RF-EST-007 | 403 para usuario | `roleMiddleware.js` | POST/PUT/DELETE admin | CP-ROLE-001 | Validado |
| RF-EST-008 | Rate limit | `authRateLimiter.js` | register/login | CP-RATE-001 | Implementado; prueba 429 pendiente |
| RF-EST-009 | Validación y normalización | `validationMiddleware.js` | escrituras | CP-VAL-001 | Validado |
| RF-EST-010 | Detalle por campo | `validationMiddleware.js; api.js` | 400 | CP-VAL-001 | Validado |
| RF-EST-011 | Estados HTTP | `httpErrors.js; errorMiddleware.js` | API completa | CP-ERR-001 | Validado |
| RF-EST-012 | Error central y seguro | `httpErrors.js; errorMiddleware.js` | 500 | CP-ERR-001 | Validado |
| RF-EST-013 | Migraciones numeradas | `database/migrations/005-integridad-basica.sql` | SQL Server | CP-DB-001 | Implementado; evidencia SSMS |
| RF-EST-014 | CHECK de rangos | `script base; migration 005` | SQL Server | CP-DB-002 | Implementado; evidencia SSMS |
| RF-EST-015 | No borrar relaciones | `FK; httpErrors.js` | DELETE territorial | CP-INT-001 | Validado |
| RF-EST-016 | Transacciones críticas | `modelos` | operaciones múltiples | CP-DB-003 | Pendiente justificado |
| RF-EST-017 | Validar imágenes | `uploadMiddleware.js` | multipart | CP-IMG-001; CP-IMG-002 | Validado |
| RF-EST-018 | Limpiar archivo nuevo | `fileCleanup.js` | errores de escritura | CP-IMG-003 | Validado |
| RF-EST-019 | Retirar imagen anterior | `imageLifecycle.js; controladores` | PUT/DELETE contenido | CP-IMG-003 | Validado |
| RF-EST-020 | Publicación controlada | `app.js; uploads` | GET /uploads | CP-IMG-003 | Validado local; Cloudinary pendiente |
| RF-EST-021 | OpenAPI real | `openapi.yaml; route-inventory.md` | 70 operaciones | CP-SDD-001 | Validado 70/70 |
| RF-EST-022 | Trazabilidad | `traceability-matrix.md` | SDD | CP-SDD-001 | Validado documentalmente |
| RF-EST-023 | Pruebas backend | `backend/tests; jest.config.js` | 14 suites | 376 casos | Validado de referencia |
| RF-EST-024 | Newman | `tests/postman; runNewman.js` | 11 solicitudes | reporte Newman | Implementado; archivar evidencia |
| RF-EST-025 | Playwright | `frontend/tests/e2e` | 4 flujos | reporte Playwright | Implementado; archivar evidencia |
| RF-EST-026 | Paginación | `distritoController.js; ciudadController.js` | GET distritos/ciudades | CP-TERR-003/004 | Parcial |
| RF-EST-027 | Optimización multimedia | `frontend assets` | build | CP-BUILD-001 | Pendiente |
| RF-EST-028 | Sin debug | `app.js` | health; rutas inexistentes | CP-SDD-001 | Validado |

## Métricas asociadas

- 70 operaciones HTTP documentadas.
- 14 suites y 376 pruebas de referencia.
- 351 casos unitarios y 25 de integración.
- Cobertura S91.20/B87.01/F96.85/L91.08.
- 11 solicitudes Newman y 4 flujos Playwright implementados.

## Regla de aceptación

Los estados que indican “evidencia” o “pendiente” no pueden convertirse en validados hasta conservar el reporte o la captura correspondiente. La aceptación en producción se añadirá después del despliegue.
