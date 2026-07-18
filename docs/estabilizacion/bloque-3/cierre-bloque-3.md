# Cierre técnico del Bloque 3 — Validaciones y errores HTTP

## Estado

**Implementado, pendiente de validación funcional y automatizada.**

## Objetivo

Centralizar las validaciones esenciales de PERU APP, evitar duplicados y relaciones inválidas, y devolver respuestas HTTP previsibles sin exponer detalles internos de SQL Server.

## Implementación realizada

1. Validación centralizada de registro, login, perfil y administración de usuarios.
2. Validación de departamentos, provincias, distritos y ciudades.
3. Validación de lugares turísticos y comidas típicas en los cuatro niveles territoriales.
4. Conversión controlada de números enviados mediante `multipart/form-data`.
5. Validación de fechas no futuras, correo, contraseña, áreas, poblaciones y coordenadas.
6. Validación de IDs de ruta y parámetros de paginación.
7. Comprobación de existencia de relaciones territoriales antes de insertar o actualizar.
8. Detección de nombres duplicados dentro de su ámbito territorial.
9. Mapeo de errores SQL Server a 400 o 409.
10. Mapeo de errores de archivos a 413 o 415.
11. Respuesta uniforme con `error`, `code` y, cuando corresponde, `details`.
12. Eliminación de archivos recién cargados si la validación, la relación, el duplicado o SQL Server fallan.
13. Verificación de existencia del registro antes de cargar una nueva imagen durante una edición.
14. Presentación de los detalles de validación en el frontend mediante el interceptor Axios central.

## Estados HTTP cubiertos

| Estado | Uso |
|---:|---|
| 400 | Campos o formatos inválidos, JSON incorrecto y restricciones de datos |
| 401 | Sesión inexistente, inválida o expirada |
| 403 | Usuario autenticado sin permisos administrativos |
| 404 | Ruta, registro o relación asociada inexistente |
| 409 | Duplicados, último administrador y eliminación con datos relacionados |
| 413 | Cuerpo o imagen demasiado grande |
| 415 | Extensión o tipo de imagen no permitido |
| 500 | Error inesperado sin exposición de información interna |

## Archivos principales

- `backend/src/validators/validationMiddleware.js`
- `backend/src/middlewares/dataIntegrityMiddleware.js`
- `backend/src/middlewares/errorMiddleware.js`
- `backend/src/middlewares/uploadMiddleware.js`
- `backend/src/utils/httpErrors.js`
- `backend/src/utils/fileCleanup.js`
- `backend/src/routes/*.js`
- `backend/src/controllers/*.js`
- `frontend/src/services/api.js`

## Pendientes deliberados

Este bloque no elimina todavía la imagen anterior después de una actualización exitosa ni la imagen asociada después de una eliminación exitosa. Esos flujos pertenecen al bloque de integridad de imágenes. Tampoco reemplaza las pruebas automatizadas del Bloque 5.
