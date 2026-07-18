# Tareas de Estabilización y Cierre — TASKS-002

## Leyenda

- `[x]` completada con código o artefacto y validación disponible.
- `[~]` implementada, pero falta archivar evidencia del ambiente real.
- `[ ]` pendiente.

## A. Línea base y configuración

- [x] **T-EST-001** Crear rama de estabilización y respaldo de trabajo.
- [x] **T-EST-002** Unificar puertos, API URL, CORS y ejemplos `.env`.
- [x] **T-EST-003** Restaurar dependencias estables sin `--force`.
- [x] **T-EST-004** Actualizar `.gitignore` y excluir secretos/artefactos generados.

## B. Autenticación y seguridad

- [x] **T-EST-010** Validar JWT y expiración.
- [x] **T-EST-011** Consultar usuario y rol vigentes en SQL Server.
- [x] **T-EST-012** Proteger consultas territoriales, turísticas y gastronómicas.
- [x] **T-EST-013** Restringir CRUD al rol admin.
- [x] **T-EST-014** Validar sesión frontend mediante perfil.
- [x] **T-EST-015** Limpiar sesión y redirigir ante 401.
- [x] **T-EST-016** Aplicar Helmet, CORS restringido y límites de cuerpo.
- [x] **T-EST-017** Aplicar rate limit en login y registro.
- [x] **T-EST-018** Eliminar endpoints debug y crear health check mínimo.

## C. Validación y errores

- [x] **T-EST-020** Centralizar validaciones de usuario y perfil.
- [x] **T-EST-021** Centralizar validaciones territoriales.
- [x] **T-EST-022** Centralizar validaciones de lugares y comidas.
- [x] **T-EST-023** Validar relaciones, existencia y duplicados.
- [x] **T-EST-024** Uniformar 400/401/403/404/409/413/415/500.
- [x] **T-EST-025** Ocultar detalles internos de errores inesperados.

## D. Base de datos e imágenes

- [x] **T-EST-030** Crear auditoría y migración SQL de integridad.
- [~] **T-EST-031** Archivar evidencia SSMS de auditoría y migración 005.
- [x] **T-EST-032** Validar firma JPEG/PNG/WEBP y límite de 5 MB.
- [x] **T-EST-033** Limpiar archivo nuevo cuando falla la operación.
- [x] **T-EST-034** Limpiar imagen anterior después de actualizar.
- [x] **T-EST-035** Limpiar imagen asociada después de eliminar.
- [ ] **T-EST-036** Incorporar transacciones donde una operación SQL múltiple sea crítica.
- [ ] **T-EST-037** Sustituir almacenamiento local por Cloudinary.

## E. Pruebas

- [x] **T-EST-040** Configurar Jest y Supertest.
- [x] **T-EST-041** Cubrir autenticación, roles, validación y errores.
- [x] **T-EST-042** Cubrir departamentos, provincias, distritos y ciudades.
- [x] **T-EST-043** Cubrir usuarios, lugares, comidas e imágenes.
- [x] **T-EST-044** Ampliar medición a todos los controladores funcionales.
- [x] **T-EST-045** Establecer umbrales S80/B70/F85/L80.
- [x] **T-EST-046** Validar paquete de referencia: 14 suites y 376 casos.
- [~] **T-EST-047** Archivar reporte Jest del proyecto real.
- [x] **T-EST-048** Crear colección Postman/Newman.
- [~] **T-EST-049** Archivar reporte Newman con cuentas QA.
- [x] **T-EST-050** Crear flujos Playwright.
- [~] **T-EST-051** Archivar reporte Playwright local.
- [x] **T-EST-052** Crear workflow de GitHub Actions.
- [~] **T-EST-053** Confirmar workflow verde en GitHub.

## F. Cierre SDD

- [x] **T-EST-060** Regenerar inventario de 70 operaciones.
- [x] **T-EST-061** Sincronizar OpenAPI 70/70.
- [x] **T-EST-062** Consolidar diseño y delta de datos.
- [x] **T-EST-063** Consolidar casos de prueba y métricas.
- [x] **T-EST-064** Consolidar matriz de trazabilidad.
- [x] **T-EST-065** Crear revisión final y checklist de cierre.
- [x] **T-EST-066** Crear puerta automática `block6-sdd-closure.ps1`.
- [~] **T-EST-067** Ejecutar la puerta en la computadora del desarrollador y archivar evidencia.

## G. Despliegue

- [ ] **T-EST-070** Revisar y corregir vulnerabilidades de producción sin `--force`.
- [ ] **T-EST-071** Integrar Cloudinary y probar ciclo remoto de imágenes.
- [ ] **T-EST-072** Crear Azure SQL y migrar esquema/datos.
- [ ] **T-EST-073** Desplegar backend en Render.
- [ ] **T-EST-074** Desplegar frontend en Vercel.
- [ ] **T-EST-075** Configurar CORS y variables definitivas.
- [ ] **T-EST-076** Ejecutar Newman y Playwright contra producción.
- [ ] **T-EST-077** Registrar URLs, capturas y logs.
- [ ] **T-EST-078** Marcar aceptación final de producción.
