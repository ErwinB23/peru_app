# Bloque 5.1 — Mejora estratégica de cobertura

## Objetivo

Elevar la cobertura de los componentes críticos sin alterar la lógica productiva ni reducir artificialmente el conjunto de archivos medidos.

## Alcance medido

- `authController.js`
- `departamentoController.js`
- `authMiddleware.js`
- `roleMiddleware.js`
- `validationMiddleware.js`
- `httpErrors.js`

## Casos añadidos

1. Registro, login, perfil y actualización de usuario.
2. Token ausente, mal formado, expirado, inválido y asociado a un usuario eliminado.
3. CRUD de departamentos, rutas de imagen y errores inesperados.
4. Duplicados, claves foráneas, restricciones CHECK, valores SQL inválidos y errores Multer.
5. Respuestas 400, 401, 403, 404, 409, 413, 415 y 500.

## Puerta de calidad

Jest falla automáticamente cuando la cobertura global queda por debajo de:

| Métrica | Umbral mínimo |
|---|---:|
| Statements | 80% |
| Branches | 70% |
| Functions | 85% |
| Lines | 80% |

## Resultado de validación interna del paquete

La suite fue ejecutada de forma aislada contra el código de los Bloques 2–5 y la corrección 404:

| Métrica | Resultado |
|---|---:|
| Statements | 94.76% |
| Branches | 86.59% |
| Functions | 97.29% |
| Lines | 94.55% |
| Suites | 7 aprobadas |
| Casos | 114 aprobados |

El resultado definitivo del proyecto debe registrarse ejecutando el script en la computadora del desarrollador y conservando `coverage-summary.json` y el reporte HTML.

## Criterio SDD

El Bloque 5.1 pasa de “implementado” a “validado” únicamente cuando:

1. Las siete suites terminan correctamente.
2. Los cuatro umbrales son superados.
3. El reporte HTML es revisado.
4. La evidencia queda en `docs/estabilizacion/evidencias/bloque-5-1/`.
5. El cambio queda registrado en Git.
