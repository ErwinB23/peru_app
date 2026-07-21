# Tasks: ActualizaciÃ³n parcial de presentaciÃ³n departamental

**Input**: Design documents from `/specs/003-actualizar-presentacion-departamento/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Obligatorios por FR-013. Las tareas de pruebas de cada historia se ejecutan antes de su implementaciÃ³n y deben evidenciar el fallo previo cuando corresponda.

**Organization**: Las tareas se agrupan por historia de usuario para mantener trazabilidad y permitir validar cada incremento de forma independiente.

## Execution Record

- Rama inicial: `002-estabilizacion-calidad`; rama de trabajo creada: `003-actualizar-presentacion-departamento`.
- Cambio preexistente preservado: `specs/001-peru-app/sdd-review-checklist.md`.
- Pruebas existentes revisadas: controlador de departamentos, validaciÃ³n central e integraciÃ³n HTTP.
- Dependencias existentes suficientes; no se agregaron paquetes ni migraciones.
- Resultados completos y pendientes documentados en `traceability-matrix.md` y `docs/estabilizacion/evidencias/003-actualizar-presentacion-departamento.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo porque trabaja en archivos distintos y no depende de una tarea incompleta.
- **[Story]**: Historia de usuario atendida (`US1`, `US2`, `US3`).
- Cada tarea incluye una ruta exacta.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar el punto de partida y preparar el contrato de trabajo sin agregar dependencias ni migraciones.

- [x] T001 Verificar que los scripts y dependencias existentes cubren Jest, Supertest, Axios, lint y build sin agregar paquetes, documentando cualquier brecha en `specs/003-actualizar-presentacion-departamento/research.md`
- [x] T002 Registrar el inventario inicial de archivos modificados, pruebas existentes del mÃ³dulo departamentos y rama activa en `specs/003-actualizar-presentacion-departamento/tasks.md`, sin alterar cambios preexistentes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establecer el contrato canÃ³nico y la capacidad de validaciÃ³n estricta que bloquean las tres historias.

**CRITICAL**: Ninguna historia comienza hasta completar esta fase.

- [x] T003 Incorporar `PATCH /api/departamentos/{id}/introduccion`, su cuerpo JSON estricto, seguridad y respuestas en el contrato global `specs/001-peru-app/openapi.yaml`, preservando el contrato de `PUT /api/departamentos/{id}`
- [x] T004 Preparar pruebas del validador dedicado para exigir `introduccion`, aceptar retirada explÃ­cita y rechazar propiedades adicionales en `backend/tests/unit/validationMiddleware.test.js`

**Checkpoint**: Contrato y validaciÃ³n base listos; las historias pueden implementarse conforme al diseÃ±o.

---

## Phase 3: User Story 1 - Guardar Ãºnicamente la presentaciÃ³n (Priority: P1) MVP

**Goal**: Permitir que un administrador guarde o retire Ãºnicamente `introduccion`, conservando todos los demÃ¡s atributos y mostrando el resultado persistido en el panel.

**Independent Test**: Actualizar la presentaciÃ³n de un departamento existente enviando solo `introduccion`, volver a consultarlo y comprobar que el texto persiste mientras nombre, capital, regiÃ³n, Ã¡rea, poblaciÃ³n e imagen conservan sus valores anteriores.

### Tests for User Story 1

- [x] T005 [P] [US1] AÃ±adir pruebas unitarias fallidas para Ã©xito, retirada explÃ­cita, conservaciÃ³n del recurso retornado y normalizaciÃ³n de error del controlador dedicado en `backend/tests/unit/departamentoController.test.js`
- [x] T006 [P] [US1] AÃ±adir pruebas unitarias fallidas para la consulta parametrizada que actualiza exclusivamente `introduccion` y devuelve `OUTPUT INSERTED.*` en `backend/tests/unit/departamentoModel.test.js`
- [x] T007 [P] [US1] AÃ±adir una prueba de integraciÃ³n HTTP fallida para `PATCH /api/departamentos/:id/introduccion` con administrador, cuerpo mÃ­nimo y respuesta actualizada en `backend/tests/integration/api.integration.test.js`

