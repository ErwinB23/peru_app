# Corrección final del Bloque 12 — V4

## Motivo

Las validaciones anteriores llamaban `npm run` sin garantizar que las dependencias
estuvieran instaladas o sincronizadas. La versión V4 ejecuta `npm ci` en backend y
frontend antes de Jest, ESLint y Vite.

## Línea base validada sobre el ZIP actualizado

- 15 suites Jest.
- 388 pruebas aprobadas.
- 363 unitarias.
- 25 de integración.
- Statements: 89.98%.
- Branches: 87.48%.
- Functions: 96.18%.
- Lines: 89.85%.
- ESLint: aprobado.
- Vite build: aprobado.

## Evidencia

El script copia los resultados Jest y cobertura recién generados a
`docs/evidencias/pruebas-finales/` y conserva todos los logs del proceso en la
carpeta temporal del Bloque 12.
