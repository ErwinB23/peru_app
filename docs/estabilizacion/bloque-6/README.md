# Bloque 6 — Cierre SDD con Spec Kit

## Objetivo

Consolidar la fuente de verdad antes del despliegue: artefactos, contrato, pruebas, trazabilidad, evidencias y pendientes.

## Aplicación

Copiar el contenido del paquete en la raíz del proyecto y reemplazar archivos.

## Ejecución

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block6-sdd-closure.ps1 -RunQualityChecks -OpenReports
```

## Resultado esperado

- 70/70 operaciones OpenAPI.
- Jest y cobertura aprobados.
- ESLint aprobado.
- Vite build aprobado.
- Evidencia generada en `docs/estabilizacion/evidencias/bloque-6/`.

El cierre autoriza iniciar el despliegue; no declara producción aceptada.
