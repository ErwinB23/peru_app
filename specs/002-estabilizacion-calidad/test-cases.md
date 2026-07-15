# Casos de Prueba Iniciales — SPEC-002

Estos casos definen el comportamiento objetivo. Se ejecutarán cuando se implemente cada bloque.

| ID | Prioridad | Escenario | Resultado esperado |
|---|---|---|---|
| CP-EST-AUTH-001 | P1 | Registrar usuario válido | HTTP 201, rol `usuario`, sin exponer contraseña. |
| CP-EST-AUTH-002 | P1 | Login válido | HTTP 200, token válido y datos mínimos del usuario. |
| CP-EST-AUTH-003 | P1 | Login inválido | HTTP 401 con mensaje genérico. |
| CP-EST-AUTH-004 | P1 | Consultar departamento sin token | HTTP 401. |
| CP-EST-AUTH-005 | P1 | Consultar departamento con token de usuario | HTTP 200. |
| CP-EST-AUTH-006 | P1 | Crear departamento con token de usuario | HTTP 403. |
| CP-EST-AUTH-007 | P1 | Crear departamento con token admin | Operación permitida. |
| CP-EST-AUTH-008 | P1 | Usar token de usuario eliminado | HTTP 401. |
| CP-EST-AUTH-009 | P1 | Usar token de admin degradado | Consulta permitida; administración HTTP 403. |
| CP-EST-AUTH-010 | P1 | Recargar frontend con token expirado | Sesión limpiada y redirección al login. |
| CP-EST-ERR-001 | P1 | Enviar datos inválidos | HTTP 400 con detalle por campo. |
| CP-EST-ERR-002 | P1 | Crear duplicado | HTTP 409. |
| CP-EST-ERR-003 | P1 | Consultar ID inexistente | HTTP 404. |
| CP-EST-ERR-004 | P1 | Eliminar territorio con hijos | HTTP 409, sin pérdida de datos. |
| CP-EST-IMG-001 | P1 | Fallar SQL después de subir imagen | Archivo temporal eliminado. |
| CP-EST-IMG-002 | P1 | Reemplazar imagen correctamente | Imagen nueva activa e imagen anterior eliminada. |
| CP-EST-IMG-003 | P1 | Subir tipo no permitido | HTTP 415. |
| CP-EST-IMG-004 | P1 | Subir archivo demasiado grande | HTTP 413. |
| CP-EST-SDD-001 | P2 | Comparar OpenAPI con rutas | Sin rutas faltantes o inventadas. |
| CP-EST-REG-001 | P1 | Ejecutar lint y build | Ambos comandos aprobados. |
| CP-EST-REG-002 | P1 | Comparar pantallas con línea base | Sin alteración visual no aprobada. |


## Casos detallados del Bloque 3

| ID | Prioridad | Escenario | Resultado esperado |
|---|---|---|---|
| CP-EST-VAL-001 | P1 | Registrar correo con formato inválido | HTTP 400, `VALIDATION_ERROR`, detalle `email`. |
| CP-EST-VAL-002 | P1 | Registrar fecha futura | HTTP 400 con detalle `fecha_nacimiento`. |
| CP-EST-VAL-003 | P1 | Crear territorio con área cero o negativa | HTTP 400 con detalle `area_km2`. |
| CP-EST-VAL-004 | P1 | Crear ciudad con latitud fuera de rango | HTTP 400 con detalle `latitud`. |
| CP-EST-VAL-005 | P1 | Crear contenido sin nombre o descripción | HTTP 400 con detalle por campo. |
| CP-EST-VAL-006 | P1 | Crear provincia con departamento inexistente | HTTP 404 `RELATED_RESOURCE_NOT_FOUND`. |
| CP-EST-VAL-007 | P1 | Crear nombre repetido en el mismo ámbito | HTTP 409 `DUPLICATE_RESOURCE`. |
| CP-EST-VAL-008 | P1 | Repetir nombre en otro ámbito permitido | Operación permitida. |
| CP-EST-VAL-009 | P1 | Editar un ID inexistente enviando imagen | HTTP 404 y la imagen nueva no se almacena. |
| CP-EST-VAL-010 | P1 | Error SQL después de cargar una imagen | Error controlado y archivo nuevo eliminado. |


## Casos detallados del Bloque 4

| ID | Prioridad | Escenario | Resultado esperado |
|---|---|---|---|
| CP-EST-DB-001 | P1 | Ejecutar auditoría previa | Todos los conteos son 0 y no aparecen duplicados. |
| CP-EST-DB-002 | P1 | Ejecutar migración 005 | Commit correcto; restricciones e índices creados una sola vez. |
| CP-EST-DB-003 | P1 | Eliminar departamento con provincias | HTTP 409 y ningún registro eliminado. |
| CP-EST-DB-004 | P1 | Insertar población negativa directamente en SQL | SQL Server rechaza la operación por CHECK. |
| CP-EST-IMG-005 | P1 | Eliminar contenido con imagen local | Registro e imagen se eliminan después de confirmar SQL Server. |
| CP-EST-IMG-006 | P1 | Renombrar un archivo de texto como `.jpg` | HTTP 415 `INVALID_IMAGE_SIGNATURE`; no queda archivo. |
| CP-EST-IMG-007 | P1 | Fallar eliminación por relación | HTTP 409 y la imagen vigente permanece intacta. |
| CP-EST-FUN-001 | P1 | Ejecutar CRUD representativo por módulo | Listar, crear, editar y eliminar funcionan según rol. |


