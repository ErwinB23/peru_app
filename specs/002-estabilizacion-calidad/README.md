# SPEC-002 — Estabilización, calidad y seguridad

Esta especificación define la corrección incremental de PERU APP sin rediseñar su interfaz ni reemplazar su arquitectura funcional.

## Fuente de verdad

El orden de precedencia para este cambio es:

1. `.specify/memory/constitution.md`
2. `specs/002-estabilizacion-calidad/spec.md`
3. `specs/002-estabilizacion-calidad/plan.md`
4. `specs/002-estabilizacion-calidad/tasks.md`
5. Contrato OpenAPI actualizado durante la implementación
6. Código y pruebas

## Regla principal

Solo el registro y el inicio de sesión son operaciones funcionales públicas. Para despliegue se permite `GET /api/health` como operación técnica mínima y no sensible. Toda otra operación debe exigir una sesión válida.

## Alcance visual

La estabilización conserva colores, estructura, tarjetas, sidebar, tipografías y navegación actuales. Los cambios visuales solo se permiten cuando sean necesarios para mostrar carga, validaciones, expiración de sesión o errores HTTP.

## Estado

- Especificación: en implementación.
- Plan: ruta crítica acelerada aprobada.
- Bloque 1 SDD/repositorio: validado documentalmente.
- Autenticación, seguridad, validaciones e integridad de imágenes: implementadas, pendientes de validación completa.
- Pruebas automatizadas: pendientes.
- Despliegue: no autorizado hasta cerrar pruebas automatizadas y persistencia Cloudinary.

## Artefactos incorporados en el Bloque 1

- `route-inventory.md`
- `traceability-matrix.md`
- `checklists/sdd-consistency-checklist.md`
- `docs/estabilizacion/bloque-1/`

- Bloque 4 integridad e imágenes: código y scripts incorporados; migración SQL y pruebas manuales pendientes.
