# Delta del Modelo de Datos — SPEC-002

El modelo funcional completo permanece en `specs/001-peru-app/data-model.md`. Este documento registra decisiones de estabilización, integridad y despliegue.

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
- Script base: `database/peru_app_script_base_datos.sql`.

Los scripts públicos no deben contener contraseñas, hashes, correos administrativos reales ni datos personales. Los respaldos completos permanecen fuera del repositorio.

## Imágenes y Cloudinary

No fue necesario agregar columnas nuevas. Las columnas de imagen almacenan:

- una ruta `/uploads/...` en modo local; o
- una URL HTTPS de Cloudinary en modo remoto.

La producción utiliza Cloudinary. El ciclo de reemplazo y eliminación se ejecuta después de confirmar la operación SQL, y los recursos nuevos se limpian si la escritura no se completa.

## Línea base y migración

La estructura, claves, restricciones e índices se conservaron. Los registros temporales se limpiaron y los `IDENTITY` se reiniciaron antes de la preparación cloud.

La base definitiva se migró a:

- **Servicio:** AWS RDS.
- **Motor:** Microsoft SQL Server Express 2019.
- **Base:** `PeruDepartamentosDB`.
- **Puerto:** 1433.
- **Conectividad:** endpoint directo y grupos de seguridad autorizados.

La línea base revisada contiene 13 tablas, confirmadas en `database/peru_app_script_base_datos.sql`.

## Configuración de conexión

```env
DB_SERVER=<endpoint-rds>
DB_DATABASE=PeruDepartamentosDB
DB_USER=<usuario-aplicacion>
DB_PASSWORD=<secreto>
DB_PORT=1433
DB_INSTANCE=
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
```

`DB_INSTANCE` se mantiene vacío en AWS RDS porque la conexión usa endpoint y puerto, no una instancia local nombrada.

## Respaldo y recuperación

- Los respaldos con información real se guardan fuera de Git.
- El ZIP académico no debe contener BAK, scripts de exportación con datos ni hashes.
- AWS RDS debe mantener una política de backup acorde con los recursos disponibles.
- Una restauración de prueba queda recomendada como mejora operativa posterior.