## Casos automatizados del Bloque 5

| ID | Nivel | Caso | Resultado esperado | Archivo |
|---|---|---|---|---|
| CP-AUTO-001 | Unitario | `isAdmin` sin usuario | 401 | `backend/tests/unit/roleMiddleware.test.js` |
| CP-AUTO-002 | Unitario | `isAdmin` con usuario normal | 403 | `backend/tests/unit/roleMiddleware.test.js` |
| CP-AUTO-003 | Unitario | Registro con correo invalido | 400 + detalles | `backend/tests/unit/validationMiddleware.test.js` |
| CP-AUTO-004 | Unitario | Error SQL duplicado | 409 | `backend/tests/unit/httpErrors.test.js` |
| CP-AUTO-005 | Integracion | Login correcto | 200 + token | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-006 | Integracion | Login incorrecto | 401 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-007 | Integracion | GET sin token | 401 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-008 | Integracion | Usuario administra | 403 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-009 | Integracion | Admin crea departamento | 201 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-010 | Integracion | Datos invalidos | 400 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-011 | Integracion | ID inexistente | 404 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-012 | Integracion | Nombre duplicado | 409 | `backend/tests/integration/api.integration.test.js` |
| CP-AUTO-013 | E2E | URL privada sin sesion | Redireccion al login | `frontend/tests/e2e/auth.spec.js` |
| CP-AUTO-014 | E2E | Login, navegacion y logout | Flujo completo | `frontend/tests/e2e/auth.spec.js` |
| CP-AUTO-015 | E2E | CRUD admin temporal | Crear y eliminar | `frontend/tests/e2e/admin.spec.js` |

## Casos automatizados del Bloque 5.1 — Cobertura crítica

| ID | Nivel | Caso | Resultado esperado |
|---|---|---|---|
| CP-COV-AUTH-001 | Unitario | Registro con campos ausentes | 400 |
| CP-COV-AUTH-002 | Unitario | Registro con contraseña corta | 400 |
| CP-COV-AUTH-003 | Unitario | Registro con correo duplicado | 409 |
| CP-COV-AUTH-004 | Unitario | Registro exitoso y contraseña cifrada | 201 |
| CP-COV-AUTH-005 | Unitario | Login sin credenciales completas | 400 |
| CP-COV-AUTH-006 | Unitario | Login con usuario inexistente o clave incorrecta | 401 |
| CP-COV-AUTH-007 | Unitario | Login exitoso y JWT seguro | 200 |
| CP-COV-AUTH-008 | Unitario | Perfil existente, inexistente y error interno | 200/404/500 |
| CP-COV-AUTH-009 | Unitario | Cambio de correo duplicado | 409 |
| CP-COV-AUTH-010 | Unitario | Cambio de contraseña incompleto, corto o incorrecto | 400/401/404 |
| CP-COV-AUTH-011 | Unitario | Actualización de perfil con y sin cambio de contraseña | 200 |
| CP-COV-MW-001 | Unitario | Cabecera Authorization ausente o mal formada | 401 |
| CP-COV-MW-002 | Unitario | JWT con identificador inválido | 401 |
| CP-COV-MW-003 | Unitario | Usuario eliminado después de emitir el JWT | 401 |
| CP-COV-MW-004 | Unitario | Token expirado, inválido o aún no vigente | 401 |
| CP-COV-MW-005 | Unitario | Usuario y rol vigentes recuperados de SQL Server | Continúa |
| CP-COV-DEP-001 | Unitario | Listado y consulta por ID | 200 |
| CP-COV-DEP-002 | Unitario | ID inválido o departamento inexistente | 400/404 |
| CP-COV-DEP-003 | Unitario | Creación con imagen local, URL o sin imagen | 201 |
| CP-COV-DEP-004 | Unitario | Actualización conservando o reemplazando imagen | 200 |
| CP-COV-DEP-005 | Unitario | Eliminación y limpieza de imagen | 200 |
| CP-COV-DEP-006 | Unitario | Errores inesperados de cada operación CRUD | 500 controlado |
| CP-COV-ERR-001 | Unitario | Duplicados SQL 2601/2627 | 409 |
| CP-COV-ERR-002 | Unitario | FK, CHECK y valores SQL inválidos | 400/409 |
| CP-COV-ERR-003 | Unitario | Límites y tipos de archivo | 400/413/415 |
| CP-COV-ERR-004 | Unitario | Error HTTP controlado y error interno oculto | Payload uniforme |
| CP-COV-GATE-001 | Calidad | Umbrales globales de cobertura | S80/B70/F85/L80 o superior |
