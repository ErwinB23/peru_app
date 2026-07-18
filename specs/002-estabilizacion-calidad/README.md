# SPEC-002 — Estabilización, Calidad y Seguridad

Esta especificación complementa `001-peru-app` y registra la estabilización, pruebas, Cloudinary y preparación de infraestructura.

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
11. `final-review.md`
12. `deployment-readiness.md`

## Estado

**Cierre local aprobado.** Cloudinary está integrado y la base local quedó limpia. Permanecen pendientes Azure SQL, Render, Vercel y pruebas públicas.

## Validación

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block12-post-cloudinary-sdd.ps1 -RunQualityChecks -OpenReports
```
