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

Solo el registro y el inicio de sesión son públicos. Toda otra operación debe exigir una sesión válida.

## Alcance visual

La estabilización conserva colores, estructura, tarjetas, sidebar, tipografías y navegación actuales. Los cambios visuales solo se permiten cuando sean necesarios para mostrar carga, validaciones, expiración de sesión o errores HTTP.

## Estado

- Especificación: preparada
- Plan: preparado
- Tareas: preparadas
- Implementación: pendiente
- Pruebas automatizadas: pendientes
