# Feature Specification: Actualización parcial de presentación departamental

**Feature Branch**: `003-actualizar-presentacion-departamento`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "Corregir la gestión administrativa para permitir actualizar únicamente la descripción o presentación informativa de un departamento, sin reenviar sus datos generales obligatorios y sin alterar la actualización completa existente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guardar únicamente la presentación (Priority: P1)

Como administrador, quiero editar y guardar la presentación informativa de un departamento sin volver a ingresar ni reenviar sus datos generales, para mantener actualizado el contenido público sin recibir un rechazo por campos ajenos a esta edición.

**Why this priority**: Resuelve directamente el error que impide completar una tarea administrativa ya disponible en la interfaz.

**Independent Test**: Puede probarse con un departamento existente, cambiando solamente su presentación y comprobando que el nuevo texto queda almacenado mientras todos sus demás datos conservan sus valores anteriores.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado y un departamento existente, **When** guarda una presentación válida sin proporcionar nombre, capital, región natural, área ni población, **Then** el sistema acepta la operación y devuelve la presentación actualizada.
2. **Given** un departamento con datos generales e imagen existentes, **When** el administrador actualiza solamente su presentación, **Then** todos los demás campos del departamento permanecen sin cambios.
3. **Given** que la actualización se completó correctamente, **When** el administrador vuelve a consultar el contenido del departamento, **Then** visualiza la nueva presentación persistida.

---

### User Story 2 - Recibir validaciones seguras y claras (Priority: P2)

Como administrador, quiero recibir una respuesta clara cuando la presentación o el identificador no sean válidos, para corregir la solicitud sin afectar la información existente.

**Why this priority**: Evita cambios inválidos y mantiene el comportamiento seguro y predecible del panel.

**Independent Test**: Puede probarse enviando identificadores inválidos, departamentos inexistentes y contenidos que incumplan las reglas permitidas, verificando el rechazo y la conservación de los datos previos.

**Acceptance Scenarios**:

1. **Given** un identificador inválido, **When** se intenta guardar una presentación, **Then** el sistema rechaza la operación con un mensaje comprensible y no modifica ningún departamento.
2. **Given** un identificador válido que no corresponde a un departamento existente, **When** se intenta guardar una presentación, **Then** el sistema informa que el departamento no existe y no crea registros.
3. **Given** una presentación que incumple las reglas de contenido vigentes, **When** el administrador intenta guardarla, **Then** el sistema la rechaza con un error de validación y conserva la presentación anterior.

---

### User Story 3 - Conservar la edición completa existente (Priority: P3)

Como administrador, quiero que la edición general del departamento siga funcionando con sus validaciones actuales, para que la corrección de la presentación no introduzca regresiones en la gestión territorial.

**Why this priority**: La compatibilidad del flujo existente es una restricción expresa del cambio.

**Independent Test**: Puede probarse ejecutando una actualización completa válida y otra incompleta, comprobando que ambas conservan el comportamiento previo.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado, **When** actualiza todos los datos generales obligatorios de un departamento, **Then** la edición completa continúa realizándose correctamente.
2. **Given** una actualización completa que omite datos generales obligatorios, **When** se intenta procesarla, **Then** continúa siendo rechazada conforme a las validaciones vigentes.

### Edge Cases

