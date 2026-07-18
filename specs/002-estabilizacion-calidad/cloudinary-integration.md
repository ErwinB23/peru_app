# Integracion Cloudinary - Bloque 11

## Objetivo

Sustituir la persistencia local de imagenes por almacenamiento remoto compatible con Render, sin perder la ejecucion local ni las referencias existentes durante la migracion.

## Decision de diseno

- `IMAGE_STORAGE=local`: Multer guarda en `backend/uploads` y mantiene las rutas `/uploads/...`.
- `IMAGE_STORAGE=cloudinary`: Multer conserva el archivo en memoria, valida su firma binaria y lo sube desde el backend mediante el SDK oficial.
- SQL Server guarda la URL HTTPS devuelta por Cloudinary.
- Las operaciones de reemplazo y eliminacion destruyen el recurso remoto usando el `public_id` extraido de la URL.
- Si la validacion o la operacion SQL falla, el middleware elimina el recurso remoto creado durante esa solicitud.
- `backend/uploads` se conserva hasta migrar y comprobar todas las referencias existentes.

## Variables

```env
IMAGE_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=peru-app/development
```

## Componentes

- `src/config/env.js`: valida modo y credenciales.
- `src/services/cloudinaryService.js`: configura el SDK, carga y elimina recursos.
- `src/middlewares/uploadMiddleware.js`: memoria/local, firma y persistencia.
- `src/utils/uploadedFile.js`: resuelve URL remota o ruta local.
- `src/utils/imageLifecycle.js`: elimina recursos locales o remotos.
- `scripts/migrateLocalImagesToCloudinary.js`: migra referencias `/uploads/...` existentes.

## Criterios de aceptacion

1. Las 12 familias de rutas de imagen usan `persistUploadedImages`.
2. JPG, PNG y WEBP validos se aceptan; firma falsa devuelve 415.
3. En modo Cloudinary, las nuevas filas almacenan URL HTTPS.
4. Reemplazar una imagen elimina la anterior despues de actualizar SQL.
5. Eliminar el registro elimina su recurso remoto.
6. Un error posterior a la carga no deja un recurso huerfano.
7. La migracion tiene modo simulacion y genera manifiesto JSON.
8. No se elimina `backend/uploads` hasta confirmar la migracion y el despliegue.

## Estado

Implementacion preparada. La tarea queda condicionada a crear credenciales, ejecutar la simulacion, migrar los recursos existentes y validar el CRUD con una cuenta administradora.
