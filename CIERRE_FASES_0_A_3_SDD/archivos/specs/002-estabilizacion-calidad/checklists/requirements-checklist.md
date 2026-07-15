# Checklist de Calidad de Requisitos — SPEC-002

## Alcance y decisiones

- [x] Se identifica que PERU APP ya funciona como línea base.
- [x] Se prohíbe el rediseño visual no solicitado.
- [x] Se establece login obligatorio.
- [x] Se declaran como públicas únicamente las rutas de registro y login.
- [x] Se distinguen permisos de usuario y administrador.
- [x] Se define una estrategia incremental.

## Claridad y verificabilidad

- [x] Los requisitos usan identificadores únicos.
- [x] Los requisitos P1 poseen escenarios de aceptación.
- [x] Se definen códigos HTTP esperados.
- [x] Se definen criterios de salida y éxito.
- [x] Se incluyen riesgos y mitigaciones.
- [x] Se define una línea base visual para evitar regresión.

## Consistencia con la Constitución

- [x] SPEC-002 respeta arquitectura cliente-servidor.
- [x] SPEC-002 mantiene arquitectura por capas.
- [x] SPEC-002 conserva React, Express y SQL Server.
- [x] SPEC-002 refuerza seguridad y trazabilidad.
- [x] La Constitución 1.1.0 incorpora la autenticación obligatoria.

## Puerta previa a la implementación de Fase 4

- [ ] Completar el respaldo `.bak` de SQL Server.
- [ ] Conservar evidencia de `RESTORE VERIFYONLY` satisfactorio.
- [x] Confirmar rama `002-estabilizacion-calidad`.
- [x] Registrar evidencia visual del frontend y flujo principal.
- [x] Aprobar SPEC-002 y PLAN-002 mediante el commit `8fa02d5`.
- [ ] Reconfirmar registro, login inválido y perfil con/sin token.

## Dictamen

- **SPEC-002:** aprobada.
- **PLAN-002:** aprobado como orden de estabilización.
- **Fase 0:** parcialmente aprobada, con pendientes expresamente identificados.
- **Autorización para continuar:** puede prepararse la Fase 4, pero los pendientes de respaldo deben cerrarse antes de cambios estructurales o despliegue.