### Implementation for User Story 1

- [x] T008 [US1] Implementar `updateDepartamentoIntroduccion(id, introduccion)` con parÃ¡metros SQL y actualizaciÃ³n exclusiva de la columna en `backend/src/models/departamentoModel.js`
- [x] T009 [US1] Implementar el controlador dedicado con confirmaciÃ³n, departamento actualizado y manejo normalizado de errores en `backend/src/controllers/departamentoController.js`
- [x] T010 [US1] Exportar el validador especÃ­fico de `introduccion` y configurar texto normalizado, varios pÃ¡rrafos y retirada explÃ­cita en `backend/src/validators/validationMiddleware.js`
- [x] T011 [US1] Montar `PATCH /:id/introduccion` con token, rol administrador vigente, ID vÃ¡lido, existencia y validador dedicado, sin middleware de imÃ¡genes, en `backend/src/routes/departamentoRoutes.js`
- [x] T012 [P] [US1] AÃ±adir `updateDepartamentoIntroduccion(id, introduccion)` con cuerpo JSON mÃ­nimo en `frontend/src/services/departamentoService.js`
- [x] T013 [US1] Sustituir Ãºnicamente la llamada del formulario de presentaciÃ³n, conservar el texto ante error y reconciliar el valor persistido tras Ã©xito en `frontend/src/pages/GestionContenidoDepartamento.jsx`
- [x] T014 [US1] Ejecutar las pruebas de US1 y corregir exclusivamente defectos de esta historia en `backend/tests/unit/departamentoController.test.js`, `backend/tests/unit/departamentoModel.test.js` y `backend/tests/integration/api.integration.test.js`

**Checkpoint**: US1 funciona de extremo a extremo y constituye el MVP validable de forma independiente.

---

## Phase 4: User Story 2 - Recibir validaciones seguras y claras (Priority: P2)

**Goal**: Rechazar solicitudes invÃ¡lidas o no autorizadas sin modificar datos y devolver errores coherentes con el proyecto.

**Independent Test**: Probar ID invÃ¡lido, departamento inexistente, falta de token, usuario no administrador, omisiÃ³n de `introduccion`, tipo invÃ¡lido y propiedades adicionales; todos deben rechazarse sin cambios.

### Tests for User Story 2

- [x] T015 [P] [US2] Completar pruebas unitarias para propiedad ausente, tipo invÃ¡lido, normalizaciÃ³n de espacios, null y rechazo de campos adicionales en `backend/tests/unit/validationMiddleware.test.js`
- [x] T016 [P] [US2] AÃ±adir pruebas de integraciÃ³n fallidas para 400, 401, 403 y 404, verificando que el modelo no se invoca en rechazos previos, en `backend/tests/integration/api.integration.test.js`

### Implementation for User Story 2

- [x] T017 [US2] Ajustar el validador dedicado y sus detalles de error para satisfacer todos los casos estrictos sin cambiar los validadores existentes en `backend/src/validators/validationMiddleware.js`
- [x] T018 [US2] Ajustar el orden y composiciÃ³n de middlewares para aplicar autenticaciÃ³n, rol vigente, ID, existencia y cuerpo antes del controlador en `backend/src/routes/departamentoRoutes.js`
- [x] T019 [US2] Verificar y ajustar los mensajes del formulario para conservar el texto editable y presentar el error normalizado del backend en `frontend/src/pages/GestionContenidoDepartamento.jsx`
- [x] T020 [US2] Ejecutar las pruebas de US2 y corregir exclusivamente defectos de validaciÃ³n o seguridad en `backend/tests/unit/validationMiddleware.test.js` y `backend/tests/integration/api.integration.test.js`

**Checkpoint**: US1 y US2 son funcionales; todos los rechazos dejan el departamento intacto.

---

