# Inventario y Depuración de Carpetas — Bloque 1

## 1. Objetivo

Reducir ruido, evitar filtración de secretos y separar los artefactos de trabajo de los entregables sin dañar el repositorio Git ni los archivos que utiliza la aplicación.

## 2. Conservar en el proyecto de trabajo y en el repositorio

```text
.specify/
.speckit/
backend/src/
backend/scripts/
backend/tests/
database/
docs/
frontend/src/
frontend/public/
scripts/
specs/
.gitignore
README.md
backend/package.json
backend/package-lock.json
frontend/package.json
frontend/package-lock.json
backend/.env.example
frontend/.env.example
```

La carpeta `.git/` se conserva en el proyecto real porque contiene el historial y las ramas. Se excluye únicamente al crear un ZIP académico o un respaldo limpio.

## 3. Conservar localmente, pero no subir ni incluir en el ZIP

```text
backend/.env
frontend/.env
backend/node_modules/
frontend/node_modules/
backend/uploads/       # mientras las imágenes dependan del disco local
```

`backend/uploads/` requiere una decisión de persistencia antes del despliegue. No debe borrarse si la base de datos referencia sus archivos.

## 4. Generados que pueden eliminarse y regenerarse

```text
frontend/dist/
frontend/.vite/
coverage/
playwright-report/
test-results/
reports/
```

Se regeneran mediante build o pruebas y no son fuente de verdad.

## 5. Respaldos duplicados que deben moverse fuera de la raíz

```text
phase0-backups/
backup-documentacion-sdd-20260714-195931/
CIERRE_FASES_0_A_3_SDD/
```

No se destruyen automáticamente: el script del Bloque 1 puede moverlos a una carpeta hermana denominada `PERU_APP_LOCAL_BACKUPS/<fecha-hora>`.

## 6. Archivos prohibidos en Git y en el ZIP de entrega

```text
*.env
*.bak
*.zip
*.rar
*.7z
node_modules/
dist/
.vite/
.git/
```

Los `.env.example` sí deben conservarse porque no incluyen valores reales.

## 7. Estructura objetivo resumida

```text
PERU_APP_FINAL/
├── .git/                    # solo proyecto de trabajo
├── .specify/
├── .speckit/
├── backend/
│   ├── src/
│   ├── scripts/
│   ├── tests/
│   ├── uploads/             # local hasta resolver despliegue
│   ├── .env                 # local, ignorado
│   └── .env.example
├── database/
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env                 # local, ignorado
│   └── .env.example
├── scripts/
├── specs/
│   ├── 001-peru-app/
│   └── 002-estabilizacion-calidad/
├── .gitignore
└── README.md
```

## 8. Criterio de cierre

El Bloque 1 se considera aplicado cuando:

- los artefactos SDD nuevos están presentes;
- los respaldos duplicados fueron movidos o identificados;
- `dist` y `.vite` no se versionan;
- `.env` no está versionado;
- el inventario de rutas y la trazabilidad reflejan el código real;
- `git status` muestra únicamente cambios intencionales.
