# Research: Actualización parcial de presentación departamental

## Decisión 1: Semántica y ruta de la operación

**Decision**: Crear `PATCH /api/departamentos/:id/introduccion`.

**Rationale**: La operación modifica un solo atributo existente y tiene una intención de negocio específica. `PATCH` expresa la actualización parcial y el sufijo `introduccion` evita confundirla con una flexibilización general del recurso. Además, deja intacto el `PUT /api/departamentos/:id` requerido para la edición completa.

**Alternatives considered**:

- Permitir cuerpos parciales en el `PUT` existente: descartado porque cambia su contrato y debilita la exigencia de datos generales.
- `PATCH /api/departamentos/:id` genérico: descartado porque ampliaría el alcance y exigiría definir una política parcial para todos los atributos.
- `PUT /api/departamentos/:id/introduccion`: viable, pero `PATCH` comunica mejor que se modifica una parte del recurso departamento.

## Decisión 2: Campo canónico

**Decision**: Mantener `introduccion` como nombre canónico del campo en almacenamiento, contrato y frontend.

**Rationale**: La pantalla afectada ya carga y presenta `departamento.introduccion`, y la columna existe. La palabra “descripción” del reporte expresa la función editorial, no una solicitud de migrar al campo general `descripcion`.

**Alternatives considered**:

- Actualizar `descripcion`: descartado porque corresponde al resumen mostrado en otras vistas y no al formulario reportado.
- Crear una columna nueva: descartado por duplicar significado y requerir una migración innecesaria.

## Decisión 3: Formato de solicitud

**Decision**: Enviar JSON con una única propiedad `introduccion`; no usar datos multipart ni middleware de imágenes.

**Rationale**: La operación no transporta archivos. JSON reduce procesamiento incidental y hace explícito el contrato mínimo.

**Alternatives considered**:

- Mantener `FormData`: descartado porque conserva una dependencia innecesaria del flujo de actualización con imágenes.
- Enviar el texto sin objeto: descartado porque se aparta de las convenciones JSON del proyecto y dificulta evolución/documentación.

## Decisión 4: Validación estricta y borrado

**Decision**: Exigir que el cuerpo contenga la clave `introduccion`, aceptar texto o borrado explícito mediante valor vacío/null normalizado, y rechazar propiedades adicionales.

**Rationale**: Distingue una solicitud intencional de una solicitud vacía y garantiza que el endpoint no se convierta en un actualizador parcial encubierto. La presentación ya es opcional, por lo que retirar su contenido forma parte del comportamiento esperado.

**Alternatives considered**:

- Aceptar un cuerpo vacío como borrado: descartado por ser ambiguo.
- Ignorar propiedades adicionales: descartado porque podría ocultar errores del cliente y contradecir la actualización exclusiva.
- Prohibir borrar la presentación: descartado porque el campo es opcional en el sistema vigente.

## Decisión 5: Persistencia y respuesta

**Decision**: Ejecutar una consulta parametrizada que actualice únicamente `introduccion`, use `OUTPUT INSERTED.*` y devuelva la misma forma de confirmación utilizada por la actualización completa.

**Rationale**: Una sentencia de una sola columna ofrece la garantía más directa de no alterar atributos generales. Devolver el recurso actualizado permite al frontend reconciliar el estado persistido.

**Alternatives considered**:

- Leer, fusionar y reutilizar el modelo de actualización completa: descartado porque aumenta el riesgo de sobrescribir datos y mantiene el acoplamiento que causó el defecto.
- Actualizar y luego ejecutar una segunda consulta: descartado porque `OUTPUT` obtiene el resultado en la misma operación.

## Decisión 6: Seguridad y existencia

**Decision**: Reutilizar `verifyToken`, `isAdmin`, `validateIdParam` y `ensureResourceExists('Departamentos')` en la nueva ruta.

**Rationale**: Estos componentes ya aplican la política constitucional: JWT válido, usuario existente y rol actual consultado desde la base de datos, ID positivo y recurso existente.

**Alternatives considered**:

- Validar permisos dentro del controlador: descartado por duplicar responsabilidades y apartarse de la arquitectura vigente.
- Confiar en el rol del token: descartado expresamente por la Constitución.

## Decisión 7: Estrategia de pruebas y contrato

**Decision**: Añadir pruebas unitarias del controlador y comportamiento de datos, pruebas de integración HTTP para validación/seguridad/compatibilidad, sincronizar `specs/001-peru-app/openapi.yaml` y ejecutar el verificador existente.

**Rationale**: La falla cruza frontend, validación, ruta y persistencia. La combinación cubre unidades y contrato observable sin usar producción ni crear cuentas QA.

**Alternatives considered**:

- Probar solo el formulario: descartado porque no demuestra seguridad ni conservación de datos.
- Probar únicamente el controlador: descartado porque no detecta errores de composición de middleware o contrato HTTP.
