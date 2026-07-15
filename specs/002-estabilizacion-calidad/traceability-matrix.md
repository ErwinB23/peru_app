# Matriz de Trazabilidad — SPEC-002

## 1. Identificación

- **Código:** TRACE-002
- **Especificación:** `SPEC-002`
- **Plan:** `PLAN-002`
- **Tareas:** `TASKS-002`
- **Estado:** activa; se actualiza con cada bloque
- **Fecha de corte:** 14 de julio de 2026

## 2. Convención de estados

- **Documentado:** requisito, tarea y caso de prueba definidos.
- **Implementado, pendiente de validación:** existe código, pero falta evidencia automatizada o manual suficiente.
- **Validado:** existe código, prueba ejecutada y evidencia.
- **Pendiente:** aún no implementado.
- **Brecha:** el código actual contradice el requisito.

## 3. Trazabilidad principal

| Requisito | Prioridad | Tareas | Código o artefacto objetivo | Endpoint/flujo | Caso de prueba | Evidencia esperada | Estado real |
|---|---|---|---|---|---|---|---|
| RF-EST-001 | P1 | T-EST-012, T-EST-036, T-EST-037 | `backend/src/routes/*.js` | Solo registro/login públicos | CP-EST-AUTH-004/005 | Supertest + Newman | **Brecha:** 8 GET territoriales públicos |
| RF-EST-002 | P1 | T-EST-030, T-EST-033, T-EST-036, T-EST-037 | `authMiddleware.js`, rutas | Toda ruta funcional protegida | CP-EST-AUTH-004 | Reporte 401 | Pendiente |
| RF-EST-003 | P1 | T-EST-030, T-EST-032 | `authMiddleware.js`, `userModel.js` | Token de usuario eliminado | CP-EST-AUTH-008 | Prueba integración | Pendiente |
| RF-EST-004 | P1 | T-EST-031, T-EST-038 | `authMiddleware.js`, `roleMiddleware.js` | Administración por rol vigente | CP-EST-AUTH-006/007/009 | Reporte 403/éxito | Pendiente |
| RF-EST-005 | P1 | T-EST-034 | `frontend/src/context/AuthContext.jsx`, `authService.js` | Recarga con sesión | CP-EST-AUTH-010 | Playwright | Pendiente |
| RF-EST-006 | P1 | T-EST-035 | Cliente Axios central | Respuesta 401 global | CP-EST-AUTH-010 | Playwright | Pendiente |
| RF-EST-007 | P1 | T-EST-038, T-EST-040 | `roleMiddleware.js`, routers CRUD | Usuario intenta administrar | CP-EST-AUTH-006 | Supertest/Newman | Implementado parcialmente; falta validar rol vigente |
| RF-EST-008 | P1 | T-EST-039 | `server.js` o middleware rate limit | Login/registro abusivo | Caso por crear | Reporte 429 | Pendiente |
| RF-EST-009 | P1 | T-EST-057/058/059 | Validadores y controladores | CRUD principal | CP-EST-ERR-001 | Unitarias/integración | Implementado de forma dispersa |
| RF-EST-010 | P1 | T-EST-057/058/059 | Middleware de validación | Errores por campo | CP-EST-ERR-001 | JSON de respuesta | Pendiente |
| RF-EST-011 | P1 | T-EST-054/055/056 | Error handler global | 400/401/403/404/409/413/415/500 | CP-EST-ERR-001..004, IMG-003/004 | Newman | Pendiente |
| RF-EST-012 | P1 | T-EST-053/054 | `server.js`, error handler | Error inesperado | Caso por crear | Sin datos internos | **Brecha:** rutas debug exponen detalles |
| RF-EST-013 | P2 | T-EST-060 | `database/migrations/` | Evolución SQL | Caso revisión | Scripts versionados | Pendiente |
| RF-EST-014 | P1 | T-EST-061 | Migración SQL | Área/población/coordenadas | Caso BD | Evidencia SSMS | Pendiente |
| RF-EST-015 | P1 | T-EST-062 | Modelos/controladores/SQL | Eliminación con hijos | CP-EST-ERR-004 | HTTP 409 | Integridad FK existente; mapeo HTTP pendiente |
| RF-EST-016 | P2 | T-EST-063 | Modelos y transacciones | Operación múltiple | Caso integración | Rollback probado | Pendiente |
| RF-EST-017 | P1 | T-EST-065 | `uploadMiddleware.js` | Archivo inválido | CP-EST-IMG-003/004 | 413/415 | Implementado parcialmente |
| RF-EST-018 | P1 | T-EST-066 | Controladores/upload | Falla SQL tras upload | CP-EST-IMG-001 | Archivo no queda huérfano | Pendiente |
| RF-EST-019 | P1 | T-EST-067 | Controladores/modelos | Reemplazo de imagen | CP-EST-IMG-002 | Archivo anterior eliminado | Pendiente |
| RF-EST-020 | P2 | T-EST-023 | `server.js` | `/uploads` | Caso manual | URL única | Implementado, pendiente de validación de despliegue |
| RF-EST-021 | P1 | T-EST-080/081 | `route-inventory.md`, `openapi.yaml` | Contrato REST | CP-EST-SDD-001 | Comparación contrato/código | Inventario validado; OpenAPI pendiente |
| RF-EST-022 | P1 | T-EST-082/083 | `traceability-matrix.md`, checklist | Requisito→código→prueba | CP-EST-SDD-001 | Revisión SDD | **Validado documentalmente en Bloque 1** |
| RF-EST-023 | P1 | T-EST-084 | Backend tests | Autenticación y CRUD | Casos AUTH/ERR | Reporte Jest/Vitest | Pendiente |
| RF-EST-024 | P1 | T-EST-085 | Postman/Newman | API crítica | Casos AUTH/ERR | HTML Newman | Pendiente |
| RF-EST-025 | P1 | T-EST-086/087 | RTL/Playwright | Login, navegación, admin, logout | CP-EST-AUTH-010 y E2E | Reporte Playwright | Pendiente |
| RF-EST-026 | P3 | T-EST-089/090 | Listados/frontend | Paginación | Caso rendimiento | Evidencia comparativa | Postergado |
| RF-EST-027 | P3 | T-EST-089/090/091 | Frontend/assets | Multimedia | CP-EST-REG-002 | Comparación visual | Postergado |
| RF-EST-028 | P1 | T-EST-053 | `server.js` | Debug y health | Caso seguridad | `/api/test-db` y `/api/debug-token` ausentes | **Brecha** |

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
