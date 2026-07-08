# README SDD - PERU APP

## 1. Descripción general

Este directorio contiene la documentación SDD de PERU APP, una plataforma web turístico-educativa orientada a organizar y difundir información territorial, turística y gastronómica del Perú.

La documentación fue elaborada bajo el enfoque de Spec-Driven Development utilizando GitHub Spec Kit como herramienta de organización documental.

---

## 2. Objetivo del SDD

El objetivo del SDD es documentar el sistema PERU APP antes, durante y después de su implementación, manteniendo trazabilidad entre:

- Requerimientos.
- Diseño técnico.
- Tareas de desarrollo.
- Modelo de datos.
- Contrato API REST.
- Módulos implementados.
- Pruebas funcionales futuras.

---

## 3. Artefactos del SDD

| Archivo | Descripción |
|---|---|
| `.specify/memory/constitution.md` | Constitución del proyecto, principios, reglas y restricciones. |
| `spec.md` | Especificación funcional de PERU APP. |
| `plan.md` | Plan técnico de arquitectura e implementación. |
| `tasks.md` | Tareas del desarrollo organizadas por incrementos. |
| `data-model.md` | Modelo de datos del sistema. |
| `openapi.yaml` | Contrato de la API REST. |
| `traceability-matrix.md` | Matriz de trazabilidad entre requerimientos, tareas, entidades, endpoints y pruebas. |
| `README-SDD.md` | Resumen y guía de uso de la documentación SDD. |
| `sdd-review-checklist.md` | Lista de verificación final del SDD. |

---

## 4. Estructura recomendada

```text
PERU_APP_FINAL/
├── .specify/
│   └── memory/
│       └── constitution.md
├── .speckit/
├── specs/
│   └── 001-peru-app/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── openapi.yaml
│       ├── traceability-matrix.md
│       ├── README-SDD.md
│       └── sdd-review-checklist.md
├── frontend/
└── backend/
```

---

## 5. Relación con PERU APP

PERU APP está compuesto por los siguientes módulos principales:

1. Autenticación y registro.
2. Inicio y cierre de sesión.
3. Control de roles.
4. Gestión de usuarios.
5. Departamentos.
6. Provincias.
7. Distritos.
8. Ciudades.
9. Lugares turísticos.
10. Comidas típicas.
11. Detalle de lugares turísticos.
12. Mapas por departamento.
13. Rutas referenciales hacia destinos turísticos.
14. Rutas personalizadas desde origen ingresado por el usuario.
15. Panel administrador.
16. Documentación SDD.

---

## 6. Tecnologías documentadas

El SDD documenta el uso de las siguientes tecnologías:

- React.
- Vite.
- JavaScript.
- CSS3.
- Node.js.
- Express.js.
- SQL Server.
- API REST.
- JWT.
- bcrypt.
- Leaflet.
- OpenStreetMap.
- Nominatim.
- OSRM.
- Lucide React.
- Git.
- GitHub.
- GitHub Spec Kit.

---

## 7. Flujo de trabajo con Git

La documentación SDD debe trabajarse en una rama separada:

```bash
git checkout main
git pull origin main
git checkout -b documentacion-sdd-spec-kit
```

Cada artefacto puede registrarse mediante commits independientes:

```bash
git add .specify .speckit
git commit -m "Inicializa Spec Kit y constitucion del proyecto"

git add specs/001-peru-app/spec.md
git commit -m "Agrega especificacion funcional de PERU APP"

git add specs/001-peru-app/plan.md
git commit -m "Agrega plan tecnico del SDD"

git add specs/001-peru-app/tasks.md
git commit -m "Agrega tareas del desarrollo SDD"

git add specs/001-peru-app/data-model.md
git commit -m "Agrega modelo de datos del SDD"

git add specs/001-peru-app/openapi.yaml
git commit -m "Agrega contrato OpenAPI del backend"

git add specs/001-peru-app/traceability-matrix.md
git commit -m "Agrega matriz de trazabilidad del SDD"

git add specs/001-peru-app/README-SDD.md specs/001-peru-app/sdd-review-checklist.md
git commit -m "Agrega resumen y checklist del SDD"
```

---

## 8. Relación con el TDD

El TDD se elaborará después del SDD. Los casos de prueba del TDD deberán derivarse de:

- Requerimientos funcionales de `spec.md`.
- Módulos definidos en `plan.md`.
- Tareas documentadas en `tasks.md`.
- Entidades de `data-model.md`.
- Endpoints de `openapi.yaml`.
- Casos propuestos en `traceability-matrix.md`.

El TDD debe incluir como mínimo:

- ID del caso de prueba.
- Requerimiento relacionado.
- Módulo.
- Objetivo.
- Precondición.
- Datos de entrada.
- Pasos.
- Resultado esperado.
- Resultado obtenido.
- Estado.

---

## 9. Uso en el informe académico

La documentación SDD será utilizada como evidencia en el informe del proyecto, especialmente en:

- Capítulo III: Material y métodos.
- Capítulo IV: Resultados y discusión.
- Capítulo V: Conclusiones y recomendaciones.

También servirá para sustentar la aplicación de Spec-Driven Development mediante GitHub Spec Kit.

---

## 10. Estado de los artefactos

| Artefacto | Estado |
|---|---|
| Constitución | Completado |
| Especificación funcional | Completado |
| Plan técnico | Completado |
| Tareas | Completado |
| Modelo de datos | Completado |
| OpenAPI | Completado |
| Matriz de trazabilidad | Completado |
| README-SDD | Completado |
| Checklist SDD | Completado |
| TDD | Pendiente |

---

## 11. Consideración final

Este SDD representa la base documental del proyecto PERU APP. Su finalidad es demostrar que el sistema fue especificado, planificado, diseñado e implementado de forma ordenada, manteniendo trazabilidad y permitiendo la posterior validación funcional mediante el TDD.