## Phase 5: User Story 3 - Conservar la ediciÃ³n completa existente (Priority: P3)

**Goal**: Demostrar que el `PUT` integral conserva sus campos obligatorios y su comportamiento anterior.

**Independent Test**: Ejecutar una actualizaciÃ³n completa vÃ¡lida y otra que omita campos generales; la primera debe aceptarse y la segunda debe seguir devolviendo validaciÃ³n 400.

### Tests for User Story 3

- [x] T021 [P] [US3] AÃ±adir pruebas de regresiÃ³n de integraciÃ³n para `PUT /api/departamentos/:id` completo vÃ¡lido e incompleto en `backend/tests/integration/api.integration.test.js`
- [x] T022 [P] [US3] Reforzar las pruebas unitarias que demuestran que `updateDepartamento` mantiene fusiÃ³n, imagen e introducciÃ³n existentes en `backend/tests/unit/departamentoController.test.js`

### Implementation for User Story 3

- [x] T023 [US3] Corregir Ãºnicamente cualquier regresiÃ³n demostrada por T021-T022 sin flexibilizar `validateDepartamentoBody` ni cambiar el contrato del `PUT` en `backend/src/routes/departamentoRoutes.js` y `backend/src/controllers/departamentoController.js`
- [x] T024 [US3] Ejecutar juntas las pruebas del `PATCH` dedicado y del `PUT` completo y resolver incompatibilidades dentro de `backend/tests/integration/api.integration.test.js` y `backend/tests/unit/departamentoController.test.js`

**Checkpoint**: Las tres historias son verificables y el endpoint completo permanece compatible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar documentaciÃ³n, trazabilidad y evidencia local de calidad.

- [x] T025 [P] Crear la matriz FR/escenario/diseÃ±o/cÃ³digo/prueba/estado en `specs/003-actualizar-presentacion-departamento/traceability-matrix.md`, usando `Implementado, pendiente de validaciÃ³n` o `Validado` solo segÃºn evidencia real
- [x] T026 [P] Revisar coherencia entre el contrato especÃ­fico y el global en `specs/003-actualizar-presentacion-departamento/contracts/departamentos-introduccion.openapi.yaml` y `specs/001-peru-app/openapi.yaml`
- [x] T027 Ejecutar `node scripts/check-openapi-sync.mjs` desde la raÃ­z y registrar el resultado real en `specs/003-actualizar-presentacion-departamento/traceability-matrix.md`
- [x] T028 Ejecutar `npm test` en `backend/` y registrar suites, pruebas y fallos reales en `specs/003-actualizar-presentacion-departamento/traceability-matrix.md`, explicando cualquier diferencia frente a 15 suites y 388 pruebas
- [x] T029 [P] Ejecutar `npm run lint` y `npm run build` en `frontend/` y registrar resultados reales en `specs/003-actualizar-presentacion-departamento/traceability-matrix.md`
- [x] T030 Ejecutar el escenario E2E local de `specs/003-actualizar-presentacion-departamento/quickstart.md` solo si existen servicios y cuenta administrativa local autorizada; registrar `Pendiente` con motivo si no estÃ¡n disponibles
- [x] T031 Ejecutar `git status --short`, `git --no-pager diff --stat` y `git diff --check`, y actualizar estados finales sin hacer commit, push, merge ni despliegue en `specs/003-actualizar-presentacion-departamento/traceability-matrix.md`
- [x] T032 Copiar un resumen verificable y no sensible de los resultados ejecutados a `docs/estabilizacion/evidencias/003-actualizar-presentacion-departamento.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; comienza inmediatamente.
- **Foundational (Phase 2)**: Depende de Setup y bloquea las historias.
- **US1 (Phase 3)**: Depende de Foundational y entrega el MVP.
- **US2 (Phase 4)**: Depende de la ruta y validador creados en US1; endurece sus bordes sin cambiar el flujo exitoso.
- **US3 (Phase 5)**: Puede preparar T021-T022 tras Foundational, pero la ejecuciÃ³n conjunta T024 depende de US1 y US2.
- **Polish (Phase 6)**: Depende de todas las historias seleccionadas.

### User Story Dependencies

```text
Setup -> Foundational -> US1 (MVP) -> US2 -> US3 -> Polish
                         |             |
                         `---------> regression preparation (T021-T022)
```

