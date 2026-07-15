# Bloque 5 - Pruebas automatizadas

## Objetivo

Demostrar de forma repetible el cumplimiento de los requisitos criticos de SPEC-002 mediante cuatro niveles de control:

1. Pruebas unitarias de middlewares, validadores y normalizacion de errores.
2. Pruebas de integracion HTTP con Jest y Supertest, aisladas de la base real.
3. Pruebas de API contra el sistema local mediante Postman y Newman.
4. Pruebas E2E del frontend mediante Playwright y Chromium.

## Alcance implementado

- Login correcto e incorrecto.
- Consulta protegida sin token: 401.
- Usuario normal intentando administrar: 403.
- Administrador creando un registro: 201.
- Datos invalidos: 400.
- Recurso inexistente: 404.
- Duplicado: 409.
- Token expirado: 401.
- Redireccion de rutas privadas.
- Navegacion autenticada y cierre de sesion.
- CRUD administrativo temporal de departamento.

## Politica de datos

Jest/Supertest utiliza mocks y no modifica SQL Server. Newman y Playwright si operan contra el ambiente QA local; crean un departamento con nombre unico y lo eliminan al finalizar.

## Reportes

- `backend/reports/jest/coverage/index.html`
- `backend/reports/jest/results.json`
- `backend/reports/newman/peru-app-api.html`
- `frontend/reports/playwright/html/index.html`
- `frontend/reports/playwright/junit.xml`

Los reportes son evidencia generada y no deben confundirse con codigo fuente. Pueden excluirse del repositorio y copiarse a `docs/estabilizacion/evidencias/bloque-5/` para la entrega academica.
