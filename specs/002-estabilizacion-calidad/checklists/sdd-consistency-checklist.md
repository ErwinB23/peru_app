# Checklist de Consistencia SDD — SPEC-002

## Gobierno y alcance

- [x] SPEC-001 se mantiene como especificación funcional base.
- [x] SPEC-002 registra estabilización, calidad, seguridad y despliegue.
- [x] La arquitectura documentada coincide con el código y la infraestructura real.
- [x] No se declara como aprobada la última ejecución Newman fallida.
- [x] La decisión de no crear cuentas QA en producción está documentada.

## Repositorio

- [x] `.env` y credenciales locales están excluidos de Git.
- [x] `.git` se conserva en el proyecto de trabajo, pero se excluye del ZIP.
- [x] `node_modules`, `dist`, `.vite` y respaldos se excluyen del ZIP.
- [x] El frontend usa CSS propio y no Tailwind.
- [x] Las imágenes de producción no dependen de `backend/uploads`.

## Contrato API

- [x] Inventario de 70 operaciones reales.
- [x] OpenAPI sincronizado 70/70.
- [x] Rutas funcionales protegidas.
- [x] Endpoints de depuración eliminados.
- [x] `/api/health` seguro y operativo.

## Integridad e imágenes

- [x] Auditoría y migración SQL disponibles.
- [x] Restricciones incorporadas al script base.
- [x] Política de borrado sin cascadas accidentales.
- [x] Validación de extensión, MIME, tamaño y firma.
- [x] Limpieza de recursos ante error.
- [x] Reemplazo y eliminación de imágenes controlados.
- [x] Cloudinary validado en producción.
- [x] AWS RDS conectado.

## Pruebas y despliegue

- [x] Jest y Supertest configurados.
- [x] 15 suites y 388 pruebas aprobadas.
- [x] Cobertura superior a los umbrales.
- [x] Colección Postman/Newman disponible.
- [x] Último Newman fallido correctamente excluido de la evidencia final.
- [x] Playwright local archivado con 0 fallos.
- [x] Lint, build y OpenAPI aprobados.
- [x] Backend, frontend, SQL Server e imágenes funcionan en producción.
- [x] Validación funcional manual registrada.

## Documentación

- [x] README principal actualizado.
- [x] SPEC, plan y tareas actualizados.
- [x] Diseño y delta de datos actualizados.
- [x] Matriz de trazabilidad actualizada.
- [x] Índice de evidencias actualizado.
- [x] Revisión final actualizada.

## Dictamen

**SDD consistente con la implementación y el despliegue reales.** Queda únicamente adjuntar las capturas finales y preparar el ZIP limpio.
