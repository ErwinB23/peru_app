# Matriz de Trazabilidad Final — SPEC-002

**Código:** TRACE-002  
**Fecha:** 18 de julio de 2026  
**Estado:** cierre local post-Cloudinary

| Requisito | Resultado esperado | Código / artefacto | Endpoint o flujo | Prueba / evidencia | Estado |
|---|---|---|---|---|---|
| RF-EST-001 | Rutas públicas mínimas | `app.js; authRoutes.js` | register/login/health | CP-AUTH-001 | Validado |
| RF-EST-002 | JWT en rutas funcionales | `authMiddleware.js; routes/*.js` | operaciones protegidas | CP-AUTH-002 | Validado |
| RF-EST-003 | Usuario vigente | `authMiddleware.js; userModel.js` | flujo JWT | CP-AUTH-003 | Validado |
| RF-EST-004 | Rol vigente | `authMiddleware.js; roleMiddleware.js` | CRUD admin | CP-ROLE-001 | Validado |
| RF-EST-005 | Perfil al cargar | `AuthContext.jsx; authService.js` | GET `/auth/profile` | Playwright `auth.spec.js` | Validado |
| RF-EST-006 | Interceptor 401 | `api.js; AuthContext.jsx` | sesión frontend | Playwright | Validado |
| RF-EST-007 | 403 para usuario | `roleMiddleware.js` | CRUD admin | Jest/Supertest/Newman | Validado |
| RF-EST-008 | Rate limit | `authRateLimiter.js` | register/login | inspección y pruebas base | Implementado |
| RF-EST-009 | Validación | `validationMiddleware.js` | escrituras | Jest | Validado |
| RF-EST-010 | Detalle por campo | `validationMiddleware.js; api.js` | 400 | Jest/Newman | Validado |
| RF-EST-011 | Estados HTTP | `httpErrors.js; errorMiddleware.js` | API | Jest/Newman | Validado |
| RF-EST-012 | Error central seguro | `httpErrors.js; errorMiddleware.js` | 500 | Jest | Validado |
| RF-EST-013 | Migraciones | `database/migrations/005-integridad-basica.sql` | SQL Server | auditoría local | Implementado |
| RF-EST-014 | CHECK de rangos | scripts SQL | SQL Server | pruebas de integridad | Validado |
| RF-EST-015 | No borrar relaciones | FK y `httpErrors.js` | DELETE | integración | Validado |
| RF-EST-016 | Transacciones críticas | modelos | operaciones múltiples | CP-DB-003 | Pendiente justificado |
| RF-EST-017 | Validar imágenes | `uploadMiddleware.js` | multipart | pruebas de firma | Validado |
| RF-EST-018 | Limpiar recurso nuevo | `fileCleanup.js` | error de escritura | pruebas de ciclo | Validado |
| RF-EST-019 | Retirar imagen anterior | `imageLifecycle.js` | PUT/DELETE | pruebas de ciclo | Validado |
| RF-EST-020 | Persistencia remota | `cloudinaryService.js; uploadMiddleware.js; imageLifecycle.js` | carga de imágenes | evidencia Bloque 11 y verificación local | Validado local; repetir en Render |
| RF-EST-021 | OpenAPI real | `openapi.yaml; route-inventory.md` | 70 operaciones | script de sincronización | Validado 70/70 |
| RF-EST-022 | Trazabilidad | esta matriz | SDD | Bloques 6 y 12 | Validado |
| RF-EST-023 | Pruebas backend | `backend/tests` | 15 suites | 388/388 | Validado |
| RF-EST-024 | Newman | `tests/postman; runNewman.js` | 11 solicitudes | 17 aserciones, 0 fallos | Validado local |
| RF-EST-025 | Playwright | `frontend/tests/e2e` | 4 flujos | JUnit 0 fallos | Validado local |
| RF-EST-026 | Paginación | controladores distritos/ciudades | GET | pruebas de módulos | Parcial |
| RF-EST-027 | Multimedia optimizada | activos WebP/video | build | Bloques 8 y 9 | Validado |
| RF-EST-028 | Sin debug | `app.js` | health y 404 | pruebas de seguridad | Validado |

## Trazabilidad operativa adicional

| Decisión | Artefacto | Evidencia/estado |
|---|---|---|
| Auditoría de dependencias | `package-lock.json; block9-dependency-security.ps1` | 0 vulnerabilidades |
| Base limpia para producción | `database/maintenance/012-limpiar-datos-y-reiniciar-identities.sql` | Ejecutada localmente |
| Estructura uploads vacía | `backend/uploads/**/.gitkeep` | Verificable por Bloque 12 |
| Stack CSS real | `frontend/src/**/*.css; package.json` | Sin Tailwind |
| Azure SQL | próximo bloque | Pendiente |
| Render/Vercel | próximo bloque | Pendiente |

## Métricas

- 70 operaciones HTTP.
- 15 suites y 388 pruebas.
- 363 pruebas unitarias y 25 de integración.
- Cobertura S89.98/B87.48/F96.18/L89.85.
- Newman: 11 solicitudes, 17 aserciones y 0 fallos.
- Playwright: 4 flujos y 0 fallos.
