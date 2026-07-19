# SPEC-002 — Estabilización, Calidad, Seguridad y Despliegue

Esta especificación complementa `specs/001-peru-app` y registra la estabilización, pruebas, seguridad, almacenamiento de imágenes, despliegue cloud y aceptación funcional de PERU APP.

## Fuente de verdad

1. `.specify/memory/constitution.md`
2. `spec.md`
3. `plan.md`
4. `tasks.md`
5. `design.md`
6. `data-model-delta.md`
7. `../001-peru-app/openapi.yaml`
8. `test-cases.md`
9. `traceability-matrix.md`
10. `implementation-summary.md`
11. `deployment-readiness.md`
12. `production-validation.md`
13. `final-review.md`
14. `evidence-index.md`

## Estado

**Implementada, desplegada y validada funcionalmente en producción.**

Arquitectura definitiva:

- React + Vite + CSS propio en Vercel.
- Node.js + Express en Render.
- SQL Server en AWS RDS.
- Cloudinary para imágenes.
- GitHub y rama `002-estabilizacion-calidad` como fuente del despliegue.

La evidencia técnica de Jest, cobertura, OpenAPI, lint y build está archivada. La colección Newman se conserva, pero no forma parte de la puerta final de producción porque no se recrearon cuentas QA temporales. La validación final se realizó manualmente con cuentas existentes autorizadas.

## Validación recomendada

```powershell
git branch --show-current

cd backend
npm test

cd ..\frontend
npm run lint
npm run build

cd ..
node scripts/check-openapi-sync.mjs
git status
```

## Resultado académico

El SDD mantiene trazabilidad entre requisitos, diseño, código, pruebas, despliegue y evidencias. Solo queda incorporar al informe o anexos las capturas finales enumeradas en `evidence-index.md`, evitando mostrar secretos.
