# Matriz de trazabilidad: Presentación departamental

**Feature**: `003-actualizar-presentacion-departamento`

**Fecha de validación local**: 2026-07-21

**Estado general**: Validado automáticamente; validación E2E manual pendiente

## Trazabilidad

| Requisito | Diseño | Implementación | Prueba/evidencia | Estado |
|-----------|--------|----------------|------------------|--------|
| FR-001, FR-002 | `PATCH /departamentos/{id}/introduccion` | `departamentoRoutes.js` | `api.integration.test.js` | Validado |
| FR-003 | Actualización SQL de una columna | `departamentoModel.js` | `departamentoModel.test.js`, integración | Validado |
| FR-004 | ID positivo y existencia | Middlewares de ruta | Casos 400 y 404 de integración | Validado |
| FR-005 | Texto opcional; retirada como `null` | `validationMiddleware.js` | `validationMiddleware.test.js` | Validado |
| FR-006 | Cuerpo estricto | `validateDepartamentoIntroduccionBody` | Omisión, tipo y campo adicional | Validado |
| FR-007 | JWT y rol vigente | `verifyToken`, `isAdmin` | Casos 401 y 403 | Validado |
| FR-008, FR-009 | Respuesta y errores normalizados | `departamentoController.js` | Pruebas unitarias e integración | Validado |
| FR-010, FR-011 | Servicio JSON y formulario dedicado | `departamentoService.js`, `GestionContenidoDepartamento.jsx` | Lint y build; recorrido manual | Implementado, pendiente de validación E2E manual |
| FR-012 | `PUT` sin cambios contractuales | Ruta y controlador existentes | Casos PUT válido e incompleto | Validado |
| FR-013 | Cobertura automatizada | Suites backend | 16 suites, 410 pruebas | Validado |
| FR-014 | Contrato y trazabilidad | OpenAPI global y artefactos 003 | Sincronización 70/70 | Validado |
| SC-001, SC-002 | Éxito y conservación | Capas backend dedicadas | Integración y modelo | Validado |
| SC-003 | Denegación administrativa | Middlewares vigentes | Casos 401/403 | Validado |
| SC-004 | Una acción y menos de 2 segundos local | Formulario y endpoint | Aserción de integración `<2000 ms`; E2E visual pendiente | Implementado, pendiente de validación E2E manual |
| SC-005 | Suite completa satisfactoria | Validación local | Jest, lint, build y OpenAPI | Validado |

## Evidencia ejecutada

| Comando | Resultado real |
|---------|----------------|
| `npm.cmd ci` en `backend/` | Correcto; 505 paquetes instalados |
| `npm.cmd ci` en `frontend/` | Correcto; 191 paquetes instalados; advertencia informativa de `allow-scripts` para esbuild |
| Pruebas focalizadas backend | 4 suites, 63 pruebas, todas aprobadas |
| `npm.cmd test` en `backend/` | 16 suites, 410 pruebas, todas aprobadas |
| `npm.cmd run lint` en `frontend/` | Correcto, sin errores |
| `npm.cmd run build` en `frontend/` | Correcto; advertencia no bloqueante por chunk de 676.93 kB |
| `node scripts/check-openapi-sync.mjs` | Correcto; 71 rutas reales, 71 operaciones y sincronización 70/70 |

La línea base documentada era 15 suites y 388 pruebas. El resultado actual añade una suite de modelo y 22 pruebas para actualización parcial, validación, seguridad y regresión, alcanzando 16 suites y 410 pruebas.

## Pendientes

- **Pendiente**: recorrido E2E visual con backend, frontend y cuenta administrativa local existente. No se ejecutó porque esta sesión no dispone de esos servicios ni de una cuenta local autorizada, y no se permite crear usuarios QA automáticamente.
- **Pendiente de autorización humana**: commit, push, Pull Request, merge y despliegue.
