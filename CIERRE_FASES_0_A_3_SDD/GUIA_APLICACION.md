# Guía para aplicar el cierre SDD de las fases 0–3

Este paquete no modifica la lógica del sistema. Solo corrige la documentación SDD, completa el README principal y refleja el avance real respaldado por evidencias.

## Opción recomendada: aplicación automática

1. Descomprime este paquete.
2. Copia la carpeta completa `CIERRE_FASES_0_A_3_SDD` dentro de la raíz de `PERU_APP_FINAL`.
3. Abre PowerShell integrado en VS Code desde la raíz del proyecto.
4. Ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\CIERRE_FASES_0_A_3_SDD\aplicar-cierre-fases-0-3.ps1
```

El script crea una copia de seguridad de los archivos reemplazados en una carpeta `backup-documentacion-sdd-AAAAMMdd-HHmmss`.

## Opción manual

Copia cada archivo de la carpeta `archivos` conservando su misma ruta:

```text
archivos/README.md
→ README.md

archivos/specs/002-estabilizacion-calidad/tasks.md
→ specs/002-estabilizacion-calidad/tasks.md

archivos/specs/002-estabilizacion-calidad/checklists/requirements-checklist.md
→ specs/002-estabilizacion-calidad/checklists/requirements-checklist.md

archivos/specs/002-estabilizacion-calidad/checklists/phase-2-configuracion-checklist.md
→ specs/002-estabilizacion-calidad/checklists/phase-2-configuracion-checklist.md

archivos/specs/002-estabilizacion-calidad/checklists/phase-3-estable-checklist.md
→ specs/002-estabilizacion-calidad/checklists/phase-3-estable-checklist.md

archivos/docs/estabilizacion/fase-0-linea-base.md
→ docs/estabilizacion/fase-0-linea-base.md
```

## Verificación inmediata

Después de copiar:

```powershell
git status --short
git diff -- README.md specs/002-estabilizacion-calidad/tasks.md specs/002-estabilizacion-calidad/checklists docs/estabilizacion/fase-0-linea-base.md
```

No hagas todavía el commit. Primero completaremos los tres pendientes de Fase 0:

1. Respaldo `.bak`.
2. `RESTORE VERIFYONLY`.
3. Pruebas manuales faltantes.

## Pendiente de SQL Server

1. Crea la carpeta:

```powershell
New-Item -ItemType Directory -Force C:\SQLBackups
```

2. En SSMS abre:

```text
database/maintenance/000-backup-before-stabilization.sql
```

3. Ejecuta el script y conserva una captura donde aparezca:

```text
RESPALDO CREADO Y VERIFICADO CORRECTAMENTE.
```

## Prueba manual pendiente

Con backend y frontend ejecutándose, comprobaremos:

- registro válido;
- login inválido;
- perfil con token;
- perfil sin token;
- login administrador;
- acceso usuario;
- cierre de sesión.

Cuando estas pruebas estén aprobadas, se actualizarán las tres tareas `[~]` a `[x]` y se realizará el commit de cierre.
