# Delta del Modelo de Datos — SPEC-002

El modelo funcional completo permanece en `specs/001-peru-app/data-model.md`. Este documento registra decisiones de estabilización y despliegue.

## Reglas incorporadas

- `Usuarios.email` único y `rol` limitado a `usuario|admin`.
- Nombre territorial único dentro de su ámbito padre.
- Lugares y comidas únicos por ámbito.
- Áreas mayores que cero.
- Poblaciones no negativas.
- Latitud entre -90 y 90.
- Longitud entre -180 y 180.
- Claves foráneas sin borrado automático en cascada.

## Política de borrado

Una entidad padre con hijos no se elimina. SQL Server conserva la integridad y el backend traduce el conflicto a HTTP 409.

## Migraciones y mantenimiento

- Auditoría: `database/maintenance/010-auditoria-integridad-bloque-4.sql`.
- Integridad: `database/migrations/005-integridad-basica.sql`.
- Limpieza y reinicio: `database/maintenance/012-limpiar-datos-y-reiniciar-identities.sql`.

## Imágenes y Cloudinary

No fue necesario agregar columnas nuevas. Las columnas de imagen almacenan:

- una ruta `/uploads/...` en modo local; o
- una URL HTTPS de Cloudinary en modo remoto.

El `public_id` se deriva de la URL de Cloudinary para ejecutar reemplazos y eliminaciones. La producción no depende de archivos locales.

## Línea base limpia

La estructura, claves, restricciones e índices se conservan. Los registros de prueba se eliminaron en orden hijo-padre y los `IDENTITY` se reiniciaron para comenzar desde ID 1.

## Pendiente de Azure

La estructura limpia se exportará o importará en Azure SQL. Antes se debe activar cifrado configurable en el backend.
