# Checklist del Bloque 4 — Revisión funcional, integridad e imágenes

## Identificación

- **Especificación:** SPEC-002
- **Bloque:** 4
- **Estado:** Implementado en código; pendiente de ejecución SQL y validación manual
- **Fecha:** 14 de julio de 2026

## A. Integridad de base de datos

- [ ] Existe un respaldo reciente de `PeruDepartamentosDB`.
- [ ] Se ejecutó `database/maintenance/010-auditoria-integridad-bloque-4.sql`.
- [ ] Todos los conteos de datos inválidos son 0.
- [ ] La consulta de duplicados no devuelve filas.
- [ ] La consulta de relaciones huérfanas devuelve 0.
- [ ] Se ejecutó `database/migrations/005-integridad-basica.sql` sin errores.
- [ ] La migración puede volver a ejecutarse sin duplicar restricciones o índices.
- [ ] Eliminar un departamento con provincias responde 409 y no elimina datos.
- [ ] Eliminar una provincia con distritos responde 409 y no elimina datos.
- [ ] Eliminar un distrito con ciudades responde 409 y no elimina datos.

## B. Seguridad de imágenes

- [x] Extensiones permitidas: JPG, JPEG, PNG y WEBP.
- [x] Tamaño máximo: 5 MB.
- [x] Nombre de archivo único y normalizado.
- [x] Verificación de firma binaria real para JPEG, PNG y WEBP.
- [x] Archivo nuevo eliminado cuando falla validación, relación, duplicado o SQL Server.
- [x] Imagen anterior eliminada solo después de una actualización confirmada.
- [x] Imagen asociada eliminada después de borrar correctamente el registro.
- [x] Rutas externas o ajenas a `/uploads` nunca se eliminan desde el disco local.
- [ ] Probar un archivo `.jpg` cuyo contenido real sea texto: debe responder 415.
- [ ] Probar una imagen mayor de 5 MB: debe responder 413.
- [ ] Reemplazar una imagen y confirmar que desaparece el archivo anterior.
- [ ] Eliminar un contenido y confirmar que desaparece su archivo.
- [ ] Confirmar que un error 409 no elimina la imagen vigente del registro.

## C. Revisión funcional por módulo

Para cada módulo ejecutar: listar, consultar por ID, crear, editar, eliminar, sin token, usuario normal, administrador, duplicado, inválido e inexistente.

- [ ] Autenticación.
- [ ] Usuarios.
- [ ] Departamentos.
- [ ] Provincias.
- [ ] Distritos.
- [ ] Ciudades.
- [ ] Lugares turísticos departamentales.
- [ ] Comidas típicas departamentales.
- [ ] Contenido provincial.
- [ ] Contenido distrital.
- [ ] Contenido de ciudades.

## D. Regresión

- [ ] Backend inicia correctamente.
- [ ] `GET /api/health` responde 200.
- [ ] Una consulta sin token responde 401.
- [ ] Usuario normal recibe 403 al administrar.
- [ ] Administrador puede completar el CRUD representativo.
- [ ] `npm run lint` aprobado.
- [ ] `npm run build` aprobado.
- [ ] No hay cambios visuales no solicitados.

## Criterio de cierre

El Bloque 4 se cierra únicamente cuando se aplica la migración, se completan las pruebas manuales representativas y se guardan las evidencias. La presencia del código por sí sola no equivale a validación.
