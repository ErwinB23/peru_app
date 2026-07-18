# Bloque 5.2 — Cobertura de módulos funcionales

## Objetivo

Ampliar la medición desde los componentes críticos del Bloque 5.1 hacia los módulos funcionales restantes, manteniendo pruebas aisladas de la base de datos productiva.

## Alcance

- Provincias, distritos y ciudades.
- Administración de usuarios.
- Lugares turísticos de departamento, provincia, distrito y ciudad.
- Comidas típicas de departamento, provincia, distrito y ciudad.
- Relaciones, existencia y duplicados.
- Firmas y ciclo de vida de imágenes.
- Integración HTTP con autenticación y roles.

## Resultado de validación interna

| Indicador | Resultado |
|---|---:|
| Suites Jest | 15 aprobadas |
| Pruebas unitarias | 363 aprobadas |
| Pruebas de integración | 25 aprobadas |
| Total | 388 aprobadas |
| Statements | 89.98% |
| Branches | 87.48% |
| Functions | 96.18% |
| Lines | 89.85% |

## Interpretación

La cobertura ahora incluye todos los controladores funcionales del backend, además de autenticación, autorización, validación, integridad y utilidades de imágenes. Los modelos SQL se verifican mediante pruebas de integración de API, auditorías SQL y pruebas funcionales; no se incluyen artificialmente en la cobertura unitaria porque requieren una base de datos real.

## Criterio de cierre

El Bloque 5.2 se valida en el proyecto real cuando:

1. Las 15 suites y 388 pruebas finalizan sin fallos.
2. Los cuatro umbrales globales se mantienen.
3. Se conserva `backend/reports/jest/coverage/index.html`.
4. Se conserva la evidencia del script en `docs/estabilizacion/evidencias/bloque-5-2/`.
5. Los resultados se incorporan al cierre SDD.
