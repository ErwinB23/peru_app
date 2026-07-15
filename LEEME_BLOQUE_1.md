# Aplicación del Bloque 1 — PERU APP

Este ZIP contiene únicamente archivos documentales, configuración de exclusiones y un script de auditoría. **No reemplaza controladores, modelos, rutas ni componentes del frontend.**

## 1. Antes de reemplazar

En Visual Studio Code, abre PowerShell en la raíz de tu proyecto y ejecuta:

```powershell
git status
git branch --show-current
```

La rama esperada es:

```text
002-estabilizacion-calidad
```

No borres la carpeta `.git`. Esa carpeta solo se excluye cuando prepares el ZIP final de entrega.

## 2. Copiar los archivos

Extrae el contenido de este ZIP directamente dentro de la raíz real de `PERU_APP_FINAL`.

Cuando Windows pregunte si deseas reemplazar archivos con el mismo nombre, selecciona:

```text
Reemplazar los archivos en el destino
```

El ZIP actualizará:

```text
.specify/memory/constitution.md
specs/002-estabilizacion-calidad/
docs/estabilizacion/bloque-1/
scripts/block1-repository-audit.ps1
.gitignore
README.md
```

## 3. Ejecutar la auditoría

Desde la raíz:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\block1-repository-audit.ps1
```

Esto solo analiza y crea evidencia.

## 4. Aplicar la limpieza segura

Después de revisar el reporte:

```powershell
.\scripts\block1-repository-audit.ps1 -ApplyCleanup
```

La limpieza:

- elimina `frontend/dist` y `frontend/.vite`, porque se regeneran;
- mueve los respaldos duplicados fuera de la raíz;
- no elimina `.git`;
- no elimina `.env`;
- no elimina `node_modules`;
- no elimina `backend/uploads`;
- no toca SQL Server.

Los respaldos se moverán a una carpeta hermana:

```text
PERU_APP_LOCAL_BACKUPS\<fecha-hora>\
```

## 5. Revisar el resultado

```powershell
git status
```

Debes ver únicamente los cambios documentales del Bloque 1. Después:

```powershell
git add .specify/memory/constitution.md
git add specs/002-estabilizacion-calidad
git add docs/estabilizacion/bloque-1
git add scripts/block1-repository-audit.ps1
git add .gitignore
git add README.md
git commit -m "docs(sdd): cerrar bloque 1 de auditoria y trazabilidad"
git push
```

## 6. Resultado del Bloque 1

Quedará completado:

- inventario de carpetas;
- depuración planificada del repositorio;
- inventario de 69 operaciones del backend;
- detección de ocho GET territoriales públicos;
- matriz de trazabilidad de `SPEC-002`;
- checklist de consistencia SDD;
- estados documentales honestos;
- evidencia reproducible.

El siguiente bloque modificará el código de autenticación, rutas, CORS, sesión y endpoints de depuración.
