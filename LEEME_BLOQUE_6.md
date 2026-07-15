# BLOQUE 6 — CIERRE COMPLETO SDD CON SPEC KIT

Este paquete actualiza únicamente documentación y scripts de validación. No reemplaza `.env`, credenciales, base de datos, imágenes ni código funcional del frontend/backend.

## Aplicar

1. Guardar el estado actual en Git.
2. Copiar todo el contenido del ZIP a la raíz `PERU_APP_FINAL`.
3. Reemplazar los archivos existentes.
4. Ejecutar:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block6-sdd-closure.ps1 -RunQualityChecks -OpenReports
```

## Resultado

- Constitución v1.3.0.
- SPEC-002 y PLAN-002 finales.
- Tareas con IDs únicos.
- Diseño y delta de datos.
- OpenAPI 70/70.
- Casos y trazabilidad final.
- Checklist y revisión pre-despliegue.
- Evidencia automática del cierre.

## Importante

El estado correcto después de este bloque es **Aprobado para iniciar despliegue**. La aceptación final se marca después de Cloudinary, Azure SQL, Render, Vercel y pruebas de producción.
