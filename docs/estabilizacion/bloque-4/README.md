# Bloque 4 — Revisión funcional, integridad e imágenes

Este bloque fortalece la coherencia entre Express, SQL Server y el almacenamiento local de imágenes.

## Cambios técnicos

1. Verificación de firma binaria para JPEG, PNG y WEBP después de Multer.
2. Eliminación del archivo nuevo cuando una solicitud falla.
3. Eliminación de la imagen anterior después de confirmar una actualización en SQL Server.
4. Eliminación de imágenes después de confirmar el borrado del registro.
5. Protección contra eliminación de rutas externas o fuera de `backend/uploads`.
6. Auditoría SQL previa para valores inválidos, duplicados y relaciones huérfanas.
7. Migración idempotente con restricciones CHECK e índices únicos por ámbito.
8. Script PowerShell de verificación técnica y generación de evidencia.

## Archivos principales

- `backend/src/middlewares/uploadMiddleware.js`
- `backend/src/utils/imageLifecycle.js`
- `backend/src/controllers/*Controller.js`
- `backend/src/routes/*Routes.js`
- `database/maintenance/010-auditoria-integridad-bloque-4.sql`
- `database/migrations/005-integridad-basica.sql`
- `scripts/block4-integrity-image-check.ps1`

## Orden de ejecución

1. Aplicar los archivos del paquete.
2. Ejecutar backend y frontend.
3. Ejecutar el script PowerShell.
4. Abrir SSMS y ejecutar la auditoría SQL.
5. Corregir datos si aparece un conteo distinto de cero.
6. Crear o verificar el respaldo de SQL Server.
7. Ejecutar la migración 005.
8. Completar el checklist manual.
9. Guardar evidencias y commit.

## Alcance de almacenamiento

Este bloque estabiliza el almacenamiento local durante desarrollo. La migración a Cloudinary se realizará en el bloque de despliegue, porque Render no garantiza persistencia de archivos locales en su modalidad gratuita.
