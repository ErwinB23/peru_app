# SPEC-002 — Estabilización, Calidad y Seguridad

Esta especificación complementa `001-peru-app` y registra la estabilización previa al despliegue.

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
10. `final-review.md`

## Estado

**Aprobado para iniciar despliegue con condiciones.** La producción todavía requiere Cloudinary, Azure SQL, Render, Vercel y pruebas públicas.

## Validación

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block6-sdd-closure.ps1 -RunQualityChecks -OpenReports
```
