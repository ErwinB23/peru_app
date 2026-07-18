# Índice de Evidencias — SPEC-002

| Evidencia | Ubicación esperada | Estado |
|---|---|---|
| Línea base | `docs/estabilizacion/evidencias/fase-0/` | Existente/parcial |
| Seguridad Bloque 2 | `docs/estabilizacion/evidencias/bloque-2/` | Ejecutada localmente según flujo de trabajo |
| Validación Bloque 3 | `docs/estabilizacion/evidencias/bloque-3/` | Ejecutada localmente |
| Integridad Bloque 4 | `docs/estabilizacion/evidencias/bloque-4/` | Ejecutada localmente; SSMS debe conservarse |
| Jest y cobertura | `backend/reports/jest/` + resumen Bloque 6 | Ejecutar/capturar |
| Newman | `backend/reports/newman/peru-app-api.html` | Ejecutar/capturar |
| Playwright | `frontend/reports/playwright/html/index.html` | Ejecutar/capturar |
| Cierre SDD | `docs/estabilizacion/evidencias/bloque-6/` | Generada por script |
| Producción | `docs/estabilizacion/evidencias/despliegue/` | Pendiente |

Los reportes pesados pueden permanecer ignorados por Git. El script de cierre copia los JSON esenciales y genera un resumen Markdown versionable.