- **US1**: Primera entrega funcional; no depende de otras historias.
- **US2**: Usa la operaciÃ³n de US1 para validar errores, seguridad y no modificaciÃ³n.
- **US3**: Es conceptualmente independiente, pero su validaciÃ³n final se ejecuta junto con el nuevo endpoint para demostrar compatibilidad.

### Within Each User Story

- Escribir las pruebas indicadas y comprobar que fallan por ausencia del comportamiento antes de implementar.
- Implementar persistencia antes del controlador y controlador antes de montar la ruta.
- Implementar el servicio antes de conectar la pantalla.
- Ejecutar la prueba independiente del checkpoint antes de avanzar.
- No modificar pruebas para ocultar defectos ni marcar tareas como validadas sin ejecuciÃ³n.

### Parallel Opportunities

- T005, T006 y T007 pueden escribirse en paralelo en archivos distintos.
- T012 puede desarrollarse en paralelo con T008-T011 despuÃ©s de fijar el contrato.
- T015 y T016 pueden escribirse en paralelo.
- T021 y T022 pueden escribirse en paralelo y prepararse mientras se completa US2.
- T025 y T026 pueden ejecutarse en paralelo; T029 puede ejecutarse en paralelo con T027-T028 si las implementaciones ya terminaron.

---

## Parallel Example: User Story 1

```text
Task T005: Pruebas unitarias del controlador en backend/tests/unit/departamentoController.test.js
Task T006: Pruebas unitarias del modelo en backend/tests/unit/departamentoModel.test.js
Task T007: Prueba HTTP de Ã©xito en backend/tests/integration/api.integration.test.js
```

## Parallel Example: User Story 2

```text
Task T015: Pruebas del validador en backend/tests/unit/validationMiddleware.test.js
Task T016: Pruebas HTTP de seguridad y errores en backend/tests/integration/api.integration.test.js
```

## Parallel Example: User Story 3

```text
Task T021: RegresiÃ³n HTTP del PUT en backend/tests/integration/api.integration.test.js
Task T022: RegresiÃ³n del controlador completo en backend/tests/unit/departamentoController.test.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup.
2. Completar Foundational.
3. Escribir las pruebas T005-T007 y observar el fallo esperado.
4. Implementar T008-T013.
5. Ejecutar T014 y detenerse para validar US1 independientemente.

### Incremental Delivery

1. Setup + Foundational: contrato y validaciÃ³n base listos.
2. US1: guardado parcial funcional y persistente.
3. US2: bordes de validaciÃ³n, autorizaciÃ³n y errores cubiertos.
4. US3: compatibilidad del `PUT` demostrada.
5. Polish: OpenAPI, trazabilidad, suite completa, lint, build y revisiÃ³n Git.

### Safe Local Execution

- Trabajar Ãºnicamente sobre servicios y datos locales autorizados.
- No ejecutar `qa:seed` ni crear cuentas QA.
- No acceder a producciÃ³n ni realizar operaciones en AWS RDS, Cloudinary, Render o Vercel.
- Detenerse antes de commit, push, merge o despliegue y solicitar autorizaciÃ³n humana.

## Notes

- `[P]` indica archivos distintos y ausencia de dependencia inmediata.
- Cada tarea de historia incluye `[US1]`, `[US2]` o `[US3]` para trazabilidad.
- No hay migraciÃ³n ni dependencia nueva prevista.
- La advertencia de tamaÃ±o del bundle no constituye por sÃ­ sola un fallo de build.
- Los resultados numÃ©ricos se registran Ãºnicamente despuÃ©s de ejecutar los comandos correspondientes.
