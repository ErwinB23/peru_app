# Delta del Modelo de Datos — SPEC-002

El modelo funcional completo permanece en `specs/001-peru-app/data-model.md`. Este documento registra únicamente decisiones de estabilización.

## Reglas incorporadas

- `Usuarios.email` único y `rol` limitado a `usuario|admin`.
- Nombre territorial único dentro de su ámbito padre.
- Lugares y comidas únicos por ámbito territorial.
- Áreas estrictamente mayores que cero.
- Poblaciones no negativas.
- Latitud entre -90 y 90; longitud entre -180 y 180.
- Claves foráneas sin eliminación automática en cascada.

## Política de borrado

Una entidad padre con hijos no se elimina. SQL Server conserva la integridad y el backend traduce el conflicto a HTTP 409.

## Migraciones

- Auditoría previa: `database/maintenance/010-auditoria-integridad-bloque-4.sql`.
- Integridad incremental: `database/migrations/005-integridad-basica.sql`.

## Pendiente de producción

Las columnas de imagen admiten rutas locales. Para Cloudinary se mantendrá la URL pública y, cuando se implemente el borrado remoto, deberá añadirse o derivarse un `public_id` estable.
