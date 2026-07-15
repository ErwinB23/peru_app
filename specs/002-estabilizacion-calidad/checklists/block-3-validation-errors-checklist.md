# Checklist Bloque 3 — Validaciones y errores

## Código

- [x] Existe un validador central reutilizable.
- [x] Registro, login y perfil tienen validación previa al controlador.
- [x] Usuarios administrados tienen correo, fecha y rol validados.
- [x] Departamentos, provincias, distritos y ciudades tienen validación central.
- [x] Lugares turísticos y comidas típicas tienen validación central.
- [x] Los IDs de ruta se validan como enteros positivos.
- [x] Las relaciones territoriales se comprueban antes de guardar.
- [x] Los nombres duplicados se rechazan con HTTP 409.
- [x] Los errores SQL se traducen sin exponer consultas ni credenciales.
- [x] Multer devuelve HTTP 413 o 415 según el error.
- [x] Los archivos nuevos se eliminan cuando una solicitud falla.
- [x] El frontend muestra el detalle de los campos inválidos.

## Validación pendiente en entorno local

- [ ] Ejecutar `scripts/block3-validation-check.ps1`.
- [ ] Confirmar registro inválido con HTTP 400 y `details`.
- [ ] Confirmar duplicado con HTTP 409.
- [ ] Confirmar relación inexistente con HTTP 404.
- [ ] Confirmar eliminación con hijos con HTTP 409.
- [ ] Confirmar archivo mayor de 5 MB con HTTP 413.
- [ ] Confirmar archivo no permitido con HTTP 415.
- [ ] Ejecutar lint y build del frontend.
- [ ] Guardar evidencia y commit del bloque.
