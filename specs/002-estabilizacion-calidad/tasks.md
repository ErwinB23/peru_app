# Tareas de Estabilización, Despliegue y Cierre — TASKS-002

## Leyenda

- `[x]` completada.
- `[~]` realizada, pero falta adjuntar una evidencia visual o verificación externa no bloqueante.
- `[ ]` pendiente o mejora futura.

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
- [x] **T-EST-017** Aplicar rate limiting.
- [x] **T-EST-018** Eliminar endpoints de depuración y crear health mínimo.

## C. Validación y errores

- [x] **T-EST-020** Centralizar validaciones de usuario.
- [x] **T-EST-021** Centralizar validaciones territoriales.
- [x] **T-EST-022** Centralizar validaciones de lugares y comidas.
- [x] **T-EST-023** Validar relaciones, existencia y duplicados.
- [x] **T-EST-024** Uniformar 400/401/403/404/409/413/415/500.
- [x] **T-EST-025** Ocultar detalles internos.

## D. Base de datos e imágenes

- [x] **T-EST-030** Crear auditoría y migración SQL de integridad.
- [~] **T-EST-031** Incorporar capturas SSMS/RDS sin datos sensibles al anexo final.
- [x] **T-EST-032** Validar firma JPEG/PNG/WEBP y límite.
- [x] **T-EST-033** Limpiar recurso nuevo cuando falla la operación.
- [x] **T-EST-034** Retirar imagen anterior después de actualizar.
- [x] **T-EST-035** Retirar imagen asociada después de eliminar.
- [ ] **T-EST-036** Añadir transacciones a toda operación SQL múltiple crítica; mejora futura.
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
- [x] **T-EST-046** Validar 15 suites y 388 pruebas.
- [x] **T-EST-047** Archivar reporte Jest y cobertura.
- [x] **T-EST-048** Crear colección Postman/Newman.
- [x] **T-EST-049** Documentar que el último Newman no es evidencia final porque las cuentas QA fueron eliminadas.
- [x] **T-EST-050** Crear flujos Playwright.
- [x] **T-EST-051** Archivar reporte Playwright local: 4 flujos y 0 fallos.
- [x] **T-EST-052** Crear workflow GitHub Actions.
- [~] **T-EST-053** Adjuntar captura del workflow verde si el docente la solicita.

## F. Cierre SDD

- [x] **T-EST-060** Inventariar 70 operaciones.
- [x] **T-EST-061** Sincronizar OpenAPI 70/70.
- [x] **T-EST-062** Consolidar diseño y delta de datos.
- [x] **T-EST-063** Consolidar casos y métricas.
- [x] **T-EST-064** Consolidar trazabilidad.
- [x] **T-EST-065** Crear revisión final y checklists.
- [x] **T-EST-066** Crear puerta automática de calidad.
- [x] **T-EST-067** Ejecutar puerta local y archivar evidencia.
- [x] **T-EST-068** Optimizar imágenes y video.
- [x] **T-EST-069** Validar lint y build.
- [x] **T-EST-070** Corregir dependencias y cerrar auditoría.
- [x] **T-EST-071** Integrar Cloudinary.
- [x] **T-EST-079** Cerrar documentación post-Cloudinary.
- [x] **T-EST-080** Sincronizar README, SPEC-001 y SPEC-002 con el stack real.
- [x] **T-EST-081** Actualizar SDD después del despliegue real.

## G. Infraestructura y producción

- [x] **T-EST-072** Parametrizar conexión SQL y migrar a AWS RDS.
- [x] **T-EST-073** Desplegar backend en Render.
- [x] **T-EST-074** Desplegar frontend en Vercel.
- [x] **T-EST-075** Configurar CORS y variables definitivas.
- [x] **T-EST-076** Configurar reescritura SPA en Vercel y validar recarga de rutas.
- [x] **T-EST-077** Ejecutar prueba funcional manual con cuentas existentes, sin crear usuarios QA.
- [x] **T-EST-078** Validar login, consulta, CRUD, imágenes, roles y logout en producción.
- [x] **T-EST-082** Registrar URLs públicas y arquitectura definitiva en el SDD.
- [~] **T-EST-083** Incorporar al anexo las capturas finales enumeradas en `evidence-index.md`.

## H. Mejoras futuras no bloqueantes

- [ ] **T-EST-090** Migrar sesión a cookie HttpOnly si se redefine la autenticación.
- [ ] **T-EST-091** Implementar lazy loading por rutas para reducir el bundle inicial.
- [ ] **T-EST-092** Crear ambiente staging independiente.
- [ ] **T-EST-093** Automatizar migraciones y restauraciones de base de datos.
- [ ] **T-EST-094** Ampliar transacciones en operaciones compuestas.
