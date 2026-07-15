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
