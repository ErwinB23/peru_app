# Evidencia SDD - GitHub Spec Kit

## 1. Datos generales

**Proyecto:** PERU APP  
**Artefacto:** Evidencia de implementación del SDD con GitHub Spec Kit  
**Metodología:** Spec-Driven Development  
**Herramienta:** GitHub Spec Kit  
**Responsable:** Erwin Brayam Inca Pauccara  
**Año:** 2026  

---

## 2. Objetivo de la evidencia

El objetivo de este documento es registrar la evidencia de implementación de la documentación SDD del proyecto PERU APP mediante GitHub Spec Kit. Esta evidencia permite demostrar que el proyecto cuenta con una estructura organizada de especificaciones, plan técnico, tareas, modelo de datos, contrato API, matriz de trazabilidad y checklist de revisión.

---

## 3. Estructura generada por GitHub Spec Kit

Dentro del proyecto PERU APP se generaron las carpetas principales relacionadas con Spec Kit:

```text
PERU_APP_FINAL/
├── .specify/
├── .speckit/
│   └── commands/
├── specs/
│   └── 001-peru-app/
├── backend/
└── frontend/
```

La carpeta `.speckit/commands/` contiene los comandos base de Spec Kit:

```text
speckit.analyze.md
speckit.checklist.md
speckit.clarify.md
speckit.constitution.md
speckit.converge.md
speckit.implement.md
speckit.plan.md
speckit.specify.md
speckit.tasks.md
speckit.taskstoissues.md
```

---

## 4. Artefactos SDD del proyecto

Los artefactos principales del SDD se encuentran en:

```text
specs/001-peru-app/
```

La carpeta contiene los siguientes documentos:

```text
spec.md
plan.md
tasks.md
data-model.md
openapi.yaml
traceability-matrix.md
README-SDD.md
sdd-review-checklist.md
```

---

## 5. Descripción de artefactos

| Artefacto | Descripción |
|---|---|
| `spec.md` | Define la especificación funcional de PERU APP, incluyendo alcance, usuarios, reglas de negocio, requerimientos funcionales y no funcionales. |
| `plan.md` | Describe el plan técnico del sistema, arquitectura, frontend, backend, base de datos, seguridad, mapas, rutas y estrategia de implementación. |
| `tasks.md` | Organiza las tareas del desarrollo por incrementos y módulos. |
| `data-model.md` | Documenta entidades, tablas, campos, relaciones y reglas de integridad de la base de datos. |
| `openapi.yaml` | Documenta el contrato de la API REST del backend. |
| `traceability-matrix.md` | Relaciona requerimientos, módulos, tareas, entidades, endpoints y pruebas futuras. |
| `README-SDD.md` | Resume la documentación SDD y explica cómo revisar los artefactos. |
| `sdd-review-checklist.md` | Lista de verificación para validar que la documentación SDD esté completa. |

---

## 6. Comandos utilizados como evidencia

### 6.1. Verificación de estructura principal

```powershell
Get-ChildItem -Force
```

Evidencia esperada:

```text
.specify
.speckit
specs
backend
frontend
```

### 6.2. Verificación de comandos Spec Kit

```powershell
Get-ChildItem .\.speckit\commands
```

### 6.3. Verificación de artefactos SDD

```powershell
Get-ChildItem .\specs\001-peru-app
```

### 6.4. Verificación de que los archivos no están vacíos

```powershell
$files = @(
  ".\specs\001-peru-app\spec.md",
  ".\specs\001-peru-app\plan.md",
  ".\specs\001-peru-app\tasks.md",
  ".\specs\001-peru-app\data-model.md",
  ".\specs\001-peru-app\openapi.yaml",
  ".\specs\001-peru-app\traceability-matrix.md",
  ".\specs\001-peru-app\README-SDD.md",
  ".\specs\001-peru-app\sdd-review-checklist.md"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $lines = (Get-Content $file).Count
    Write-Output "OK - $file - $lines lineas"
  } else {
    Write-Output "FALTA - $file"
  }
}
```

### 6.5. Verificación de commits

```powershell
git log --oneline --decorate -10
```

---

## 7. Evidencias con capturas

### Captura 1: Estructura principal del proyecto

**Descripción:** Se evidencia la existencia de las carpetas `.specify`, `.speckit` y `specs`, generadas para organizar el SDD con GitHub Spec Kit.

**Captura:**  
[Pegar captura aquí]

---

### Captura 2: Comandos de GitHub Spec Kit

**Descripción:** Se evidencia la carpeta `.speckit/commands/` con los comandos de trabajo de Spec Kit.

**Captura:**  
[Pegar captura aquí]

---

### Captura 3: Artefactos SDD

**Descripción:** Se evidencia la carpeta `specs/001-peru-app/` con los documentos principales del SDD.

**Captura:**  
[Pegar captura aquí]

---

### Captura 4: Verificación de archivos no vacíos

**Descripción:** Se evidencia que los documentos principales del SDD existen y contienen información.

**Captura:**  
[Pegar captura aquí]

---

### Captura 5: Evidencia de commits en Git

**Descripción:** Se evidencia que la documentación SDD fue versionada mediante Git y subida a GitHub.

**Captura:**  
[Pegar captura aquí]

---

## 8. Texto para el informe

Se implementó la documentación SDD del proyecto PERU APP utilizando GitHub Spec Kit como herramienta de apoyo para el enfoque Spec-Driven Development. La estructura generada permitió organizar los artefactos principales del diseño y especificación del sistema, incluyendo la especificación funcional, plan técnico, tareas del desarrollo, modelo de datos, contrato OpenAPI, matriz de trazabilidad, README y checklist de revisión.

Esta documentación permitió relacionar los requerimientos del sistema con sus módulos, entidades, endpoints y futuras pruebas funcionales. Asimismo, los artefactos fueron versionados mediante Git y GitHub, garantizando trazabilidad documental y control de cambios durante el desarrollo del proyecto.

---

## 9. Checklist de validación de evidencia

| N.º | Criterio | Estado |
|---|---|---|
| 1 | Existe la carpeta `.specify`. | Cumple |
| 2 | Existe la carpeta `.speckit/commands`. | Cumple |
| 3 | Existe la carpeta `specs/001-peru-app`. | Cumple |
| 4 | Existe `spec.md`. | Cumple |
| 5 | Existe `plan.md`. | Cumple |
| 6 | Existe `tasks.md`. | Cumple |
| 7 | Existe `data-model.md`. | Cumple |
| 8 | Existe `openapi.yaml`. | Cumple |
| 9 | Existe `traceability-matrix.md`. | Cumple |
| 10 | Existe `README-SDD.md`. | Cumple |
| 11 | Existe `sdd-review-checklist.md`. | Cumple |
| 12 | Los archivos contienen información del proyecto PERU APP. | Cumple |
| 13 | La documentación está versionada con Git. | Cumple |
| 14 | La documentación fue subida a GitHub. | Cumple |

---

## 10. Conclusión de la evidencia

La evidencia demuestra que el proyecto PERU APP cuenta con una documentación SDD organizada mediante GitHub Spec Kit. Los artefactos generados permiten sustentar el diseño, planificación, modelo de datos, contrato API y trazabilidad del sistema, sirviendo como base para la elaboración posterior del TDD y la validación funcional del proyecto.
