# Tareas de Estabilización y Cierre — TASKS-002

## Leyenda

- `[x]` completada y validada localmente.
- `[~]` implementada, pero pendiente de validación pública o evidencia externa.
- `[ ]` pendiente.

## A. Línea base y configuración

- [x] **T-EST-001** Crear rama de estabilización y respaldo.
- [x] **T-EST-002** Unificar puertos, API URL, CORS y ejemplos `.env`.
- [x] **T-EST-003** Restaurar dependencias sin `--force`.
- [x] **T-EST-004** Excluir secretos y artefactos generados.

## B. Autenticación y seguridad

- [x] **T-EST-010** Validar JWT y expiración.
- [x] **T-EST-011** Consultar usuario y rol vigentes.
- [x] **T-EST-012** Proteger consultas funcionales.
- [x] **T-EST-013** Restringir CRUD al rol admin.
- [x] **T-EST-014** Validar sesión frontend mediante perfil.
- [x] **T-EST-015** Limpiar sesión y redirigir ante 401.
- [x] **T-EST-016** Aplicar Helmet, CORS y límites.
- [x] **T-EST-017** Aplicar rate limit.
- [x] **T-EST-018** Eliminar debug y crear health mínimo.

## C. Validación y errores

- [x] **T-EST-020** Centralizar validaciones de usuario.
- [x] **T-EST-021** Centralizar validaciones territoriales.
- [x] **T-EST-022** Centralizar validaciones de lugares y comidas.
- [x] **T-EST-023** Validar relaciones, existencia y duplicados.
- [x] **T-EST-024** Uniformar 400/401/403/404/409/413/415/500.
- [x] **T-EST-025** Ocultar detalles internos.

## D. Base de datos e imágenes

- [x] **T-EST-030** Crear auditoría y migración SQL de integridad.
- [~] **T-EST-031** Conservar evidencia visual SSMS de migraciones.
- [x] **T-EST-032** Validar firma JPEG/PNG/WEBP y límite.
- [x] **T-EST-033** Limpiar recurso nuevo cuando falla la operación.
- [x] **T-EST-034** Retirar imagen anterior después de actualizar.
- [x] **T-EST-035** Retirar imagen asociada después de eliminar.
- [ ] **T-EST-036** Añadir transacciones donde exista una operación SQL múltiple crítica.
- [x] **T-EST-037** Implementar almacenamiento dual y Cloudinary para producción.
- [x] **T-EST-038** Limpiar registros locales y reiniciar identidades.
- [x] **T-EST-039** Dejar `uploads` sin imágenes y conservar `.gitkeep`.

## E. Pruebas

- [x] **T-EST-040** Configurar Jest y Supertest.
- [x] **T-EST-041** Cubrir autenticación, roles, validación y errores.
- [x] **T-EST-042** Cubrir departamentos, provincias, distritos y ciudades.
- [x] **T-EST-043** Cubrir usuarios, lugares, comidas e imágenes.
- [x] **T-EST-044** Medir todos los controladores principales.
- [x] **T-EST-045** Establecer umbrales S80/B70/F85/L80.
- [x] **T-EST-046** Validar 15 suites y 388 casos.
- [x] **T-EST-047** Archivar reporte Jest.
- [x] **T-EST-048** Crear colección Postman/Newman.
- [x] **T-EST-049** Archivar reporte Newman: 11 solicitudes y 0 fallos.
- [x] **T-EST-050** Crear flujos Playwright.
- [x] **T-EST-051** Archivar reporte Playwright: 4 flujos y 0 fallos.
- [x] **T-EST-052** Crear workflow GitHub Actions.
- [~] **T-EST-053** Confirmar workflow verde en GitHub después del push final.

## F. Cierre SDD

- [x] **T-EST-060** Inventariar 70 operaciones.
- [x] **T-EST-061** Sincronizar OpenAPI 70/70.
- [x] **T-EST-062** Consolidar diseño y delta de datos.
- [x] **T-EST-063** Consolidar casos y métricas.
- [x] **T-EST-064** Consolidar trazabilidad.
- [x] **T-EST-065** Crear revisión final y checklist.
- [x] **T-EST-066** Crear puerta automática Bloque 6.
- [x] **T-EST-067** Ejecutar puerta local y archivar evidencia.
- [x] **T-EST-068** Optimizar imágenes y video.
- [x] **T-EST-069** Validar lint y build con multimedia optimizada.
- [x] **T-EST-070** Corregir dependencias y cerrar auditoría sin `--force`.
- [x] **T-EST-071** Integrar Cloudinary y validar carga local.
- [x] **T-EST-079** Cerrar documentación post-Cloudinary.
- [x] **T-EST-080** Sincronizar README, SPEC-001 y SPEC-002 con el stack real.

## G. Infraestructura y producción

- [ ] **T-EST-072** Adaptar cifrado y conectar Azure SQL.
- [ ] **T-EST-073** Desplegar backend en Render.
- [ ] **T-EST-074** Desplegar frontend en Vercel.
- [ ] **T-EST-075** Configurar CORS y variables definitivas.
- [ ] **T-EST-076** Ejecutar Newman y Playwright contra producción.
- [ ] **T-EST-077** Registrar URLs, capturas y logs.
- [ ] **T-EST-078** Marcar aceptación final de producción.
