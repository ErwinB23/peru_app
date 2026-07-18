# Fase 3 — Estrategia de dependencias estables

## Objetivo

Mantener el proyecto ejecutable y verificable antes de introducir cambios funcionales o de seguridad.

## Requisitos

- **RF-DEP-001:** El proyecto debe conservar una combinación de dependencias previamente funcional.
- **RF-DEP-002:** La sintaxis del backend debe ser válida.
- **RF-DEP-003:** El frontend debe aprobar lint y build.
- **RF-DEP-004:** Las auditorías deben almacenarse como evidencia.
- **RF-DEP-005:** Las vulnerabilidades pendientes no deben ocultarse y deberán resolverse individualmente en una fase posterior.
- **RF-DEP-006:** No debe utilizarse `npm audit fix --force`.

## Criterio de aceptación

La fase se aprueba si backend, lint y build pasan. Los códigos no cero de `npm audit` no bloquean la fase, pero deben conservarse en evidencias.
