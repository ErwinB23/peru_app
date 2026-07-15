# Checklist de Consistencia SDD — Bloque 1

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
- [ ] Las ocho brechas de autenticación están corregidas en código.
- [ ] `/api/test-db` y `/api/debug-token` fueron eliminadas.
- [ ] Existe `/api/health` seguro.

## Pruebas y despliegue

- [ ] Existe suite backend con Supertest.
- [ ] Existe colección Postman/Newman y reporte.
- [ ] Existen flujos Playwright críticos.
- [ ] Existe verificación de build, lint y tests.
- [ ] Backend, frontend, SQL Server e imágenes funcionan en producción.

## Dictamen

**Bloque documental y de repositorio:** aprobado.  
**Código de seguridad:** pendiente.  
**Pruebas automatizadas:** pendientes.  
**Despliegue:** no autorizado todavía.
