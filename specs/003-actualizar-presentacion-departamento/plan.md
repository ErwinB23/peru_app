# Implementation Plan: Actualización parcial de presentación departamental

**Branch**: `003-actualizar-presentacion-departamento` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-actualizar-presentacion-departamento/spec.md`

## Summary

Incorporar una operación parcial dedicada para que un administrador actualice únicamente la presentación (`introduccion`) de un departamento, sin relajar la validación ni modificar el contrato de edición completa. Se añadirá un `PATCH` JSON protegido en la ruta de departamentos, con validador de cuerpo estricto, controlador y consulta SQL parametrizada específicos. El servicio y la pantalla administrativa usarán la nueva operación. El contrato OpenAPI global, las pruebas del backend y la validación del frontend quedarán sincronizados.

## Technical Context

**Language/Version**: JavaScript ESM sobre Node.js >=20.19.0; React 19.2

**Primary Dependencies**: Express 4.18, mssql 12.7, JWT 9; React Router 7.18, Axios 1.18, Vite 7.3

**Storage**: Microsoft SQL Server; tabla existente `Departamentos`, columna existente `introduccion`

**Testing**: Jest 30 + Supertest 7 para backend; ESLint 9 y build Vite para frontend; Playwright 1.61 cuando el entorno E2E local esté disponible

**Target Platform**: Aplicación web cliente-servidor; backend Node.js y navegador moderno

**Project Type**: Aplicación web con frontend y backend separados

**Performance Goals**: Confirmación o error visible en menos de 2 segundos en condiciones locales normales; una única escritura parametrizada por actualización

**Constraints**: Trabajo exclusivamente local; mantener `PUT /api/departamentos/:id`; sin migración; sin cambios de imágenes; autenticación JWT y rol vigente obligatorios; no leer secretos; no usar Tailwind; no ejecutar seeds, commit, push ni despliegue

**Scale/Scope**: Un endpoint, un campo existente, una pantalla y un servicio frontend; cambios focalizados en el módulo departamentos y su documentación/pruebas

## Constitution Check

*GATE: Passed before Phase 0 and re-checked after Phase 1 design.*

| Gate | Evaluation | Evidence in design |
|------|------------|--------------------|
| Specification is source of truth | PASS | `spec.md` defines 14 functional requirements and acceptance scenarios before implementation. |
| Client/server and layered architecture | PASS | Route, validator, controller, model, frontend service and page retain separate responsibilities. |
| REST API documented | PASS | A dedicated OpenAPI contract is produced and the global contract is identified for synchronization. |
| Authentication and current-role authorization | PASS | The new route reuses token verification and database-backed administrator authorization. |
| Parameterized SQL and input validation | PASS | The design uses an ID parameter and a single text parameter; the body is strictly limited to `introduccion`. |
| Incremental specification history | PASS | Work is isolated in `specs/003-actualizar-presentacion-departamento`; historical specs are not rewritten. |
| Automated evidence before validation | PASS | Unit, integration, lint, build and contract-sync checks are specified; status remains pending until executed. |
| Existing contract compatibility | PASS | The complete `PUT` route and its required-field validator remain unchanged. |
| Local-only and human-controlled delivery | PASS | No production access, QA seed, commit, push, merge or deployment is included. |

**Post-design re-check**: PASS. Phase 1 adds no new storage, dependency, public access or architectural layer. No constitutional exception is required.

## Project Structure

### Documentation (this feature)

```text
specs/003-actualizar-presentacion-departamento/
|-- spec.md
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- departamentos-introduccion.openapi.yaml
|-- checklists/
|   `-- requirements.md
`-- tasks.md                         # Generated later by speckit-tasks
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- routes/departamentoRoutes.js
|   |-- controllers/departamentoController.js
|   |-- models/departamentoModel.js
|   `-- validators/validationMiddleware.js
`-- tests/
    |-- unit/departamentoController.test.js
    `-- integration/api.integration.test.js

frontend/
|-- src/
|   |-- pages/GestionContenidoDepartamento.jsx
|   `-- services/departamentoService.js
`-- tests/e2e/admin.spec.js            # Extend only if local E2E prerequisites are available

specs/001-peru-app/openapi.yaml         # Global API contract to synchronize
scripts/check-openapi-sync.mjs          # Existing route/contract consistency check
```

**Structure Decision**: Mantener la estructura web existente. La ruta compone las protecciones, el validador limita el cuerpo, el controlador orquesta la respuesta, el modelo ejecuta una actualización parametrizada de una sola columna y el servicio frontend encapsula el nuevo contrato.

## Phase 0: Research Decisions

Los razonamientos y alternativas están consolidados en [research.md](./research.md). No quedan marcadores `NEEDS CLARIFICATION`.

## Phase 1: Design

- [data-model.md](./data-model.md) documenta que no hay migración y delimita la única transición de datos.
- [departamentos-introduccion.openapi.yaml](./contracts/departamentos-introduccion.openapi.yaml) define solicitud, respuestas y seguridad.
- [quickstart.md](./quickstart.md) establece la validación local reproducible y los resultados esperados.

## Implementation Strategy

1. Añadir un validador exportado para un cuerpo JSON que acepte únicamente `introduccion`, normalice el texto según las reglas vigentes y preserve la intención de borrado como `null`.
2. Añadir al modelo una función que actualice exclusivamente `Departamentos.introduccion` mediante parámetros y devuelva el registro actualizado.
3. Añadir un controlador dedicado y montar `PATCH /:id/introduccion` después de las protecciones de token, rol, ID y existencia. No incluir middleware de carga de imágenes.
4. Añadir al servicio frontend una función específica que envíe JSON y sustituir en la pantalla solamente la llamada del formulario de presentación.
5. Sincronizar el OpenAPI global y extender pruebas unitarias/de integración, incluida la garantía de que el `PUT` conserva su comportamiento.
6. Ejecutar las validaciones indicadas en `quickstart.md`; registrar cualquier cifra solamente a partir de resultados reales.

## Test Design

- **Validador/ruta**: acepta texto y borrado explícito; rechaza cuerpos sin el campo, tipos inválidos y propiedades adicionales.
- **Controlador/modelo**: actualiza solamente `introduccion`, devuelve el registro, normaliza errores y usa parámetros SQL.
- **Seguridad**: rechaza ausencia de token, usuario no administrador y departamento inexistente.
- **Integración**: confirma el contrato de éxito y que nombre, capital, región, área y población no cambian.
- **Regresión**: confirma que el `PUT /:id` completo sigue aceptando una carga válida y rechazando la omisión de campos obligatorios.
- **Frontend**: lint y build; E2E local del formulario cuando estén disponibles sus prerrequisitos sin crear usuarios ni tocar producción.

## Complexity Tracking

No hay violaciones constitucionales ni complejidad adicional que requiera justificación.
