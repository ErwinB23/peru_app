# BLOQUE 5.1 — Mejora de cobertura

Este paquete amplía las pruebas automatizadas del backend. No modifica controladores, modelos, rutas, base de datos, credenciales ni frontend.

## Archivos principales

- `backend/tests/unit/authController.test.js`
- `backend/tests/unit/authMiddleware.test.js`
- `backend/tests/unit/departamentoController.test.js`
- `backend/tests/unit/httpErrors.test.js`
- `backend/tests/unit/roleMiddleware.test.js`
- `backend/jest.config.js`
- `scripts/block5-coverage-improvement.ps1`

## Aplicación

Copie todo el contenido del paquete en la raíz de `PERU_APP_FINAL` y reemplace los archivos existentes.

## Ejecución directa

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\backend
npm run test:coverage
```

Resultado esperado aproximado:

```text
Test Suites: 7 passed, 7 total
Tests:       114 passed, 114 total
Statements:  alrededor de 94%
Branches:    alrededor de 86%
Functions:   alrededor de 97%
Lines:       alrededor de 94%
```

Los porcentajes pueden variar ligeramente por versión de Node/Jest, pero no deben quedar por debajo de los umbrales del archivo `jest.config.js`.

## Ejecución con evidencia SDD

Desde la raíz:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block5-coverage-improvement.ps1 -OpenReport
```

El script guarda:

- resumen de métricas;
- `coverage-summary.json`;
- ruta del reporte HTML;
- evidencia fechada en `docs\estabilizacion\evidencias\bloque-5-1\`.

## Importante

- No ejecute `npm audit fix --force`.
- No borre las pruebas anteriores.
- Los números rojos de “Uncovered Line #s” no son errores; indican líneas aún no ejecutadas.
- No se busca 100% artificial. La puerta de calidad exige S80/B70/F85/L80 y este paquete la supera ampliamente.
