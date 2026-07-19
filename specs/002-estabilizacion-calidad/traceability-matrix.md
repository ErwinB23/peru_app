# Matriz de Trazabilidad Final — SPEC-002

**Código:** TRACE-002  
**Fecha:** 18 de julio de 2026  
**Estado:** producción validada y cierre SDD actualizado

| Requisito | Resultado esperado | Código / artefacto | Endpoint o flujo | Prueba / evidencia | Estado |
|---|---|---|---|---|---|
| RF-EST-001 | Rutas públicas mínimas | `app.js; authRoutes.js` | register/login/health | Jest e inspección de rutas | Validado |
| RF-EST-002 | JWT en rutas funcionales | `authMiddleware.js; routes/*.js` | operaciones protegidas | Jest/Supertest | Validado |
| RF-EST-003 | Usuario vigente | `authMiddleware.js; userModel.js` | flujo JWT | Jest | Validado |
| RF-EST-004 | Rol vigente | `authMiddleware.js; roleMiddleware.js` | CRUD admin | Jest y prueba manual | Validado |
| RF-EST-005 | Perfil al cargar | `AuthContext.jsx; authService.js` | `GET /auth/profile` | Playwright local y producción manual | Validado |
| RF-EST-006 | Interceptor 401 | `api.js; AuthContext.jsx` | sesión frontend | Playwright/manual | Validado |
| RF-EST-007 | 403 para usuario | `roleMiddleware.js` | CRUD admin | Jest/Supertest/manual | Validado |
| RF-EST-008 | Rate limit | configuración de autenticación | register/login | Inspección y pruebas base | Implementado |
| RF-EST-009 | Validación | `validationMiddleware.js` | escrituras | Jest | Validado |
| RF-EST-010 | Detalle por campo | `validationMiddleware.js; api.js` | 400 | Jest | Validado |
| RF-EST-011 | Estados HTTP | `httpErrors.js; errorMiddleware.js` | API | Jest/Supertest | Validado |
| RF-EST-012 | Error central seguro | `httpErrors.js; errorMiddleware.js` | 500 | Jest | Validado |
| RF-EST-013 | Migraciones | `database/migrations/005-integridad-basica.sql` | SQL Server | scripts SQL | Implementado |
| RF-EST-014 | CHECK de rangos | scripts SQL | SQL Server | pruebas de integridad | Validado |
| RF-EST-015 | No borrar relaciones | FK y `httpErrors.js` | DELETE | Jest/Supertest | Validado |
| RF-EST-016 | Transacciones críticas | modelos | operaciones múltiples | revisión técnica | Parcial |
| RF-EST-017 | Validar imágenes | `uploadMiddleware.js` | multipart | Jest | Validado |
| RF-EST-018 | Limpiar recurso nuevo | `fileCleanup.js` | error de escritura | Jest | Validado |
| RF-EST-019 | Retirar imagen anterior | `imageLifecycle.js` | PUT/DELETE | Jest/manual | Validado |
| RF-EST-020 | Persistencia remota | `cloudinaryService.js; imageLifecycle.js` | carga de imágenes | Bloque 11 y producción manual | Validado |
| RF-EST-021 | OpenAPI real | `openapi.yaml; route-inventory.md` | 70 operaciones | `check-openapi-sync.mjs` | Validado 70/70 |
| RF-EST-022 | Trazabilidad | esta matriz y SDD | ciclo completo | revisión documental | Validado |
| RF-EST-023 | Pruebas backend | `backend/tests` | 15 suites | 388/388 | Validado |
| RF-EST-024 | Colección API | `tests/postman; runNewman.js` | 11 solicitudes | reporte no aceptado por cuentas QA eliminadas | Implementado, no usado como gate |
| RF-EST-025 | E2E frontend | `frontend/tests/e2e` | 4 flujos | JUnit 0 fallos local | Validado local |
| RF-EST-026 | Paginación | controladores distritos/ciudades | GET | pruebas de módulos | Parcial |
| RF-EST-027 | Multimedia | activos optimizados | build | Bloques 8 y 9 | Validado |
| RF-EST-028 | Sin debug | `app.js` | health y 404 | Jest/inspección | Validado |
| RF-EST-029 | AWS RDS | `database.js; env.js` | conexión SQL | health y prueba funcional | Validado |
| RF-EST-030 | Backend Render | configuración proveedor | API HTTPS | health público | Validado |
| RF-EST-031 | Frontend Vercel | Vite y variable API | navegación | prueba manual | Validado |
| RF-EST-032 | CORS definitivo | `app.js; FRONTEND_URLS` | frontend → API | consola/navegación | Validado |
| RF-EST-033 | Recarga SPA | `frontend/vercel.json` | rutas React | F5 y URL directa | Validado |
| RF-EST-034 | CRUD cloud | controladores, RDS y Cloudinary | crear/editar/eliminar | registro temporal | Validado |

## Trazabilidad operativa

| Decisión | Artefacto | Evidencia / estado |
|---|---|---|
| Frontend sin Tailwind | `frontend/package.json; frontend/src/**/*.css` | Confirmado |
| Auditoría de dependencias | `package-lock.json; block9-dependency-security.ps1` | Sin vulnerabilidades reportadas |
| Base preparada | scripts de `database/` | Ejecutada y migrada a AWS RDS |
| Cloudinary | servicios y variables de entorno | Activo en producción |
| AWS RDS | `database.js; checkDatabaseConfig.js` | Conectado |
| Render | backend y health | Desplegado |
| Vercel | frontend y `vercel.json` | Desplegado |
| CORS | `FRONTEND_URLS` | Dominio definitivo |
| Despliegue automático | GitHub + proveedores | Rama `002-estabilizacion-calidad` |
| QA en producción | decisión documentada | Sin nuevas cuentas QA |

## Métricas finales

- 70 operaciones HTTP documentadas.
- 15 suites y 388 pruebas backend aprobadas.
- 363 pruebas unitarias y 25 de integración HTTP.
- Cobertura S89.98/B87.48/F96.18/L89.85.
- Playwright local: 4 flujos y 0 fallos.
- Newman final: no usado como gate por eliminación de cuentas QA.
- Frontend, backend, base e imágenes validados de forma integrada.
