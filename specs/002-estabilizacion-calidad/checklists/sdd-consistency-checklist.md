# Checklist de Consistencia SDD — SPEC-002

## Gobierno y alcance

- [x] `SPEC-001` se mantiene como especificación funcional base.
- [x] `SPEC-002` se mantiene como especificación de estabilización.
- [x] Existe una ruta acelerada de trabajo que prioriza funcionamiento, pruebas y despliegue.
- [x] No se declara implementado lo que solo está documentado.
- [x] Se admite un health check técnico mínimo como excepción de despliegue, sin datos sensibles.

## Repositorio

- [x] Se identificaron carpetas fuente, generadas, locales y duplicadas.
- [x] `.git/` se conserva en el proyecto de trabajo.
- [x] `.git/` se excluye del ZIP de entrega.
- [x] `.env` se conserva localmente y se excluye de Git.
- [x] `dist`, `.vite`, reportes y coberturas se ignoran.
- [x] `uploads` no se elimina hasta resolver persistencia.

## Trazabilidad

- [x] Existe `traceability-matrix.md` para `SPEC-002`.
- [x] Cada requisito RF-EST tiene tareas asociadas.
- [x] Los requisitos críticos tienen casos de prueba o una tarea explícita para crearlos.
- [x] Se distinguen los estados Brecha, Pendiente, Implementado y Validado.
- [x] Se registraron ocho brechas de autenticación.
- [x] Se registraron dos endpoints de depuración inseguros.

## Contrato API

- [x] Se creó un inventario de las rutas reales.
- [x] Se contaron 69 operaciones en routers Express.
- [x] Se identificaron 41 operaciones administrativas.
- [x] Se identificaron 18 operaciones autenticadas de consulta/perfil.
- [x] Se identificaron 10 operaciones públicas actuales, de las cuales solo 2 son funcionalmente permitidas.
- [ ] `openapi.yaml` está sincronizado con el inventario.
- [x] Las ocho brechas de autenticación están corregidas en código.
- [x] `/api/test-db` y `/api/debug-token` fueron eliminadas.
- [x] Existe `/api/health` seguro.


## Integridad e imágenes — Bloque 4

- [x] Existe auditoría SQL previa para datos inválidos, duplicados y relaciones huérfanas.
- [x] Existe una migración SQL numerada, transaccional e idempotente.
- [x] El script base incorpora restricciones para instalaciones nuevas.
- [x] La política de eliminación conserva las relaciones y evita cascadas accidentales.
- [x] Las cargas comprueban extensión, MIME, tamaño y firma binaria.
- [x] Los errores eliminan archivos nuevos que no llegaron a confirmarse.
- [x] Las actualizaciones confirmadas eliminan la imagen anterior.
- [x] Las eliminaciones confirmadas eliminan la imagen asociada.
- [ ] La auditoría SQL fue ejecutada y todos los conteos son 0.
- [ ] La migración 005 fue aplicada y evidenciada en SSMS.
- [ ] Los casos manuales de reemplazo, eliminación, 413 y 415 fueron aprobados.

## Pruebas y despliegue

- [ ] Existe suite backend con Supertest.
- [ ] Existe colección Postman/Newman y reporte.
- [ ] Existen flujos Playwright críticos.
- [ ] Existe verificación de build, lint y tests.
- [ ] Backend, frontend, SQL Server e imágenes funcionan en producción.

## Dictamen

**Bloque documental y de repositorio:** aprobado.  
**Código de seguridad e integridad:** implementado, pendiente de validación completa.  
**Pruebas automatizadas:** pendientes.  
**Despliegue:** no autorizado todavía.