- Una presentación vacía se interpreta como la intención explícita de retirar el texto informativo y se almacena como ausencia de contenido (`null`), conforme al comportamiento opcional vigente del campo.
- Los espacios exteriores del texto se normalizan según las reglas de validación existentes; los saltos de línea internos necesarios para separar párrafos se conservan.
- Una solicitud sin autenticación válida, de un usuario inexistente o de un usuario sin rol administrador se rechaza sin modificar datos.
- Dos actualizaciones consecutivas de la presentación dejan persistido el valor de la última operación completada correctamente.
- Un fallo inesperado durante el guardado no debe producir una respuesta de éxito ni alterar parcialmente otros atributos del departamento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST ofrecer una operación administrativa dedicada a actualizar únicamente la presentación informativa de un departamento existente.
- **FR-002**: La operación dedicada MUST aceptar el identificador del departamento y el campo de presentación sin exigir nombre, capital, región natural, área ni población.
- **FR-003**: La operación dedicada MUST modificar exclusivamente la presentación; todos los demás atributos del departamento MUST conservar sus valores anteriores.
- **FR-004**: El sistema MUST validar que el identificador sea un entero positivo y que el departamento exista antes de intentar la modificación.
- **FR-005**: El sistema MUST aplicar a la presentación las reglas vigentes para texto opcional, incluida la posibilidad de retirar el contenido mediante un valor vacío explícito.
- **FR-006**: El sistema MUST rechazar campos adicionales en la operación dedicada para impedir que se utilice como una actualización parcial no controlada de otros atributos.
- **FR-007**: La operación dedicada MUST requerir una sesión válida y el rol administrador vigente, con las mismas garantías de autorización que las demás operaciones administrativas.
- **FR-008**: Ante una actualización exitosa, el sistema MUST devolver una confirmación y el departamento con la presentación ya actualizada.
- **FR-009**: Ante datos inválidos, falta de autorización, recurso inexistente o error interno, el sistema MUST devolver un resultado coherente con las convenciones de error vigentes y no modificar la información existente.
- **FR-010**: El formulario de presentación del panel administrador MUST usar exclusivamente la operación dedicada y enviar solamente el campo de presentación.
- **FR-011**: Después de guardar correctamente, el panel MUST mostrar una confirmación y reflejar el valor persistido; ante un error, MUST conservar el texto editable y mostrar un mensaje comprensible.
- **FR-012**: La operación de edición completa de departamentos MUST conservar su contrato, sus campos obligatorios y su comportamiento actual.
- **FR-013**: La corrección MUST contar con pruebas automatizadas que cubran éxito, conservación de campos no editados, validación, recurso inexistente, autorización y compatibilidad de la edición completa.
- **FR-014**: La documentación del contrato y la trazabilidad de la feature MUST distinguir la actualización dedicada de presentación de la actualización completa del departamento.

### Key Entities

- **Departamento**: Unidad territorial administrada; mantiene datos generales obligatorios, contenido informativo opcional, imagen y relaciones territoriales. En esta feature solamente cambia su presentación informativa.
- **Presentación departamental**: Texto informativo opcional, con soporte para varios párrafos, que se muestra debajo de la ficha informativa del departamento.
- **Administrador**: Usuario autenticado cuyo rol vigente le permite gestionar el contenido departamental.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las actualizaciones válidas que contienen únicamente la presentación de un departamento existente se completan sin exigir datos generales.
- **SC-002**: En el 100% de las actualizaciones dedicadas, nombre, capital, región natural, área, población, imagen y demás atributos no incluidos conservan exactamente su valor anterior.
- **SC-003**: El 100% de los intentos realizados sin permiso administrativo vigente son rechazados sin cambios en el departamento.
- **SC-004**: El administrador puede completar el guardado de la presentación en una sola acción y recibe confirmación o un error comprensible en menos de 2 segundos bajo condiciones locales normales.
- **SC-005**: Todas las pruebas automatizadas nuevas de los escenarios de esta feature y todas las pruebas existentes de edición completa finalizan satisfactoriamente antes de considerar el cambio validado.

## Assumptions

- La “descripción o presentación informativa” reportada corresponde al campo que la interfaz actual denomina “Presentación” e “Introducción del departamento”; el resumen general denominado “descripción” permanece fuera del alcance de esta operación dedicada.
- La presentación continúa siendo opcional y admite varios párrafos; no se introduce un nuevo atributo de datos ni una migración de registros existentes.
- Se reutilizan la autenticación, la consulta del rol vigente y las convenciones de errores ya establecidas para las funciones administrativas.
- La edición de datos generales, imágenes, lugares turísticos y comidas típicas queda fuera del alcance, salvo las comprobaciones necesarias para evitar regresiones.
- Todo el análisis, desarrollo y validación posterior se realizará únicamente en el entorno local, sin crear cuentas de prueba en producción ni ejecutar commit, push, merge o despliegue.
