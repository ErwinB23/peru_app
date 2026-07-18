# Bloque 11 - Almacenamiento persistente con Cloudinary

Este bloque prepara la aplicacion para que Render no dependa del sistema de archivos efimero. Mantiene un modo local para desarrollo y un modo Cloudinary para produccion.

## Flujo de una carga

1. Multer recibe hasta 5 MB.
2. Se verifica extension, MIME y firma binaria.
3. En modo remoto, el buffer se envia a Cloudinary desde el backend.
4. Se guarda `secure_url` en SQL Server.
5. Si una validacion o SQL falla, se elimina el recurso remoto nuevo.
6. Al reemplazar o eliminar, se destruye la imagen anterior.

## Migracion de imagenes existentes

- `npm run cloudinary:migrate:dry`: inventario sin cambios.
- `npm run cloudinary:migrate`: carga archivos locales y actualiza SQL Server.
- Cada ejecucion genera un JSON en `backend/reports/cloudinary`.
- Los archivos locales se conservan como respaldo hasta validar produccion.

## Riesgos controlados

- Secretos solo en `.env` y variables de Render.
- Ningun secreto se envia al frontend.
- La migracion es idempotente porque omite URLs que ya no empiezan con `/uploads/`.
- Se reutiliza una sola carga cuando varias filas apuntan al mismo archivo local.
